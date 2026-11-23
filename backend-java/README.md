# Portfolio Chatbot Backend - Spring Boot 3.4+ Microservice

A Spring Boot 3.4+ microservice (Java 21, Gradle) that replicates the Node.js backend for Krushnat Khawale's portfolio chatbot. This service integrates with Google Gemini AI via Spring AI, includes MongoDB logging, session-based rate limiting, and deploys to Render.

## Features

- **Gemini AI Integration**: Uses `spring-ai-google-genai-spring-boot-starter` to call Google Gemini 2.5 Flash Lite
- **Chat Endpoint**: POST `/api/chat` with session management and rate limiting (5 requests per 24 hours)
- **MongoDB Logging**: Logs all requests and errors asynchronously to MongoDB
- **Session Management**: In-memory session storage with chat history
- **CORS Support**: Configured for localhost:3000, localhost:3001, and GitHub Pages domain
- **Multi-stage Docker**: Gradle build stage + lightweight runtime stage for Render deployment
- **Environment Variables**: Supports `SPRING_AI_GOOGLE_GENAI_API_KEY`, `MONGODB_URI`, and `PORT`

## Prerequisites

- Java 21 (JDK)
- Gradle 8.0+ (or use `./gradlew`)
- MongoDB (local or cloud URI via `MONGODB_URI` env var)
- Google Gemini API key (set `SPRING_AI_GOOGLE_GENAI_API_KEY`)

## Quick Start

### 1. Configure Environment Variables

```bash
export SPRING_AI_GOOGLE_GENAI_API_KEY=your_google_gemini_api_key
export MONGODB_URI=mongodb://localhost:27017/portfolio-chatbot  # Optional, defaults to local
export PORT=8080  # Optional, defaults to 8080
```

### 2. Build

```bash
./gradlew bootJar
```

The JAR file will be created at `build/libs/chatbot-backend-0.0.1-SNAPSHOT.jar`.

### 3. Run

```bash
java -jar build/libs/chatbot-backend-0.0.1-SNAPSHOT.jar
```

Or with environment variables:

```bash
PORT=8080 SPRING_AI_GOOGLE_GENAI_API_KEY=your_key java -jar build/libs/chatbot-backend-0.0.1-SNAPSHOT.jar
```

The app will start on the port specified by `PORT` environment variable (defaults to 8080).

### 4. Health Check

```bash
curl http://localhost:8080/health
```

Response:
```json
{
  "status": "OK",
  "message": "Chatbot backend is running"
}
```

## API Endpoints

### POST /api/chat

Send a message and get a response from Gemini.

**Request:**
```json
{
  "message": "What are your projects?",
  "sessionId": "unique-session-id-123"
}
```

**Response (200 OK):**
```json
{
  "response": "Here are some of my notable projects...",
  "remaining": 4
}
```

**Error Response (429 Too Many Requests):**
```json
{
  "error": "Question limit reached! You have 5 questions per 24 hours. Come back later!",
  "remaining": 0
}
```

### GET /health

Check if the service is running.

**Response:**
```json
{
  "status": "OK",
  "message": "Chatbot backend is running"
}
```

### GET /api/logs

Retrieve all request logs (sorted by timestamp descending).

**Response:**
```json
[
  {
    "id": "...",
    "timestamp": "2024-01-15T10:30:00Z",
    "method": "POST",
    "path": "/api/chat",
    "sessionId": "session-123",
    "user_prompt": "What do you do?"
  }
]
```

### GET /api/error-logs

Retrieve all error logs (sorted by timestamp descending).

**Response:**
```json
[
  {
    "id": "...",
    "timestamp": "2024-01-15T10:30:00Z",
    "apiname": "backend",
    "where": "/api/chat",
    "message": "Connection timeout",
    "stacktrace": "..."
  }
]
```

## Docker Deployment

### Build Docker Image

```bash
docker build -t portfolio-backend-java .
```

### Run Docker Container

