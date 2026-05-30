import { Router } from 'express';

const router = Router();

router.get('/dashboard', (_req, res) => {
  res.json({
    revenue: { total: 15800, change: 24.5 },
    campaigns: { active: 12, total: 28 },
    leads: { total: 520, change: 38 },
    engagement: { rate: 6.2, change: 1.4 },
    roi: { average: 351, best: 500 },
  });
});

export default router;
