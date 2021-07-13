import express from 'express';
import { handleEditAvatar } from '../controllers/profile-controller.js';
const router = express.Router();

router.post('/edit/avatar', handleEditAvatar);

export default router;