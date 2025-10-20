import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Calendar, MapPin, User, Users, Phone } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import GradientButton from '../components/GradientButton';
import { QRCodeSVG } from 'qrcode.react';
import { generateTicketPdf } from '../utils/generateTicketPdf';
import { useAuth } from '../context/useAuth';
import { useLocation } from 'react-router-dom';

export default function BookTicket() {
  const { user } = useAuth();
  const location = useLocation();

  // routeState may be passed from Routes page when user clicked "Book This Route"
  type RouteState = { from?: string; to?: string; name?: string; phone?: string };
  type UserLike = { id?: string; name?: string; phone?: string } | null;
  type PdfLike = { save?: (name: string) => void; output: (format: string) => string };

  const routePrefill = (location.state as RouteState) || null;
  const currentUser = user as UserLike;

  const [formData, setFormData] = useState({
    from: routePrefill?.from || '',
    to: routePrefill?.to || '',
    date: '',
    passengers: 1,
    name: routePrefill?.name || currentUser?.name || '',
    phone: routePrefill?.phone || currentUser?.phone || '',
  });

  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({ ...prev, name: prev.name || currentUser.name || '', phone: prev.phone || currentUser.phone || '' }));
    }
  }, [currentUser]);

  const [showTicket, setShowTicket] = useState(false);
  const [ticketId, setTicketId] = useState('');

  type CaptureResult = { pdf: { save?: (name: string) => void; output: (format: string) => string }; imgData: string };

  const captureElement = async (sourceEl: HTMLElement): Promise<CaptureResult> => {
    const clone = sourceEl.cloneNode(true) as HTMLElement;
    const computed = window.getComputedStyle(sourceEl);
    clone.style.boxSizing = 'border-box';
    clone.style.width = computed.width;
    clone.style.background = computed.backgroundColor || '#ffffff';
    clone.style.color = computed.color || '#000';
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    clone.style.top = '0';
    document.body.appendChild(clone);

    // Deprecated screen-capture approach retained for fallback only.
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import('html2canvas'), import('jspdf')]);

    const scale = Math.min(3, window.devicePixelRatio || 3);
    const canvas = await html2canvas(clone, { scale, useCORS: true, allowTaint: true, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ unit: 'px', format: [canvas.width, canvas.height] });
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);

    document.body.removeChild(clone);
    return { pdf, imgData };
  };

  // Convert QRCode SVG element to PNG data URL
  const qrSvgToPng = async (svgEl: SVGElement | null) => {
    if (!svgEl) return null;
    try {
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgEl);
      const svg64 = btoa(unescape(encodeURIComponent(svgString)));
      const dataUrl = 'data:image/svg+xml;base64,' + svg64;
      // Render SVG dataURL to canvas and export PNG dataURL
      const img = new Image();
      img.src = dataUrl;
      await new Promise((res, rej) => {
        img.onload = () => res(true);
        img.onerror = () => rej(new Error('Failed to load QR svg image'));
      });
      const canvas = document.createElement('canvas');
      canvas.width = img.width || 256;
      canvas.height = img.height || 256;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      return canvas.toDataURL('image/png');
    } catch (err) {
      console.warn('QR to PNG conversion failed', err);
      return null;
    }
  };

  const saveTicketToLocal = (id: string, pdfDataUri: string | null, imgData: string | null) => {
    const storageKey = `ticket_${id}`;
    try {
      if (pdfDataUri) localStorage.setItem(storageKey, pdfDataUri);
      if (imgData) localStorage.setItem(`${storageKey}_img`, imgData);
      const meta = {
        id,
        from: formData.from,
        to: formData.to,
        date: formData.date,
        name: formData.name,
        passengers: formData.passengers,
        phone: formData.phone,
        userId: user?.id || null,
      };
      localStorage.setItem(`${storageKey}_meta`, JSON.stringify(meta));

      // update per-user index
      try {
        if (user?.id) {
          const listKey = `tickets_user_${user.id}`;
          const raw = localStorage.getItem(listKey);
          const arr = raw ? JSON.parse(raw) : [];
          if (!arr.includes(id)) arr.push(id);
          localStorage.setItem(listKey, JSON.stringify(arr));
        }
      } catch (e) {
        console.warn('Failed to update user ticket index', e);
      }
      // notify other tabs/components that tickets changed
      try {
        window.dispatchEvent(new CustomEvent('tickets-updated', { detail: { id } }));
      } catch {
        // ignore in environments that block CustomEvent
      }
    } catch (err) {
      console.warn('Failed to save ticket to localStorage', err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = 'BBS' + Math.random().toString(36).substr(2, 9).toUpperCase();
    setTicketId(id);
    setShowTicket(true);

    // Persist ticket metadata immediately so Profile can show the booking without waiting
    try {
      saveTicketToLocal(id, null, null);
    } catch (err) {
      console.warn('Immediate save of ticket meta failed', err);
    }

    // Auto-generate a proper PDF (text + QR) and save in background
    setTimeout(async () => {
      try {
        const el = document.getElementById('ticket-confirmation');
        if (!el) return;
        // get the QR svg element rendered by QRCodeSVG
        const svgEl = el.querySelector('svg');
        const qrPng = await qrSvgToPng(svgEl as SVGElement | null);

        const meta: { id: string; from?: string; to?: string; date?: string; name?: string; passengers?: number; phone?: string; userId?: string | null } = {
          id,
          from: formData.from,
          to: formData.to,
          date: formData.date,
          name: formData.name,
          passengers: formData.passengers,
          phone: formData.phone,
          userId: user?.id || null,
        };

        try {
          const dataUri = await generateTicketPdf(meta, qrPng || undefined);
          saveTicketToLocal(id, dataUri, qrPng || null);
        } catch (err) {
          // log the structured PDF error and fallback to screenshot-based PDF
          console.warn('Structured PDF generation failed', err);
          try {
            const { pdf, imgData } = await captureElement(el as HTMLElement);
            const dataUri = (pdf as PdfLike).output('datauristring');
            saveTicketToLocal(id, dataUri, imgData);
          } catch (e) {
            // fallback: save only image/meta
            saveTicketToLocal(id, null, qrPng || null);
            console.warn('Auto-save fallback failed', e);
          }
        }
      } catch (err) {
        console.warn('Auto-generate ticket preview failed', err);
      }
    }, 400);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    let newVal: string | number = value;

    // For phone field: strictly allow digits only (strip non-digits)
    if (name === 'phone') {
      newVal = value.replace(/\D+/g, '');
    } else if (type === 'number') {
      newVal = Number(value);
    }

    setFormData((prev) => ({ ...prev, [name]: newVal }));
  };

  // Prevent non-digit key presses for phone input
  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowed = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'];
    if (allowed.includes(e.key)) return;
    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handlePhonePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text');
    if (/\D/.test(text)) {
      // strip non-digits from paste and set the value
      e.preventDefault();
      const cleaned = text.replace(/\D+/g, '');
      setFormData((prev) => ({ ...prev, phone: (prev.phone || '') + cleaned }));
    }
  };

  if (showTicket) {
    return (
      <div className="min-h-screen pt-32 pb-20">
        <div className="max-w-2xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <GlassCard className="text-center" id="ticket-confirmation">
              <motion.div initial={{ rotateY: 0 }} animate={{ rotateY: 360 }} transition={{ duration: 1, delay: 0.3 }} className="mb-6">
                <div className="inline-block bg-white p-6 rounded-2xl">
                  <QRCodeSVG value={ticketId} size={200} />
                </div>
              </motion.div>

              <h2 className="text-3xl font-bold brand-gradient bg-clip-text text-transparent mb-4">Booking Confirmed!</h2>

              <div className="space-y-3 text-left max-w-md mx-auto mb-6">
                <div className="flex justify-between">
                  <span className="text-white/60 light:text-slate-700">Ticket ID:</span>
                  <span className="text-white font-mono light:text-black">{ticketId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60 light:text-slate-700">From:</span>
                  <span className="text-white light:text-black">{formData.from}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60 light:text-slate-700">To:</span>
                  <span className="text-white light:text-black">{formData.to}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60 light:text-slate-700">Date:</span>
                  <span className="text-white light:text-black">{formData.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60 light:text-slate-700">Passenger:</span>
                  <span className="text-white light:text-black">{formData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60 light:text-slate-700">Seats:</span>
                  <span className="text-white light:text-black">{formData.passengers}</span>
                </div>
              </div>

              <GradientButton onClick={() => setShowTicket(false)}>Book Another Ticket</GradientButton>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="mt-4 p-3 rounded-lg bg-green-500/20 border border-green-500/40 text-green-400 text-sm text-center">
                ✅ Ticket saved to your profile! Check "My Profile" → "Ticket History" to view all your tickets.
              </motion.div>

              <div className="mt-4 flex justify-center gap-4">
                <button
                  onClick={async () => {
                    try {
                      const el = document.getElementById('ticket-confirmation');
                      if (!el) return;
                      const svgEl = el.querySelector('svg');
                      const qrPng = await qrSvgToPng(svgEl as SVGElement | null);
                      const meta: { id: string; from?: string; to?: string; date?: string; name?: string; passengers?: number; phone?: string; userId?: string | null } = {
                        id: ticketId,
                        from: formData.from,
                        to: formData.to,
                        date: formData.date,
                        name: formData.name,
                        passengers: formData.passengers,
                        phone: formData.phone,
                        userId: user?.id || null,
                      };
                      const dataUri = await generateTicketPdf(meta, qrPng || undefined);
                      // trigger download
                      const a = document.createElement('a');
                      a.href = dataUri;
                      a.download = `${ticketId}.pdf`;
                      document.body.appendChild(a);
                      a.click();
                      a.remove();
                      // also save locally
                      saveTicketToLocal(ticketId, dataUri, qrPng || null);
                    } catch (err) {
                      console.error('Failed to generate PDF', err);
                      alert('Unable to generate PDF. Please ensure dependencies are installed.');
                    }
                  }}
                  className="px-6 py-3 rounded-xl bg-white/10 text-white/90 light:text-black light:bg-white/10 font-semibold hover:bg-white/20 transition-all"
                >
                  Download PDF
                </button>

                <button
                  onClick={async () => {
                    try {
                      const el = document.getElementById('ticket-confirmation');
                      if (!el) return;
                      const svgEl = el.querySelector('svg');
                      const qrPng = await qrSvgToPng(svgEl as SVGElement | null);
                      const meta: { id: string; from?: string; to?: string; date?: string; name?: string; passengers?: number; phone?: string; userId?: string | null } = {
                        id: ticketId,
                        from: formData.from,
                        to: formData.to,
                        date: formData.date,
                        name: formData.name,
                        passengers: formData.passengers,
                        phone: formData.phone,
                        userId: user?.id || null,
                      };
                      const dataUri = await generateTicketPdf(meta, qrPng || undefined);
                      saveTicketToLocal(ticketId, dataUri, qrPng || null);
                      alert('Ticket saved in your browser (Saved Tickets).');
                    } catch (err) {
                      console.error('Failed to generate PDF', err);
                      alert('Unable to generate PDF. Please ensure dependencies are installed.');
                    }
                  }}
                  className="px-6 py-3 rounded-xl bg-white/10 text-white/90 light:text-black light:bg-white/10 font-semibold hover:bg-white/20 transition-all"
                >
                  Save to Browser
                </button>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-2xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 brand-gradient bg-clip-text text-transparent">Book Your Ticket</h1>
          <p className="text-xl text-white/70 light:text-slate-700">Quick and easy booking process</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <GlassCard>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="from" className="flex items-center gap-2 text-white/80 text-sm light:text-black">
                    <MapPin className="w-4 h-4 text-orange-400" />
                    From
                  </label>
                  <input id="from" type="text" name="from" value={formData.from} onChange={handleChange} required placeholder="Origin city" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all light:text-black light:placeholder-slate-600 light:bg-white light:border-gray-200" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="to" className="flex items-center gap-2 text-white/80 text-sm light:text-black">
                    <MapPin className="w-4 h-4 text-green-400" />
                    To
                  </label>
                  <input id="to" type="text" name="to" value={formData.to} onChange={handleChange} required placeholder="Destination city" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all light:text-black light:placeholder-slate-600 light:bg-white light:border-gray-200" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="date" className="flex items-center gap-2 text-white/80 text-sm light:text-black">
                    <Calendar className="w-4 h-4 text-orange-400" />
                    Travel Date
                  </label>
                  <input id="date" type="date" name="date" value={formData.date} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all light:text-black light:bg-white light:border-gray-200" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="passengers" className="flex items-center gap-2 text-white/80 text-sm light:text-black">
                    <Users className="w-4 h-4 text-orange-400" />
                    Passengers
                  </label>
                  <input id="passengers" type="number" name="passengers" value={formData.passengers} onChange={handleChange} min="1" max="6" required className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all light:text-black light:bg-white light:border-gray-200" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="name" className="flex items-center gap-2 text-white/80 text-sm light:text-black">
                  <User className="w-4 h-4 text-orange-400" />
                  Passenger Name
                </label>
                <input id="name" type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Full name" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all light:text-black light:placeholder-slate-600 light:bg-white light:border-gray-200" />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="flex items-center gap-2 text-white/80 text-sm light:text-black">
                  <Phone className="w-4 h-4 text-orange-400" />
                  Phone Number
                </label>
                <input
                  id="phone"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onKeyDown={handlePhoneKeyDown}
                  onPaste={handlePhonePaste}
                  required
                  placeholder="Enter digits only"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all light:text-black light:placeholder-slate-600 light:bg-white light:border-gray-200"
                />
              </div>

              <GradientButton type="submit" className="w-full text-lg py-4">Book Now</GradientButton>
            </form>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
