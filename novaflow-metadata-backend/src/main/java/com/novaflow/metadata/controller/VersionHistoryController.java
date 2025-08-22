package com.novaflow.metadata.controller;

import com.novaflow.metadata.entity.VersionHistory;
import com.novaflow.metadata.service.VersionHistoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/version-history")
@Tag(name = "Version History Management", description = "APIs for managing entity version history")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class VersionHistoryController {

    @Autowired
    private VersionHistoryService versionHistoryService;

    @GetMapping
    @Operation(summary = "Get all version history", description = "Retrieve all version history records")
    public ResponseEntity<List<VersionHistory>> getAllVersionHistory() {
        List<VersionHistory> versionHistoryList = versionHistoryService.findAll();
        return ResponseEntity.ok(versionHistoryList);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get version history by ID", description = "Retrieve specific version history by its ID")
    public ResponseEntity<VersionHistory> getVersionHistoryById(@PathVariable String id) {
        Optional<VersionHistory> versionHistory = versionHistoryService.findById(id);
        return versionHistory.map(ResponseEntity::ok)
                           .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/entity/{entityId}")
    @Operation(summary = "Get version history by entity ID", description = "Retrieve version history for a specific entity")
    public ResponseEntity<List<VersionHistory>> getVersionHistoryByEntityId(@PathVariable String entityId) {
        List<VersionHistory> versionHistoryList = versionHistoryService.findByEntityId(entityId);
        return ResponseEntity.ok(versionHistoryList);
    }

    @GetMapping("/entity-type/{entityType}")
    @Operation(summary = "Get version history by entity type", description = "Retrieve version history by entity type")
    public ResponseEntity<List<VersionHistory>> getVersionHistoryByEntityType(@PathVariable String entityType) {
        List<VersionHistory> versionHistoryList = versionHistoryService.findByEntityType(entityType);
        return ResponseEntity.ok(versionHistoryList);
    }

    @GetMapping("/changed-by/{changedBy}")
    @Operation(summary = "Get version history by changed by user", description = "Retrieve version history by user who made changes")
    public ResponseEntity<List<VersionHistory>> getVersionHistoryByChangedBy(@PathVariable String changedBy) {
        List<VersionHistory> versionHistoryList = versionHistoryService.findByChangedBy(changedBy);
        return ResponseEntity.ok(versionHistoryList);
    }

    @GetMapping("/change-type/{changeType}")
    @Operation(summary = "Get version history by change type", description = "Retrieve version history by change type")
    public ResponseEntity<List<VersionHistory>> getVersionHistoryByChangeType(@PathVariable String changeType) {
        List<VersionHistory> versionHistoryList = versionHistoryService.findByChangeType(changeType);
        return ResponseEntity.ok(versionHistoryList);
    }

    @GetMapping("/entity/{entityId}/entity-type/{entityType}")
    @Operation(summary = "Get version history by entity ID and type", description = "Retrieve version history for specific entity ID and type")
    public ResponseEntity<List<VersionHistory>> getVersionHistoryByEntityIdAndType(
            @PathVariable String entityId, 
            @PathVariable String entityType) {
        List<VersionHistory> versionHistoryList = versionHistoryService.findByEntityIdAndEntityType(entityId, entityType);
        return ResponseEntity.ok(versionHistoryList);
    }

    @GetMapping("/date-range")
    @Operation(summary = "Get version history by date range", description = "Retrieve version history within a date range")
    public ResponseEntity<List<VersionHistory>> getVersionHistoryByDateRange(
            @Parameter(description = "Start date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @Parameter(description = "End date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<VersionHistory> versionHistoryList = versionHistoryService.findByDateRange(startDate, endDate);
        return ResponseEntity.ok(versionHistoryList);
    }

    @PostMapping
    @Operation(summary = "Create version history", description = "Create new version history record")
    public ResponseEntity<VersionHistory> createVersionHistory(@Valid @RequestBody VersionHistory versionHistory) {
        VersionHistory savedVersionHistory = versionHistoryService.save(versionHistory);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedVersionHistory);
    }

    @PostMapping("/create")
    @Operation(summary = "Create version history record", description = "Create version history with basic information")
    public ResponseEntity<VersionHistory> createVersionHistoryRecord(
            @Parameter(description = "Entity ID") @RequestParam String entityId,
            @Parameter(description = "Entity type") @RequestParam String entityType,
            @Parameter(description = "Entity name") @RequestParam String entityName,
            @Parameter(description = "Change type") @RequestParam String changeType,
            @Parameter(description = "Changed by user") @RequestParam String changedBy,
            @Parameter(description = "Change description") @RequestParam(required = false) String changeDescription) {
        VersionHistory versionHistory = versionHistoryService.createVersionHistory(
            entityId, entityType, entityName, changeType, changedBy, changeDescription);
        return ResponseEntity.status(HttpStatus.CREATED).body(versionHistory);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete version history", description = "Delete version history record")
    public ResponseEntity<Void> deleteVersionHistory(@PathVariable String id) {
        versionHistoryService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/entity/{entityId}/count")
    @Operation(summary = "Count version history by entity", description = "Get count of version history records for an entity")
    public ResponseEntity<Long> countVersionHistoryByEntity(@PathVariable String entityId) {
        long count = versionHistoryService.countByEntityId(entityId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/entity/{entityId}/next-version")
    @Operation(summary = "Get next version number", description = "Get the next version number for an entity")
    public ResponseEntity<Integer> getNextVersionNumber(@PathVariable String entityId) {
        Integer nextVersion = versionHistoryService.getNextVersionNumber(entityId);
        return ResponseEntity.ok(nextVersion);
    }
}
