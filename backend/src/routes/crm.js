import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getFirestore } from '../services/firebase.js';

const router = Router();

// In-memory store for MVP. We key by tenantId so multiple tenants don't share data.
const leadsStoreByTenant = {};

function getTenantLeads(tenantId, uid) {
  if (!leadsStoreByTenant[tenantId]) {
    // Seed with realistic demo data per tenant
    leadsStoreByTenant[tenantId] = [
      { id: '1', userId: uid, tenantId, company: 'TechFlow Solutions', website: 'techflow.io', email: 'hello@techflow.io', phone: '+1-555-0101', industry: 'SaaS', stage: 'new', score: 92, notes: '', createdAt: new Date().toISOString() },
      { id: '2', userId: uid, tenantId, company: 'GreenBite Restaurant', website: 'greenbite.com', email: 'info@greenbite.com', phone: '+1-555-0102', industry: 'Restaurant', stage: 'contacted', score: 78, notes: 'Follow up Monday', createdAt: new Date().toISOString() },
    ];
  }
  return leadsStoreByTenant[tenantId];
}

function parseLimit(value, fallback = 25, max = 100) {
  const parsed = Number.parseInt(String(value || ''), 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(parsed, max);
}

router.get('/leads', async (req, res) => {
  const tenantId = req.auth?.tenantId;
  const uid = req.auth?.uid;
  if (!tenantId) return res.status(400).json({ message: 'Missing tenant context' });
  const limit = parseLimit(req.query.limit, 25);
  const before = typeof req.query.before === 'string' ? req.query.before : '';

  const db = getFirestore();
  if (!db) {
    const fallbackItems = getTenantLeads(tenantId, uid)
      .filter((item) => !before || item.createdAt < before)
      .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
      .slice(0, limit);
    const nextCursor = fallbackItems.length === limit ? fallbackItems[fallbackItems.length - 1]?.createdAt : null;
    return res.json({ leads: fallbackItems, nextCursor });
  }

  try {
    let query = db.collection('leads')
      .where('tenantId', '==', tenantId)
      .orderBy('createdAt', 'desc');

    if (before) {
      query = query.where('createdAt', '<', before);
    }

    const snapshot = await query.limit(limit).get();
    const leads = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const nextCursor = leads.length === limit ? leads[leads.length - 1]?.createdAt : null;
    res.json({ leads, nextCursor });
  } catch {
    const fallbackItems = getTenantLeads(tenantId, uid)
      .filter((item) => !before || item.createdAt < before)
      .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
      .slice(0, limit);
    const nextCursor = fallbackItems.length === limit ? fallbackItems[fallbackItems.length - 1]?.createdAt : null;
    res.json({ leads: fallbackItems, nextCursor });
  }
});

router.post('/leads', async (req, res) => {
  const tenantId = req.auth?.tenantId;
  const uid = req.auth?.uid;
  if (!tenantId) return res.status(400).json({ message: 'Missing tenant context' });
  const lead = { userId: uid, tenantId, ...req.body, createdAt: new Date().toISOString() };
  const db = getFirestore();
  if (!db) {
    const memoryLead = { id: uuidv4(), ...lead };
    getTenantLeads(tenantId, uid).push(memoryLead);
    return res.status(201).json(memoryLead);
  }
  try {
    const docRef = db.collection('leads').doc();
    await docRef.set(lead);
    res.status(201).json({ id: docRef.id, ...lead });
  } catch {
    const memoryLead = { id: uuidv4(), ...lead };
    getTenantLeads(tenantId, uid).push(memoryLead);
    res.status(201).json(memoryLead);
  }
});

router.put('/leads/:id', async (req, res) => {
  const tenantId = req.auth?.tenantId;
  const uid = req.auth?.uid;
  if (!tenantId) return res.status(400).json({ message: 'Missing tenant context' });
  const db = getFirestore();
  if (db) {
    try {
      const docRef = db.collection('leads').doc(req.params.id);
      const snapshot = await docRef.get();
      if (!snapshot.exists) return res.status(404).json({ message: 'Lead not found' });
      const existing = snapshot.data() || {};
      if (existing.tenantId !== tenantId) return res.status(404).json({ message: 'Lead not found' });
      const updated = {
        ...existing,
        ...req.body,
        tenantId,
        userId: existing.userId || uid,
        updatedAt: new Date().toISOString(),
      };
      await docRef.set(updated, { merge: true });
      return res.json({ id: docRef.id, ...updated });
    } catch {
      // fallback below
    }
  }
  const leads = getTenantLeads(tenantId, uid);
  const index = leads.findIndex((l) => l.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Lead not found' });
  leads[index] = {
    ...leads[index],
    ...req.body,
    tenantId,
    userId: leads[index].userId || uid,
    updatedAt: new Date().toISOString(),
  };
  res.json(leads[index]);
});

router.delete('/leads/:id', async (req, res) => {
  const tenantId = req.auth?.tenantId;
  const uid = req.auth?.uid;
  if (!tenantId) return res.status(400).json({ message: 'Missing tenant context' });
  const db = getFirestore();
  if (db) {
    try {
      const docRef = db.collection('leads').doc(req.params.id);
      const snapshot = await docRef.get();
      if (!snapshot.exists) return res.status(404).json({ message: 'Lead not found' });
      const existing = snapshot.data() || {};
      if (existing.tenantId !== tenantId) return res.status(404).json({ message: 'Lead not found' });
      await docRef.delete();
      return res.json({ message: 'Lead deleted' });
    } catch {
      // fallback below
    }
  }
  const leads = getTenantLeads(tenantId, uid);
  const index = leads.findIndex((l) => l.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Lead not found' });
  leads.splice(index, 1);
  res.json({ message: 'Lead deleted' });
});

export default router;
