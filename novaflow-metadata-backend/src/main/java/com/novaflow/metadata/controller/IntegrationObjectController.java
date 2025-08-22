package com.novaflow.metadata.controller;

import com.novaflow.metadata.entity.IntegrationObject;
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

@RestController
@RequestMapping("/api/integration-objects")
@Tag(name = "Integration Objects", description = "Integration object management APIs")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class IntegrationObjectController {

    @Autowired
    private IntegrationObjectService integrationObjectService;

    @GetMapping
    @Operation(summary = "Get all integration objects", description = "Retrieve all integration objects in the system")
    public ResponseEntity<List<IntegrationObject>> getAllIntegrationObjects() {
        List<IntegrationObject> objects = integrationObjectService.getAllIntegrationObjects();
        return ResponseEntity.ok(objects);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get integration object by ID", description = "Retrieve a specific integration object by its ID")
    public ResponseEntity<IntegrationObject> getIntegrationObjectById(
            @Parameter(description = "Integration object ID") @PathVariable String id) {
        return integrationObjectService.getIntegrationObjectById(id)
                .map(object -> ResponseEntity.ok(object))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/domain/{domainId}")
    @Operation(summary = "Get integration objects by domain", description = "Retrieve all integration objects for a specific domain")
    public ResponseEntity<List<IntegrationObject>> getIntegrationObjectsByDomain(
            @Parameter(description = "Domain ID") @PathVariable String domainId) {
        List<IntegrationObject> objects = integrationObjectService.getIntegrationObjectsByDomain(domainId);
        return ResponseEntity.ok(objects);
    }

    @GetMapping("/domain/{domainId}/active")
    @Operation(summary = "Get active integration objects by domain", description = "Retrieve all active integration objects for a specific domain")
    public ResponseEntity<List<IntegrationObject>> getActiveIntegrationObjectsByDomain(
            @Parameter(description = "Domain ID") @PathVariable String domainId) {
        List<IntegrationObject> objects = integrationObjectService.getActiveIntegrationObjectsByDomain(domainId);
        return ResponseEntity.ok(objects);
    }

    @GetMapping("/type/{type}")
    @Operation(summary = "Get integration objects by type", description = "Retrieve all integration objects of a specific type")
    public ResponseEntity<List<IntegrationObject>> getIntegrationObjectsByType(
            @Parameter(description = "Object type") @PathVariable String type) {
        List<IntegrationObject> objects = integrationObjectService.getIntegrationObjectsByType(type);
        return ResponseEntity.ok(objects);
    }

    @GetMapping("/connection/{connectionId}")
    @Operation(summary = "Get integration objects by connection", description = "Retrieve all integration objects for a specific connection")
    public ResponseEntity<List<IntegrationObject>> getIntegrationObjectsByConnection(
            @Parameter(description = "Connection ID") @PathVariable String connectionId) {
        List<IntegrationObject> objects = integrationObjectService.getIntegrationObjectsByConnection(connectionId);
        return ResponseEntity.ok(objects);
    }

    @GetMapping("/search")
    @Operation(summary = "Search integration objects by name", description = "Search integration objects by name within a domain")
    public ResponseEntity<List<IntegrationObject>> searchIntegrationObjectsByName(
            @Parameter(description = "Domain ID") @RequestParam String domainId,
            @Parameter(description = "Search term") @RequestParam String name) {
        List<IntegrationObject> objects = integrationObjectService.searchIntegrationObjectsByName(domainId, name);
        return ResponseEntity.ok(objects);
    }

    @PostMapping
    @Operation(summary = "Create integration object", description = "Create a new integration object")
    public ResponseEntity<IntegrationObject> createIntegrationObject(@Valid @RequestBody IntegrationObject integrationObject) {
        if (integrationObjectService.existsByDomainAndName(integrationObject.getDomainId(), integrationObject.getName())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        IntegrationObject createdObject = integrationObjectService.createIntegrationObject(integrationObject);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdObject);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update integration object", description = "Update an existing integration object")
    public ResponseEntity<IntegrationObject> updateIntegrationObject(
            @Parameter(description = "Integration object ID") @PathVariable String id,
            @Valid @RequestBody IntegrationObject objectDetails) {
        try {
            IntegrationObject updatedObject = integrationObjectService.updateIntegrationObject(id, objectDetails);
            return ResponseEntity.ok(updatedObject);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete integration object", description = "Delete an integration object")
    public ResponseEntity<Void> deleteIntegrationObject(
            @Parameter(description = "Integration object ID") @PathVariable String id) {
        try {
            integrationObjectService.deleteIntegrationObject(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/activate")
    @Operation(summary = "Activate integration object", description = "Activate an integration object")
    public ResponseEntity<Void> activateIntegrationObject(
            @Parameter(description = "Integration object ID") @PathVariable String id,
            @Parameter(description = "User making the change") @RequestParam String modifiedBy) {
        try {
            integrationObjectService.activateIntegrationObject(id, modifiedBy);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/deactivate")
    @Operation(summary = "Deactivate integration object", description = "Deactivate an integration object")
    public ResponseEntity<Void> deactivateIntegrationObject(
            @Parameter(description = "Integration object ID") @PathVariable String id,
            @Parameter(description = "User making the change") @RequestParam String modifiedBy) {
        try {
            integrationObjectService.deactivateIntegrationObject(id, modifiedBy);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/domain/{domainId}/count")
    @Operation(summary = "Get integration object count by domain", description = "Get total number of integration objects in a domain")
    public ResponseEntity<Long> getIntegrationObjectCountByDomain(
            @Parameter(description = "Domain ID") @PathVariable String domainId) {
        long count = integrationObjectService.getIntegrationObjectCountByDomain(domainId);
        return ResponseEntity.ok(count);
    }
}
