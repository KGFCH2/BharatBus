import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Calendar, Download, Eye, Clock, CheckCircle, Ticket as TicketIcon, User } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../context/useAuth';
import GlassCard from '../components/GlassCard';
import GradientButton from '../components/GradientButton';
import { Link } from 'react-router-dom';

type SavedTicket = {
  id: string;
  from?: string;
  to?: string;
  date?: string;
  name?: string;
  passengers?: number;
  phone?: string;
  img?: string; // image data URI
  pdf?: string; // pdf data URI
  isUpcoming?: boolean;
};

export default function MyTickets() {
  const { user, isAuthenticated } = useAuth();
  const [upcomingTickets, setUpcomingTickets] = useState<SavedTicket[]>([]);
  const [pastTickets, setPastTickets] = useState<SavedTicket[]>([]);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setUpcomingTickets([]);
      setPastTickets([]);
      return;
    }

    const saved: SavedTicket[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)!;
      if (key?.startsWith('ticket_') && !key.endsWith('_meta')) {
        const id = key.replace('ticket_', '');
        const metaRaw = localStorage.getItem(`${key}_meta`);
        const meta = metaRaw ? JSON.parse(metaRaw) : undefined;

        // Only include tickets that belong to the current user
        // Ignore anonymous tickets (meta.userId === null/undefined)
        if (!meta?.userId || meta.userId !== user.id) continue;

        const pdf = localStorage.getItem(key) || undefined;
        const img = localStorage.getItem(`${key}_img`) || undefined;

        // Determine if ticket is upcoming or past
        const ticketDate = meta?.date ? new Date(meta.date) : new Date();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        ticketDate.setHours(0, 0, 0, 0);
        const isUpcoming = ticketDate >= today;

        saved.push({
          id,
          from: meta?.from,
          to: meta?.to,
          date: meta?.date,
          name: meta?.name,
          passengers: meta?.passengers,
          phone: meta?.phone,
          img,
          pdf,
          isUpcoming
        });
      }
    }

    // Sort tickets by date (newest first)
    saved.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA;
    });

    setUpcomingTickets(saved.filter(t => t.isUpcoming));
    setPastTickets(saved.filter(t => !t.isUpcoming));
  }, [user, isAuthenticated]);

  // Use shared download helper which handles data URIs and blob URLs correctly
  import('../utils/download').then((m) => m).catch(() => null);
  const downloadData = async (dataUri: string, filename: string) => {
    const mod = await import('../utils/download');
    return mod.downloadDataUri(dataUri, filename);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const TicketCard = ({ ticket }: { ticket: SavedTicket }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group"
    >
      <GlassCard className="hover:bg-white/10 transition-all duration-300">
        <div className="flex flex-col gap-4">
          {/* Ticket Header */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-white text-lg mb-1">{ticket.id}</h3>
              <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold w-fit ${ticket.isUpcoming
                ? 'bg-green-500/20 text-green-400'
                : 'bg-gray-500/20 text-gray-400'
                }`}>
                {ticket.isUpcoming ? (
                  <>
                    <Clock className="w-3 h-3" />
                    Upcoming
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-3 h-3" />
                    Completed
                  </>
                )}
              </div>
            </div>

            {/* QR Code Preview */}
            <div className="w-16 h-16 bg-white p-2 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              {ticket.img ? (
                <img src={ticket.img} alt={ticket.id} className="w-full h-full object-contain rounded" />
              ) : (
                <QRCodeSVG value={ticket.id} size={48} />
              )}
            </div>
          </div>

          {/* Route Information */}
          <div className="text-center py-3 border-y border-white/10">
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <h4 className="text-lg font-bold text-white">{ticket.from || 'Unknown'}</h4>
                <p className="text-white/60 text-xs">Departure</p>
              </div>
              <div className="text-orange-400 text-xl">→</div>
              <div className="text-center">
                <h4 className="text-lg font-bold text-white">{ticket.to || 'Unknown'}</h4>
                <p className="text-white/60 text-xs">Destination</p>
              </div>
            </div>
          </div>

          {/* Ticket Details */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-400" />
              <div>
                <p className="text-white/70">Date</p>
                <p className="text-white font-medium">{formatDate(ticket.date)}</p>
              </div>
            </div>
            {ticket.passengers && (
              <div className="flex items-center gap-2">
                <TicketIcon className="w-4 h-4 text-orange-400" />
                <div>
                  <p className="text-white/70">Seats</p>
                  <p className="text-white font-medium">{ticket.passengers}</p>
                </div>
              </div>
            )}
            {ticket.name && (
              <div className="flex items-center gap-2 col-span-2">
                <User className="w-4 h-4 text-orange-400" />
                <div>
                  <p className="text-white/70">Passenger</p>
                  <p className="text-white font-medium">{ticket.name}</p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-3 border-t border-white/10">
            {ticket.pdf && (
              <button
                onClick={() => downloadData(ticket.pdf!, `${ticket.id}.pdf`)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 transition-all text-sm font-semibold"
              >
                <Download className="w-4 h-4" />
                PDF
              </button>
            )}
            {/* View: try PDF first, then image. If neither, show a small alert */}
            <button
              onClick={async () => {
                try {
                  if (ticket.pdf) {
                    // Open PDF data URI in new tab
                    const newWin = window.open();
                    if (newWin) {
                      newWin.document.open();
                      // Use an embed to ensure proper rendering across browsers
                      newWin.document.write(`<iframe src="${ticket.pdf}" style="border:none; width:100vw; height:100vh"></iframe>`);
                      newWin.document.close();
                      return;
                    }
                  }

                  if (ticket.img) {
                    window.open(ticket.img, '_blank');
                    return;
                  }

                  alert('No preview available for this ticket');
                } catch (err) {
                  console.error('Failed to open ticket preview', err);
                  alert('Unable to open ticket preview');
                }
              }}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all text-sm font-semibold"
            >
              <Eye className="w-4 h-4" />
              View
            </button>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );

  // If user is not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-32 pb-20">
        <div className="max-w-2xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <GlassCard className="py-16">
              <TicketIcon className="w-16 h-16 text-white/40 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-white mb-4">View Your Tickets</h1>
              <p className="text-white/70 mb-8">Please log in to view your booked tickets and travel history.</p>
              <Link to="/login">
                <GradientButton className="px-8 py-3">
                  Login to Continue
                </GradientButton>
              </Link>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 brand-gradient bg-clip-text text-transparent">
            My Tickets
          </h1>
          <p className="text-xl text-white/70">View and manage your bookings</p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-4 justify-center mb-8"
        >
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === 'upcoming'
              ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
              : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
          >
            Upcoming Tickets ({upcomingTickets.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === 'past'
              ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
              : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
          >
            Past Tickets ({pastTickets.length})
          </button>
        </motion.div>

        {/* Tickets Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {activeTab === 'upcoming' ? (
            upcomingTickets.length === 0 ? (
              <GlassCard className="text-center py-16">
                <Clock className="w-16 h-16 text-white/40 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-white/60 mb-4">No Upcoming Tickets</h3>
                <p className="text-white/40 mb-8">You don't have any upcoming travel plans.</p>
                <Link to="/book">
                  <GradientButton>
                    Book Your First Ticket
                  </GradientButton>
                </Link>
              </GlassCard>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingTickets.map((ticket, index) => (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <TicketCard ticket={ticket} />
                  </motion.div>
                ))}
              </div>
            )
          ) : (
            pastTickets.length === 0 ? (
              <GlassCard className="text-center py-16">
                <CheckCircle className="w-16 h-16 text-white/40 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-white/60 mb-4">No Past Tickets</h3>
                <p className="text-white/40 mb-8">Your completed journeys will appear here.</p>
                <Link to="/book">
                  <GradientButton>
                    Plan Your Next Trip
                  </GradientButton>
                </Link>
              </GlassCard>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastTickets.map((ticket, index) => (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <TicketCard ticket={ticket} />
                  </motion.div>
                ))}
              </div>
            )
          )}
        </motion.div>

        {/* Quick Actions */}
        {(upcomingTickets.length > 0 || pastTickets.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 text-center"
          >
            <GlassCard>
              <h3 className="text-xl font-semibold text-white mb-4">Need Help with Your Tickets?</h3>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/help">
                  <button className="px-6 py-3 rounded-xl bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all font-semibold">
                    Help Center
                  </button>
                </Link>
                <Link to="/book">
                  <button className="px-6 py-3 rounded-xl bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 transition-all font-semibold">
                    Book Another Ticket
                  </button>
                </Link>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </div>
  );
}
