package com.portfolio.service;

import com.portfolio.model.ErrorLog;
import com.portfolio.model.RequestLog;
import com.portfolio.repository.ErrorLogRepository;
import com.portfolio.repository.RequestLogRepository;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

@Service
public class LogService {
    private static final Logger log = Logger.getLogger(LogService.class.getName());

    private final RequestLogRepository requestLogRepository;
    private final ErrorLogRepository errorLogRepository;
    private final MongoTemplate mongoTemplate;

    public LogService(RequestLogRepository requestLogRepository,
                      ErrorLogRepository errorLogRepository,
                      MongoTemplate mongoTemplate) {
        this.requestLogRepository = requestLogRepository;
        this.errorLogRepository = errorLogRepository;
        this.mongoTemplate = mongoTemplate;
    }

    @Async
    public void createLog(Map<String, String> logData) {
        try {
            RequestLog log2 = new RequestLog();
            log2.setTimestamp(logData.get("timestamp"));
            log2.setMethod(logData.get("method"));
            log2.setPath(logData.get("path"));
            log2.setSessionId(logData.get("sessionId"));
            log2.setUser_prompt(logData.get("user_prompt"));

            requestLogRepository.save(log2);
            log.info("Request log saved successfully");
        } catch (Exception e) {
            log.warning("Failed to save request log to database: " + e.getMessage());
        }
    }

    @Async
    public void createErrorLog(Map<String, String> errorData) {
        try {
            ErrorLog errorLog = new ErrorLog();
            errorLog.setTimestamp(errorData.get("timestamp"));
            errorLog.setApiname(errorData.get("apiname"));
            errorLog.setWhere(errorData.get("where"));
            errorLog.setMessage(errorData.get("message"));
            errorLog.setStacktrace(errorData.get("stacktrace"));

            errorLogRepository.save(errorLog);
            log.info("Error log saved successfully");
        } catch (Exception e) {
            log.warning("Failed to save error log to database: " + e.getMessage());
        }
    }

    public List<ErrorLog> getAllErrorLogs() {
        try {
            return errorLogRepository.findAllByOrderByTimestampDesc();
        } catch (Exception e) {
            log.severe("Failed to retrieve error logs: " + e.getMessage());
            throw new RuntimeException("Failed to retrieve error logs", e);
        }
    }

    public List<RequestLog> getAllLogs() {
        try {
            return requestLogRepository.findAllByOrderByTimestampDesc();
        } catch (Exception e) {
            log.severe("Failed to retrieve request logs: " + e.getMessage());
            throw new RuntimeException("Failed to retrieve request logs", e);
        }
    }

    public RequestLog getLogById(String id) {
        try {
            return requestLogRepository.findById(id).orElse(null);
        } catch (Exception e) {
            log.severe("Failed to retrieve log by id: " + e.getMessage());
            throw new RuntimeException("Failed to retrieve log", e);
        }
    }

    public RequestLog updateLog(String id, Map<String, String> updateData) {
        try {
            RequestLog requestLog = requestLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Log not found with id: " + id));

            if (updateData.get("method") != null) requestLog.setMethod(updateData.get("method"));
            if (updateData.get("path") != null) requestLog.setPath(updateData.get("path"));
            if (updateData.get("user_prompt") != null) requestLog.setUser_prompt(updateData.get("user_prompt"));

            return requestLogRepository.save(requestLog);
        } catch (Exception e) {
            log.severe("Failed to update log: " + e.getMessage());
            throw new RuntimeException("Failed to update log", e);
        }
    }

    public void deleteLog(String id) {
        try {
            requestLogRepository.deleteById(id);
            log.info("Log deleted successfully");
        } catch (Exception e) {
            log.severe("Failed to delete log: " + e.getMessage());
            throw new RuntimeException("Failed to delete log", e);
        }
    }
}
