package com.novaflow.metadata.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuditLogger {

    private static final Logger logger = LoggerFactory.getLogger(AuditLogger.class);
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Emit structured audit log events
     * Later this will publish to Kafka for centralized audit logging
     */
    public void emit(String eventType, String entityType, String entityId, String outcome, String details) {
        try {
            Map<String, Object> auditEvent = new HashMap<>();
            auditEvent.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            auditEvent.put("eventType", eventType);
            auditEvent.put("entityType", entityType);
            auditEvent.put("entityId", entityId);
            auditEvent.put("outcome", outcome);
            auditEvent.put("details", details);
            auditEvent.put("service", "novaflow-metadata-backend");

            String jsonLog = objectMapper.writeValueAsString(auditEvent);
            
            // Log as structured JSON
            if ("DENIED".equals(outcome) || "ERROR".equals(outcome)) {
                logger.warn("AUDIT: {}", jsonLog);
            } else {
                logger.info("AUDIT: {}", jsonLog);
            }
            
            // TODO: Later integrate with Kafka producer to publish audit events
            // kafkaTemplate.send("audit-events", jsonLog);
            
        } catch (Exception e) {
            logger.error("Failed to emit audit log", e);
        }
    }

    /**
     * Emit audit event for connection operations
     */
    public void emitConnectionOperation(String connectionKey, String operation, String performedBy, String outcome, String details) {
        emit("CONNECTION_OPERATION", "CONNECTION", connectionKey, outcome, 
            String.format("Operation %s performed by %s: %s", operation, performedBy, details));
    }
}
