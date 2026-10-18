import React, { Suspense, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { DemoStoryOverlay } from './components/common/DemoStoryOverlay';
import { ChatbotBubble } from './components/common/ChatbotBubble';
import { ScrollToTop } from './components/common/ScrollToTop';
import { ErrorBoundary } from './components/common/ErrorBoundary';
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
import { NotFoundPage } from './pages/public/NotFoundPage';
import { ErrorPage } from './pages/public/ErrorPage';

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
  const { user, loading, switchDemoPersona } = useAuth();
  const location = useLocation();
  const [isAutoSwitching, setIsAutoSwitching] = useState(false);
  const [switchAttempted, setSwitchAttempted] = useState(false);

  // 1. If auth state is still resolving or actively switching, show loading state
  if (loading || isAutoSwitching) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white font-bengali p-6 text-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-lg font-bold text-emerald-400 mb-1">
          অফিস ড্যাশবোর্ড লোড হচ্ছে...
        </h2>
        <p className="text-xs text-slate-400">
          সুরক্ষিত সরকারি কর্মকর্তা সেশন ও ভূমি রেকর্ড ভেরিফিকেশন সম্পন্ন হচ্ছে
        </p>
      </div>
    );
  }

  // 2. CRITICAL: If user is not authenticated (or just logged out), immediately redirect to login!
  // Do NOT execute auto-switch or display protected gateway to unauthenticated visitors.
  if (!user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  const currentRole = (user?.role || '').toLowerCase();
  const normalizedAllowed = (allowedRoles || []).map((r) => r.toLowerCase());

  const isAllowed =
    !allowedRoles ||
    allowedRoles.length === 0 ||
    normalizedAllowed.includes(currentRole) ||
    currentRole === 'central_admin' ||
    currentRole === 'admin' ||
    (normalizedAllowed.includes('union_officer') && currentRole === 'union_land_officer') ||
    (normalizedAllowed.includes('union_land_officer') && currentRole === 'union_officer') ||
    (normalizedAllowed.includes('ac_land') && currentRole === 'ac_land_officer') ||
    (normalizedAllowed.includes('sub_registrar') && currentRole === 'sub_registry_officer');

  // 3. User is authorized for this role
  if (isAllowed) {
    return <>{children}</>;
  }

  const pathname = location.pathname;
  let targetPersona: string | null = null;
  let targetRole: string | null = null;
  let officeNameBn = 'সরকারি অফিস ড্যাশবোর্ড';

  if (pathname.startsWith('/office/union')) {
    targetPersona = 'union_officer';
    targetRole = 'union_land_officer';
    officeNameBn = 'ইউনিয়ন ভূমি সহকারী কর্মকর্তা (ULAO) ড্যাশবোর্ড';
  } else if (pathname.startsWith('/office/ac-land')) {
    targetPersona = 'ac_land';
    targetRole = 'ac_land';
    officeNameBn = 'সহকারী কমিশনার (ভূমি) - এসি ল্যান্ড ড্যাশবোর্ড';
  } else if (pathname.startsWith('/office/registry')) {
    targetPersona = 'sub_registrar';
    targetRole = 'sub_registrar';
    officeNameBn = 'সাব-রেজিস্ট্রার কার্যালয় ড্যাশবোর্ড';
  } else if (pathname.startsWith('/admin')) {
    targetPersona = 'central_admin';
    targetRole = 'central_admin';
    officeNameBn = 'ভূমি সেবা কেন্দ্রীয় প্রশাসনিক প্যানেল';
  }

  const isDemo =
    import.meta.env.VITE_DEMO_MODE !== 'false' ||
    localStorage.getItem('bhumisathi_is_demo') === 'true' ||
    (user.id && user.id.startsWith('usr-'));

  const justLoggedOut = sessionStorage.getItem('bhumisathi_just_logged_out') === 'true';

  useEffect(() => {
    // Only auto-switch if user is already an authenticated demo persona actively switching dockets
    if (loading || !user || isAllowed || switchAttempted || !targetPersona || !isDemo || justLoggedOut) return;

    setSwitchAttempted(true);
    setIsAutoSwitching(true);
    switchDemoPersona(targetPersona, targetRole || undefined)
      .finally(() => {
        setIsAutoSwitching(false);
      });
  }, [loading, user, isAllowed, switchAttempted, targetPersona, targetRole, isDemo, justLoggedOut, switchDemoPersona]);

  // If in demo mode and not yet allowed, show clear gateway instead of bouncing away
  if (isDemo && targetPersona && !justLoggedOut) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-bengali">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center text-3xl mb-4 border border-emerald-500/20">
            <i className="bx bxs-institution"></i>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mb-2">{officeNameBn}</h2>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            এই ড্যাশবোর্ডটি দেখার জন্য সংশ্লিষ্ট কর্মকর্তা প্রোফাইলে লগইন প্রয়োজন। ডেমো সংস্করণে ১-ক্লিকে সরাসরি প্রবেশ করতে নিচের বাটনে চাপ দিন।
          </p>
          <div className="space-y-3">
            <button
              onClick={() => {
                setIsAutoSwitching(true);
                switchDemoPersona(targetPersona!, targetRole || undefined)
                  .finally(() => setIsAutoSwitching(false));
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/40 transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <i className="bx bx-log-in-circle text-lg"></i>
              <span>কর্মকর্তা হিসেবে সরাসরি ড্যাশবোর্ডে প্রবেশ করুন</span>
            </button>
            <div className="flex items-center justify-between gap-3 pt-2">
              <Link
                to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
                className="flex-1 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold text-center border border-slate-700/60 transition"
              >
                লগইন পেইজ
              </Link>
              <Link
                to="/"
                className="flex-1 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold text-center border border-slate-700/60 transition"
              >
                মূল পাতা
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

// Public Layout Wrapper
function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-bengali transition-colors duration-200">
      <Navbar />
      <main className="flex-1">
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
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

              {/* Application Routes wrapped with ErrorBoundary to prevent blank white crashes */}
              <ErrorBoundary>
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
                          <Route path="*" element={<NotFoundPage />} />
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
                            <Route path="applications" element={<Navigate to="/office/union/dashboard" replace />} />
                            <Route path="applications/:id" element={<UnionApplicationDetailPage />} />
                            <Route path="tax-verification" element={<UnionTaxVerificationPage />} />
                            <Route path="record-verification" element={<UnionRecordVerificationPage />} />
                            <Route path="reports" element={<UnionReportsPage />} />
                            <Route path="history" element={<UnionHistoryPage />} />
                            <Route path="profile" element={<OfficerProfilePage />} />
                            <Route path="*" element={<NotFoundPage />} />
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
                            <Route path="applications" element={<Navigate to="/office/ac-land/dashboard" replace />} />
                            <Route path="applications/:id" element={<AcLandApplicationDetailPage />} />
                            <Route path="hearings" element={<AcLandHearingsPage />} />
                            <Route path="mutation" element={<AcLandMutationPage />} />
                            <Route path="decisions" element={<AcLandDecisionsPage />} />
                            <Route path="history" element={<AcLandHistoryPage />} />
                            <Route path="profile" element={<OfficerProfilePage />} />
                            <Route path="*" element={<NotFoundPage />} />
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
                            <Route path="applications" element={<Navigate to="/office/registry/dashboard" replace />} />
                            <Route path="applications/:id" element={<RegistryApplicationDetailPage />} />
                            <Route path="appointments" element={<RegistryAppointmentsPage />} />
                            <Route path="documents" element={<RegistryDocumentsPage />} />
                            <Route path="completed" element={<RegistryCompletedPage />} />
                            <Route path="history" element={<RegistryHistoryPage />} />
                            <Route path="profile" element={<OfficerProfilePage />} />
                            <Route path="*" element={<NotFoundPage />} />
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
                            <Route path="*" element={<NotFoundPage />} />
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

                {/* Dedicated Error Pages */}
                <Route path="/404" element={<PublicLayout><NotFoundPage /></PublicLayout>} />
                <Route path="/401" element={<PublicLayout><ErrorPage status="401" /></PublicLayout>} />
                <Route path="/403" element={<PublicLayout><ErrorPage status="403" /></PublicLayout>} />
                <Route path="/500" element={<PublicLayout><ErrorPage status="500" /></PublicLayout>} />
                <Route path="/error" element={<PublicLayout><ErrorPage /></PublicLayout>} />
                <Route path="/network-error" element={<PublicLayout><ErrorPage status="network" /></PublicLayout>} />

                {/* Catch-all Not Found Route */}
                <Route path="*" element={<PublicLayout><NotFoundPage /></PublicLayout>} />
              </Routes>
              </ErrorBoundary>
            </div>
          </NotificationProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </BrowserRouter>
  );
}
