import { motion } from 'framer-motion';
import { Navigation } from 'lucide-react';

interface RouteMapProps {
  origin: { lat: number; lng: number; name: string };
  destination: { lat: number; lng: number; name: string };
  busLocation?: { lat: number; lng: number };
}

export default function RouteMap({ origin, destination, busLocation }: RouteMapProps) {
  // Always render a simple static SVG map for frontend-only mode.
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="backdrop-blur-md bg-white/10 rounded-2xl border border-white/20 overflow-hidden shadow-xl p-6 light:border-2 light:border-black"
    >
      <div className="text-white mb-4">
        <div className="text-sm text-white/60">Map preview</div>
        <div className="text-lg font-bold">{origin.name} → {destination.name}</div>
      </div>

      <div className="w-full h-[240px] md:h-[300px] lg:h-[380px] flex items-center justify-center mb-4">
        <svg width="100%" height="100%" viewBox="0 0 140 80" preserveAspectRatio="xMidYMid meet" aria-hidden="true" className="rounded-lg overflow-hidden w-full h-full">
          <defs>
            <linearGradient id="g1" x1="0" x2="1">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.08" />
            </linearGradient>
            <filter id="fGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* soft gradient backdrop */}
          <rect width="100%" height="100%" fill="url(#g1)" rx="8" />

          {/* shimmering strip */}
          <motion.rect x="0" y="0" width="140" height="80" fill="white" opacity="0" animate={{ opacity: [0, 0.03, 0] }} transition={{ repeat: Infinity, duration: 6 }} />

          {/* decorative sparkles */}
          <motion.circle cx={30} cy={12} r={1.2} fill="#fff" opacity={0.6} animate={{ opacity: [0.2, 0.9, 0.2], scale: [1, 1.6, 1] }} transition={{ repeat: Infinity, duration: 4 }} />
          <motion.circle cx={90} cy={24} r={1.4} fill="#fff" opacity={0.5} animate={{ opacity: [0.2, 0.9, 0.2] }} transition={{ repeat: Infinity, duration: 5 }} />

          {/* curved route */}
          <motion.path d="M12 56 C 36 16, 104 64, 128 30" stroke="#ff7a18" strokeWidth="2.6" fill="none" strokeOpacity="0.9" strokeLinecap="round" style={{ filter: 'url(#fGlow)' }} />

          {/* animated route stroke (dash reveal) */}
          <motion.path d="M12 56 C 36 16, 104 64, 128 30" stroke="#fff" strokeWidth="1.4" fill="none" strokeDasharray="180" strokeDashoffset="180" animate={{ strokeDashoffset: [180, 0, 180] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }} strokeOpacity={0.12} />

          {/* origin marker (pulsing) */}
          <g>
            <motion.circle cx={12} cy={56} r={3.6} fill="#06b6d4" animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 2 }} />
            <motion.circle cx={12} cy={56} r={6} fill="#06b6d4" opacity={0.12} animate={{ r: [6, 14, 6], opacity: [0.12, 0.28, 0.12] }} transition={{ repeat: Infinity, duration: 2 }} />
          </g>

          {/* destination marker (pulsing) */}
          <g>
            <motion.circle cx={128} cy={30} r={3.6} fill="#8b5cf6" animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 2.2 }} />
            <motion.circle cx={128} cy={30} r={6} fill="#8b5cf6" opacity={0.12} animate={{ r: [6, 14, 6], opacity: [0.12, 0.28, 0.12] }} transition={{ repeat: Infinity, duration: 2.2 }} />
          </g>

          {/* moving bus marker (follows keyframes) */}
          {
            (() => {
              const positions = [{ x: 18, y: 50 }, { x: 42, y: 32 }, { x: 70, y: 56 }, { x: 98, y: 36 }, { x: 120, y: 32 }];
              const xs = positions.map(p => p.x);
              const ys = positions.map(p => p.y);
              return (
                <motion.g initial={{ x: xs[0], y: ys[0], opacity: 0 }} animate={{ x: [xs[0], xs[1], xs[2], xs[3], xs[4]], y: [ys[0], ys[1], ys[2], ys[3], ys[4]], opacity: [0, 1, 1, 1, 0.95] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}>
                  <rect x="-8" y="-6" width="20" height="12" rx="2" fill="#ff7a18" />
                  <rect x="-4" y="-2" width="8" height="6" rx="1" fill="#fff" opacity={0.95} />
                  <circle cx="2" cy="8" r="1.6" fill="#111827" />
                  <circle cx="14" cy="8" r="1.6" fill="#111827" />
                </motion.g>
              );
            })()
          }

          {/* show a highlighted marker when busLocation present */}
          {busLocation && (
            <motion.circle cx={60} cy={44} r={4.2} fill="#3b82f6" animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 1.8 }} />
          )}
        </svg>
      </div>

      <div className="flex items-center justify-between text-white/70 text-sm">
        <div>
          <div className="font-semibold text-white">Origin</div>
          <div>{origin.name}</div>
        </div>
        <div className="text-right">
          <div className="font-semibold text-white">Destination</div>
          <div>{destination.name}</div>
        </div>
      </div>

      {busLocation && (
        <div className="mt-4 p-3 flex items-center gap-2 bg-blue-500/10 rounded-lg">
          <Navigation className="w-4 h-4 text-orange-400" />
          <span className="text-sm text-black dark:text-white/90">Bus is en route — live updates disabled in this mode</span>
        </div>
      )}
    </motion.div>
  );
}
