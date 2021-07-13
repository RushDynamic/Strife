import express from 'express';
import { handleGenerateAccessToken, handleGenerateRefreshToken, handleGenerateAll, handleVerifyAccessToken, handleVerifyRefreshToken } from '../controllers/authorization-status-controller.js';

const router = express.Router();

router.post('/generate/access', handleGenerateAccessToken);
router.post('/generate/refresh', handleGenerateRefreshToken);
router.post('/generate/all', handleGenerateAll)
router.post('/verify/access', handleVerifyAccessToken);
router.post('/verify/refresh', handleVerifyRefreshToken);

export default router;