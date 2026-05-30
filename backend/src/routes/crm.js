import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

const leadsStore = [
  { id: '1', company: 'TechFlow Solutions', website: 'techflow.io', email: 'hello@techflow.io', phone: '+1-555-0101', industry: 'SaaS', stage: 'new', score: 92, notes: '', createdAt: new Date().toISOString() },
  { id: '2', company: 'GreenBite Restaurant', website: 'greenbite.com', email: 'info@greenbite.com', phone: '+1-555-0102', industry: 'Restaurant', stage: 'contacted', score: 78, notes: 'Follow up Monday', createdAt: new Date().toISOString() },
];

router.get('/leads', (_req, res) => {
  res.json({ leads: leadsStore });
});

router.post('/leads', (req, res) => {
  const lead = { id: uuidv4(), ...req.body, createdAt: new Date().toISOString() };
  leadsStore.push(lead);
  res.status(201).json(lead);
});

router.put('/leads/:id', (req, res) => {
  const index = leadsStore.findIndex((l) => l.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Lead not found' });
  leadsStore[index] = { ...leadsStore[index], ...req.body, updatedAt: new Date().toISOString() };
  res.json(leadsStore[index]);
});

router.delete('/leads/:id', (req, res) => {
  const index = leadsStore.findIndex((l) => l.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Lead not found' });
  leadsStore.splice(index, 1);
  res.json({ message: 'Lead deleted' });
});

export default router;
