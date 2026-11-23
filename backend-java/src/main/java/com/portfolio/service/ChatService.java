package com.portfolio.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.config.KnowledgeBaseConfig;
import com.portfolio.exception.InvalidMessageException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

@Service
public class ChatService {
    private static final Logger log = Logger.getLogger(ChatService.class.getName());

    private final SessionManager sessionManager;
    private final KnowledgeBaseConfig knowledgeBaseConfig;
    private final String apiKey;
    private final WebClient webClient;
    private final String SYSTEM_PROMPT;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ChatService(SessionManager sessionManager,
                       KnowledgeBaseConfig knowledgeBaseConfig,
                       @Value("${spring.ai.google.genai.api-key:}") String apiKey,
                       WebClient.Builder webClientBuilder) {
        this.sessionManager = sessionManager;
        this.knowledgeBaseConfig = knowledgeBaseConfig;
        this.apiKey = apiKey;
        this.webClient = webClientBuilder.baseUrl("https://generativelanguage.googleapis.com").build();
        this.SYSTEM_PROMPT = buildSystemPrompt();
    }

    private String buildSystemPrompt() {
        return """
You are a friendly and knowledgeable portfolio assistant for Krushnat Khawale, a skilled Java backend developer.

Your role is to help visitors learn about Krushnat's:
- Professional experience and work history
- Technical skills and expertise
- Projects and accomplishments
- Blog topics and interests
- Education and background

Guidelines:
1. Be professional but friendly in your tone
2. Ask clarifying questions if the user's query is unclear
3. Provide specific examples from the portfolio when appropriate
4. Suggest related topics that might interest them
5. Keep responses concise (2-3 sentences typically, max 5-6 sentences)
6. Always be accurate with dates, company names, and technical details
7. Add a touch of personality but avoid slang
8. Use proper line breaks and formatting for readability
9. If asked about something not in the portfolio, politely redirect
10. If user wants to end conversation, suggest reaching out via email.

You have access to the full portfolio knowledge. Answer based on it.""";
    }

    private void validateMessage(String message) {
        if (message == null || message.trim().isEmpty()) {
            throw new InvalidMessageException("Message cannot be empty");
        }
        if (message.length() > 500) {
            throw new InvalidMessageException("Message too long (max 500 characters)");
        }
    }

    private String getFullSystemInstruction() {
        try {
            Map<String, Object> knowledge = knowledgeBaseConfig.getKnowledgeBase();
            String knowledgeJson = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(knowledge);
            return SYSTEM_PROMPT + "\n\nHere is the complete knowledge base to answer from:\n" + knowledgeJson;
        } catch (Exception e) {
            log.severe("Failed to serialize knowledge base: " + e.getMessage());
            return SYSTEM_PROMPT;
        }
    }

    public String chat(String message, String sessionId) {
        validateMessage(message);

        try {
            if (apiKey == null || apiKey.trim().isEmpty()) {
                throw new RuntimeException("API configuration error. Please contact the site owner.");
            }

            List<Map<String, Object>> history = sessionManager.getHistory(sessionId);

            StringBuilder fullPrompt = new StringBuilder();
            
            if (history.isEmpty()) {
                fullPrompt.append(getFullSystemInstruction()).append("\n\n");
            }
            
            fullPrompt.append(message);

            Map<String, Object> requestBody = buildGeminiRequest(fullPrompt.toString());

            String response = webClient.post()
                    .uri("/v1beta/models/gemini-2.5-flash-lite:generateContent?key=" + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            String responseText = extractResponseText(response);

            sessionManager.addToHistory(sessionId, "user", message);
            sessionManager.addToHistory(sessionId, "model", responseText);

            log.info("Response sent to session " + sessionId);
            return responseText;

        } catch (Exception e) {
            log.severe("Gemini API Error: " + e.getMessage());
            
            if (e.getMessage() != null && (e.getMessage().contains("API key") || e.getMessage().contains("401") || e.getMessage().contains("authentication"))) {
                throw new RuntimeException("API configuration error. Please contact the site owner.");
            }

            throw new RuntimeException("Sorry, I encountered an error. Please try again later.");
        }
    }

    private Map<String, Object> buildGeminiRequest(String prompt) {
        Map<String, Object> request = new HashMap<>();
        
        List<Map<String, Object>> contents = new ArrayList<>();
        Map<String, Object> content = new HashMap<>();
        
        List<Map<String, Object>> parts = new ArrayList<>();
        Map<String, Object> part = new HashMap<>();
        part.put("text", prompt);
        parts.add(part);
        
        content.put("parts", parts);
        contents.add(content);
        
        request.put("contents", contents);
        
        Map<String, Object> generationConfig = new HashMap<>();
        generationConfig.put("temperature", 0.7);
        generationConfig.put("maxOutputTokens", 300);
        request.put("generationConfig", generationConfig);
        
        return request;
    }

    private String extractResponseText(Map<String, Object> response) {
        try {
            if (response == null) {
                throw new RuntimeException("Empty response from Gemini API");
            }

            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
            if (candidates == null || candidates.isEmpty()) {
                throw new RuntimeException("No candidates in response from Gemini API");
            }

            Map<String, Object> candidate = candidates.get(0);
            Map<String, Object> content = (Map<String, Object>) candidate.get("content");
            if (content == null) {
                throw new RuntimeException("No content in candidate from Gemini API");
            }

            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
            if (parts == null || parts.isEmpty()) {
                throw new RuntimeException("No parts in content from Gemini API");
            }

            Map<String, Object> textPart = parts.get(0);
            String text = (String) textPart.get("text");
            
            if (text == null || text.trim().isEmpty()) {
                throw new RuntimeException("No text in response from Gemini API");
            }

            return text;
        } catch (Exception e) {
            log.severe("Failed to extract response from Gemini: " + e.getMessage());
            throw new RuntimeException("Failed to parse Gemini response: " + e.getMessage());
        }
    }
}
