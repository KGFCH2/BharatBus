import { motion } from 'framer-motion';
import { Bus, Users, Calendar, TrendingUp, Clock, MapPin } from 'lucide-react';
import GlassCard from '../components/GlassCard';

export default function OperatorDashboard() {
  const stats = [
    { icon: Bus, label: 'Active Buses', value: '24', color: 'text-orange-400' },
    { icon: Users, label: 'Total Passengers', value: '1,247', color: 'text-green-400' },
    { icon: Calendar, label: 'Bookings Today', value: '89', color: 'text-orange-400' },
    { icon: TrendingUp, label: 'Revenue', value: '₹45,320', color: 'text-green-400' },
  ];

  const routes = [
    { id: 1, number: '81', route: 'Barasat ↔ Barrackpore', status: 'Active', buses: 4 },
    { id: 2, number: '42E', route: 'Howrah ↔ Salt Lake', status: 'Active', buses: 3 },
    { id: 3, number: 'ML-5', route: 'Airport ↔ Esplanade', status: 'Active', buses: 5 },
    { id: 4, number: '203', route: 'Jadavpur ↔ Howrah', status: 'Maintenance', buses: 2 },
  ];

  const schedules = [
    { time: '08:00 AM', bus: '81', route: 'Barasat → Barrackpore', status: 'On Time' },
    { time: '09:15 AM', bus: '42E', route: 'Howrah → Salt Lake', status: 'Delayed 5m' },
    { time: '10:30 AM', bus: 'ML-5', route: 'Airport → Esplanade', status: 'On Time' },
    { time: '11:45 AM', bus: '203', route: 'Jadavpur → Howrah', status: 'On Time' },
  ];
  // QuickActions intentionally removed — operator dashboard keeps only core stats and schedule views

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 brand-gradient bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-xl text-white/70">Manage your bus operations</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="text-center glow-hover feature-glow edge-glow-orange">
                <stat.icon className={`w-12 h-12 mx-auto mb-3 ${stat.color}`} />
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard className="glow-hover edge-glow-orange">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Bus className="w-6 h-6 text-orange-400" />
                Route Management
              </h2>
              <div className="space-y-3">
                {routes.map((route) => (
                  <div
                    key={route.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-orange-400/50 transition-colors glow-interactive edge-glow-orange"
                  >
                    <div>
                      <div className="text-white font-semibold">
                        Bus {route.number}
                      </div>
                      <div className="text-white/60 text-sm">{route.route}</div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-sm font-semibold ${route.status === 'Active' ? 'text-green-400' : 'text-yellow-400'
                          }`}
                      >
                        {route.status}
                      </div>
                      <div className="text-white/60 text-xs">{route.buses} buses</div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <GlassCard className="glow-hover edge-glow-orange">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Clock className="w-6 h-6 text-green-400" />
                Today's Schedule
              </h2>
              <div className="space-y-3">
                {schedules.map((schedule, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 glow-interactive edge-glow-orange"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-orange-400 font-bold">{schedule.time}</div>
                      <div>
                        <div className="text-white font-semibold">
                          Bus {schedule.bus}
                        </div>
                        <div className="text-white/60 text-sm flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {schedule.route}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`text-sm font-semibold ${schedule.status === 'On Time' ? 'text-green-400' : 'text-yellow-400'
                        }`}
                    >
                      {schedule.status}
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Quick Actions removed */}


      </div>
    </div>
  );
}
