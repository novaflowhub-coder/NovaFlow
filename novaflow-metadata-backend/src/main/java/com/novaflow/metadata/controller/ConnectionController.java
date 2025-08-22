package com.novaflow.metadata.controller;

import com.novaflow.metadata.entity.Connection;
import com.novaflow.metadata.entity.IntegrationObject;
import com.novaflow.metadata.service.ConnectionService;
import com.novaflow.metadata.service.IntegrationObjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/connections")
@Tag(name = "Connections", description = "Connection management APIs")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class ConnectionController {

    @Autowired
    private ConnectionService connectionService;
    
    @Autowired
    private IntegrationObjectService integrationObjectService;

    @GetMapping
    @Operation(summary = "Get all connections", description = "Retrieve all connections in the system")
    public ResponseEntity<List<Connection>> getAllConnections() {
        List<Connection> connections = connectionService.getAllConnections();
        return ResponseEntity.ok(connections);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get connection by ID", description = "Retrieve a specific connection by its ID")
    public ResponseEntity<Connection> getConnectionById(@PathVariable String id) {
        Optional<Connection> connection = connectionService.getConnectionById(id);
        return connection.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/integration-objects")
    @Operation(summary = "Get integration objects by connection", description = "Retrieve all integration objects for a specific connection")
    public ResponseEntity<List<IntegrationObject>> getIntegrationObjectsByConnection(@PathVariable String id) {
        List<IntegrationObject> objects = integrationObjectService.getIntegrationObjectsByConnection(id);
        return ResponseEntity.ok(objects);
    }

    @GetMapping("/domain/{domainId}")
    @Operation(summary = "Get connections by domain", description = "Retrieve all connections for a specific domain")
    public ResponseEntity<List<Connection>> getConnectionsByDomain(
            @Parameter(description = "Domain ID") @PathVariable String domainId) {
        List<Connection> connections = connectionService.getConnectionsByDomain(domainId);
        return ResponseEntity.ok(connections);
    }

    @GetMapping("/domain/{domainId}/active")
    @Operation(summary = "Get active connections by domain", description = "Retrieve all active connections for a specific domain")
    public ResponseEntity<List<Connection>> getActiveConnectionsByDomain(
            @Parameter(description = "Domain ID") @PathVariable String domainId) {
        List<Connection> connections = connectionService.getActiveConnectionsByDomain(domainId);
        return ResponseEntity.ok(connections);
    }

    @GetMapping("/type/{type}")
    @Operation(summary = "Get connections by type", description = "Retrieve all connections of a specific type")
    public ResponseEntity<List<Connection>> getConnectionsByType(
            @Parameter(description = "Connection type") @PathVariable String type) {
        List<Connection> connections = connectionService.getConnectionsByType(type);
        return ResponseEntity.ok(connections);
    }

    @GetMapping("/search")
    @Operation(summary = "Search connections by name", description = "Search connections by name within a domain")
    public ResponseEntity<List<Connection>> searchConnectionsByName(
            @Parameter(description = "Domain ID") @RequestParam String domainId,
            @Parameter(description = "Search term") @RequestParam String name) {
        List<Connection> connections = connectionService.searchConnectionsByName(domainId, name);
        return ResponseEntity.ok(connections);
    }

    @PostMapping
    @Operation(summary = "Create connection", description = "Create a new connection")
    public ResponseEntity<Connection> createConnection(@Valid @RequestBody Connection connection) {
        if (connectionService.existsByDomainAndName(connection.getDomainId(), connection.getName())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        Connection createdConnection = connectionService.createConnection(connection);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdConnection);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update connection", description = "Update an existing connection")
    public ResponseEntity<Connection> updateConnection(
            @Parameter(description = "Connection ID") @PathVariable String id,
            @Valid @RequestBody Connection connectionDetails) {
        try {
            Connection updatedConnection = connectionService.updateConnection(id, connectionDetails);
            return ResponseEntity.ok(updatedConnection);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete connection", description = "Delete a connection")
    public ResponseEntity<Void> deleteConnection(
            @Parameter(description = "Connection ID") @PathVariable String id) {
        try {
            connectionService.deleteConnection(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/activate")
    @Operation(summary = "Activate connection", description = "Activate a connection")
    public ResponseEntity<Void> activateConnection(
            @Parameter(description = "Connection ID") @PathVariable String id,
            @Parameter(description = "User making the change") @RequestParam String modifiedBy) {
        try {
            connectionService.activateConnection(id, modifiedBy);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/deactivate")
    @Operation(summary = "Deactivate connection", description = "Deactivate a connection")
    public ResponseEntity<Void> deactivateConnection(
            @Parameter(description = "Connection ID") @PathVariable String id,
            @Parameter(description = "User making the change") @RequestParam String modifiedBy) {
        try {
            connectionService.deactivateConnection(id, modifiedBy);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/domain/{domainId}/count")
    @Operation(summary = "Get connection count by domain", description = "Get total number of connections in a domain")
    public ResponseEntity<Long> getConnectionCountByDomain(
            @Parameter(description = "Domain ID") @PathVariable String domainId) {
        long count = connectionService.getConnectionCountByDomain(domainId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/domain/{domainId}/count/active")
    @Operation(summary = "Get active connection count by domain", description = "Get number of active connections in a domain")
    public ResponseEntity<Long> getActiveConnectionCountByDomain(
            @Parameter(description = "Domain ID") @PathVariable String domainId) {
        long count = connectionService.getActiveConnectionCountByDomain(domainId);
        return ResponseEntity.ok(count);
    }
}
