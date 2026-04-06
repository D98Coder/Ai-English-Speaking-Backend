import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini with API key from .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class AIService {
  constructor() {
    // Get the model (gemini-2.5-flash is free and fast)
    this.model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
      }
    });
  }

  async getAIResponse(userMessage, englishLevel = 'intermediate', conversationHistory = []) {
    try {
      console.log('🤖 Calling Gemini API...');
      console.log('📝 User message:', userMessage);
      console.log('📚 English Level:', englishLevel);

      // Create system instruction based on user's English level
      const systemInstruction = this.getSystemInstruction(englishLevel);
      
      // Prepare chat with history
      const chat = this.model.startChat({
        history: this.formatHistory(conversationHistory),
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        },
      });

      // Send message with system instruction
      const fullPrompt = `${systemInstruction}\n\nUser: ${userMessage}`;
      const result = await chat.sendMessage(fullPrompt);
      const response = result.response.text();

      console.log('✅ Gemini Response:', response.substring(0, 100) + '...');
      
      return {
        response: response,
        metadata: {
          model: 'gemini-2.5-flash',
          level: englishLevel,
          timestamp: new Date().toISOString()
        }
      };

    } catch (error) {
      console.error('❌ Gemini API Error:', error);
      
      // Fallback responses if API fails
      return {
        response: this.getFallbackResponse(userMessage, englishLevel),
        metadata: { error: true, message: error.message }
      };
    }
  }

  getSystemInstruction(level) {
    const instructions = {
      basic: `You are an English teacher for a BASIC level student.
- Use VERY simple words and short sentences
- Speak slowly and clearly
- Focus on everyday topics
- Correct mistakes gently
- Keep responses to 1-2 short sentences`,

      intermediate: `You are an English conversation partner for an INTERMEDIATE level student.
- Use moderate vocabulary
- Discuss various topics naturally
- Correct errors and suggest better ways to express ideas
- Ask follow-up questions
- Keep responses to 2-3 sentences`,

      advanced: `You are an English conversation partner for an ADVANCED level student.
- Use natural, fluent English
- Discuss complex topics and abstract ideas
- Provide sophisticated feedback
- Engage in deep, meaningful conversations`
    };

    return instructions[level] || instructions.intermediate;
  }

  formatHistory(history) {
    if (!history || history.length === 0) return [];
    
    // Convert history to Gemini format
    const formatted = [];
    for (const msg of history) {
      formatted.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      });
    }
    return formatted;
  }

  getFallbackResponse(message, level) {
    const fallbacks = {
      basic: [
        "That's interesting! Tell me more about that.",
        "Good job! Keep practicing your English.",
        "I understand. What else would you like to talk about?"
      ],
      intermediate: [
        "That's a great point! Could you explain further?",
        "I see what you mean. That's very interesting!",
        "Excellent! How does that make you feel?"
      ],
      advanced: [
        "That's a fascinating perspective! Could you elaborate?",
        "I appreciate your insight on this matter.",
        "That's very thought-provoking! Tell me more."
      ]
    };
    
    const levelFallbacks = fallbacks[level] || fallbacks.intermediate;
    return levelFallbacks[Math.floor(Math.random() * levelFallbacks.length)];
  }
}

export default new AIService();