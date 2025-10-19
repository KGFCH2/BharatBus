import { useAuth } from '../context/useAuth';
import { motion } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import maleAvatar from '../assets/male.svg';
import femaleAvatar from '../assets/female.svg';
import neutralAvatar from '../assets/neutral.svg';
import { Calendar, MapPin, Download, Eye, Clock, CheckCircle, Ticket } from 'lucide-react';
import GlassCard from '../components/GlassCard';

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

export default function Profile() {
    const { user } = useAuth();
    // Normalize common gender values to 'male' | 'female' | 'other' | null
    function normalizeGender(value?: string | null): 'male' | 'female' | 'other' | null {
        if (!value) return null;
        const s = String(value).trim().toLowerCase();
        if (s === 'male' || s === 'm' || s === 'man' || s.startsWith('m')) return 'male';
        if (s === 'female' || s === 'f' || s === 'woman' || s.startsWith('f')) return 'female';
        return 'other';
    }

    const gender = normalizeGender(user?.gender ?? null);
    const [upcomingTickets, setUpcomingTickets] = useState<SavedTicket[]>([]);
    const [pastTickets, setPastTickets] = useState<SavedTicket[]>([]);
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

    // Extracted loader so we can call it from event listeners
    const loadSavedTickets = useCallback(() => {
        const saved: SavedTicket[] = [];

        // First try per-user index for performance and reliability
        try {
            const listKey = user?.id ? `tickets_user_${user.id}` : null;
            const idsFromIndex: string[] | null = listKey ? JSON.parse(localStorage.getItem(listKey) || 'null') : null;

            const ticketIds = new Set<string>();

            if (idsFromIndex && Array.isArray(idsFromIndex)) {
                idsFromIndex.forEach((tid) => ticketIds.add(tid));
            }

            // Fallback: scan meta keys if index missing or incomplete
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i) || '';
                if (key.endsWith('_meta') && key.startsWith('ticket_')) {
                    const tid = key.replace('ticket_', '').replace('_meta', '');
                    ticketIds.add(tid);
                }
            }

            // Build ticket objects from the collected ids
            ticketIds.forEach((id) => {
                const metaRaw = localStorage.getItem(`ticket_${id}_meta`);
                const meta = metaRaw ? JSON.parse(metaRaw) : undefined;
                // only include tickets that belong to the current user (or unassigned)
                if (meta?.userId && user?.id && meta.userId !== user.id) return;
                const pdf = localStorage.getItem(`ticket_${id}`) || undefined;
                const img = localStorage.getItem(`ticket_${id}_img`) || undefined;

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
            });
        } catch (err) {
            console.warn('Failed to read ticket index from localStorage, falling back to full scan', err);
            // last-resort fallback: full scan (previous behavior)
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i)!;
                if (key?.startsWith('ticket_') && !key.endsWith('_meta')) {
                    const id = key.replace('ticket_', '');
                    const metaRaw = localStorage.getItem(`${key}_meta`);
                    const meta = metaRaw ? JSON.parse(metaRaw) : undefined;
                    if (meta?.userId && user?.id && meta.userId !== user.id) continue;
                    const pdf = localStorage.getItem(key) || undefined;
                    const img = localStorage.getItem(`${key}_img`) || undefined;

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
        }

        // Sort tickets by date (newest first)
        saved.sort((a, b) => {
            const dateA = a.date ? new Date(a.date).getTime() : 0;
            const dateB = b.date ? new Date(b.date).getTime() : 0;
            return dateB - dateA;
        });

        setUpcomingTickets(saved.filter(t => t.isUpcoming));
        setPastTickets(saved.filter(t => !t.isUpcoming));
    }, [user]);

    useEffect(() => {
        // Initial load
        loadSavedTickets();

        // Listen for cross-tab storage changes
        const onStorage = (e: StorageEvent) => {
            if (!e.key) return;
            if (e.key.startsWith('ticket_') || e.key.startsWith(`tickets_user_${user?.id}`)) {
                loadSavedTickets();
            }
        };

        // Custom event for same-tab updates
        const onTicketsUpdated = () => loadSavedTickets();

        window.addEventListener('storage', onStorage);
        window.addEventListener('tickets-updated', onTicketsUpdated as EventListener);

        return () => {
            window.removeEventListener('storage', onStorage);
            window.removeEventListener('tickets-updated', onTicketsUpdated as EventListener);
        };
    }, [user, loadSavedTickets]);

    const downloadDataUri = async (dataUri: string, filename: string) => {
        try {
            const res = await fetch(dataUri);
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Download failed', err);
            alert('Failed to download file');
        }
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
                <div className="flex items-start gap-6">
                    {/* QR Code / Ticket Preview */}
                    <div className="flex-shrink-0">
                        <div className="w-20 h-20 bg-white p-2 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                            {ticket.img ? (
                                <img src={ticket.img} alt={ticket.id} className="w-full h-full object-contain rounded-lg" />
                            ) : (
                                <QRCodeSVG value={ticket.id} size={64} />
                            )}
                        </div>
                    </div>

                    {/* Ticket Information */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h3 className="font-bold text-white text-lg mb-1">{ticket.id}</h3>
                                <div className="flex items-center gap-2 text-sm text-white/70">
                                    <MapPin className="w-4 h-4 text-orange-400" />
                                    <span>{ticket.from} → {ticket.to}</span>
                                </div>
                            </div>
                            <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${ticket.isUpcoming
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

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-orange-400" />
                                <span className="text-white/70">Date:</span>
                                <span className="text-white font-medium">{formatDate(ticket.date)}</span>
                            </div>
                            {ticket.passengers && (
                                <div className="flex items-center gap-2">
                                    <Ticket className="w-4 h-4 text-orange-400" />
                                    <span className="text-white/70">Seats:</span>
                                    <span className="text-white font-medium">{ticket.passengers}</span>
                                </div>
                            )}
                        </div>

                        {ticket.name && (
                            <div className="mt-2 text-sm">
                                <span className="text-white/70">Passenger: </span>
                                <span className="text-white font-medium">{ticket.name}</span>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2">
                        {ticket.pdf && (
                            <button
                                onClick={() => downloadDataUri(ticket.pdf!, `${ticket.id}.pdf`)}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 transition-all text-sm font-semibold group"
                                title="Download PDF"
                            >
                                <Download className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                PDF
                            </button>
                        )}
                        {ticket.img && (
                            <button
                                onClick={() => window.open(ticket.img, '_blank')}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all text-sm font-semibold group"
                                title="View Image"
                            >
                                <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                View
                            </button>
                        )}
                    </div>
                </div>
            </GlassCard>
        </motion.div>
    );

    return (
        <div className="min-h-screen pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 brand-gradient bg-clip-text text-transparent">
                        My Profile
                    </h1>
                    <p className="text-xl text-white/70">View and manage your profile information</p>
                </motion.div>

                {/* User Information Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <GlassCard className="text-center mb-12">
                        <div className="flex items-center justify-center mb-4 relative">
                            <img src={gender === 'male' ? maleAvatar : gender === 'female' ? femaleAvatar : neutralAvatar} alt="avatar" className="w-20 h-20 rounded-full object-cover mr-4" />
                            <span aria-hidden className="absolute right-1 bottom-6 w-7 h-7 rounded-full text-sm flex items-center justify-center bg-white/90 text-black shadow-sm">
                                {gender === 'male' ? '🚹' : gender === 'female' ? '🚺' : '🧑'}
                            </span>
                        </div>
                        <div className="text-2xl font-bold text-white mb-2">{user?.name || 'No Name'}</div>
                        <div className="text-white/70 mb-4">{user?.email || 'No Email'}</div>
                        <div className="text-white/40 text-sm">User ID: {user?.id || 'N/A'}</div>
                    </GlassCard>
                </motion.div>

                {/* Ticket History Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                            <Ticket className="w-8 h-8 text-orange-400" />
                            Ticket History
                        </h2>

                        {/* Tab Navigation */}
                        <div className="flex gap-4 mb-6">
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
                        </div>

                        {/* Tickets Display */}
                        <div className="space-y-4">
                            {activeTab === 'upcoming' ? (
                                upcomingTickets.length === 0 ? (
                                    <GlassCard className="text-center py-12">
                                        <Clock className="w-12 h-12 text-white/40 mx-auto mb-4" />
                                        <h3 className="text-xl font-semibold text-white/60 mb-2">No Upcoming Tickets</h3>
                                        <p className="text-white/40">Book a ticket to see it here!</p>
                                    </GlassCard>
                                ) : (
                                    upcomingTickets.map((ticket) => (
                                        <TicketCard key={ticket.id} ticket={ticket} />
                                    ))
                                )
                            ) : (
                                pastTickets.length === 0 ? (
                                    <GlassCard className="text-center py-12">
                                        <CheckCircle className="w-12 h-12 text-white/40 mx-auto mb-4" />
                                        <h3 className="text-xl font-semibold text-white/60 mb-2">No Past Tickets</h3>
                                        <p className="text-white/40">Your completed journeys will appear here.</p>
                                    </GlassCard>
                                ) : (
                                    pastTickets.map((ticket) => (
                                        <TicketCard key={ticket.id} ticket={ticket} />
                                    ))
                                )
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
