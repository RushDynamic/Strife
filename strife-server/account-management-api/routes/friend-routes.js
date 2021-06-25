import express from 'express';
import { handleAddFriend, handleRemoveFriend } from '../controllers/friend-controller.js';

const router = express.Router();

router.post('/add_friend', handleAddFriend);
router.post('/remove_friend', handleRemoveFriend);

export default router;