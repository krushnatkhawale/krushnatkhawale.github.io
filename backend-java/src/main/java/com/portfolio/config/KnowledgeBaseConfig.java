package com.portfolio.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Map;
import java.util.logging.Logger;

@Component
public class KnowledgeBaseConfig {
    private static final Logger log = Logger.getLogger(KnowledgeBaseConfig.class.getName());
    private static final ObjectMapper objectMapper = new ObjectMapper();

    private Map<String, Object> knowledgeBase;

    public KnowledgeBaseConfig() {
        loadKnowledgeBase();
    }

    private void loadKnowledgeBase() {
        try {
            ClassPathResource resource = new ClassPathResource("knowledge.json");
            String content = Files.readString(Paths.get(resource.getURI()));
            this.knowledgeBase = objectMapper.readValue(content, Map.class);
            log.info("Knowledge base loaded successfully");
        } catch (IOException e) {
            log.warning("Failed to load knowledge base from classpath: " + e.getMessage());
            this.knowledgeBase = Map.of();
        }
    }

    public Map<String, Object> getKnowledgeBase() {
        return knowledgeBase;
    }
}
