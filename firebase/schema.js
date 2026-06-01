/**
 * Firebase Firestore Schema — AI Business Growth OS
 *
 * Collections and document structures for the platform.
 */

// ============================================
// users/{userId}
// ============================================
const userSchema = {
  uid: 'string',
  email: 'string',
  displayName: 'string',
  photoURL: 'string | null',
  role: 'owner | admin | manager | sales | marketing | viewer | agency | client | influencer',
  tenantId: 'string',
  tenantName: 'string',
  company: 'string | null',
  industry: 'string | null',
  theme: 'dark | light | neon | corporate | viral',
  language: 'en | ur | ar | hi',
  createdAt: 'timestamp',
  updatedAt: 'timestamp',
  settings: {
    notifications: {
      campaigns: 'boolean',
      leads: 'boolean',
      influencers: 'boolean',
      reports: 'boolean',
    },
  },
};

// ============================================
// campaigns/{campaignId}
// ============================================
const campaignSchema = {
  userId: 'string',
  tenantId: 'string',
  clientId: 'string | null',
  name: 'string',
  type: 'one-click | autopilot | manual',
  status: 'draft | active | paused | completed',
  platform: 'string[]',
  input: 'string',
  generatedContent: {
    videoScript: 'string',
    instagramPosts: 'string[]',
    tiktokScripts: 'string[]',
    linkedinPosts: 'string[]',
    emailCampaign: 'object',
    adCopy: 'object',
    hashtags: 'string[]',
  },
  budget: 'number',
  spent: 'number',
  roi: 'number',
  metrics: {
    impressions: 'number',
    clicks: 'number',
    conversions: 'number',
    engagement: 'number',
  },
  createdAt: 'timestamp',
  updatedAt: 'timestamp',
};

// ============================================
// leads/{leadId}
// ============================================
const leadSchema = {
  userId: 'string',
  tenantId: 'string',
  company: 'string',
  website: 'string',
  email: 'string',
  phone: 'string',
  industry: 'string',
  stage: 'new | contacted | meeting | proposal | negotiation | won | lost',
  score: 'number (0-100)',
  tags: 'string[]',
  notes: 'string',
  tasks: [{
    id: 'string',
    title: 'string',
    dueDate: 'timestamp',
    completed: 'boolean',
  }],
  createdAt: 'timestamp',
  updatedAt: 'timestamp',
};

// ============================================
// content/{contentId}
// ============================================
const contentSchema = {
  userId: 'string',
  tenantId: 'string',
  campaignId: 'string | null',
  platform: 'instagram | facebook | linkedin | tiktok | twitter',
  type: 'post | reel | story | video | email',
  content: 'string',
  mediaUrls: 'string[]',
  hashtags: 'string[]',
  status: 'draft | scheduled | published | failed',
  scheduledAt: 'timestamp | null',
  publishedAt: 'timestamp | null',
  metrics: {
    likes: 'number',
    comments: 'number',
    shares: 'number',
    reach: 'number',
  },
  createdAt: 'timestamp',
};

// ============================================
// influencers/{influencerId}
// ============================================
const influencerSchema = {
  tenantId: 'string',
  name: 'string',
  handle: 'string',
  platform: 'string',
  followers: 'number',
  engagementRate: 'number',
  niche: 'string[]',
  country: 'string',
  fakeFollowerScore: 'number (0-100, lower is better)',
  email: 'string | null',
  status: 'discovered | contacted | negotiating | partnered | rejected',
  campaigns: 'string[] (campaign IDs)',
  createdAt: 'timestamp',
};

// ============================================
// outreach/{outreachId}
// ============================================
const outreachSchema = {
  userId: 'string',
  tenantId: 'string',
  type: 'email | whatsapp | sponsorship',
  target: 'string',
  targetEmail: 'string | null',
  messages: {
    initial: 'string',
    followUps: 'string[]',
  },
  tracking: {
    sent: 'boolean',
    opened: 'boolean',
    clicked: 'boolean',
    replied: 'boolean',
    sentAt: 'timestamp | null',
    openedAt: 'timestamp | null',
  },
  status: 'draft | sent | opened | replied | converted',
  createdAt: 'timestamp',
};

// ============================================
// reports/{reportId}
// ============================================
const reportSchema = {
  userId: 'string',
  tenantId: 'string',
  clientId: 'string | null',
  type: 'campaign | roi | leads | social | custom',
  format: 'pdf | excel | json',
  title: 'string',
  data: 'object',
  fileUrl: 'string | null',
  createdAt: 'timestamp',
};

// ============================================
// autopilot/{jobId}
// ============================================
const autopilotSchema = {
  userId: 'string',
  tenantId: 'string',
  goal: 'sales | leads | followers',
  budget: 'number',
  industry: 'string',
  status: 'running | completed | failed | paused',
  steps: [{
    id: 'number',
    label: 'string',
    status: 'pending | running | done | failed',
    completedAt: 'timestamp | null',
  }],
  results: {
    contentCreated: 'number',
    influencersFound: 'number',
    outreachSent: 'number',
    leadsGenerated: 'number',
    estimatedROI: 'number',
  },
  createdAt: 'timestamp',
  completedAt: 'timestamp | null',
};

// ============================================
// analytics/{eventId}
// ============================================
const analyticsSchema = {
  userId: 'string',
  tenantId: 'string',
  campaignId: 'string | null',
  event: 'string',
  data: 'object',
  timestamp: 'timestamp',
};

// ============================================
// notifications/{notificationId}
// ============================================
const notificationSchema = {
  userId: 'string',
  tenantId: 'string',
  title: 'string',
  message: 'string',
  type: 'info | success | warning | error',
  read: 'boolean',
  link: 'string | null',
  createdAt: 'timestamp',
};

export {
  userSchema,
  campaignSchema,
  leadSchema,
  contentSchema,
  influencerSchema,
  outreachSchema,
  reportSchema,
  autopilotSchema,
  analyticsSchema,
  notificationSchema,
};
