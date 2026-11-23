package com.portfolio.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "request_logs")
public class RequestLog {
    @Id
    private String id;
    private String timestamp;
    private String method;
    private String path;
    private String sessionId;
    private String user_prompt;

    public RequestLog() {}

    public RequestLog(String timestamp, String method, String path, String sessionId, String user_prompt) {
        this.timestamp = timestamp;
        this.method = method;
        this.path = path;
        this.sessionId = sessionId;
        this.user_prompt = user_prompt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getUser_prompt() {
        return user_prompt;
    }

    public void setUser_prompt(String user_prompt) {
        this.user_prompt = user_prompt;
    }
}
