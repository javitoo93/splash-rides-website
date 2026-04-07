import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';
import { ProtectedRoute } from '@components/ProtectedRoute';
import { MainLayout } from '@components/layouts/MainLayout';
import { AuthLayout } from '@components/layouts/AuthLayout';

// Lazy load pages for better performance
const Dashboard = React.lazy(() => import('@pages/Dashboard'));
const Transfer = React.lazy(() => import('@pages/Transfer'));
const Wallet = React.lazy(() => import('@pages/Wallet'));
const Transactions = React.lazy(() => import('@pages/Transactions'));
const Settings = React.lazy(() => import('@pages/Settings'));
const Profile = React.lazy(() => import('@pages/Profile'));
const Login = React.lazy(() => import('@pages/auth/Login'));
const Register = React.lazy(() => import('@pages/auth/Register'));
const ForgotPassword = React.lazy(() => import('@pages/auth/ForgotPassword'));
const ResetPassword = React.lazy(() => import('@pages/auth/ResetPassword'));
const VerifyEmail = React.lazy(() => import('@pages/auth/VerifyEmail'));
const TwoFactorAuth = React.lazy(() => import('@pages/auth/TwoFactorAuth'));
const KYCVerification = React.lazy(() => import('@pages/KYCVerification'));

function App() {
  const { checkAuth, isAuthenticated } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <React.Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      }
    >
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/2fa" element={<TwoFactorAuth />} />
        </Route>

        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transfer" element={<Transfer />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/kyc" element={<KYCVerification />} />
        </Route>

        {/* Redirects */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </React.Suspense>
  );
}

export default App;
