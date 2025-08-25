package com.novaflow.metadata.service;

import com.novaflow.metadata.dto.CreateConnectionRequest;
import com.novaflow.metadata.dto.UpdateConnectionRequest;
import com.novaflow.metadata.dto.ConnectionResponse;
import com.novaflow.metadata.entity.Connection;
import com.novaflow.metadata.repository.ConnectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.Authentication;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class ConnectionService {

    @Autowired
    private ConnectionRepository connectionRepository;
    
    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * List current connections by domain (domain-scoped access)
     */
    public List<ConnectionResponse> listCurrentConnectionsByDomain(String domainId, Authentication authentication) {
        validateDomainAccess(domainId, authentication);
        
        List<Connection> connections = connectionRepository.findCurrentConnectionsByDomain(domainId);
        return connections.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get connection history for a specific connection key
     */
    public List<ConnectionResponse> getConnectionHistory(UUID connectionKey, Authentication authentication) {
        // First verify user has access to the domain this connection belongs to
        Optional<Connection> currentConnection = connectionRepository.findCurrentConnectionByKey(connectionKey);
        if (currentConnection.isEmpty()) {
            throw new RuntimeException("Connection not found with key: " + connectionKey);
        }
        
        validateDomainAccess(currentConnection.get().getDomainId(), authentication);
        
        List<Connection> history = connectionRepository.findConnectionHistory(connectionKey);
        return history.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Create a new connection (version 1)
     */
    public ConnectionResponse createConnection(CreateConnectionRequest request, String actor, Authentication authentication) {
        validateDomainAccess(request.getDomainId(), authentication);
        
        // Check for duplicate name within domain+type for current connections
        Optional<Connection> existing = connectionRepository.findCurrentConnectionByDomainTypeAndName(
            request.getDomainId(), request.getTypeCode(), request.getName());
        if (existing.isPresent()) {
            throw new IllegalArgumentException(
                String.format("Connection with name '%s' already exists for type '%s' in domain '%s'", 
                    request.getName(), request.getTypeCode(), request.getDomainId()));
        }

        // Use the database function to create version 1
        UUID newId = callCreateConnectionVersionFunction(
            null, // NULL for new connection
            request.getDomainId(),
            request.getName(),
            request.getTypeCode(),
            request.getDescription(),
            request.getParameters(),
            actor,
            request.getStatus(),
            "UNKNOWN",
            null,
            null
        );

        // Fetch and return the created connection
        Connection created = connectionRepository.findById(newId)
            .orElseThrow(() -> new RuntimeException("Failed to retrieve created connection"));
        
        return mapToResponse(created);
    }

    /**
     * Create a new version of an existing connection
     */
    public ConnectionResponse createNewVersion(UpdateConnectionRequest request, String actor, Authentication authentication) {
        // Verify the connection exists and user has access
        Optional<Connection> currentConnection = connectionRepository.findCurrentConnectionByKey(request.getConnectionKey());
        if (currentConnection.isEmpty()) {
            throw new RuntimeException("Connection not found with key: " + request.getConnectionKey());
        }
        
        validateDomainAccess(currentConnection.get().getDomainId(), authentication);
        
        // Check for duplicate name within domain+type (excluding current connection)
        Optional<Connection> existing = connectionRepository.findCurrentConnectionByDomainTypeAndName(
            request.getDomainId(), request.getTypeCode(), request.getName());
        if (existing.isPresent() && !existing.get().getConnectionKey().equals(request.getConnectionKey())) {
            throw new IllegalArgumentException(
                String.format("Connection with name '%s' already exists for type '%s' in domain '%s'", 
                    request.getName(), request.getTypeCode(), request.getDomainId()));
        }

        // Use the database function to create new version
        UUID newId = callCreateConnectionVersionFunction(
            request.getConnectionKey(), // Existing connection key
            request.getDomainId(),
            request.getName(),
            request.getTypeCode(),
            request.getDescription(),
            request.getParameters(),
            actor,
            request.getStatus(),
            "UNKNOWN",
            null,
            null
        );

        // Fetch and return the created version
        Connection created = connectionRepository.findById(newId)
            .orElseThrow(() -> new RuntimeException("Failed to retrieve created connection version"));
        
        return mapToResponse(created);
    }

    /**
     * Get current connections count by domain
     */
    public long getConnectionCountByDomain(String domainId, Authentication authentication) {
        validateDomainAccess(domainId, authentication);
        return connectionRepository.countCurrentConnectionsByDomain(domainId);
    }

    /**
     * Get current active connections count by domain
     */
    public long getActiveConnectionCountByDomain(String domainId, Authentication authentication) {
        validateDomainAccess(domainId, authentication);
        return connectionRepository.countCurrentActiveConnectionsByDomain(domainId);
    }

    /**
     * Search connections by name within domain
     */
    public List<ConnectionResponse> searchConnectionsByName(String domainId, String name, Authentication authentication) {
        validateDomainAccess(domainId, authentication);
        
        List<Connection> connections = connectionRepository.searchCurrentConnectionsByName(domainId, name);
        return connections.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get domains accessible by user
     */
    public List<String> getAccessibleDomains(Authentication authentication) {
        String userEmail = extractUserEmail(authentication);
        return connectionRepository.findAccessibleDomainsByUser(userEmail);
    }

    // Private helper methods

    private UUID callCreateConnectionVersionFunction(UUID connectionKey, String domainId, String name, 
            String typeCode, String description, Map<String, Object> parameters, String createdBy,
            String status, String lastTestStatus, String lastTestError, Object lastTestedDate) {
        
        String sql = """
            SELECT metadata.create_connection_version(?, ?, ?, ?, ?, ?::jsonb, ?, ?::metadata.connection_status, 
                                                     ?::metadata.test_result_status, ?, ?::timestamptz)
            """;
        
        return jdbcTemplate.queryForObject(sql, UUID.class,
            connectionKey, domainId, name, typeCode, description, 
            parameters != null ? objectToJson(parameters) : "{}",
            createdBy, status, lastTestStatus, lastTestError, lastTestedDate);
    }

    private void validateDomainAccess(String domainId, Authentication authentication) {
        String userEmail = extractUserEmail(authentication);
        List<String> accessibleDomains = connectionRepository.findAccessibleDomainsByUser(userEmail);
        
        if (!accessibleDomains.contains(domainId)) {
            throw new SecurityException("Access denied to domain: " + domainId);
        }
    }

    private String extractUserEmail(Authentication authentication) {
        // This should match the pattern used in AuthorizationService
        if (authentication != null && authentication.getName() != null) {
            return authentication.getName();
        }
        throw new SecurityException("Unable to extract user email from authentication");
    }

    private ConnectionResponse mapToResponse(Connection connection) {
        ConnectionResponse response = new ConnectionResponse();
        response.setId(connection.getId());
        response.setConnectionKey(connection.getConnectionKey());
        response.setDomainId(connection.getDomainId());
        response.setName(connection.getName());
        response.setTypeCode(connection.getTypeCode());
        response.setDescription(connection.getDescription());
        response.setParameters(connection.getParameters());
        response.setStatus(connection.getStatus().name());
        response.setVersionNo(connection.getVersionNo());
        response.setIsCurrent(connection.getIsCurrent());
        response.setLastTestedDate(connection.getLastTestedDate());
        response.setLastTestStatus(connection.getLastTestStatus().name());
        response.setLastTestError(connection.getLastTestError());
        response.setCreatedBy(connection.getCreatedBy());
        response.setCreatedDate(connection.getCreatedDate());
        response.setLastModifiedBy(connection.getLastModifiedBy());
        response.setLastModifiedDate(connection.getLastModifiedDate());
        return response;
    }

    private String objectToJson(Map<String, Object> obj) {
        try {
            // Simple JSON conversion - in production you'd use Jackson ObjectMapper
            StringBuilder json = new StringBuilder("{");
            boolean first = true;
            for (Map.Entry<String, Object> entry : obj.entrySet()) {
                if (!first) json.append(",");
                json.append("\"").append(entry.getKey()).append("\":");
                if (entry.getValue() instanceof String) {
                    json.append("\"").append(entry.getValue()).append("\"");
                } else {
                    json.append(entry.getValue());
                }
                first = false;
            }
            json.append("}");
            return json.toString();
        } catch (Exception e) {
            return "{}";
        }
    }
}
