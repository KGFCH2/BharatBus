import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { Bus, Menu, X, LogOut, Sun, Moon } from 'lucide-react';
import maleAvatar from '../assets/male.svg';
import femaleAvatar from '../assets/female.svg';
import neutralAvatar from '../assets/neutral.svg';
import { useAuth } from '../context/useAuth';
import { useTheme } from '../context/ThemeContext';

// Normalize common gender values to 'male' | 'female' | 'other' | null
function normalizeGender(value?: string | null): 'male' | 'female' | 'other' | null {
  if (!value) return null;
  const s = String(value).trim().toLowerCase();
  if (s === 'male' || s === 'm' || s === 'man' || s.startsWith('m')) return 'male';
  if (s === 'female' || s === 'f' || s === 'woman' || s.startsWith('f')) return 'female';
  return 'other';
}

function ThemeToggle(): JSX.Element {
  const { theme, toggleTheme } = useTheme();
  const controls = useAnimation();

  return (
    <button
      onClick={async () => {
        controls.start({ y: [0, -6, 0], scale: [1, 1.06, 1] });
        toggleTheme();
      }}
      aria-label="Toggle theme"
      className="p-2 rounded-full bg-white/5 text-white/90 flex items-center justify-center"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <motion.div animate={controls} transition={{ duration: 0.45 }}>
          <Sun className="w-5 h-5 text-yellow-400" />
        </motion.div>
      ) : (
        <motion.div animate={controls} transition={{ duration: 0.45 }}>
          <Moon className="w-5 h-5 text-sky-600" />
        </motion.div>
      )}
    </button>
  );
}

export default function Navbar(): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const { theme } = useTheme();

  const gender = normalizeGender(user?.gender ?? null);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Routes', path: '/routes' },
    { name: 'Live Tracking', path: '/tracking' },
    { name: 'Book Ticket', path: '/book' },
    ...(isAuthenticated ? [
      { name: 'Profile', path: '/profile' },
      { name: 'Dashboard', path: '/dashboard' },
    ] : []),
  ];

  return (
    <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto backdrop-blur-md bg-white/5 dark:bg-black/30 rounded-2xl border border-white/10 dark:border-white/10 shadow-lg">
        <div className="flex items-center justify-between px-6 py-3">
          <Link to="/" className="flex items-center gap-2">
            {gender === 'male' ? (
              <img src={maleAvatar} alt="male logo" className="w-8 h-8 rounded-md" />
            ) : gender === 'female' ? (
              <img src={femaleAvatar} alt="female logo" className="w-8 h-8 rounded-md" />
            ) : (
              <Bus className="w-8 h-8 text-orange-400" />
            )}
            <span className="text-2xl font-bold brand-gradient bg-clip-text text-transparent">BharatBus</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const lightMode = theme === 'light';
              const base = `relative px-4 py-2 transition-all ${lightMode ? 'transition-colors' : 'rounded-lg nav-glow glow-hover'}`;
              const stateClass = isActive
                ? `${lightMode ? 'text-gray-900 font-semibold' : 'text-white font-semibold'}`
                : `${lightMode ? 'text-gray-700 hover:text-orange-400' : 'text-white/80 hover:text-white'}`;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative ${base} ${stateClass}`}
                  onClick={() => window.scrollTo(0, 0)}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {/* animated rounded box indicator */}
                  {isActive && (
                    <motion.span
                      layoutId="navbar-indicator"
                      transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                      className={`${lightMode ? 'absolute inset-0 rounded-lg bg-orange-50/80 border border-orange-200 shadow-sm -z-10' : 'absolute inset-0 rounded-lg bg-white/10 -z-10'}`}
                      aria-hidden
                    />
                  )}

                  <span className="relative z-10">{item.name}</span>
                </Link>
              );
            })}

            {!isAuthenticated ? (
              <Link to="/login" className="px-4 py-2 rounded-lg bg-white text-gray-900 font-semibold" onClick={() => window.scrollTo(0, 0)}>
                Login
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <button title={user?.name || 'Account'} aria-label="User account" className="p-1 rounded-full bg-white/5 text-white/90 glow-hover relative" onClick={() => { window.scrollTo(0, 0); navigate('/profile'); }}>
                  <img src={gender === 'male' ? maleAvatar : gender === 'female' ? femaleAvatar : neutralAvatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                  <span aria-hidden className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center bg-white/90 text-black shadow-sm">{gender === 'male' ? '🚹' : gender === 'female' ? '🚺' : '🧑'}</span>
                </button>
                <button title="Log out" aria-label="Log out" className="p-2 rounded-full bg-white text-gray-900 transition-all glow-hover" onClick={() => { logout(); window.scrollTo(0, 0); navigate('/login'); }}>
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle navigation menu">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden px-6 pb-4 space-y-2">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path} className={`block px-4 py-2 rounded-lg nav-glow ${location.pathname === item.path ? 'text-white bg-white/10 active' : 'text-white/80 hover:text-white hover:bg-white/10'}`} onClick={() => setIsOpen(false)}>
                {item.name}
              </Link>
            ))}
            {!isAuthenticated ? (
              <Link to="/login" className="block px-4 py-2 rounded-lg bg-white text-gray-900 font-semibold text-center" onClick={() => setIsOpen(false)}>Login</Link>
            ) : (
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-2 rounded-lg bg-white/5 text-white" onClick={() => { setIsOpen(false); navigate('/profile'); }}>Account</button>
                <button className="w-full text-left px-4 py-2 rounded-lg bg-white text-gray-900" onClick={() => { setIsOpen(false); logout(); navigate('/login'); }}>Log out</button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}

