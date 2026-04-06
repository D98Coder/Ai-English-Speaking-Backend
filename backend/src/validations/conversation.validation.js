import Joi from 'joi';

export const startConversationSchema = Joi.object({
  title: Joi.string().min(1).max(100)
});

export const sendTextMessageSchema = Joi.object({
  conversationId: Joi.string(),
  message: Joi.string().min(1).max(5000).required()
});

export const sendVoiceMessageSchema = Joi.object({
  conversationId: Joi.string()
});

export const getConversationMessagesSchema = Joi.object({
  conversationId: Joi.string().required(),
  page: Joi.number().min(1),
  limit: Joi.number().min(1).max(100)
});