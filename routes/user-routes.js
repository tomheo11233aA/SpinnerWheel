import express from 'express';
import { createUser, getAllUser, deleteUser, updateUser } from '../controllers/user-controllers.js';

const router = express.Router();
router.get('/', getAllUser);
router.post('/', createUser);
router.delete('/:id', deleteUser);
router.put('/:id', updateUser);

export default router;