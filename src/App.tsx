import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { DemoPersonaBar } from './components/common/DemoPersonaBar';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CitizenLayout } from './components/layout/CitizenLayout';
import { OfficerLayout } from './components/layout/OfficerLayout';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { ServicesPage } from './pages/public/ServicesPage';
import { SearchLandPage } from './pages/public/SearchLandPage';
import { VerifyLandPage } from './pages/public/VerifyLandPage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';
import { HelpPage } from './pages/public/HelpPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';

// Citizen Pages
import { CitizenDashboard } from './pages/citizen/CitizenDashboard';
import { ProfileKycPage } from './pages/citizen/ProfileKycPage';
import { MyLandPage } from './pages/citizen/MyLandPage';
import { LandDetailPage } from './pages/citizen/LandDetailPage';
import { TaxClearancePage } from './pages/citizen/TaxClearancePage';
import { SellLandPage } from './pages/citizen/SellLandPage';
import { DealsPage } from './pages/citizen/DealsPage';
import { MyApplicationsPage } from './pages/citizen/MyApplicationsPage';
import { RegistrationChecklistPage } from './pages/citizen/RegistrationChecklistPage';
import MutationTrackingPage from './pages/citizen/MutationTrackingPage';
import DocumentsVaultPage from './pages/citizen/DocumentsVaultPage';
import NotificationsPage from './pages/citizen/NotificationsPage';

// Officer Pages
import UnionLandPage from './pages/officer/UnionLandPage';
import AcLandPage from './pages/officer/AcLandPage';
import SubRegistryPage from './pages/officer/SubRegistryPage';
import CentralAdminPage from './pages/officer/CentralAdminPage';

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 font-sans">
        অ্যাকাউন্ট ভেরিফিকেশন হচ্ছে...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const currentRole = (user.role || '').toLowerCase();

  if (allowedRoles && allowedRoles.length > 0) {
    const normalizedAllowed = allowedRoles.map((r) => r.toLowerCase());
    const isAllowed =
      normalizedAllowed.includes(currentRole) ||
      (currentRole === 'central_admin' || currentRole === 'admin');

    if (!isAllowed) {
      if (currentRole === 'citizen') {
        return <Navigate to="/citizen/dashboard" replace />;
      } else if (currentRole === 'union_officer' || currentRole === 'union_land_officer') {
        return <Navigate to="/officer/union-land" replace />;
      } else if (currentRole === 'ac_land') {
        return <Navigate to="/officer/ac-land" replace />;
      } else if (currentRole === 'sub_registrar') {
        return <Navigate to="/officer/registry" replace />;
      } else {
        return <Navigate to="/admin" replace />;
      }
    }
  }

  return <>{children}</>;
}

// Public Layout Wrapper
function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-bengali">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <div className="min-h-screen flex flex-col font-sans text-slate-800 bg-slate-50 antialiased selection:bg-teal-500 selection:text-white">
            {/* 1-Click Role Switcher Demo Persona Bar */}
            <DemoPersonaBar />

            {/* Application Routes */}
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
              <Route path="/services" element={<PublicLayout><ServicesPage /></PublicLayout>} />
              <Route path="/search-land" element={<PublicLayout><SearchLandPage /></PublicLayout>} />
              <Route path="/verify-land" element={<PublicLayout><VerifyLandPage /></PublicLayout>} />
              <Route path="/how-it-works" element={<PublicLayout><HowItWorksPage /></PublicLayout>} />
              <Route path="/help" element={<PublicLayout><HelpPage /></PublicLayout>} />
              <Route path="/login" element={<PublicLayout><LoginPage /></PublicLayout>} />
              <Route path="/register" element={<PublicLayout><RegisterPage /></PublicLayout>} />

              {/* Citizen Routes */}
              <Route
                path="/citizen/*"
                element={
                  <ProtectedRoute allowedRoles={['citizen', 'central_admin', 'admin']}>
                    <CitizenLayout>
                      <Routes>
                        <Route path="dashboard" element={<CitizenDashboard />} />
                        <Route path="profile" element={<ProfileKycPage />} />
                        <Route path="my-land" element={<MyLandPage />} />
                        <Route path="land/:id" element={<LandDetailPage />} />
                        <Route path="tax" element={<TaxClearancePage />} />
                        <Route path="sell" element={<SellLandPage />} />
                        <Route path="deals" element={<DealsPage />} />
                        <Route path="my-applications" element={<MyApplicationsPage />} />
                        <Route path="registration-checklist" element={<RegistrationChecklistPage />} />
                        <Route path="mutation-tracking" element={<MutationTrackingPage />} />
                        <Route path="documents" element={<DocumentsVaultPage />} />
                        <Route path="notifications" element={<NotificationsPage />} />
                        <Route path="*" element={<Navigate to="/citizen/dashboard" replace />} />
                      </Routes>
                    </CitizenLayout>
                  </ProtectedRoute>
                }
              />

              {/* Officer: Union Land Assistant Officer (ULAO) */}
              <Route
                path="/officer/union-land"
                element={
                  <ProtectedRoute allowedRoles={['union_officer', 'union_land_officer', 'central_admin', 'admin']}>
                    <OfficerLayout title="ইউনিয়ন ভূমি সহকারী কর্মকর্তার ড্যাশবোর্ড">
                      <UnionLandPage />
                    </OfficerLayout>
                  </ProtectedRoute>
                }
              />

              {/* Officer: Assistant Commissioner Land (AC Land) */}
              <Route
                path="/officer/ac-land"
                element={
                  <ProtectedRoute allowedRoles={['ac_land', 'central_admin', 'admin']}>
                    <OfficerLayout title="সহকারী কমিশনার (ভূমি) এর বিচারিক ড্যাশবোর্ড">
                      <AcLandPage />
                    </OfficerLayout>
                  </ProtectedRoute>
                }
              />

              {/* Officer: Sub-Registry Office */}
              <Route
                path="/officer/registry"
                element={
                  <ProtectedRoute allowedRoles={['sub_registrar', 'central_admin', 'admin']}>
                    <OfficerLayout title="সাব-রেজিস্ট্রি অফিস এক্সিকিউশন প্যানেল">
                      <SubRegistryPage />
                    </OfficerLayout>
                  </ProtectedRoute>
                }
              />

              {/* Central Administration */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['central_admin', 'admin']}>
                    <OfficerLayout title="কেন্দ্রীয় প্রশাসন ও সুপারভাইজরি ড্যাশবোর্ড">
                      <CentralAdminPage />
                    </OfficerLayout>
                  </ProtectedRoute>
                }
              />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
