import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import RoutesPage from './pages/Routes';
import LiveTracking from './pages/LiveTracking';
import BookTicket from './pages/BookTicket';
import MyTickets from './pages/MyTickets';
import OperatorDashboard from './pages/OperatorDashboard';
import Profile from './pages/Profile';
import HelpCenter from './pages/HelpCenter';
import FAQs from './pages/FAQs';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ProtectedRoute from './components/ProtectedRoute';
import LoginSignup from './pages/LoginSignup';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-white dark:bg-neutral-900 transition-colors duration-300 text-gray-900 dark:text-white">
            <div className="relative z-10">
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/routes" element={<RoutesPage />} />
                <Route path="/tracking" element={<LiveTracking />} />
                <Route path="/book" element={<BookTicket />} />
                <Route path="/tickets" element={<MyTickets />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <OperatorDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={<ProtectedRoute><Profile /></ProtectedRoute>}
                />
                <Route path="/login" element={<LoginSignup />} />
                <Route path="/help" element={<HelpCenter />} />
                <Route path="/faqs" element={<FAQs />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
              </Routes>
              <Footer />
            </div>
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
