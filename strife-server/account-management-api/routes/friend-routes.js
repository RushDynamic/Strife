import express from 'express';
import { handleAddFriend, handleRemoveFriend, handleFetchFriends } from '../controllers/friend-controller.js';

const router = express.Router();

router.post('/add', handleAddFriend);
router.post('/remove', handleRemoveFriend);
router.post('/fetch', handleFetchFriends);

export default router;