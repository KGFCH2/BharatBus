import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { MapPin, Clock, IndianRupee, Search, Filter, X } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import FlipCard from '../components/FlipCard';
import GradientButton from '../components/GradientButton';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

type RouteItem = {
  id: number;
  busNumber: string;
  operator: string;
  from: string;
  to: string;
  departure: string;
  arrival?: string;
  duration: string;
  fare: number;
  stops: string[];
  frequency: string;
  rating?: number;
};

export default function Routes() {
  const [searchParams] = useSearchParams();
  const from = searchParams.get('from') || 'Any Location';
  const to = searchParams.get('to') || 'Any Destination';
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [selectedOperators, setSelectedOperators] = useState<string[]>([]);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const normalizedQuery = query.trim().toLowerCase();

  // Simple fuzzy match: direct includes OR small Levenshtein distance for short queries
  function levenshtein(a: string, b: string) {
    const A = a.split('');
    const B = b.split('');
    const dp: number[][] = Array.from({ length: A.length + 1 }, () => Array(B.length + 1).fill(0));
    for (let i = 0; i <= A.length; i++) dp[i][0] = i;
    for (let j = 0; j <= B.length; j++) dp[0][j] = j;
    for (let i = 1; i <= A.length; i++) {
      for (let j = 1; j <= B.length; j++) {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + (A[i - 1] === B[j - 1] ? 0 : 1)
        );
      }
    }
    return dp[A.length][B.length];
  }

  function fuzzyMatch(text: string, q: string) {
    if (!q) return true;
    const t = text.toLowerCase();
    if (t.includes(q)) return true; // partial match
    // small queries: allow small typos
    if (q.length <= 3) {
      return levenshtein(t, q) <= 2 || levenshtein(q, t) <= 2;
    }
    // split words and try fuzzy on words (for stops)
    return t.split(/\s+/).some((w) => levenshtein(w, q) <= 2);
  }

  const groupedRoutes = [
    {
      category: 'Featured Routes',
      routes: [
        {
          id: 1,
          busNumber: '81',
          operator: 'BharatBus',
          from: 'Barasat',
          to: 'Barrackpore',
          departure: '05:00 AM',
          arrival: '11:00 PM',
          duration: '—',
          fare: 25,
          stops: ['Barasat', 'Madhyamgram', 'Sodepur', 'Barrackpore'],
          frequency: 'Every 15 mins',
          rating: 4.5,
        },
        {
          id: 2,
          busNumber: 'Express 42',
          operator: 'Express Services',
          from: 'Howrah',
          to: 'Salt Lake',
          departure: '06:00 AM',
          arrival: '10:00 PM',
          duration: '—',
          fare: 30,
          stops: ['Howrah', 'Maidan', 'Park Street', 'Salt Lake'],
          frequency: 'Every 20 mins',
          rating: 4.4,
        },
        {
          id: 3,
          busNumber: 'Metro Link',
          operator: 'MetroLink',
          from: 'Airport',
          to: 'Esplanade',
          departure: '05:30 AM',
          arrival: '11:30 PM',
          duration: '—',
          fare: 40,
          stops: ['Airport', 'New Town', 'Sector V', 'Esplanade'],
          frequency: 'Every 10 mins',
          rating: 4.6,
        },
      ],
    },
    {
      category: 'Public / STU (NBSTC examples)',
      routes: [
        {
          id: 1001,
          busNumber: 'NB-101',
          operator: 'NBSTC',
          from: 'Siliguri',
          to: 'Alipurduar',
          departure: '06:00 AM',
          arrival: '10:30 AM',
          duration: '4h 30m',
          fare: 120,
          stops: ['Siliguri', 'Bagdogra', 'Hasimara', 'Alipurduar'],
          frequency: 'Daily',
          rating: 4.2,
        },
        {
          id: 1002,
          busNumber: 'NB-202',
          operator: 'NBSTC',
          from: 'Siliguri',
          to: 'Cooch Behar',
          departure: '07:30 AM',
          arrival: '12:00 PM',
          duration: '4h 30m',
          fare: 150,
          stops: ['Siliguri', 'Alipurduar', 'Cooch Behar'],
          frequency: 'Daily',
          rating: 4.0,
        },
        {
          id: 1003,
          busNumber: 'NB-303',
          operator: 'NBSTC',
          from: 'Malda',
          to: 'Raiganj',
          departure: '05:45 AM',
          arrival: '10:00 AM',
          duration: '4h 15m',
          fare: 110,
          stops: ['Malda', 'Chanchal', 'Raiganj'],
          frequency: 'Daily',
          rating: 3.9,
        },
      ],
    },
    {
      category: 'WBTC / CSTC & Government (Kolkata area examples)',
      routes: [
        {
          id: 2001,
          busNumber: 'E-1',
          operator: 'WBTC',
          from: 'Jadavpur 8B',
          to: 'Howrah Station',
          departure: '08:00 AM',
          arrival: '09:00 AM',
          duration: '1h 0m',
          fare: 20,
          stops: ['Jadavpur', 'Tollygunge', 'Kalighat', 'Howrah'],
          frequency: 'Every 20 mins',
          rating: 4.1,
        },
        {
          id: 2002,
          busNumber: 'AC-1',
          operator: 'WBTC',
          from: 'Jadavpur 8B',
          to: 'Howrah Station',
          departure: '09:00 AM',
          arrival: '10:00 AM',
          duration: '1h 0m',
          fare: 45,
          stops: ['Jadavpur', 'Tollygunge', 'Dalhousie', 'Howrah'],
          frequency: 'Every 30 mins',
          rating: 4.3,
        },
        {
          id: 2003,
          busNumber: 'S-2',
          operator: 'CSTC',
          from: 'Kudghat',
          to: 'Howrah Station',
          departure: '07:45 AM',
          arrival: '08:50 AM',
          duration: '1h 5m',
          fare: 18,
          stops: ['Kudghat', 'Jadavpur', 'Tollygunge', 'Howrah'],
          frequency: 'Every 25 mins',
          rating: 4.0,
        },
      ],
    },
    {
      category: 'Private / Other / Mixed (sample private and SD series)',
      routes: [
        {
          id: 3001,
          busNumber: '1',
          operator: 'Private (Blue-Yellow)',
          from: 'Ramnagar',
          to: 'Mukundapur',
          departure: '06:30 AM',
          arrival: '07:15 AM',
          duration: '45m',
          fare: 12,
          stops: ['Ramnagar', 'Rashbehari', 'Gariahat', 'Mukundapur'],
          frequency: 'Every 30 mins',
          rating: 3.8,
        },
        {
          id: 3002,
          busNumber: '1A',
          operator: 'Private (Blue-Yellow)',
          from: 'Ramnagar',
          to: 'Mukundapur (via alt)',
          departure: '07:00 AM',
          arrival: '07:50 AM',
          duration: '50m',
          fare: 12,
          stops: ['Ramnagar', 'Salt Lake', 'Mukundapur'],
          frequency: 'Every 40 mins',
          rating: 3.7,
        },
        {
          id: 3003,
          busNumber: '3B',
          operator: 'Private',
          from: 'New Alipore',
          to: 'Milk Colony',
          departure: '08:15 AM',
          arrival: '08:45 AM',
          duration: '30m',
          fare: 10,
          stops: ['New Alipore', 'Behala', 'Diamond Harbour Road', 'Milk Colony'],
          frequency: 'Every 20 mins',
          rating: 3.6,
        },
        {
          id: 3010,
          busNumber: 'SD-3',
          operator: 'Private (SD series)',
          from: 'Sonarpur',
          to: 'Ghatakpukur',
          departure: '06:50 AM',
          arrival: '08:30 AM',
          duration: '1h 40m',
          fare: 30,
          stops: ['Sonarpur', 'Garia', 'Ballygunge', 'Ghatakpukur'],
          frequency: 'Every 60 mins',
          rating: 3.5,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-2 brand-gradient bg-clip-text text-transparent">
            Available Routes
          </h1>
          <p className="text-xl text-white/70">
            {from} → {to}
          </p>
        </motion.div>

        {/* Search / Filter bar */}
        <div className="max-w-4xl mx-auto mb-8 space-y-4">
          <div className="flex items-center gap-2">
            <div className="search-outline flex items-center flex-1 rounded-lg bg-white/5 px-3 py-2 transition-all light:bg-white light:border light:border-gray-200 light:text-black light:shadow-sm">
              <Search className="w-5 h-5 text-white/60 dark:text-white/70 light:text-slate-600 mr-3" />
              <input
                aria-label="Search routes"
                placeholder="Search by route code, operator, origin or destination (e.g. E-1, AC-1, SD-3)"
                className="flex-1 bg-transparent text-white dark:text-white placeholder-white/60 focus:outline-none light:text-black light:placeholder-slate-600 light:bg-white"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <button
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${showFilters ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40' : 'bg-white/10 text-white light:bg-white/10 light:text-black'}`}
              onClick={() => setShowFilters(!showFilters)}
              aria-label="Toggle filters"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
            {(query || selectedOperators.length > 0 || priceRange[0] > 0 || priceRange[1] < 200) && (
              <button
                className="px-3 py-2 rounded-lg bg-white/10 text-white light:bg-white/10 light:text-black"
                onClick={() => {
                  setQuery('');
                  setSelectedOperators([]);
                  setPriceRange([0, 200]);
                }}
                aria-label="Clear all filters"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <GlassCard className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Price Range */}
                  <div>
                    <label className="text-white/80 text-sm font-medium mb-2 block">
                      Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Math.min(Number(e.target.value), priceRange[1] - 10), priceRange[1]])}
                        className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-orange-400"
                      />
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Math.max(Number(e.target.value), priceRange[0] + 10)])}
                        className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-orange-400"
                      />
                    </div>
                  </div>

                  {/* Operator Type */}
                  <div>
                    <label className="text-white/80 text-sm font-medium mb-2 block">
                      Operator Type
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['WBTC', 'CSTC', 'NBSTC', 'Private'].map((op) => (
                        <button
                          key={op}
                          onClick={() => {
                            setSelectedOperators((prev) =>
                              prev.includes(op) ? prev.filter((o) => o !== op) : [...prev, op]
                            );
                          }}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                            selectedOperators.includes(op)
                              ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                              : 'bg-white/5 text-white/70 hover:bg-white/10'
                          }`}
                        >
                          {op}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Active Filters Summary */}
                {(selectedOperators.length > 0 || priceRange[0] > 0 || priceRange[1] < 200) && (
                  <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                    <span className="text-white/60 text-sm">Active filters:</span>
                    {priceRange[0] > 0 || priceRange[1] < 200 ? (
                      <span className="px-2 py-1 rounded bg-orange-500/20 text-orange-400 text-xs">
                        ₹{priceRange[0]}-₹{priceRange[1]}
                      </span>
                    ) : null}
                    {selectedOperators.map((op) => (
                      <span key={op} className="px-2 py-1 rounded bg-blue-500/20 text-blue-400 text-xs flex items-center gap-1">
                        {op}
                        <button onClick={() => setSelectedOperators((prev) => prev.filter((o) => o !== op))}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </GlassCard>
            </motion.div>
          )}
        </div>

        <div className="space-y-8">
          {groupedRoutes.map((group) => {
            const filtered = group.routes.filter((r: RouteItem) => {
              // Text search filter
              if (normalizedQuery) {
                const matchesText = fuzzyMatch(r.busNumber, normalizedQuery) ||
                  fuzzyMatch(r.operator, normalizedQuery) ||
                  fuzzyMatch(r.from, normalizedQuery) ||
                  fuzzyMatch(r.to, normalizedQuery) ||
                  r.stops.some((s) => fuzzyMatch(s, normalizedQuery));
                if (!matchesText) return false;
              }

              // Price filter
              if (r.fare < priceRange[0] || r.fare > priceRange[1]) {
                return false;
              }

              // Operator filter
              if (selectedOperators.length > 0) {
                const matchesOperator = selectedOperators.some((op) =>
                  r.operator.toLowerCase().includes(op.toLowerCase())
                );
                if (!matchesOperator) return false;
              }

              return true;
            });
            if (filtered.length === 0) return null;

            return (
              <div key={group.category}>
                <h2 className="text-2xl text-white/80 font-semibold mb-4">{group.category}</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                  {filtered.map((route: RouteItem, index: number) => {
                    const front = (
                      <GlassCard hover={false} className="h-full">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="text-3xl font-bold brand-gradient bg-clip-text text-transparent">
                              Bus {route.busNumber}
                            </div>
                            <div className="text-white/60 text-sm">{route.operator}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-white flex items-center">
                              <IndianRupee className="w-5 h-5" />
                              {route.fare}
                            </div>
                            <div className="text-yellow-400 text-sm">★ {route.rating}</div>
                          </div>
                        </div>

                        <div className="space-y-3 mb-4">
                          <div className="flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-orange-400" />
                            <div>
                              <div className="text-white font-semibold">{route.from}</div>
                              <div className="text-white/60 text-sm">{route.departure}</div>
                            </div>
                          </div>

                          <div className="border-l-2 border-dashed border-white/20 ml-2 pl-6 py-2">
                            <Clock className="w-4 h-4 text-white/40 inline mr-2" />
                            <span className="text-white/60 text-sm">{route.duration}</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-green-400" />
                            <div>
                              <div className="text-white font-semibold">{route.to}</div>
                              <div className="text-white/60 text-sm">{route.arrival}</div>
                            </div>
                          </div>
                        </div>

                        <p className="text-white/40 text-xs text-center mt-4 flip-caption">Click for more details</p>
                      </GlassCard>
                    );

                    const back = (
                      <GlassCard hover={false} className="h-full flex flex-col">
                        <h3 className="text-xl font-bold text-white mb-4">Route Details</h3>

                        <div className="flex-grow space-y-3">
                          <div>
                            <p className="text-white/60 text-sm mb-1">All Stops:</p>
                            <div className="flex flex-col gap-1">
                              {route.stops.map((stop: string, idx: number) => (
                                <div key={idx} className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                                  <span className="text-white text-sm">{stop}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <p className="text-white/60 text-sm">Frequency:</p>
                            <p className="text-white">{route.frequency}</p>
                          </div>
                        </div>

                        <GradientButton
                          className="w-full mt-4"
                          onClick={() => {
                            if (isAuthenticated) {
                              // proceed to booking page for this route and pass route info so BookTicket can prefill
                              navigate('/book', { state: { routeId: route.id, from: route.from, to: route.to } });
                            } else {
                              // redirect to login and preserve intended destination + route data
                              navigate('/login', { state: { from: '/book', routeState: { routeId: route.id, from: route.from, to: route.to } } });
                            }
                          }}
                        >
                          Book This Route
                        </GradientButton>
                      </GlassCard>
                    );

                    return (
                      <motion.div
                        key={route.id}
                        className="h-full min-h-0"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="h-full min-h-0">
                          <FlipCard front={front} back={back} className="h-full min-h-[22rem]" />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
