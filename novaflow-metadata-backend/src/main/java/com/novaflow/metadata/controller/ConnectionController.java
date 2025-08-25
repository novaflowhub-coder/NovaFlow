package com.novaflow.metadata.controller;

import com.novaflow.metadata.dto.CreateConnectionRequest;
import com.novaflow.metadata.dto.UpdateConnectionRequest;
import com.novaflow.metadata.dto.ConnectionResponse;
import com.novaflow.metadata.service.ConnectionService;
import com.novaflow.metadata.service.AuthorizationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.validation.annotation.Validated;

import jakarta.validation.Valid;
import java.util.*;

@RestController
@RequestMapping("/api/connections")
@Validated
@Tag(name = "Connections", description = "Versioned connection management with domain-scoped access control")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class ConnectionController {

    @Autowired
    private ConnectionService connectionService;
    
    @Autowired
    private AuthorizationService authorizationService;

    @GetMapping
    @PreAuthorize("@authz.hasPermission(authentication, 'READ', '/connections')")
    @Operation(summary = "Get connections", description = "Retrieve connections by domain ID or all accessible connections")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved connections"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    public ResponseEntity<List<ConnectionResponse>> getConnections(
            @Parameter(description = "Domain ID filter (optional)") @RequestParam(required = false) String domain_id,
            Authentication authentication) {
        try {
            if (domain_id != null && !"all".equals(domain_id)) {
                List<ConnectionResponse> connections = connectionService.listCurrentConnectionsByDomain(domain_id, authentication);
                return ResponseEntity.ok(connections);
            } else {
                // Return all accessible connections across all domains
                List<ConnectionResponse> allConnections = new ArrayList<>();
                List<String> accessibleDomains = connectionService.getAccessibleDomains(authentication);
                for (String domainId : accessibleDomains) {
                    allConnections.addAll(connectionService.listCurrentConnectionsByDomain(domainId, authentication));
                }
                return ResponseEntity.ok(allConnections);
            }
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @GetMapping("/domains")
    @PreAuthorize("@authz.hasPermission(authentication, 'READ', '/connections')")
    @Operation(summary = "Get accessible domains", description = "Retrieve all domains accessible to the authenticated user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved accessible domains"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    public ResponseEntity<List<String>> getAccessibleDomains(Authentication authentication) {
        return ResponseEntity.ok(connectionService.getAccessibleDomains(authentication));
    }

    @GetMapping("/domain/{domainId}")
    @PreAuthorize("@authz.hasPermission(authentication, 'READ', '/connections')")
    @Operation(summary = "Get current connections by domain", description = "Retrieve all current connections for a specific domain")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Successfully retrieved connections"),
        @ApiResponse(responseCode = "403", description = "Access denied to domain")
    })
    public ResponseEntity<List<ConnectionResponse>> getCurrentConnectionsByDomain(
            @Parameter(description = "Domain ID") @PathVariable String domainId,
            Authentication authentication) {
        try {
            List<ConnectionResponse> connections = connectionService.listCurrentConnectionsByDomain(domainId, authentication);
            return ResponseEntity.ok(connections);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @GetMapping("/history/{connectionKey}")
    @PreAuthorize("@authz.hasPermission(authentication, 'READ', '/connections')")
    @Operation(summary = "Get connection history", description = "Retrieve all versions of a connection")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Successfully retrieved connection history"),
        @ApiResponse(responseCode = "404", description = "Connection not found"),
        @ApiResponse(responseCode = "403", description = "Access denied to connection domain")
    })
    public ResponseEntity<List<ConnectionResponse>> getConnectionHistory(
            @Parameter(description = "Connection Key") @PathVariable UUID connectionKey,
            Authentication authentication) {
        try {
            List<ConnectionResponse> history = connectionService.getConnectionHistory(connectionKey, authentication);
            return ResponseEntity.ok(history);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/domain/{domainId}/search")
    @PreAuthorize("@authz.hasPermission(authentication, 'READ', '/connections')")
    @Operation(summary = "Search connections by name", description = "Search current connections by name within a domain")
    public ResponseEntity<List<ConnectionResponse>> searchConnectionsByName(
            @Parameter(description = "Domain ID") @PathVariable String domainId,
            @Parameter(description = "Search term") @RequestParam String name,
            Authentication authentication) {
        try {
            List<ConnectionResponse> connections = connectionService.searchConnectionsByName(domainId, name, authentication);
            return ResponseEntity.ok(connections);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @PostMapping
    @PreAuthorize("@authz.hasPermission(authentication, 'CREATE', '/connections')")
    @Operation(summary = "Create connection", description = "Create a new connection (version 1)")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Connection created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid request or duplicate name"),
        @ApiResponse(responseCode = "403", description = "Access denied to domain")
    })
    public ResponseEntity<ConnectionResponse> createConnection(
            @Valid @RequestBody CreateConnectionRequest request,
            Authentication authentication) {
        try {
            String actor = authorizationService.getCurrentIdentity(authentication).email();
            ConnectionResponse created = connectionService.createConnection(request, actor, authentication);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PostMapping("/version")
    @PreAuthorize("@authz.hasPermission(authentication, 'UPDATE', '/connections')")
    @Operation(summary = "Create new connection version", description = "Create a new version of an existing connection")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "New version created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid request or duplicate name"),
        @ApiResponse(responseCode = "404", description = "Connection not found"),
        @ApiResponse(responseCode = "403", description = "Access denied to connection domain")
    })
    public ResponseEntity<ConnectionResponse> createNewVersion(
            @Valid @RequestBody UpdateConnectionRequest request,
            Authentication authentication) {
        try {
            String actor = authorizationService.getCurrentIdentity(authentication).email();
            ConnectionResponse created = connectionService.createNewVersion(request, actor, authentication);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/domain/{domainId}/count")
    @PreAuthorize("@authz.hasPermission(authentication, 'READ', '/connections')")
    @Operation(summary = "Get connection count by domain", description = "Get total number of current connections in a domain")
    public ResponseEntity<Long> getConnectionCountByDomain(
            @Parameter(description = "Domain ID") @PathVariable String domainId,
            Authentication authentication) {
        try {
            long count = connectionService.getConnectionCountByDomain(domainId, authentication);
            return ResponseEntity.ok(count);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @GetMapping("/domain/{domainId}/count/active")
    @PreAuthorize("@authz.hasPermission(authentication, 'READ', '/connections')")
    @Operation(summary = "Get active connection count by domain", description = "Get number of current active connections in a domain")
    public ResponseEntity<Long> getActiveConnectionCountByDomain(
            @Parameter(description = "Domain ID") @PathVariable String domainId,
            Authentication authentication) {
        try {
            long count = connectionService.getActiveConnectionCountByDomain(domainId, authentication);
            return ResponseEntity.ok(count);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    // Note: DELETE operations are not supported due to immutable versioning
    // Status changes should be done via creating new versions with different status
}
