import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';

// Pages
import LandingPage from './pages/LandingPage';
import MapPage from './pages/MapPage';
import ProvidersPage from './pages/ProvidersPage';
import CaseworkersPage from './pages/CaseworkersPage';
import ResourcesPage from './pages/ResourcesPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ModulesPage from './pages/ModulesPage';
import AssessmentsPage from './pages/AssessmentsPage';
import CertificationsPage from './pages/CertificationsPage';
import ProfilePage from './pages/ProfilePage';
import PricingPage from './pages/PricingPage';
import AdminPage from './pages/AdminPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import ProviderDashboardPage from './pages/ProviderDashboardPage';
import VerificationPage from './pages/VerificationPage';

// Protected Route Wrapper - requires login
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isLoading } = useAuth();
  if (isLoading) return null;
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

// Admin Route Wrapper - requires admin role
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

// Provider Route Wrapper - requires provider role
function ProviderRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  if (user?.role !== 'provider' && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

// Caseworker Route Wrapper - requires caregiver/caseworker role
function CaseworkerRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  if (user?.role !== 'caregiver' && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

function AppContent() {
  const { isLoggedIn, user } = useAuth();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0a0a0b', color: 'white' }}>
      {/* Navigation Bar */}
      <Navbar
        isLoggedIn={isLoggedIn}
        userName={user?.first_name || 'Guest'}
        userRole={user?.role === 'caregiver' ? 'caregiver' : user?.role === 'provider' ? 'provider' : user?.role === 'admin' ? 'admin' : undefined}
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Public Verification Route */}
        <Route path="/verify/:code?" element={<VerificationPage />} />

        {/* Protected Routes (require login) */}
        <Route path="/map" element={
          <ProtectedRoute><MapPage /></ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute><DashboardPage /></ProtectedRoute>
        } />
        <Route path="/modules" element={
          <ProtectedRoute><ModulesPage /></ProtectedRoute>
        } />
        <Route path="/assessments" element={
          <ProtectedRoute><AssessmentsPage /></ProtectedRoute>
        } />
        <Route path="/certifications" element={
          <ProtectedRoute><CertificationsPage /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><ProfilePage /></ProtectedRoute>
        } />

        {/* Provider Routes */}
        <Route path="/providers" element={
          <ProviderRoute><ProvidersPage /></ProviderRoute>
        } />
        <Route path="/provider/dashboard" element={
          <ProviderRoute><ProviderDashboardPage /></ProviderRoute>
        } />

        {/* Caseworker Routes */}
        <Route path="/caseworkers" element={
          <CaseworkerRoute><CaseworkersPage /></CaseworkerRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <AdminRoute><AdminPage /></AdminRoute>
        } />
        <Route path="/admin/*" element={
          <AdminRoute><AdminPage /></AdminRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Box>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

