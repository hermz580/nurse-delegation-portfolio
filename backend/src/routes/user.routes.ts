import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ message: 'Get users endpoint - To be implemented' });
});

router.get('/:id', (req, res) => {
  res.json({ message: `Get user ${req.params.id} - To be implemented` });
});

router.put('/:id', (req, res) => {
  res.json({ message: `Update user ${req.params.id} - To be implemented` });
});

router.delete('/:id', (req, res) => {
  res.json({ message: `Delete user ${req.params.id} - To be implemented` });
});

export default router;
