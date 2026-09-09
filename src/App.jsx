import './App.css'
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import ScrollToTop from './components/ScrollToTop'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import { Navigate } from 'react-router-dom';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import TermsOfService from '@/pages/TermsOfService';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import Estimate from '@/pages/Estimate';
import AreaPage from '@/pages/AreaPage';
import Careers from '@/pages/Careers';
import CareerDetail from '@/pages/CareerDetail';
import AdminApplications from '@/pages/AdminApplications';
import RentalAgreement from '@/pages/RentalAgreement';
import ShipmentAuthorization from '@/pages/ShipmentAuthorization';
import CreditCardAuthorization from '@/pages/CreditCardAuthorization';
import Settings from '@/pages/Settings';
import SavedHomes from '@/pages/SavedHomes';
import AdminLeads from '@/pages/AdminLeads';
import AdminReviews from '@/pages/AdminReviews';
import BottomNav from '@/components/BottomNav';
import ChatBubble from '@/components/ChatBubble';

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

const pageTransition = {
  initial: { opacity: 0, x: 28 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -28 },
  transition: { duration: 0.25, ease: 'easeInOut' },
};

const AnimatedRoutes = () => {
  const location = useLocation();
  const wrap = (element) => <motion.div {...pageTransition}>{element}</motion.div>;
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={wrap(<MainPage />)} />
        {Object.entries(Pages).map(([path, Page]) => (
          <Route key={path} path={`/${path}`} element={wrap(<Page />)} />
        ))}
        <Route path="/terms" element={wrap(<TermsOfService />)} />
        <Route path="/terms-and-conditions" element={wrap(<TermsOfService />)} />
        <Route path="/privacy" element={wrap(<PrivacyPolicy />)} />
        <Route path="/privacy-policy" element={wrap(<PrivacyPolicy />)} />
        <Route path="/estimate" element={wrap(<Estimate />)} />
        <Route path="/careers" element={wrap(<Careers />)} />
        <Route path="/careers/:slug" element={wrap(<CareerDetail />)} />
        <Route path="/rental-agreement" element={wrap(<RentalAgreement />)} />
        <Route path="/shipment-authorization" element={wrap(<ShipmentAuthorization />)} />
        <Route path="/credit-card-authorization" element={wrap(<CreditCardAuthorization />)} />
        <Route path="/areas/:areaName" element={wrap(<AreaPage />)} />
        <Route path="/login" element={wrap(<Login />)} />
        <Route path="/register" element={wrap(<Register />)} />
        <Route path="/forgot-password" element={wrap(<ForgotPassword />)} />
        <Route path="/reset-password" element={wrap(<ResetPassword />)} />
        <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
          <Route path="/settings" element={wrap(<Settings />)} />
          <Route path="/saved" element={wrap(<SavedHomes />)} />
          <Route path="/admin/leads" element={wrap(<AdminLeads />)} />
          <Route path="/admin/reviews" element={wrap(<AdminReviews />)} />
          <Route path="/admin/applications" element={wrap(<AdminApplications />)} />
        </Route>
        <Route path="*" element={wrap(<PageNotFound />)} />
      </Routes>
    </AnimatePresence>
  );
};

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, isAuthenticated, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <LayoutWrapper currentPageName={mainPageKey}>
      <AnimatedRoutes />
      <BottomNav />
      <ChatBubble />
    </LayoutWrapper>
  );
};


function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App