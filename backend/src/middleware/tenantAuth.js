import { admin, getFirestore } from '../services/firebase.js';

function getTenantId(req) {
  const header = req.headers['x-tenant-id'] || req.headers['X-Tenant-Id'];
  if (typeof header === 'string' && header.trim()) return header.trim();
  if (typeof req.query.tenantId === 'string' && req.query.tenantId.trim()) return req.query.tenantId.trim();
  return null;
}

function getBearerToken(req) {
  const auth = req.headers.authorization;
  if (!auth || typeof auth !== 'string') return null;
  if (!auth.toLowerCase().startsWith('bearer ')) return null;
  return auth.slice('bearer '.length).trim();
}

async function getMembershipRole({ db, tenantId, uid }) {
  if (!db || !tenantId) return null;

  const memberRef = db.collection('tenants').doc(tenantId).collection('members').doc(uid);
  const memberSnap = await memberRef.get();
  if (!memberSnap.exists) return null;

  const data = memberSnap.data() || {};
  return typeof data.role === 'string' ? data.role : null;
}

// Derives tenant context + RBAC role from:
// - Firebase ID token (Authorization header)
// - Tenant ID (X-Tenant-Id header)
// - Membership doc: tenants/{tenantId}/members/{uid}
export default async function tenantAuth(req, res, next) {
  try {
    const tenantId = getTenantId(req);
    if (!tenantId) {
      res.status(400).json({ message: 'Missing X-Tenant-Id header' });
      return;
    }

    const token = getBearerToken(req);
    if (!token) {
      res.status(401).json({ message: 'Missing Authorization bearer token' });
      return;
    }

    const decoded = await admin.auth().verifyIdToken(token);
    const uid = decoded.uid;

    const db = getFirestore();
    const roleFromMembership = await getMembershipRole({ db, tenantId, uid });

    // Legacy fallback: if memberships aren't created yet, only allow when the user doc tenantId matches.
    let role = roleFromMembership;
    if (!role && db) {
      const userSnap = await db.collection('users').doc(uid).get();
      const userData = userSnap.exists ? userSnap.data() : null;
      const userTenantId = userData?.tenantId || null;
      if (!userTenantId || userTenantId !== tenantId) {
        res.status(403).json({ message: 'No membership found for this tenant' });
        return;
      }
      role = userData?.role || null;
    }

    if (!role) {
      res.status(403).json({ message: 'No membership found for this tenant' });
      return;
    }

    req.auth = { uid, tenantId, role };
    next();
  } catch (error) {
    res.status(401).json({ message: error?.message || 'Unauthorized' });
  }
}

