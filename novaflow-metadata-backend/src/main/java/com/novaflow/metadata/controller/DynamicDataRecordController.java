package com.novaflow.metadata.controller;

import com.novaflow.metadata.entity.DynamicDataRecord;
import com.novaflow.metadata.service.DynamicDataRecordService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/dynamic-data-records")
@Tag(name = "Dynamic Data Record Management", description = "APIs for managing dynamic data records")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class DynamicDataRecordController {

    @Autowired
    private DynamicDataRecordService dynamicDataRecordService;

    @GetMapping
    @Operation(summary = "Get all dynamic data records", description = "Retrieve all dynamic data records")
    public ResponseEntity<List<DynamicDataRecord>> getAllDynamicDataRecords() {
        List<DynamicDataRecord> records = dynamicDataRecordService.findAll();
        return ResponseEntity.ok(records);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get dynamic data record by ID", description = "Retrieve specific dynamic data record by its ID")
    public ResponseEntity<DynamicDataRecord> getDynamicDataRecordById(@PathVariable String id) {
        Optional<DynamicDataRecord> record = dynamicDataRecordService.findById(id);
        return record.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/domain/{domainId}")
    @Operation(summary = "Get dynamic data records by domain", description = "Retrieve all dynamic data records for a specific domain")
    public ResponseEntity<List<DynamicDataRecord>> getDynamicDataRecordsByDomain(
            @Parameter(description = "Domain ID") @PathVariable String domainId,
            @Parameter(description = "Include only active records") @RequestParam(defaultValue = "false") boolean activeOnly) {
        List<DynamicDataRecord> records = activeOnly ? 
            dynamicDataRecordService.findActiveByDomainId(domainId) : 
            dynamicDataRecordService.findByDomainId(domainId);
        return ResponseEntity.ok(records);
    }

    @GetMapping("/entity-type/{entityType}")
    @Operation(summary = "Get dynamic data records by entity type", description = "Retrieve dynamic data records by entity type")
    public ResponseEntity<List<DynamicDataRecord>> getDynamicDataRecordsByEntityType(@PathVariable String entityType) {
        List<DynamicDataRecord> records = dynamicDataRecordService.findByEntityType(entityType);
        return ResponseEntity.ok(records);
    }

    @GetMapping("/approval-status/{approvalStatus}")
    @Operation(summary = "Get dynamic data records by approval status", description = "Retrieve dynamic data records by approval status")
    public ResponseEntity<List<DynamicDataRecord>> getDynamicDataRecordsByApprovalStatus(@PathVariable String approvalStatus) {
        List<DynamicDataRecord> records = dynamicDataRecordService.findByApprovalStatus(approvalStatus);
        return ResponseEntity.ok(records);
    }

    @GetMapping("/domain/{domainId}/entity-type/{entityType}")
    @Operation(summary = "Get dynamic data records by domain and entity type", description = "Retrieve dynamic data records for a domain and entity type")
    public ResponseEntity<List<DynamicDataRecord>> getDynamicDataRecordsByDomainAndEntityType(
            @PathVariable String domainId, 
            @PathVariable String entityType) {
        List<DynamicDataRecord> records = dynamicDataRecordService.findByDomainIdAndEntityType(domainId, entityType);
        return ResponseEntity.ok(records);
    }

    @PostMapping
    @Operation(summary = "Create dynamic data record", description = "Create new dynamic data record")
    public ResponseEntity<DynamicDataRecord> createDynamicDataRecord(@Valid @RequestBody DynamicDataRecord record) {
        DynamicDataRecord savedRecord = dynamicDataRecordService.save(record);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedRecord);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update dynamic data record", description = "Update existing dynamic data record")
    public ResponseEntity<DynamicDataRecord> updateDynamicDataRecord(@PathVariable String id, @Valid @RequestBody DynamicDataRecord record) {
        DynamicDataRecord updatedRecord = dynamicDataRecordService.update(id, record);
        return updatedRecord != null ? 
            ResponseEntity.ok(updatedRecord) : 
            ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete dynamic data record", description = "Delete dynamic data record")
    public ResponseEntity<Void> deleteDynamicDataRecord(@PathVariable String id) {
        dynamicDataRecordService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/activate")
    @Operation(summary = "Activate dynamic data record", description = "Activate dynamic data record")
    public ResponseEntity<DynamicDataRecord> activateDynamicDataRecord(
            @PathVariable String id,
            @Parameter(description = "User making the change") @RequestParam String modifiedBy) {
        DynamicDataRecord activatedRecord = dynamicDataRecordService.activate(id, modifiedBy);
        return activatedRecord != null ? 
            ResponseEntity.ok(activatedRecord) : 
            ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/deactivate")
    @Operation(summary = "Deactivate dynamic data record", description = "Deactivate dynamic data record")
    public ResponseEntity<DynamicDataRecord> deactivateDynamicDataRecord(
            @PathVariable String id,
            @Parameter(description = "User making the change") @RequestParam String modifiedBy) {
        DynamicDataRecord deactivatedRecord = dynamicDataRecordService.deactivate(id, modifiedBy);
        return deactivatedRecord != null ? 
            ResponseEntity.ok(deactivatedRecord) : 
            ResponseEntity.notFound().build();
    }

    @GetMapping("/domain/{domainId}/count")
    @Operation(summary = "Count dynamic data records by domain", description = "Get count of dynamic data records for a domain")
    public ResponseEntity<Long> countDynamicDataRecordsByDomain(
            @PathVariable String domainId,
            @RequestParam(defaultValue = "false") boolean activeOnly) {
        long count = activeOnly ? 
            dynamicDataRecordService.countActiveByDomainId(domainId) : 
            dynamicDataRecordService.countByDomainId(domainId);
        return ResponseEntity.ok(count);
    }
}
