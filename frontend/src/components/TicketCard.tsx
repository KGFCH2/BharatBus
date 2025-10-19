import { QRCodeSVG } from 'qrcode.react';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import FlipCard from './FlipCard';
import GlassCard from './GlassCard';

interface TicketCardProps {
  ticket: {
    id: string;
    from: string;
    to: string;
    date?: string;
    time?: string;
    passenger?: string;
    seat?: string;
    price?: number;
  };
}

export default function TicketCard({ ticket }: TicketCardProps) {
  const front = (
    <GlassCard hover={false}>
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-white">{ticket.from}</h3>
            <div className="text-orange-400 text-2xl my-2">→</div>
            <h3 className="text-xl font-bold text-white">{ticket.to}</h3>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold brand-gradient bg-clip-text text-transparent">
              ₹{ticket.price ?? 0}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
          <div className="flex items-center gap-2 text-white/80">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{ticket.date ?? ''}</span>
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{ticket.time}</span>
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <User className="w-4 h-4" />
            <span className="text-sm">{ticket.passenger ?? ''}</span>
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">Seat {ticket.seat ?? ''}</span>
          </div>
        </div>

        <p className="text-center text-white/40 text-xs mt-4 flip-caption">Click to view QR Code</p>
      </div>
    </GlassCard>
  );

  const back = (
    <GlassCard hover={false}>
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <div className="bg-white p-4 rounded-xl">
          <QRCodeSVG value={ticket.id} size={160} />
        </div>
        <p className="text-white/60 text-sm">Scan at boarding</p>
        <p className="text-white/40 text-xs">ID: {ticket.id}</p>
      </div>
    </GlassCard>
  );

  return <FlipCard front={front} back={back} className="h-80" />;
}
