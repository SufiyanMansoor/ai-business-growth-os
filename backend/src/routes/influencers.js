import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getFirestore } from '../services/firebase.js';

const router = Router();

const influencerStoreByTenant = {};

function getTenantInfluencers(tenantId, uid) {
  if (!influencerStoreByTenant[tenantId]) {
    influencerStoreByTenant[tenantId] = [
      {
        id: '1',
        userId: uid,
        tenantId,
        name: 'Sarah Chen',
        handle: '@sarahcreates',
        followers: '125K',
        engagement: '6.8%',
        niche: 'Tech',
        country: 'US',
        fakeScore: 12,
        reachEstimate: '85K-110K',
        strategy: 'Product review series',
        createdAt: new Date().toISOString(),
      },
    ];
  }
  return influencerStoreByTenant[tenantId];
}

function parseLimit(value, fallback = 25, max = 100) {
  const parsed = Number.parseInt(String(value || ''), 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(parsed, max);
}

router.get('/', (req, res) => {
  const tenantId = req.auth?.tenantId;
  const uid = req.auth?.uid;
  if (!tenantId) return res.status(400).json({ message: 'Missing tenant context' });
  const limit = parseLimit(req.query.limit, 25);
  const before = typeof req.query.before === 'string' ? req.query.before : '';
  const db = getFirestore();
  if (!db) {
    const items = getTenantInfluencers(tenantId, uid)
      .filter((item) => !before || item.createdAt < before)
      .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
      .slice(0, limit);
    const nextCursor = items.length === limit ? items[items.length - 1]?.createdAt : null;
    return res.json({ items, nextCursor });
  }

  let query = db.collection('influencers')
    .where('tenantId', '==', tenantId)
    .orderBy('createdAt', 'desc');

  if (before) query = query.where('createdAt', '<', before);

  query.limit(limit).get()
    .then((snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const nextCursor = items.length === limit ? items[items.length - 1]?.createdAt : null;
      res.json({ items, nextCursor });
    })
    .catch(() => {
      const items = getTenantInfluencers(tenantId, uid)
        .filter((item) => !before || item.createdAt < before)
        .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
        .slice(0, limit);
      const nextCursor = items.length === limit ? items[items.length - 1]?.createdAt : null;
      res.json({ items, nextCursor });
    });
});

router.post('/', async (req, res) => {
  const tenantId = req.auth?.tenantId;
  const uid = req.auth?.uid;
  if (!tenantId) return res.status(400).json({ message: 'Missing tenant context' });
  const item = {
    userId: uid,
    tenantId,
    ...req.body,
    createdAt: new Date().toISOString(),
  };
  const db = getFirestore();
  if (!db) {
    const memoryItem = { id: uuidv4(), ...item };
    getTenantInfluencers(tenantId, uid).push(memoryItem);
    return res.status(201).json(memoryItem);
  }

  try {
    const docRef = db.collection('influencers').doc();
    await docRef.set(item);
    res.status(201).json({ id: docRef.id, ...item });
  } catch {
    const memoryItem = { id: uuidv4(), ...item };
    getTenantInfluencers(tenantId, uid).push(memoryItem);
    res.status(201).json(memoryItem);
  }
});

export default router;

