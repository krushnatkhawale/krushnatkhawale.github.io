package com.portfolio.repository;

import com.portfolio.model.RequestLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequestLogRepository extends MongoRepository<RequestLog, String> {
    List<RequestLog> findAllByOrderByTimestampDesc();
    List<RequestLog> findBySessionId(String sessionId);
}
