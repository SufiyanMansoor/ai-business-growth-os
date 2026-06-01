import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getFirestore } from '../services/firebase.js';

const router = Router();

const runsStoreByTenant = {};

function getTenantRuns(tenantId, uid) {
  if (!runsStoreByTenant[tenantId]) {
    runsStoreByTenant[tenantId] = [
      {
        id: '1',
        userId: uid,
        tenantId,
        goal: 'leads',
        budget: 1000,
        industry: 'saas',
        status: 'completed',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ];
  }
  return runsStoreByTenant[tenantId];
}

function parseLimit(value, fallback = 25, max = 100) {
  const parsed = Number.parseInt(String(value || ''), 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(parsed, max);
}

router.get('/runs', (req, res) => {
  const tenantId = req.auth?.tenantId;
  const uid = req.auth?.uid;
  if (!tenantId) return res.status(400).json({ message: 'Missing tenant context' });
  const limit = parseLimit(req.query.limit, 25);
  const before = typeof req.query.before === 'string' ? req.query.before : '';
  const db = getFirestore();
  if (!db) {
    const runs = getTenantRuns(tenantId, uid)
      .filter((item) => !before || item.createdAt < before)
      .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
      .slice(0, limit);
    const nextCursor = runs.length === limit ? runs[runs.length - 1]?.createdAt : null;
    return res.json({ runs, nextCursor });
  }

  let query = db.collection('autopilot')
    .where('tenantId', '==', tenantId)
    .orderBy('createdAt', 'desc');

  if (before) query = query.where('createdAt', '<', before);

  query.limit(limit).get()
    .then((snapshot) => {
      const runs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const nextCursor = runs.length === limit ? runs[runs.length - 1]?.createdAt : null;
      res.json({ runs, nextCursor });
    })
    .catch(() => {
      const runs = getTenantRuns(tenantId, uid)
        .filter((item) => !before || item.createdAt < before)
        .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
        .slice(0, limit);
      const nextCursor = runs.length === limit ? runs[runs.length - 1]?.createdAt : null;
      res.json({ runs, nextCursor });
    });
});

router.post('/runs', async (req, res) => {
  const tenantId = req.auth?.tenantId;
  const uid = req.auth?.uid;
  if (!tenantId) return res.status(400).json({ message: 'Missing tenant context' });
  const run = {
    userId: uid,
    tenantId,
    status: 'running',
    ...req.body,
    createdAt: new Date().toISOString(),
  };
  const db = getFirestore();
  if (!db) {
    const memoryRun = { id: uuidv4(), ...run };
    getTenantRuns(tenantId, uid).push(memoryRun);
    return res.status(201).json(memoryRun);
  }
  try {
    const docRef = db.collection('autopilot').doc();
    await docRef.set(run);
    res.status(201).json({ id: docRef.id, ...run });
  } catch {
    const memoryRun = { id: uuidv4(), ...run };
    getTenantRuns(tenantId, uid).push(memoryRun);
    res.status(201).json(memoryRun);
  }
});

router.put('/runs/:id', async (req, res) => {
  const tenantId = req.auth?.tenantId;
  const uid = req.auth?.uid;
  if (!tenantId) return res.status(400).json({ message: 'Missing tenant context' });
  const db = getFirestore();
  if (db) {
    try {
      const docRef = db.collection('autopilot').doc(req.params.id);
      const snapshot = await docRef.get();
      if (!snapshot.exists) return res.status(404).json({ message: 'Autopilot run not found' });
      const existing = snapshot.data() || {};
      if (existing.tenantId !== tenantId) return res.status(404).json({ message: 'Autopilot run not found' });
      const updated = { ...existing, ...req.body, updatedAt: new Date().toISOString() };
      await docRef.set(updated, { merge: true });
      return res.json({ id: docRef.id, ...updated });
    } catch {
      // fallback to in-memory below
    }
  }
  const runs = getTenantRuns(tenantId, uid);
  const index = runs.findIndex((item) => item.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Autopilot run not found' });
  runs[index] = { ...runs[index], ...req.body, updatedAt: new Date().toISOString() };
  res.json(runs[index]);
});

export default router;

