import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/Toast';
import Skeleton from './components/Skeleton';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const RoutesPage = lazy(() => import('./pages/Routes'));
const LiveTracking = lazy(() => import('./pages/LiveTracking'));
const BookTicket = lazy(() => import('./pages/BookTicket'));
const MyTickets = lazy(() => import('./pages/MyTickets'));
const OperatorDashboard = lazy(() => import('./pages/OperatorDashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const HelpCenter = lazy(() => import('./pages/HelpCenter'));
const FAQs = lazy(() => import('./pages/FAQs'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const LoginSignup = lazy(() => import('./pages/LoginSignup'));

// Loading fallback component
function PageLoader() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton variant="text" height="48px" width="60%" />
        <Skeleton variant="text" lines={3} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Skeleton variant="card" height="200px" />
          <Skeleton variant="card" height="200px" />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ToastProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-white dark:bg-neutral-900 transition-colors duration-300 text-gray-900 dark:text-white">
              <div className="relative z-10">
                <Navbar />
                <Suspense fallback={<PageLoader />}>
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
                </Suspense>
                <Footer />
              </div>
            </div>
          </BrowserRouter>
        </ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
