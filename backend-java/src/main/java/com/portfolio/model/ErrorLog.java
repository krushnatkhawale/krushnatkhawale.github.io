package com.portfolio.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "error_logs")
public class ErrorLog {
    @Id
    private String id;
    private String timestamp;
    private String apiname;
    private String where;
    private String message;
    private String stacktrace;

    public ErrorLog() {}

    public ErrorLog(String timestamp, String apiname, String where, String message, String stacktrace) {
        this.timestamp = timestamp;
        this.apiname = apiname;
        this.where = where;
        this.message = message;
        this.stacktrace = stacktrace;
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

    public String getApiname() {
        return apiname;
    }

    public void setApiname(String apiname) {
        this.apiname = apiname;
    }

    public String getWhere() {
        return where;
    }

    public void setWhere(String where) {
        this.where = where;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getStacktrace() {
        return stacktrace;
    }

    public void setStacktrace(String stacktrace) {
        this.stacktrace = stacktrace;
    }
}
