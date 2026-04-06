import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/english_practice',
  
  // JWT
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  
  // OpenAI
  // openaiApiKey: process.env.OPENAI_API_KEY,
  
  // Rate Limiting
  rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  
  // File Upload
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedAudioTypes: ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/webm', 'audio/mp4'],
};

export default config;