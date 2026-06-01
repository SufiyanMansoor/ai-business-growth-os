import { Router } from 'express';
import PDFDocument from 'pdfkit';
import { getFirestore } from '../services/firebase.js';

const router = Router();
const reportHistoryByTenant = {};

function getTenantReports(tenantId, uid) {
  if (!reportHistoryByTenant[tenantId]) {
    reportHistoryByTenant[tenantId] = [
      {
        id: 'seed-1',
        userId: uid,
        tenantId,
        title: 'Q2 Campaign Summary',
        type: 'PDF',
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      },
    ];
  }
  return reportHistoryByTenant[tenantId];
}

function parseLimit(value, fallback = 25, max = 100) {
  const parsed = Number.parseInt(String(value || ''), 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(parsed, max);
}

router.get('/history', (req, res) => {
  const tenantId = req.auth?.tenantId;
  const uid = req.auth?.uid;
  if (!tenantId) return res.status(400).json({ message: 'Missing tenant context' });
  const limit = parseLimit(req.query.limit, 25);
  const before = typeof req.query.before === 'string' ? req.query.before : '';
  const db = getFirestore();
  if (!db) {
    const reports = getTenantReports(tenantId, uid)
      .filter((item) => !before || item.createdAt < before)
      .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
      .slice(0, limit);
    const nextCursor = reports.length === limit ? reports[reports.length - 1]?.createdAt : null;
    return res.json({ reports, nextCursor });
  }

  let query = db.collection('reports')
    .where('tenantId', '==', tenantId)
    .orderBy('createdAt', 'desc');

  if (before) query = query.where('createdAt', '<', before);

  query.limit(limit).get()
    .then((snapshot) => {
      const reports = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const nextCursor = reports.length === limit ? reports[reports.length - 1]?.createdAt : null;
      res.json({ reports, nextCursor });
    })
    .catch(() => {
      const reports = getTenantReports(tenantId, uid)
        .filter((item) => !before || item.createdAt < before)
        .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
        .slice(0, limit);
      const nextCursor = reports.length === limit ? reports[reports.length - 1]?.createdAt : null;
      res.json({ reports, nextCursor });
    });
});

router.post('/generate', async (req, res) => {
  const { type, campaignId } = req.body;
  const tenantId = req.auth?.tenantId;
  const uid = req.auth?.uid;
  const normalizedType = String(type || 'summary').toLowerCase();
  const reportRecord = {
    id: `report-${Date.now()}`,
    userId: uid,
    tenantId: tenantId || null,
    type: normalizedType === 'pdf' ? 'PDF' : normalizedType === 'excel' ? 'Excel' : 'JSON',
    title: campaignId ? `Campaign Report (${campaignId})` : 'Business Report',
    createdAt: new Date().toISOString(),
  };
  const db = getFirestore();
  if (tenantId && !db) getTenantReports(tenantId, uid).unshift(reportRecord);
  if (tenantId && db) {
    try {
      await db.collection('reports').doc(reportRecord.id).set(reportRecord);
    } catch {
      getTenantReports(tenantId, uid).unshift(reportRecord);
    }
  }

  if (normalizedType === 'pdf') {
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=report.pdf');
    doc.pipe(res);

    doc.fontSize(24).text('AI Business Growth OS', { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text(`${normalizedType.toUpperCase()} Report`, { align: 'center' });
    doc.moveDown(2);
    doc.fontSize(12).text(`Generated: ${new Date().toLocaleDateString()}`);
    if (campaignId) doc.text(`Campaign ID: ${campaignId}`);
    if (tenantId) doc.text(`Tenant: ${tenantId}`);
    doc.moveDown();
    doc.text('Campaign Performance Summary');
    doc.text('Total Revenue: $15,800');
    doc.text('ROI: 351%');
    doc.text('Leads Generated: 520');
    doc.text('Engagement Rate: 6.2%');
    doc.end();
  } else {
    res.json({
      type: normalizedType,
      generatedAt: new Date().toISOString(),
      tenantId: tenantId || null,
      reportId: reportRecord.id,
      data: {
        revenue: 15800,
        roi: 351,
        leads: 520,
        engagement: 6.2,
      },
    });
  }
});

export default router;
