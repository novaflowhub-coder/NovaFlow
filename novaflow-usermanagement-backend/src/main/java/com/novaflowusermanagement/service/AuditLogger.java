package com.novaflowusermanagement.service;

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
            auditEvent.put("service", "novaflow-user-management");

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
     * Emit audit event for role binding changes
     */
    public void emitRoleBindingChange(String userId, String domainId, String roleId, String action, String performedBy) {
        String entityId = String.format("%s:%s:%s", userId, domainId, roleId);
        String details = String.format("User %s %s role %s in domain %s by %s", 
            userId, action, roleId, domainId, performedBy);
        emit("ROLE_BINDING_CHANGE", "USER_DOMAIN_ROLE", entityId, "SUCCESS", details);
    }

    /**
     * Emit audit event for permission grants/revokes
     */
    public void emitPermissionChange(String roleName, String pageId, String permissionTypeId, 
                                   boolean isGranted, String performedBy) {
        String entityId = String.format("%s:%s:%s", roleName, pageId, permissionTypeId);
        String action = isGranted ? "GRANTED" : "REVOKED";
        String details = String.format("Permission %s %s for role %s on page %s by %s", 
            permissionTypeId, action, roleName, pageId, performedBy);
        emit("PERMISSION_CHANGE", "ROLE_PAGE_PERMISSION", entityId, "SUCCESS", details);
    }
}
