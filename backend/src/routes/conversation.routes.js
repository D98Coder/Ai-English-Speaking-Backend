import express from 'express';
import {
    deleteConversation,
    getConversationMessages,
    getUserConversations,
    sendTextMessage,
    sendVoiceMessage,
    startConversation
} from '../controllers/conversation.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Conversation management
router.post('/start', startConversation);
router.get('/', getUserConversations);
router.delete('/:conversationId', deleteConversation);

// Messages
router.get('/:conversationId/messages', getConversationMessages);
router.post('/message/text', sendTextMessage);
router.post('/message/voice', upload.single('audio'), sendVoiceMessage);  // ← यह route जोड़ें

export default router;
