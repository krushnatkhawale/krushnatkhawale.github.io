package com.portfolio.model;

public class ChatResponse {
    private String response;
    private int remaining;

    public ChatResponse() {}

    public ChatResponse(String response, int remaining) {
        this.response = response;
        this.remaining = remaining;
    }

    public String getResponse() {
        return response;
    }

    public void setResponse(String response) {
        this.response = response;
    }

    public int getRemaining() {
        return remaining;
    }

    public void setRemaining(int remaining) {
        this.remaining = remaining;
    }
}
