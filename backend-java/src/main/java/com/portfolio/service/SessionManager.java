package com.portfolio.service;

import com.portfolio.exception.SessionLimitExceededException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Logger;

@Service
public class SessionManager {
    private static final Logger log = Logger.getLogger(SessionManager.class.getName());

    public static class Session {
        private int count;
        private long resetTime;
        private List<Map<String, Object>> history;

        public Session(long resetTime) {
            this.count = 0;
            this.resetTime = resetTime;
            this.history = new ArrayList<>();
        }

        public int getCount() {
            return count;
        }

        public void setCount(int count) {
            this.count = count;
        }

        public long getResetTime() {
            return resetTime;
        }

        public void setResetTime(long resetTime) {
            this.resetTime = resetTime;
        }

        public List<Map<String, Object>> getHistory() {
            return history;
        }

        public void setHistory(List<Map<String, Object>> history) {
            this.history = history;
        }
    }

    private static final int MAX_REQUESTS_PER_24H = 5;
    private static final long WINDOW_DURATION_MS = 24 * 60 * 60 * 1000;

    private final Map<String, Session> sessions = new ConcurrentHashMap<>();

    public int validateAndIncrementSession(String sessionId) {
        if (sessionId == null || sessionId.trim().isEmpty()) {
            throw new IllegalArgumentException("Session ID is required");
        }

        long now = System.currentTimeMillis();

        Session session = sessions.computeIfAbsent(sessionId, key -> 
            new Session(now + WINDOW_DURATION_MS)
        );

        if (now > session.getResetTime()) {
            session.setCount(0);
            session.getHistory().clear();
            session.setResetTime(now + WINDOW_DURATION_MS);
        }

        if (session.getCount() >= MAX_REQUESTS_PER_24H) {
            throw new SessionLimitExceededException(
                "Question limit reached! You have " + MAX_REQUESTS_PER_24H + 
                " questions per 24 hours. Come back later!"
            );
        }

        session.setCount(session.getCount() + 1);
        return MAX_REQUESTS_PER_24H - session.getCount();
    }

    public Session getSession(String sessionId) {
        return sessions.getOrDefault(sessionId, null);
    }

    public void addToHistory(String sessionId, String role, String content) {
        Session session = sessions.get(sessionId);
        if (session != null) {
            Map<String, Object> message = new HashMap<>();
            message.put("role", role);
            Map<String, Object> parts = new HashMap<>();
            parts.put("text", content);
            message.put("parts", new Object[]{parts});
            session.getHistory().add(message);
        }
    }

    public List<Map<String, Object>> getHistory(String sessionId) {
        Session session = sessions.get(sessionId);
        return session != null ? session.getHistory() : new ArrayList<>();
    }
}
