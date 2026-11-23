package com.portfolio.controller;

import com.portfolio.exception.SessionLimitExceededException;
import com.portfolio.model.ChatRequest;
import com.portfolio.model.ChatResponse;
import com.portfolio.model.ErrorLog;
import com.portfolio.model.LogDetails;
import com.portfolio.model.RequestLog;
import com.portfolio.service.ChatService;
import com.portfolio.service.LogService;
import com.portfolio.service.SessionManager;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api")
public class ChatController {
    private static final Logger log = Logger.getLogger(ChatController.class.getName());

    private final ChatService chatService;
    private final SessionManager sessionManager;
    private final LogService logService;

    public ChatController(ChatService chatService,
                         SessionManager sessionManager,
                         LogService logService) {
        this.chatService = chatService;
        this.sessionManager = sessionManager;
        this.logService = logService;
    }

    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request) {
        try {
            if (request.getSessionId() == null || request.getSessionId().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(new ChatResponse("Session ID is required", 0));
            }

            String timestamp = Instant.now().toString();
            LogDetails logDetails = new LogDetails(
                    timestamp,
                    "POST",
                    "/api/chat",
                    request.getSessionId(),
                    request.getMessage() != null ? request.getMessage() : "empty-user-prompt"
            );
            
            log.info("Incoming Request: " + logDetails.getSessionId());
            
            if (!logDetails.getUser_prompt().equals("empty-user-prompt")) {
                logService.createLog(convertLogDetailsToMap(logDetails));
            }

            int remaining = sessionManager.validateAndIncrementSession(request.getSessionId());

            String responseText = chatService.chat(request.getMessage(), request.getSessionId());

            ChatResponse response = new ChatResponse(responseText, remaining);
            return ResponseEntity.ok(response);

        } catch (SessionLimitExceededException e) {
            log.warning("Session limit exceeded for request");
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(new ChatResponse(e.getMessage(), 0));
        } catch (Exception e) {
            log.severe("Error in chat endpoint: " + e.getMessage());
            
            Map<String, String> errorData = new HashMap<>();
            errorData.put("timestamp", Instant.now().toString());
            errorData.put("apiname", "backend");
            errorData.put("where", "/api/chat");
            errorData.put("message", e.getMessage());
            errorData.put("stacktrace", getStackTrace(e));
            logService.createErrorLog(errorData);

            if (e.getMessage() != null && e.getMessage().contains("API configuration")) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(new ChatResponse("API configuration error. Please contact the site owner.", 0));
            }

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ChatResponse("Sorry, I encountered an error. Please try again later.", 0));
        }
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "OK");
        response.put("message", "Chatbot backend is running");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/error-logs")
    public ResponseEntity<List<ErrorLog>> getErrorLogs() {
        try {
            List<ErrorLog> logs = logService.getAllErrorLogs();
            return ResponseEntity.ok(logs);
        } catch (Exception e) {
            log.severe("Failed to retrieve error logs: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/logs")
    public ResponseEntity<List<RequestLog>> getLogs() {
        try {
            List<RequestLog> logs = logService.getAllLogs();
            return ResponseEntity.ok(logs);
        } catch (Exception e) {
            log.severe("Failed to retrieve logs: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/logs/{id}")
    public ResponseEntity<RequestLog> getLogById(@PathVariable String id) {
        try {
            RequestLog requestLog = logService.getLogById(id);
            if (requestLog == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(requestLog);
        } catch (Exception e) {
            log.severe("Failed to retrieve log: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private Map<String, String> convertLogDetailsToMap(LogDetails logDetails) {
        Map<String, String> map = new HashMap<>();
        map.put("timestamp", logDetails.getTimestamp());
        map.put("method", logDetails.getMethod());
        map.put("path", logDetails.getPath());
        map.put("sessionId", logDetails.getSessionId());
        map.put("user_prompt", logDetails.getUser_prompt());
        return map;
    }

    private String getStackTrace(Exception e) {
        StringBuilder sb = new StringBuilder();
        for (StackTraceElement element : e.getStackTrace()) {
            sb.append(element.toString()).append("\n");
        }
        return sb.toString();
    }
}
