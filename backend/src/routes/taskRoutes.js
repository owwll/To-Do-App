import { Router } from 'express';
import { addTask, deleteTask, getTasks, updateTask } from '../controllers/taskController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);
router.post('/', addTask);
router.get('/', getTasks);
router.patch('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
