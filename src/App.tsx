import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { DemoStoryOverlay } from './components/common/DemoStoryOverlay';
import { ChatbotBubble } from './components/common/ChatbotBubble';
import { ScrollToTop } from './components/common/ScrollToTop';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Layouts
import { CitizenLayout } from './components/layout/CitizenLayout';
import { UnionOfficeLayout } from './components/layout/UnionOfficeLayout';
import { AcLandOfficeLayout } from './components/layout/AcLandOfficeLayout';
import { RegistryOfficeLayout } from './components/layout/RegistryOfficeLayout';
import { AdminOfficeLayout } from './components/layout/AdminOfficeLayout';

// Public Pages (Static for fast initial paint)
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

// Panel 2: Union Land Office Pages (Lazy Loaded)
const UnionDashboard = React.lazy(() => import('./pages/office/union/UnionDashboard'));
const UnionApplicationDetailPage = React.lazy(() => import('./pages/office/union/UnionApplicationDetailPage'));
const UnionTaxVerificationPage = React.lazy(() => import('./pages/office/union/UnionTaxVerificationPage'));
const UnionRecordVerificationPage = React.lazy(() => import('./pages/office/union/UnionRecordVerificationPage'));
const UnionReportsPage = React.lazy(() => import('./pages/office/union/UnionReportsPage'));
const UnionHistoryPage = React.lazy(() => import('./pages/office/union/UnionHistoryPage'));

// Panel 3: AC Land Office Pages (Lazy Loaded)
const AcLandDashboard = React.lazy(() => import('./pages/office/acland/AcLandDashboard'));
const AcLandApplicationDetailPage = React.lazy(() => import('./pages/office/acland/AcLandApplicationDetailPage'));
const AcLandMutationPage = React.lazy(() => import('./pages/office/acland/AcLandMutationPage'));
const AcLandHearingsPage = React.lazy(() => import('./pages/office/acland/AcLandHearingsPage'));
const AcLandDecisionsPage = React.lazy(() => import('./pages/office/acland/AcLandDecisionsPage'));
const AcLandHistoryPage = React.lazy(() => import('./pages/office/acland/AcLandHistoryPage'));

// Panel 4: Sub-Registry Office Pages (Lazy Loaded)
const RegistryDashboard = React.lazy(() => import('./pages/office/registry/RegistryDashboard'));
const RegistryApplicationDetailPage = React.lazy(() => import('./pages/office/registry/RegistryApplicationDetailPage'));
const RegistryAppointmentsPage = React.lazy(() => import('./pages/office/registry/RegistryAppointmentsPage'));
const RegistryDocumentsPage = React.lazy(() => import('./pages/office/registry/RegistryDocumentsPage'));
const RegistryCompletedPage = React.lazy(() => import('./pages/office/registry/RegistryCompletedPage'));
const RegistryHistoryPage = React.lazy(() => import('./pages/office/registry/RegistryHistoryPage'));

// Panel 5: Central Administration Pages (Lazy Loaded)
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const AdminUsersPage = React.lazy(() => import('./pages/admin/AdminUsersPage'));
const AdminRolesPage = React.lazy(() => import('./pages/admin/AdminRolesPage'));
const AdminApplicationsPage = React.lazy(() => import('./pages/admin/AdminApplicationsPage'));
const AdminAuditLogsPage = React.lazy(() => import('./pages/admin/AdminAuditLogsPage'));
const AdminMonitoringPage = React.lazy(() => import('./pages/admin/AdminMonitoringPage'));
const OfficerProfilePage = React.lazy(() => import('./pages/office/OfficerProfilePage'));

