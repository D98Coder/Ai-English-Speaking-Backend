import 'dotenv/config';
import app from './backend/src/app.js';
import connectDB from './backend/src/config/database.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('⚠️ Running without MongoDB - using in-memory storage');
  }

  app.listen(PORT, () => {
    console.log(`\n🚀 Server running successfully`);
    console.log(`📍 Backend: http://localhost:${PORT}`);
    console.log(`📍 API: http://localhost:${PORT}/api/health`);
    console.log(`📍 Auth: http://localhost:${PORT}/api/auth/signup`);
    console.log(`📍 Practice: http://localhost:${PORT}/api/conversations`);
    console.log(`🤖 AI Model: Google Gemini 2.5 Flash (Free)`);
  });
};

startServer();