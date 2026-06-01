import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getFirestore } from '../services/firebase.js';

const router = Router();

const outreachStoreByTenant = {};

function getTenantOutreach(tenantId, uid) {
  if (!outreachStoreByTenant[tenantId]) {
    outreachStoreByTenant[tenantId] = [
      {
        id: '1',
        userId: uid,
        tenantId,
        type: 'email',
        target: 'Acme Corp',
        initial: 'Hi Acme team, we can help you scale outreach...',
        followUps: ['Follow up day 3', 'Follow up day 7'],
        tracking: { opens: 3, clicks: 1, replies: 0, status: 'sent' },
        createdAt: new Date().toISOString(),
      },
    ];
  }
  return outreachStoreByTenant[tenantId];
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
    const items = getTenantOutreach(tenantId, uid)
      .filter((item) => !before || item.createdAt < before)
      .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
      .slice(0, limit);
    const nextCursor = items.length === limit ? items[items.length - 1]?.createdAt : null;
    return res.json({ items, nextCursor });
  }

  let query = db.collection('outreach')
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
      const items = getTenantOutreach(tenantId, uid)
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
    tracking: { opens: 0, clicks: 0, replies: 0, status: 'draft' },
    ...req.body,
    createdAt: new Date().toISOString(),
  };
  const db = getFirestore();
  if (!db) {
    const memoryItem = { id: uuidv4(), ...item };
    getTenantOutreach(tenantId, uid).push(memoryItem);
    return res.status(201).json(memoryItem);
  }

  try {
    const docRef = db.collection('outreach').doc();
    await docRef.set(item);
    res.status(201).json({ id: docRef.id, ...item });
  } catch {
    const memoryItem = { id: uuidv4(), ...item };
    getTenantOutreach(tenantId, uid).push(memoryItem);
    res.status(201).json(memoryItem);
  }
});

export default router;

