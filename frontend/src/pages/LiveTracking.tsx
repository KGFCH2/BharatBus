import { motion } from 'framer-motion';
import { useState } from 'react';
import { Navigation, MapPin, Clock } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import GlassCard from '../components/GlassCard';
import RouteMap from '../components/RouteMap';
import GradientButton from '../components/GradientButton';

export default function LiveTracking() {
  const [selectedBus, setSelectedBus] = useState(1);

  const buses = [
    {
      id: 1,
      number: '81',
      route: 'Barasat ↔ Barrackpore',
      status: 'En Route',
      eta: '12 mins',
      nextStop: 'Madhyamgram',
      location: { lat: 22.6447, lng: 88.4342 },
      origin: { lat: 22.7200, lng: 88.4839, name: 'Barasat' },
      destination: { lat: 22.7676, lng: 88.3677, name: 'Barrackpore' },
    },
    {
      id: 2,
      number: '42E',
      route: 'Howrah ↔ Salt Lake',
      status: 'At Stop',
      eta: '5 mins',
      nextStop: 'Park Street',
      location: { lat: 22.5698, lng: 88.3631 },
      origin: { lat: 22.5826, lng: 88.3426, name: 'Howrah' },
      destination: { lat: 22.5726, lng: 88.4279, name: 'Salt Lake' },
    },
  ];

  const currentBus = buses.find((bus) => bus.id === selectedBus) || buses[0];
  const { user } = useAuth();

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 brand-gradient bg-clip-text text-transparent">
            Live Bus Tracking
          </h1>
          <p className="text-xl text-white/70">Track your bus in real-time</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative">
                <RouteMap
                  origin={currentBus.origin}
                  destination={currentBus.destination}
                  busLocation={currentBus.location}
                />

                {/* single illustration kept in RouteMap (no extra overlay) */}
              </div>
            </motion.div>
          </div>

          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GlassCard>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-orange-400" />
                  Bus {currentBus.number}
                </h3>

                <div className="space-y-3 mb-6">
                  <div>
                    <p className="text-white/60 text-sm">Route</p>
                    <p className="text-white font-semibold">{currentBus.route}</p>
                  </div>

                  <div>
                    <p className="text-white/60 text-sm">Status</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                      <p className="text-green-400 font-semibold">{currentBus.status}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-white/60 text-sm">Next Stop</p>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-orange-400" />
                      <p className="text-white">{currentBus.nextStop}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-white/60 text-sm">ETA</p>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-green-400" />
                      <p className="text-white font-bold text-lg">{currentBus.eta}</p>
                    </div>
                  </div>
                </div>

                {/* Show Set Alert only when user is logged in; this feature requires authentication */}
                {/** useAuth will provide user info; hide button for anonymous users **/}
                {user ? <GradientButton className="w-full">Set Alert</GradientButton> : null}
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <GlassCard>
                <h3 className="text-lg font-bold text-white mb-4">Available Buses</h3>
                <div className="space-y-2">
                  {buses.map((bus) => (
                    <button
                      key={bus.id}
                      onClick={() => setSelectedBus(bus.id)}
                      className={`w-full p-3 rounded-xl text-left transition-all ${selectedBus === bus.id
                        ? 'brand-bg-subtle border border-orange-400'
                        : 'bg-white/5 border border-white/10 hover:border-white/30 light:bg-white light:border-gray-200 light:text-black'
                        }`}
                    >
                      <div className="font-semibold text-white">Bus {bus.number}</div>
                      <div className="text-xs text-white/60">{bus.route}</div>
                    </button>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
