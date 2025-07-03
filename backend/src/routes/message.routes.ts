import express from 'express';
import { protectRoute } from '../middlewares/auth.middleware';
import { getMessages, getUsersForSidebar, sendMessage } from '../controllers/message.controller';
import { asyncHandler } from '../lib/asyncHandler';

const router = express.Router();



router.get('/users',asyncHandler(protectRoute),asyncHandler(getUsersForSidebar));
router.get('/:id',asyncHandler(protectRoute),asyncHandler(getMessages));

router.post('/send/:id',asyncHandler(protectRoute),asyncHandler(sendMessage));

export default router;