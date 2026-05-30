import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

const campaignsStore = [
  { id: '1', name: 'Summer Sale 2026', platform: 'Instagram', status: 'active', budget: 2500, roi: 245, createdAt: '2026-05-01' },
  { id: '2', name: 'Product Launch', platform: 'TikTok', status: 'active', budget: 1800, roi: 180, createdAt: '2026-05-10' },
];

router.get('/', (_req, res) => {
  res.json({ campaigns: campaignsStore });
});

router.post('/', (req, res) => {
  const campaign = { id: uuidv4(), status: 'draft', ...req.body, createdAt: new Date().toISOString() };
  campaignsStore.push(campaign);
  res.status(201).json(campaign);
});

router.get('/:id', (req, res) => {
  const campaign = campaignsStore.find((c) => c.id === req.params.id);
  if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
  res.json(campaign);
});

export default router;