// Loading Fallback Component
const OfficeLoadingFallback: React.FC = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center font-bengali">
    <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3"></div>
    <p className="text-sm font-bold text-slate-800">অফিস মডিউল ও রেকর্ড লোড হচ্ছে...</p>
    <p className="text-xs text-slate-500 mt-1">সুরক্ষিত সরকারি ভূমি নেটওয়ার্ক সংযোগ স্থাপন করা হচ্ছে</p>
  </div>
);

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 font-bengali">
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
      currentRole === 'central_admin' ||
      currentRole === 'admin';

    if (!isAllowed) {
      if (currentRole === 'citizen') {
        return <Navigate to="/citizen/dashboard" replace />;
      } else if (currentRole === 'union_officer' || currentRole === 'union_land_officer') {
        return <Navigate to="/office/union/dashboard" replace />;
      } else if (currentRole === 'ac_land' || currentRole === 'ac_land_officer') {
        return <Navigate to="/office/ac-land/dashboard" replace />;
      } else if (currentRole === 'sub_registrar' || currentRole === 'sub_registry_officer') {
        return <Navigate to="/office/registry/dashboard" replace />;
      } else {
        return <Navigate to="/admin/dashboard" replace />;
      }
    }
  }

  return <>{children}</>;
}

// Public Layout Wrapper
function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-bengali transition-colors duration-200">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Scroll-to-top restoration on every route navigation */}
      <ScrollToTop />

      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <NotificationProvider>
              <div className="min-h-screen flex flex-col font-sans text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 antialiased selection:bg-teal-500 selection:text-white transition-colors duration-200">
              {/* 3-Minute Guided Walkthrough for Hackathon Judges */}
              <DemoStoryOverlay />

              {/* Floating Gemini AI Chatbot Bubble (Right Side) */}
              <ChatbotBubble />

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
                <Route path="/login/citizen" element={<PublicLayout><LoginPage /></PublicLayout>} />
                <Route path="/login/office" element={<PublicLayout><LoginPage /></PublicLayout>} />
                <Route path="/login/admin" element={<PublicLayout><LoginPage /></PublicLayout>} />
                <Route path="/register" element={<PublicLayout><RegisterPage /></PublicLayout>} />

                {/* Panel 1: Citizen Routes */}
                <Route
                  path="/citizen/*"
                  element={
                    <ProtectedRoute allowedRoles={['citizen', 'central_admin', 'admin']}>
                      <CitizenLayout>
                        <Routes>
                          <Route path="dashboard" element={<CitizenDashboard />} />
                          <Route path="profile" element={<ProfileKycPage />} />
                          <Route path="my-land" element={<MyLandPage />} />
                          <Route path="search-land" element={<SearchLandPage />} />
                          <Route path="verify-land" element={<VerifyLandPage />} />
                          <Route path="land/:id" element={<LandDetailPage />} />
                          <Route path="land-details/:id" element={<LandDetailPage />} />
                          <Route path="tax" element={<TaxClearancePage />} />
                          <Route path="sell" element={<SellLandPage />} />
                          <Route path="applications" element={<MyApplicationsPage />} />
                          <Route path="sale-applications" element={<MyApplicationsPage />} />
                          <Route path="my-applications" element={<MyApplicationsPage />} />
                          <Route path="deals" element={<DealsPage />} />
                          <Route path="registration-checklist" element={<RegistrationChecklistPage />} />
                          <Route path="mutation-applications" element={<MutationTrackingPage />} />
                          <Route path="mutation-tracking" element={<MutationTrackingPage />} />
                          <Route path="mutation" element={<MutationTrackingPage />} />
                          <Route path="documents" element={<DocumentsVaultPage />} />
                          <Route path="notifications" element={<NotificationsPage />} />
                          <Route path="help" element={<HelpPage />} />
                          <Route path="faq" element={<HelpPage />} />
                          <Route path="*" element={<Navigate to="/citizen/dashboard" replace />} />
                        </Routes>
                      </CitizenLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Panel 2: Union Land Office Routes (Lazy Loaded) */}
                <Route
                  path="/office/union/*"
                  element={
                    <ProtectedRoute allowedRoles={['union_officer', 'union_land_officer', 'central_admin', 'admin']}>
                      <UnionOfficeLayout>
                        <Suspense fallback={<OfficeLoadingFallback />}>
                          <Routes>
                            <Route path="dashboard" element={<UnionDashboard />} />
                            <Route path="applications" element={<UnionDashboard />} />
                            <Route path="applications/:id" element={<UnionApplicationDetailPage />} />
                            <Route path="tax-verification" element={<UnionTaxVerificationPage />} />
                            <Route path="record-verification" element={<UnionRecordVerificationPage />} />
                            <Route path="reports" element={<UnionReportsPage />} />
                            <Route path="history" element={<UnionHistoryPage />} />
                            <Route path="profile" element={<OfficerProfilePage />} />
                            <Route path="*" element={<Navigate to="/office/union/dashboard" replace />} />
                          </Routes>
                        </Suspense>
                      </UnionOfficeLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Panel 3: AC Land Office Routes (Lazy Loaded) */}
                <Route
                  path="/office/ac-land/*"
                  element={
                    <ProtectedRoute allowedRoles={['ac_land', 'ac_land_officer', 'central_admin', 'admin']}>
                      <AcLandOfficeLayout>
                        <Suspense fallback={<OfficeLoadingFallback />}>
                          <Routes>
                            <Route path="dashboard" element={<AcLandDashboard />} />
                            <Route path="applications" element={<AcLandDashboard />} />
                            <Route path="applications/:id" element={<AcLandApplicationDetailPage />} />
                            <Route path="hearings" element={<AcLandHearingsPage />} />
                            <Route path="mutation" element={<AcLandMutationPage />} />
                            <Route path="decisions" element={<AcLandDecisionsPage />} />
                            <Route path="history" element={<AcLandHistoryPage />} />
                            <Route path="profile" element={<OfficerProfilePage />} />
                            <Route path="*" element={<Navigate to="/office/ac-land/dashboard" replace />} />
                          </Routes>
                        </Suspense>
                      </AcLandOfficeLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Panel 4: Sub-Registry Office Routes (Lazy Loaded) */}
                <Route
                  path="/office/registry/*"
                  element={
                    <ProtectedRoute allowedRoles={['sub_registrar', 'sub_registry_officer', 'central_admin', 'admin']}>
                      <RegistryOfficeLayout>
                        <Suspense fallback={<OfficeLoadingFallback />}>
                          <Routes>
                            <Route path="dashboard" element={<RegistryDashboard />} />
                            <Route path="applications" element={<RegistryDashboard />} />
                            <Route path="applications/:id" element={<RegistryApplicationDetailPage />} />
                            <Route path="appointments" element={<RegistryAppointmentsPage />} />
                            <Route path="documents" element={<RegistryDocumentsPage />} />
                            <Route path="completed" element={<RegistryCompletedPage />} />
                            <Route path="history" element={<RegistryHistoryPage />} />
                            <Route path="profile" element={<OfficerProfilePage />} />
                            <Route path="*" element={<Navigate to="/office/registry/dashboard" replace />} />
                          </Routes>
                        </Suspense>
                      </RegistryOfficeLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Panel 5: Central Administration Routes (Lazy Loaded) */}
                <Route
                  path="/admin/*"
                  element={
                    <ProtectedRoute allowedRoles={['central_admin', 'admin']}>
                      <AdminOfficeLayout>
                        <Suspense fallback={<OfficeLoadingFallback />}>
                          <Routes>
                            <Route path="dashboard" element={<AdminDashboard />} />
                            <Route path="users" element={<AdminUsersPage />} />
                            <Route path="roles" element={<AdminRolesPage />} />
                            <Route path="applications" element={<AdminApplicationsPage />} />
                            <Route path="audit-logs" element={<AdminAuditLogsPage />} />
                            <Route path="monitoring" element={<AdminMonitoringPage />} />
                            <Route path="offices" element={<AdminDashboard />} />
                            <Route path="demo-data" element={<AdminMonitoringPage />} />
                            <Route path="settings" element={<AdminMonitoringPage />} />
                            <Route path="profile" element={<OfficerProfilePage />} />
                            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                          </Routes>
                        </Suspense>
                      </AdminOfficeLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Backwards-compatibility redirects for old /officer URLs */}
                <Route path="/officer/union-land" element={<Navigate to="/office/union/dashboard" replace />} />
                <Route path="/officer/ac-land" element={<Navigate to="/office/ac-land/dashboard" replace />} />
                <Route path="/officer/registry" element={<Navigate to="/office/registry/dashboard" replace />} />
                <Route path="/officer/*" element={<Navigate to="/office/union/dashboard" replace />} />

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </NotificationProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </BrowserRouter>
  );
}
