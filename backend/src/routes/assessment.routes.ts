import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ message: 'Get assessments - To be implemented' });
});

router.get('/:id', (req, res) => {
  res.json({ message: `Get assessment ${req.params.id} - To be implemented` });
});

router.post('/', (_req, res) => {
  res.json({ message: 'Create assessment - To be implemented' });
});

router.post('/:id/submit', (req, res) => {
  res.json({ message: `Submit assessment ${req.params.id} - To be implemented` });
});

export default router;
