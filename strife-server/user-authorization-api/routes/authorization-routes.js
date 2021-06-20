import express from 'express';
import { handleGenerateAccessToken, handleGenerateRefreshToken, handleGenerateAll, handleVerifyAccessToken, handleVerifyRefreshToken } from '../controllers/authorization-status-controller.js';

const router = express.Router();

router.get('/generate/access', handleGenerateAccessToken);
router.get('/generate/refresh', handleGenerateRefreshToken);
router.get('/generate/all', handleGenerateAll)
router.get('/verify/access', handleVerifyAccessToken);
router.get('/verify/refresh', handleVerifyRefreshToken);

export default router;