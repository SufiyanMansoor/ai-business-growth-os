import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/store';
import AuthProvider from '@/components/AuthProvider';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { LoadingState } from '@/components/ui/States';

const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const BusinessBrainPage = lazy(() => import('@/pages/modules/BusinessBrainPage'));
const CampaignPage = lazy(() => import('@/pages/modules/CampaignPage'));
const VideoCreatorPage = lazy(() => import('@/pages/modules/VideoCreatorPage'));
const ViralContentPage = lazy(() => import('@/pages/modules/ViralContentPage'));
const InfluencersPage = lazy(() => import('@/pages/modules/InfluencersPage'));
const OutreachPage = lazy(() => import('@/pages/modules/OutreachPage'));
const LeadsPage = lazy(() => import('@/pages/modules/LeadsPage'));
const CRMPage = lazy(() => import('@/pages/modules/CRMPage'));
const SocialPage = lazy(() => import('@/pages/modules/SocialPage'));
const SEOPage = lazy(() => import('@/pages/modules/SEOPage'));
const CompetitorPage = lazy(() => import('@/pages/modules/CompetitorPage'));
const AnalyticsPage = lazy(() => import('@/pages/modules/AnalyticsPage'));
const AutopilotPage = lazy(() => import('@/pages/modules/AutopilotPage'));
const ReportsPage = lazy(() => import('@/pages/modules/ReportsPage'));
const ClientPortalPage = lazy(() => import('@/pages/modules/ClientPortalPage'));
const SettingsPage = lazy(() => import('@/pages/modules/SettingsPage'));

function PageLoader() {
  return <LoadingState message="Loading module..." />;
}

export default function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/business-brain" element={<BusinessBrainPage />} />
                <Route path="/campaign" element={<CampaignPage />} />
                <Route path="/video-creator" element={<VideoCreatorPage />} />
                <Route path="/viral-content" element={<ViralContentPage />} />
                <Route path="/influencers" element={<InfluencersPage />} />
                <Route path="/outreach" element={<OutreachPage />} />
                <Route path="/leads" element={<LeadsPage />} />
                <Route path="/crm" element={<CRMPage />} />
                <Route path="/social" element={<SocialPage />} />
                <Route path="/seo" element={<SEOPage />} />
                <Route path="/competitor" element={<CompetitorPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/autopilot" element={<AutopilotPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/client-portal" element={<ClientPortalPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>

              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  );
}
