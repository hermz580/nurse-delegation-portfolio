import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ message: 'Get training modules - To be implemented' });
});

router.get('/:id', (req, res) => {
  res.json({ message: `Get module ${req.params.id} - To be implemented` });
});

router.post('/', (_req, res) => {
  res.json({ message: 'Create module - To be implemented' });
});

router.put('/:id', (req, res) => {
  res.json({ message: `Update module ${req.params.id} - To be implemented` });
});

router.delete('/:id', (req, res) => {
  res.json({ message: `Delete module ${req.params.id} - To be implemented` });
});

export default router;
