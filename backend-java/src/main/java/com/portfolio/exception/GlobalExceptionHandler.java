package com.portfolio.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

@ControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger log = Logger.getLogger(GlobalExceptionHandler.class.getName());

    @ExceptionHandler(SessionLimitExceededException.class)
    public ResponseEntity<Map<String, Object>> handleSessionLimitExceeded(
            SessionLimitExceededException ex,
            WebRequest request) {
        
        log.warning("Session limit exceeded: " + ex.getMessage());
        
        Map<String, Object> body = new HashMap<>();
        body.put("error", ex.getMessage());
        body.put("remaining", 0);
        body.put("timestamp", Instant.now().toString());

        return new ResponseEntity<>(body, HttpStatus.TOO_MANY_REQUESTS);
    }

    @ExceptionHandler(InvalidMessageException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidMessage(
            InvalidMessageException ex,
            WebRequest request) {
        
        log.warning("Invalid message: " + ex.getMessage());
        
        Map<String, Object> body = new HashMap<>();
        body.put("error", ex.getMessage());
        body.put("timestamp", Instant.now().toString());

        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgument(
            IllegalArgumentException ex,
            WebRequest request) {
        
        log.warning("Illegal argument: " + ex.getMessage());
        
        Map<String, Object> body = new HashMap<>();
        body.put("error", ex.getMessage());
        body.put("timestamp", Instant.now().toString());

        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneralException(
            Exception ex,
            WebRequest request) {
        
        log.severe("Unhandled exception: " + ex.getMessage());
        
        Map<String, Object> body = new HashMap<>();
        body.put("error", "Sorry, I encountered an error. Please try again later.");
        body.put("timestamp", Instant.now().toString());

        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
