import express from 'express';
import { checkAuth, login, logout, signup, updateProfile } from '../controllers/auth.controller';
import { protectRoute } from '../middlewares/auth.middleware';

const router = express.Router();

//@ts-ignore
router.post('/signup' , signup);
//@ts-ignore
router.post('/login', login);
router.post('/logout', logout);
//@ts-ignore
router.put('/update',protectRoute, updateProfile);
//@ts-ignore
router.get('/check', protectRoute, checkAuth);

export default router;