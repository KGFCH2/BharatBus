import { motion } from 'framer-motion';
import { Search, MapPin, Clock, Shield, Zap } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import FlipCard from '../components/FlipCard';
import GradientButton from '../components/GradientButton';
import Typewriter from '../components/Typewriter';

export default function Home() {
  const navigate = useNavigate();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const handleSearch = () => {
    if (from && to) {
      navigate(`/routes?from=${from}&to=${to}`);
    }
  };
//hiii
  const featuredRoutes = [
    {
      id: 1,
      name: 'Bus 81',
      route: 'Barasat ↔ Barrackpore',
      frequency: 'Every 15 mins',
      fare: '₹25',
      stops: ['Barasat', 'Madhyamgram', 'Sodepur', 'Barrackpore'],
      timing: '5:00 AM - 11:00 PM',
      distance: '18 km',
    },
    {
      id: 2,
      name: 'Express 42',
      route: 'Howrah ↔ Salt Lake',
      frequency: 'Every 20 mins',
      fare: '₹30',
      stops: ['Howrah', 'Maidan', 'Park Street', 'Salt Lake'],
      timing: '6:00 AM - 10:00 PM',
      distance: '22 km',
    },
    {
      id: 3,
      name: 'Metro Link',
      route: 'Airport ↔ Esplanade',
      frequency: 'Every 10 mins',
      fare: '₹40',
      stops: ['Airport', 'New Town', 'Sector V', 'Esplanade'],
      timing: '5:30 AM - 11:30 PM',
      distance: '28 km',
    },
  ];

  const features = [
    { icon: MapPin, title: 'Live Tracking', desc: 'Track your bus in real-time' },
    { icon: Clock, title: 'Always On Time', desc: 'Accurate schedule updates' },
    { icon: Shield, title: 'Safe & Secure', desc: 'Verified operators only' },
    { icon: Zap, title: 'Quick Booking', desc: 'Book tickets in seconds' },
  ];

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 brand-gradient bg-clip-text text-transparent">
            <Typewriter phrases={[
              'Your All-India Bus Companion',
              'Search routes nationwide',
              'Track buses in real-time',
              'Book tickets in seconds'
            ]} />
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Search routes, track buses live, and book tickets seamlessly across India
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard className="home-search max-w-4xl mx-auto mb-20 border-2 rounded-2xl border-white/20 dark:border-white/20 light:border-black">
            <div className="flex flex-row flex-nowrap gap-3 items-end">
              <div className="flex-1 min-w-0">
                <label htmlFor="from-input" className="hidden md:block text-white/60 text-sm mb-1">From</label>
                <div className="flex items-center gap-2 h-11 p-2 rounded-xl bg-white/5 border border-white/20 light:bg-white light:border-gray-200 light-box search-outline">
                  <MapPin className="w-4 h-4 text-orange-400" />
                  <input
                    id="from-input"
                    type="text"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    placeholder="Enter origin"
                    aria-label="Enter origin city"
                    className="flex-1 h-full px-2 bg-transparent w-full text-white placeholder-white/40 focus:outline-none focus:border-transparent transition-colors light:text-black light:placeholder-slate-600 light:bg-white dark:text-white light:border-black light:border-2 min-w-0"
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <label htmlFor="to-input" className="hidden md:block text-white/60 text-sm mb-1">To</label>
                <div className="flex items-center gap-2 h-11 p-2 rounded-xl bg-white/5 border border-white/20 light:bg-white light:border-gray-200 light-box search-outline">
                  <MapPin className="w-4 h-4 text-green-400" />
                  <input
                    id="to-input"
                    type="text"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="Enter destination"
                    aria-label="Enter destination city"
                    className="flex-1 h-full px-2 bg-transparent w-full text-white placeholder-white/40 focus:outline-none focus:border-transparent transition-colors light:text-black light:placeholder-slate-600 light:bg-white dark:text-white light:border-black light:border-2 min-w-0"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <GradientButton onClick={handleSearch} className="h-11 flex items-center justify-center px-4 rounded-xl glass i-glow glow-hover search-orange-glow" ariaLabel="Search bus routes" glow="strong">
                  <Search className="w-5 h-5" />
                </GradientButton>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-10">
            Featured Routes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredRoutes.map((route, index) => {
              const front = (
                <GlassCard hover={false} className="h-full">
                  <div className="flex flex-col h-full">
                    <div className="text-2xl font-bold brand-gradient bg-clip-text text-transparent mb-2">
                      {route.name}
                    </div>
                    <div className="text-white text-lg mb-4">{route.route}</div>
                    <div className="space-y-2 text-white/70 flex-grow">
                      <p className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {route.frequency}
                      </p>
                      <p className="text-2xl font-bold text-orange-400">{route.fare}</p>
                    </div>
                    <p className="text-white/40 text-sm mt-4 text-center">Hover for details</p>
                  </div>
                </GlassCard>
              );

              const back = (
                <GlassCard hover={false} className="h-full">
                  <div className="flex flex-col h-full">
                    <h3 className="text-xl font-bold text-white mb-4">Route Details</h3>
                    <div className="space-y-3 text-sm flex-grow">
                      <div>
                        <p className="text-white/60 mb-1">Stops:</p>
                        <p className="text-white">{route.stops.join(' → ')}</p>
                      </div>
                      <div>
                        <p className="text-white/60">Timing: <span className="text-white">{route.timing}</span></p>
                      </div>
                      <div>
                        <p className="text-white/60">Distance: <span className="text-white">{route.distance}</span></p>
                      </div>
                    </div>
                    {/* booking control intentionally removed from featured card backs */}
                  </div>
                </GlassCard>
              );

              return (
                <motion.div
                  key={route.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  {/* flip on hover, booking action removed from card */}
                  <FlipCard front={front} back={back} className="h-80" trigger="hover" />
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-white text-center mb-10">
            Why Choose BharatBus?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
              >
                <GlassCard className="text-center h-full feature-glow">
                  <feature.icon className="w-12 h-12 mx-auto mb-4 text-orange-400" aria-hidden="true" />
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-white/60">{feature.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
