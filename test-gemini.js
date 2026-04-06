import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenerativeAI } from '@google/generative-ai';

async function testGeminiAPI() {
  console.log('🔍 Testing Google Gemini API...');
  console.log('📝 API Key exists:', !!process.env.GEMINI_API_KEY);
  
  if (!process.env.GEMINI_API_KEY) {
    console.log('❌ GEMINI_API_KEY not found in .env file!');
    console.log('💡 Please add: GEMINI_API_KEY=your-key-here');
    return;
  }
  
  console.log('🔑 API Key:', process.env.GEMINI_API_KEY.substring(0, 20) + '...');
  
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const result = await model.generateContent("Say 'Hello from Gemini API!'");
    const response = result.response.text();
    
    console.log('✅ SUCCESS! Gemini API is working!');
    console.log('🤖 Response:', response);
  } catch (error) {
    console.error('❌ Gemini API Error:', error.message);
    
    if (error.message.includes('API key not valid')) {
      console.log('⚠️ Invalid API Key. Please check your key in .env file');
    } else if (error.message.includes('quota')) {
      console.log('⚠️ Quota exceeded or no credits');
    }
  }
}

testGeminiAPI();