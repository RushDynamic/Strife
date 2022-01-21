import express from 'express';
import {
  handleUserRegistration,
  handleUserLogin,
  handleUserLogout,
  handleCheckLoggedIn,
} from '../controllers/authentication-controller.js';

const router = express.Router();

router.post('/register', handleUserRegistration);
router.post('/login', handleUserLogin);
router.get('/logout', handleUserLogout);
router.post('/logged_in', handleCheckLoggedIn);
export default router;