```bash
docker run -p 8080:8080 \
  -e PORT=8080 \
  -e SPRING_AI_GOOGLE_GENAI_API_KEY=your_google_gemini_api_key \
  -e MONGODB_URI=mongodb://host.docker.internal:27017/portfolio-chatbot \
  portfolio-backend-java
```

### Deploy to Render

The `Dockerfile` is optimized for Render deployment. The app automatically respects the `PORT` environment variable that Render sets.

1. Push code to GitHub
2. Create a new Web Service on Render
3. Connect your repository
4. Set the following environment variables:
   - `SPRING_AI_GOOGLE_GENAI_API_KEY`: Your Google Gemini API key
   - `MONGODB_URI`: Your MongoDB connection string (optional, can use Render MongoDB addon)
5. Set build command: `./gradlew bootJar`
6. Set start command: `java -jar build/libs/chatbot-backend-0.0.1-SNAPSHOT.jar`

Render will automatically detect the Dockerfile and use the multi-stage build.

## Project Structure

```
backend-java/
├── build.gradle                          # Gradle build configuration
├── settings.gradle                       # Gradle settings
├── Dockerfile                            # Multi-stage Docker build
├── .gitignore
├── README.md
├── src/main/java/com/portfolio/
│   ├── ChatbotBackendApplication.java    # Main Spring Boot app
│   ├── controller/
│   │   └── ChatController.java           # REST endpoints
│   ├── service/
│   │   ├── ChatService.java              # Gemini integration
│   │   ├── LogService.java               # MongoDB logging
│   │   └── SessionManager.java           # Session & rate limiting
│   ├── model/
│   │   ├── ChatRequest.java
│   │   ├── ChatResponse.java
│   │   ├── RequestLog.java               # MongoDB document
│   │   ├── ErrorLog.java                 # MongoDB document
│   │   └── LogDetails.java
│   ├── repository/
│   │   ├── RequestLogRepository.java
│   │   └── ErrorLogRepository.java
│   ├── config/
│   │   ├── CorsConfig.java
│   │   └── KnowledgeBaseConfig.java      # Load knowledge.json
│   └── exception/
│       ├── GlobalExceptionHandler.java
│       ├── SessionLimitExceededException.java
│       └── InvalidMessageException.java
└── src/main/resources/
    ├── application.yml                   # Spring Boot configuration
    └── knowledge.json                    # Portfolio knowledge base
```

## Configuration (application.yml)

```yaml
spring:
  ai:
    google:
      genai:
        api-key: ${SPRING_AI_GOOGLE_GENAI_API_KEY}
  data:
    mongodb:
      uri: ${MONGODB_URI:mongodb://localhost:27017/portfolio-chatbot}

server:
  port: ${PORT:8080}
```

## Dependencies

- **Spring Boot 3.4.0**: Web framework
- **Spring Data MongoDB**: Database access
- **Spring AI (Google GenAI)**: Gemini API integration
- **Lombok**: Reduces boilerplate code
- **Jackson**: JSON processing

## Testing

### Test Chat Endpoint

```bash
curl -X POST http://localhost:8080/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Tell me about your experience",
    "sessionId": "test-session-1"
  }'
```

### Test Rate Limiting

Send 6 requests with the same `sessionId` - the 6th will return 429 status.

### Test Health Endpoint

```bash
curl http://localhost:8080/health
```

## Troubleshooting

**API Key Error**: Ensure `SPRING_AI_GOOGLE_GENAI_API_KEY` is set correctly.

```bash
export SPRING_AI_GOOGLE_GENAI_API_KEY=your_api_key
```

**MongoDB Connection**: If `MONGODB_URI` is not set, it defaults to `mongodb://localhost:27017`. Set it for cloud MongoDB:

```bash
export MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/portfolio-chatbot
```

**Port Already in Use**: Change the port using the `PORT` environment variable:

```bash
PORT=9090 java -jar build/libs/chatbot-backend-0.0.1-SNAPSHOT.jar
```

## License

MIT
