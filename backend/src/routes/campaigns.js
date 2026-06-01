import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getFirestore } from '../services/firebase.js';

const router = Router();

// In-memory store for MVP. We key by tenantId so multiple tenants don't share data.
const campaignsStoreByTenant = {};

function getTenantCampaigns(tenantId, uid) {
  if (!campaignsStoreByTenant[tenantId]) {
    campaignsStoreByTenant[tenantId] = [
      { id: '1', userId: uid, tenantId, name: 'Summer Sale 2026', platform: 'Instagram', status: 'active', budget: 2500, roi: 245, createdAt: '2026-05-01' },
      { id: '2', userId: uid, tenantId, name: 'Product Launch', platform: 'TikTok', status: 'active', budget: 1800, roi: 180, createdAt: '2026-05-10' },
    ];
  }
  return campaignsStoreByTenant[tenantId];
}

function parseLimit(value, fallback = 25, max = 100) {
  const parsed = Number.parseInt(String(value || ''), 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(parsed, max);
}

router.get('/', async (req, res) => {
  const tenantId = req.auth?.tenantId;
  const uid = req.auth?.uid;
  if (!tenantId) return res.status(400).json({ message: 'Missing tenant context' });
  const limit = parseLimit(req.query.limit, 25);
  const before = typeof req.query.before === 'string' ? req.query.before : '';

  const db = getFirestore();
  if (!db) {
    const fallbackItems = getTenantCampaigns(tenantId, uid)
      .filter((item) => !before || item.createdAt < before)
      .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
      .slice(0, limit);
    const nextCursor = fallbackItems.length === limit ? fallbackItems[fallbackItems.length - 1]?.createdAt : null;
    return res.json({ campaigns: fallbackItems, nextCursor });
  }

  try {
    let query = db.collection('campaigns')
      .where('tenantId', '==', tenantId)
      .orderBy('createdAt', 'desc');

    if (before) {
      query = query.where('createdAt', '<', before);
    }
    const snapshot = await query.limit(limit).get();
    const campaigns = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const nextCursor = campaigns.length === limit ? campaigns[campaigns.length - 1]?.createdAt : null;
    res.json({ campaigns, nextCursor });
  } catch {
    const fallbackItems = getTenantCampaigns(tenantId, uid)
      .filter((item) => !before || item.createdAt < before)
      .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
      .slice(0, limit);
    const nextCursor = fallbackItems.length === limit ? fallbackItems[fallbackItems.length - 1]?.createdAt : null;
    res.json({ campaigns: fallbackItems, nextCursor });
  }
});

router.post('/', async (req, res) => {
  const tenantId = req.auth?.tenantId;
  const uid = req.auth?.uid;
  if (!tenantId) return res.status(400).json({ message: 'Missing tenant context' });
  const campaign = { userId: uid, tenantId, status: 'draft', ...req.body, createdAt: new Date().toISOString() };
  const db = getFirestore();
  if (!db) {
    const memoryCampaign = { id: uuidv4(), ...campaign };
    getTenantCampaigns(tenantId, uid).push(memoryCampaign);
    return res.status(201).json(memoryCampaign);
  }
  try {
    const docRef = db.collection('campaigns').doc();
    await docRef.set(campaign);
    res.status(201).json({ id: docRef.id, ...campaign });
  } catch {
    const memoryCampaign = { id: uuidv4(), ...campaign };
    getTenantCampaigns(tenantId, uid).push(memoryCampaign);
    res.status(201).json(memoryCampaign);
  }
});

router.get('/:id', async (req, res) => {
  const tenantId = req.auth?.tenantId;
  const uid = req.auth?.uid;
  if (!tenantId) return res.status(400).json({ message: 'Missing tenant context' });
  const db = getFirestore();
  if (db) {
    try {
      const docRef = db.collection('campaigns').doc(req.params.id);
      const snapshot = await docRef.get();
      if (!snapshot.exists) return res.status(404).json({ message: 'Campaign not found' });
      const campaign = snapshot.data() || {};
      if (campaign.tenantId !== tenantId) return res.status(404).json({ message: 'Campaign not found' });
      return res.json({ id: docRef.id, ...campaign });
    } catch {
      // fallback below
    }
  }
  const campaigns = getTenantCampaigns(tenantId, uid);
  const campaign = campaigns.find((c) => c.id === req.params.id);
  if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
  res.json(campaign);
});

export default router;
