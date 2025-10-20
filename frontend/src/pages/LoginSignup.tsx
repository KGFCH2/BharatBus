import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Bus } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import GradientButton from '../components/GradientButton';
import { useAuth } from '../context/useAuth';

export default function LoginSignup() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    gender: 'other',
  });
  const { login, signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  interface TicketMeta {
    id: string;
    from?: string;
    to?: string;
    date?: string;
  }

  const [savedTickets, setSavedTickets] = useState<TicketMeta[]>([]);

  useEffect(() => {
    // Load saved tickets from localStorage (keys prefixed with ticket_)
    const tickets: TicketMeta[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)!;
      if (key?.startsWith('ticket_') && !key.endsWith('_meta')) {
        const id = key.replace('ticket_', '');
        const metaRaw = localStorage.getItem(`${key}_meta`);
        const meta = metaRaw ? JSON.parse(metaRaw) : undefined;
        tickets.push({ id, from: meta?.from, to: meta?.to, date: meta?.date });
      }
    }
    setSavedTickets(tickets);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        // refresh saved tickets after auth
        const tickets: TicketMeta[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)!;
          if (key?.startsWith('ticket_') && !key.endsWith('_meta')) {
            const id = key.replace('ticket_', '');
            const metaRaw = localStorage.getItem(`${key}_meta`);
            const meta = metaRaw ? JSON.parse(metaRaw) : undefined;
            tickets.push({ id, from: meta?.from, to: meta?.to, date: meta?.date });
          }
        }
        setSavedTickets(tickets);
        navigate('/tickets');
      } else {
        await signup(formData.name, formData.email, formData.password, formData.gender as 'male' | 'female' | 'other');
        // After signup, clear all ticket keys and any per-user ticket index keys from localStorage
        // This prevents leftover `tickets_user_*` indexes (which may have been created during
        // associateAnonymousTickets) from causing phantom/placeholder tickets to appear.
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)!;
          if (key.startsWith('ticket_') || key.startsWith('tickets_user_')) keysToRemove.push(key);
        }
        keysToRemove.forEach((k) => localStorage.removeItem(k));
        setSavedTickets([]);
        // Redirect to profile page after signup
        navigate('/profile');
      }
    } catch (err) {
      console.error('Auth failed', err);
      alert('Unable to authenticate. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 mb-4"
          >
            <Bus className="w-8 h-8 text-orange-400" aria-hidden="true" />
          </motion.div>
          <h1 className="text-3xl font-bold brand-gradient bg-clip-text text-transparent mb-2">
            BharatBus
          </h1>
          <p className="text-white/60">
            {isLogin ? 'Welcome back!' : 'Create your account'}
          </p>
        </div>

        <GlassCard>
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              aria-label="Switch to login form"
              className={`flex-1 py-2 px-4 rounded-lg font-bold transition-all ${isLogin
                ? 'brand-bg text-gray-900'
                : 'text-white/60 hover:text-white'
                }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              aria-label="Switch to signup form"
              className={`flex-1 py-2 px-4 rounded-lg font-bold transition-all ${!isLogin
                ? 'brand-bg text-gray-900'
                : 'text-white/60 hover:text-white'
                }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <label className="flex items-center gap-2 text-white/80 text-sm">
                  <User className="w-4 h-4 text-orange-400" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required={!isLogin}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all light:text-black light:placeholder-slate-600 light:bg-white light:border-gray-200"
                />
              </motion.div>
            )}

            {!isLogin && (
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-white/80 text-sm">
                  <User className="w-4 h-4 text-orange-400" />
                  Gender
                </label>
                <div className="inline-flex w-full rounded-xl overflow-hidden border border-white/10 bg-white/5">
                  {(['male', 'female', 'other'] as const).map((g) => {
                    const active = formData.gender === g;
                    return (
                      <button
                        key={g}
                        type="button"
                        aria-pressed={active ? 'true' : 'false'}
                        onClick={() => setFormData({ ...formData, gender: g })}
                        className={`flex-1 px-4 py-3 text-sm font-medium transition-all focus:outline-none ${active ? 'bg-orange-500/20 text-orange-400 border-r border-white/10' : 'text-white hover:bg-white/10 hover:text-white'}`}
                      >
                        {g === 'male' ? 'Male' : g === 'female' ? 'Female' : 'Other'}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-white/80 text-sm">
                <Mail className="w-4 h-4 text-orange-400" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all light:text-black light:placeholder-slate-600 light:bg-white light:border-gray-200"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-white/80 text-sm">
                <Lock className="w-4 h-4 text-orange-400" />
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all light:text-black light:placeholder-slate-600 light:bg-white light:border-gray-200"
              />
            </div>

            {isLogin && (
              <div className="text-right">
                <a href="#" className="text-orange-400 text-sm hover:text-orange-300 transition-colors" aria-label="Reset your password">
                  Forgot Password?
                </a>
              </div>
            )}

            <GradientButton type="submit" className="w-full text-lg py-3 mt-6" ariaLabel={isLogin ? 'Submit login form' : 'Submit signup form'}>
              {isLogin ? 'Login' : 'Create Account'}
            </GradientButton>
          </form>

          <div className="mt-6 text-center text-white/60 text-sm">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-orange-400 hover:text-orange-300 transition-colors"
              aria-label={isLogin ? 'Switch to signup form' : 'Switch to login form'}
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </div>
        </GlassCard>

        {isAuthenticated && savedTickets.length > 0 && (
          <div className="mt-6">
            <GlassCard>
              <h3 className="text-lg font-bold text-white mb-4">Saved Tickets</h3>
              <div className="space-y-3">
                {savedTickets.map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <div className="text-white font-semibold">{t.from || 'Ticket'} → {t.to || t.id}</div>
                      <div className="text-white/60 text-sm">{t.date || ''}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={async () => {
                          const dataUri = localStorage.getItem(`ticket_${t.id}`);
                          if (!dataUri) return alert('Ticket not found');
                          const mod = await import('../utils/download');
                          mod.downloadDataUri(dataUri, `${t.id}.pdf`);
                        }}
                        className="px-3 py-1 rounded brand-bg text-gray-900 font-semibold"
                      >
                        Download
                      </button>

                      <button
                        onClick={() => {
                          localStorage.removeItem(`ticket_${t.id}`);
                          localStorage.removeItem(`ticket_${t.id}_meta`);
                          setSavedTickets((s) => s.filter((x) => x.id !== t.id));
                        }}
                        className="px-3 py-1 rounded bg-white/10 text-white/80"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        )}
      </motion.div>
    </div>
  );
}
