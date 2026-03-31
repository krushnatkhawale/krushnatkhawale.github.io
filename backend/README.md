# Portfolio Chatbot Backend

Node.js + Express backend for the portfolio chatbot using Google Gemini API.

## Features

- ✅ Google Gemini integration for AI responses
- ✅ Rate limiting (5 questions per 24 hours per session)
- ✅ Session-based tracking
- ✅ CORS configured for GitHub Pages
- ✅ Production-ready deployment to Render

## Prerequisites

- Node.js 16+ 
- npm or yarn
- Google Gemini API key (free tier available at https://makersuite.google.com/app/apikey)

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the backend folder:

```bash
cp .env.example .env
```

Then edit `.env` and add your Google Gemini API key:

```
GOOGLE_GEMINI_API_KEY=your_api_key_here
```

### 3. Run Locally

**Development (with hot reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

The server will run on `http://localhost:3001`

## API Endpoints

### POST `/api/chat`

Send a user message and get a chatbot response.

**Request:**
```json
{
  "message": "What projects have you built?",
  "sessionId": "user_12345"
}
```

**Response:**
```json
{
  "response": "I've built several projects including...",
  "remaining": 4
}
```

**Rate Limits:**
- 5 questions per session per 24 hours
- Returns 429 status if limit exceeded

### GET `/health`

Health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "message": "Chatbot backend is running"
}
```

## Deployment to Render

### 1. Create Render Account

Go to https://render.com and sign up (free tier available)

### 2. Deploy Backend

1. Fork this repository to GitHub
2. Go to https://render.com/dashboard
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name:** `portfolio-chatbot-backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free`

### 3. Add Environment Variables

In Render dashboard:
1. Go to Environment → Environment Variables
2. Add: `GOOGLE_GEMINI_API_KEY` = your API key
3. Add: `FRONTEND_URL` = `https://krushnatkhawale.github.io`
4. Add: `NODE_ENV` = `production`

### 4. Get Backend URL

Once deployed, Render will provide a URL like:
```
https://portfolio-chatbot-backend.onrender.com
```

### 5. Update Frontend

Update `.env` in the frontend (or set `REACT_APP_BACKEND_URL`):

```
REACT_APP_BACKEND_URL=https://portfolio-chatbot-backend.onrender.com
```

## File Structure

```
backend/
├── server.js           # Main Express server
├── knowledge.json      # Portfolio data for chatbot
├── package.json        # Dependencies
├── .env.example        # Environment variables template
├── .gitignore         # Git ignore rules
└── README.md          # This file
```

## How It Works

1. **Frontend** sends user message + session ID from `src/components/Chatbot.js`
2. **Backend** receives request and checks rate limit
3. **Google Gemini API** generates response using portfolio knowledge base
4. **Backend** returns response with remaining questions
5. **Frontend** displays message in chat window

## Troubleshooting

**"API Key Error"**
- Make sure `GOOGLE_GEMINI_API_KEY` is set in `.env`
- Get free key from https://makersuite.google.com/app/apikey

**"CORS Error"**
- Make sure `FRONTEND_URL` is added to CORS origins in `server.js`
- Or add your frontend domain to the CORS whitelist

**"Rate Limit: Too Many Requests"**
- Users can ask 5 questions per 24 hours
- Limit resets automatically after 24 hours

## Cost

- **Google Gemini API:** Free tier available (60 requests/minute, 1500/day)
- **Render Hosting:** $0/month (free tier with cold starts) to $5+/month (faster)

## License

MIT
