const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');
const logService = require('./logService');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());

app.use(async (req, res, next) => {
  const timestamp = new Date().toISOString();
  const sessionId = req.body?.sessionId || 'no-session';

  const logDetails = {
    timestamp,
    method: req.method,
    path: req.path,
    sessionId,
    user_prompt: req.body.message || 'empty-user-prompt'
  };

  const logDetailsJson = JSON.stringify(logDetails, null, 2);
  console.log('Incoming Request:', logDetailsJson);
  
  if (req.method === 'POST' && logDetails.user_prompt !== 'empty-user-prompt') {
    logService.createLog(logDetails);
  }

  next();
});

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://krushnatkhawale.github.io',
    process.env.FRONTEND_URL || ''
  ],
  credentials: true
}));

// Load knowledge base
const knowledgeBase = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'knowledge.json'), 'utf8')
);

// Session storage (in production, use Redis or database)
const sessions = new Map();

// Rate limiting per session (5 requests per hour)
const sessionLimiter = (req, res, next) => {
  const sessionId = req.body.sessionId;
  
  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID is required' });
  }

  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, {
      count: 0,
      resetTime: Date.now() + 24 * 60 * 60 * 1000, // 24 hour window
      questions: []
    });
  }

  const session = sessions.get(sessionId);
  const now = Date.now();

  // Reset if window has passed
  if (now > session.resetTime) {
    session.count = 0;
    session.questions = [];
    session.resetTime = now + 24 * 60 * 60 * 1000;
  }

  // Check limit
  if (session.count >= 5) {
    return res.status(429).json({
      error: 'Question limit reached! You have 5 questions per 24 hours. Come back later!',
      remaining: 0
    });
  }

  session.count++;
  session.questions.push({
    question: req.body.message,
    timestamp: new Date().toISOString()
  });

  req.remainingQuestions = 5 - session.count;
  next();
};

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

// System prompt for the chatbot
const SYSTEM_PROMPT = `You are a friendly and knowledgeable portfolio assistant for Krushnat Khawale, a skilled Java backend developer. 

Your role is to help visitors learn about Krushnat's:
- Professional experience and work history
- Technical skills and expertise
- Projects and accomplishments
- Blog topics and interests
- Education and background

Here is Krushnat's portfolio information:
${JSON.stringify(knowledgeBase, null, 2)}

Guidelines:
1. Be professional but friendly in your tone
2. Ask clarifying questions if the user's query is unclear
3. Provide specific examples from the portfolio when appropriate
4. Suggest related topics that might interest them
5. If asked about something not in the portfolio, politely mention that and redirect to relevant information
6. Keep responses concise (2-3 sentences typically, max 5-6 sentences)
7. Always be accurate with dates, company names, and technical details
8. Add a touch of personality to make the conversation engaging, but avoid being too casual or using slang
9. Add proper line breaks and text formatting(e.g. an empty line between to paragraps) for readability when providing lists or multiple points
10. If user asks something outside the scope of the portfolio (e.g. personal opinions, unrelated topics), politely decline and steer the conversation back to Krushnat's professional background and expertise.
11. If user message is about ending the conversation, respond politely and suggest reaching out to Krushnat on his email(give Krushnat's email address). 
12. If users question addresses you, consider it as a question about Krushnat's portfolio and respond accordingly.  
13. The last response (5th in this case) should always include a friendly closing statement inviting the user to ask more questions about Krushnat's portfolio or to reach out via email for further inquiries.
`;

// Chat endpoint
app.post('/api/chat', sessionLimiter, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    // Check message length (prevent abuse)
    if (message.length > 500) {
      return res.status(400).json({ error: 'Message too long (max 500 characters)' });
    }

    // Call Gemini API
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

    const chat = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 256,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage([
      {
        text: SYSTEM_PROMPT
      },
      {
        text: `User question: ${message}`
      }
    ]);

    const response = result.response.text();

    res.json({
      response: response,
      remaining: req.remainingQuestions
    });

    console.log(`Response sent to session ${req.body.sessionId}:`, response);
  } catch (error) {
    console.error('Error:', error);
    
    if (error.message?.includes('API key')) {
      return res.status(500).json({
        error: 'API configuration error. Please contact the site owner.'
      });
    }

    res.status(500).json({
      error: 'Sorry, I encountered an error. Please try again later.'
    });
  }
});

// Logs endpoint
app.get('/api/logs', async (req, res) => {
  try {
    const logs = await logService.getAllLogs();
    res.json(logs);
  } catch (err) {
    console.error('Failed to retrieve logs:', err);
    res.status(500).json({ error: 'Failed to retrieve logs' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Chatbot backend is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error'
  });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🤖 Portfolio chatbot backend running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
