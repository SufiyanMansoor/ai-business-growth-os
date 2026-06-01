import { getDemoResponse, shouldUseClientDemo } from './demoResponses';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

type PaginationParams = {
  limit?: number;
  before?: string;
};

function withPagination(endpoint: string, params?: PaginationParams): string {
  if (!params) return endpoint;
  const query = new URLSearchParams();
  if (params.limit) query.set('limit', String(params.limit));
  if (params.before) query.set('before', params.before);
  const queryString = query.toString();
  if (!queryString) return endpoint;
  return `${endpoint}?${queryString}`;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  if (shouldUseClientDemo()) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const body = options.body ? JSON.parse(options.body as string) : {};
    return getDemoResponse(endpoint, options.method || 'GET', body) as T;
  }

  const token = localStorage.getItem('authToken');
  const activeTenantId = localStorage.getItem('activeTenantId');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (activeTenantId) headers['X-Tenant-Id'] = activeTenantId;

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/pdf')) {
    return response.blob() as Promise<T>;
  }
  return response.json();
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, data: unknown) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  put: <T>(endpoint: string, data: unknown) =>
    request<T>(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
};

// AI Business Brain
export const analyzeBusiness = (data: { url?: string; description?: string; industry?: string }) =>
  api.post('/ai/business-brain', data);

// One Click Campaign
export const generateCampaign = (data: { input: string; type: 'url' | 'product' | 'description' }) =>
  api.post('/ai/campaign', data);

// Viral Content Engine
export const generateViralContent = (data: { niche: string; platform: string; topic?: string }) =>
  api.post('/ai/viral-content', data);

// Video Creator
export const createVideo = (data: { source: string; type: string; language?: string; voice?: string }) =>
  api.post('/ai/video', data);

// Influencer Discovery
export const searchInfluencers = (data: { country?: string; niche?: string; minFollowers?: number }) =>
  api.post('/ai/influencers', data);

// Outreach Automation
export const generateOutreach = (data: { type: string; target: string; context?: string }) =>
  api.post('/ai/outreach', data);

// Lead Generation
export const findLeads = (data: { industry: string; location?: string; count?: number }) =>
  api.post('/ai/leads', data);

// SEO Engine
export const generateSEO = (data: { url: string; keywords?: string[] }) =>
  api.post('/ai/seo', data);

// Competitor Analysis
export const analyzeCompetitor = (data: { url: string; competitors?: string[] }) =>
  api.post('/ai/competitor', data);

// Autopilot Mode
export const startAutopilot = (data: { goal: string; budget: number; industry: string }) =>
  api.post('/ai/autopilot', data);

// CRM
export const getLeads = (params?: PaginationParams) => api.get(withPagination('/crm/leads', params));
export const createLead = (data: unknown) => api.post('/crm/leads', data);
export const updateLead = (id: string, data: unknown) => api.put(`/crm/leads/${id}`, data);

// Campaigns
export const getCampaigns = (params?: PaginationParams) => api.get(withPagination('/campaigns', params));
export const createCampaignRecord = (data: unknown) => api.post('/campaigns', data);

// Reports
export const generateReport = (data: { type: string; campaignId?: string }) =>
  api.post('/reports/generate', data);
export const getReportHistory = (params?: PaginationParams) =>
  api.get(withPagination('/reports/history', params));

// Content Scheduler
export const getContentItems = (params?: PaginationParams) =>
  api.get(withPagination('/content', params));
export const createContentItem = (data: unknown) => api.post('/content', data);

// Outreach storage
export const getOutreachRecords = (params?: PaginationParams) =>
  api.get(withPagination('/outreach', params));
export const createOutreachRecord = (data: unknown) => api.post('/outreach', data);

// Influencer tracking
export const getInfluencerRecords = (params?: PaginationParams) =>
  api.get(withPagination('/influencers', params));
export const createInfluencerRecord = (data: unknown) => api.post('/influencers', data);

// Autopilot run history
export const getAutopilotRuns = (params?: PaginationParams) =>
  api.get(withPagination('/autopilot/runs', params));
export const createAutopilotRun = (data: unknown) => api.post('/autopilot/runs', data);
export const updateAutopilotRun = (id: string, data: unknown) => api.put(`/autopilot/runs/${id}`, data);

// Translation
export const translateContent = (data: { text: string; targetLanguage: string }) =>
  api.post('/ai/translate', data);

// Dashboard Analytics
export const getDashboardStats = () => api.get('/analytics/dashboard');
