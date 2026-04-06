import express from 'express';
import { protect, restrictTo } from '../middleware/auth.middleware.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(restrictTo('admin'));

// Dashboard route
router.get('/dashboard', (req, res) => {
  res.json({ success: true, message: 'Welcome to Admin Dashboard' });
});

// Users management
router.get('/users', (req, res) => {
  res.json({ success: true, message: 'Users list - Admin only' });
});

// Analytics
router.get('/analytics', (req, res) => {
  res.json({ success: true, message: 'Analytics Dashboard' });
});

// Conversations (admin view)
router.get('/conversations', (req, res) => {
  res.json({ success: true, message: 'All conversations - Admin view' });
});

export default router;