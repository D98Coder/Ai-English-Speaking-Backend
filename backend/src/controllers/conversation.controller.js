import aiService from '../services/ai.service.js';

// In-memory storage (replace with database in production)
const conversations = new Map();
const messages = new Map();

export const startConversation = async (req, res) => {
  try {
    const { title } = req.body;
    const conversationId = Date.now().toString();
    
    conversations.set(conversationId, {
      _id: conversationId,
      user: req.user._id,
      title: title || 'New Conversation',
      lastMessageAt: new Date(),
      createdAt: new Date()
    });
    
    messages.set(conversationId, []);
    
    res.status(201).json({
      success: true,
      data: conversations.get(conversationId)
    });
  } catch (error) {
    console.error('Start conversation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserConversations = async (req, res) => {
  try {
    const userConversations = Array.from(conversations.values())
      .filter(c => c.user === req.user._id)
      .sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
    
    res.status(200).json({
      success: true,
      count: userConversations.length,
      data: userConversations
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const convMessages = messages.get(conversationId) || [];
    
    res.status(200).json({
      success: true,
      data: convMessages
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const sendTextMessage = async (req, res) => {
  try {
    const { conversationId, message } = req.body;
    const englishLevel = req.user.englishLevel || 'intermediate';
    
    if (!message || message.trim() === '') {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }
    
    let conversation = conversations.get(conversationId);
    if (!conversation) {
      // Create new conversation if doesn't exist
      const newId = Date.now().toString();
      conversation = {
        _id: newId,
        user: req.user._id,
        title: 'New Conversation',
        lastMessageAt: new Date(),
        createdAt: new Date()
      };
      conversations.set(newId, conversation);
      messages.set(newId, []);
    }
    
    // Save user message
    const userMessage = {
      _id: Date.now(),
      conversation: conversation._id,
      role: 'user',
      content: message,
      createdAt: new Date()
    };
    
    const convMessages = messages.get(conversation._id) || [];
    convMessages.push(userMessage);
    
    // Get conversation history for context (last 10 messages)
    const history = convMessages.slice(-10).map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    // Get AI response from Gemini
    const aiResponseData = await aiService.getAIResponse(message, englishLevel, history);
    
    const aiMessage = {
      _id: Date.now() + 1,
      conversation: conversation._id,
      role: 'assistant',
      content: aiResponseData.response,
      metadata: aiResponseData.metadata,
      createdAt: new Date()
    };
    
    convMessages.push(aiMessage);
    messages.set(conversation._id, convMessages);
    
    conversation.lastMessageAt = new Date();
    conversations.set(conversation._id, conversation);
    
    res.status(200).json({
      success: true,
      data: {
        userMessage,
        aiMessage,
        conversationId: conversation._id
      }
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const sendVoiceMessage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No audio file provided' });
    }
    
    const englishLevel = req.user.englishLevel || 'intermediate';
    const { conversationId, transcribedText } = req.body;
    
    // Use provided transcribed text or mock one
    const userText = transcribedText || "Hello, I'm practicing English speaking. Can you help me?";
    
    let conversation = conversations.get(conversationId);
    if (!conversation) {
      const newId = Date.now().toString();
      conversation = {
        _id: newId,
        user: req.user._id,
        title: 'Voice Conversation',
        lastMessageAt: new Date(),
        createdAt: new Date()
      };
      conversations.set(newId, conversation);
      messages.set(newId, []);
    }
    
    // Save user message
    const userMessage = {
      _id: Date.now(),
      conversation: conversation._id,
      role: 'user',
      content: userText,
      createdAt: new Date(),
      audioUrl: req.file.path
    };
    
    const convMessages = messages.get(conversation._id) || [];
    convMessages.push(userMessage);
    
    // Get conversation history
    const history = convMessages.slice(-10).map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    // Get AI response
    const aiResponseData = await aiService.getAIResponse(userText, englishLevel, history);
    
    const aiMessage = {
      _id: Date.now() + 1,
      conversation: conversation._id,
      role: 'assistant',
      content: aiResponseData.response,
      metadata: aiResponseData.metadata,
      createdAt: new Date()
    };
    
    convMessages.push(aiMessage);
    messages.set(conversation._id, convMessages);
    
    conversation.lastMessageAt = new Date();
    conversations.set(conversation._id, conversation);
    
    res.status(200).json({
      success: true,
      data: {
        transcribedText: userText,
        userMessage,
        aiMessage,
        conversationId: conversation._id
      }
    });
  } catch (error) {
    console.error('Voice message error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    
    const conversation = conversations.get(conversationId);
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }
    
    conversations.delete(conversationId);
    messages.delete(conversationId);
    
    res.status(200).json({
      success: true,
      message: 'Conversation deleted successfully'
    });
  } catch (error) {
    console.error('Delete conversation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};