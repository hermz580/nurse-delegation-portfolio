import { Router } from 'express';

const router = Router();

router.get('/dashboard', (_req, res) => {
  res.json({ message: 'Get dashboard analytics - To be implemented' });
});

router.get('/progress/:userId', (req, res) => {
  res.json({ message: `Get user progress ${req.params.userId} - To be implemented` });
});

router.get('/completion-rates', (_req, res) => {
  res.json({ message: 'Get completion rates - To be implemented' });
});

export default router;
