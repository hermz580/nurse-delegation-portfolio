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

      <Box
        component="a"
        href="https://harpstarunlimited.com/apps#projects"
        sx={{
          position: 'fixed',
          right: { xs: 12, md: 20 },
          bottom: { xs: 12, md: 20 },
          zIndex: 2000,
          px: 2,
          py: 1.1,
          borderRadius: '999px',
          bgcolor: 'rgba(10, 10, 11, 0.92)',
          color: '#f3cf65',
          border: '1px solid rgba(243, 207, 101, 0.55)',
          textDecoration: 'none',
          fontSize: '0.78rem',
          fontWeight: 700,
          letterSpacing: '0.04em',
          boxShadow: '0 8px 30px rgba(0,0,0,0.35)',
          backdropFilter: 'blur(10px)',
          '&:hover': { bgcolor: '#f3cf65', color: '#0a0a0b' },
          '&:focus-visible': { outline: '2px solid #10e7c2', outlineOffset: 3 },
        }}
      >
        ← Back to HarpStar
      </Box>

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

