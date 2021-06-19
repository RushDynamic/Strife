import express from 'express';
import { handleUserRegistration, handleUserLogin, handleUserLogout } from '../controllers/authentication-controller.js';

const router = express.Router();

router.get('/register', handleUserRegistration);
router.get('/login', handleUserLogin);
router.get('/logout', handleUserLogout);

export default router;