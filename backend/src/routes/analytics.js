import { Router } from 'express';

const router = Router();

router.get('/dashboard', (req, res) => {
  const tenantId = req.auth?.tenantId;
  if (!tenantId) return res.status(400).json({ message: 'Missing tenant context' });
  res.json({
    tenantId,
    revenue: { total: 15800, change: 24.5 },
    campaigns: { active: 12, total: 28 },
    leads: { total: 520, change: 38 },
    engagement: { rate: 6.2, change: 1.4 },
    roi: { average: 351, best: 500 },
  });
});

export default router;
