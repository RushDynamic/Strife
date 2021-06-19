import express from 'express';
import { handleIsUserLoggedIn } from '../controllers/authorization-status-controller.js';

const router = express.Router();

router.get('/logged_in', handleIsUserLoggedIn);

export default router;