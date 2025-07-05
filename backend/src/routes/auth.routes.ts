import express from 'express';
import { checkAuth, login, logout, signup, updateProfile } from '../controllers/auth.controller';
import { protectRoute } from '../middlewares/auth.middleware';
import { asyncHandler } from '../lib/asyncHandler';

const router = express.Router();

router.post('/signup' , asyncHandler(signup));
router.post('/login', asyncHandler(login));
router.get('/logout', asyncHandler(logout));
router.put('/update',asyncHandler(protectRoute), asyncHandler(updateProfile));
router.get('/check', asyncHandler(protectRoute), asyncHandler(checkAuth));

export default router;