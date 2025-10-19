import { Bus, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="relative mt-20 backdrop-blur-md bg-white/5 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Bus className="w-6 h-6 text-orange-400" aria-hidden="true" />
              <span className="text-xl font-bold brand-gradient bg-clip-text text-transparent">
                BharatBus
              </span>
            </div>
            <p className="text-white/60 text-sm">
              Your All-India Bus Companion for seamless travel across the nation.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/routes" className="text-white/60 hover:text-orange-400 transition-colors" onClick={() => window.scrollTo(0, 0)}>Routes</Link></li>
              <li><Link to="/tracking" className="text-white/60 hover:text-orange-400 transition-colors" onClick={() => window.scrollTo(0, 0)}>Live Tracking</Link></li>
              <li><Link to="/book" className="text-white/60 hover:text-orange-400 transition-colors" onClick={() => window.scrollTo(0, 0)}>Book Ticket</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/help" className="text-white/60 hover:text-orange-400 transition-colors" onClick={() => window.scrollTo(0, 0)}>Help Center</Link></li>
              <li><Link to="/faqs" className="text-white/60 hover:text-orange-400 transition-colors" onClick={() => window.scrollTo(0, 0)}>FAQs</Link></li>
              <li><Link to="/terms" className="text-white/60 hover:text-orange-400 transition-colors" onClick={() => window.scrollTo(0, 0)}>Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-white/60 hover:text-orange-400 transition-colors" onClick={() => window.scrollTo(0, 0)}>Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-white/60 text-sm">
                <Mail className="w-4 h-4" />
                support@bharatbus.in
              </li>
              <li className="flex items-center gap-2 text-white/60 text-sm">
                <Phone className="w-4 h-4" />
                +91 1800-XXX-XXXX
              </li>
              <li className="flex items-center gap-2 text-white/60 text-sm">
                <MapPin className="w-4 h-4" />
                New Delhi, India
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 text-center text-white/40 text-sm">
          © 2025 BharatBus. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
