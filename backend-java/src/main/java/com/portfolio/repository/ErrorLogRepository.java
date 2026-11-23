package com.portfolio.repository;

import com.portfolio.model.ErrorLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ErrorLogRepository extends MongoRepository<ErrorLog, String> {
    List<ErrorLog> findAllByOrderByTimestampDesc();
}
