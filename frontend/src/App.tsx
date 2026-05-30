import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/store';
import AuthProvider from '@/components/AuthProvider';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import BusinessBrainPage from '@/pages/modules/BusinessBrainPage';
import CampaignPage from '@/pages/modules/CampaignPage';
import VideoCreatorPage from '@/pages/modules/VideoCreatorPage';
import ViralContentPage from '@/pages/modules/ViralContentPage';
import InfluencersPage from '@/pages/modules/InfluencersPage';
import OutreachPage from '@/pages/modules/OutreachPage';
import LeadsPage from '@/pages/modules/LeadsPage';
import CRMPage from '@/pages/modules/CRMPage';
import SocialPage from '@/pages/modules/SocialPage';
import SEOPage from '@/pages/modules/SEOPage';
import CompetitorPage from '@/pages/modules/CompetitorPage';
import AnalyticsPage from '@/pages/modules/AnalyticsPage';
import AutopilotPage from '@/pages/modules/AutopilotPage';
import ReportsPage from '@/pages/modules/ReportsPage';
import ClientPortalPage from '@/pages/modules/ClientPortalPage';
import SettingsPage from '@/pages/modules/SettingsPage';

export default function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <BrowserRouter>
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
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  );
}
