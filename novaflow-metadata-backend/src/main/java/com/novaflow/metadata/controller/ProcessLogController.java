package com.novaflow.metadata.controller;

import com.novaflow.metadata.entity.ProcessLog;
import com.novaflow.metadata.service.ProcessLogService;
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
@RequestMapping("/api/process-logs")
@Tag(name = "Process Log Management", description = "APIs for managing process execution logs")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class ProcessLogController {

    @Autowired
    private ProcessLogService processLogService;

    @GetMapping
    @Operation(summary = "Get all process logs", description = "Retrieve all process logs")
    public ResponseEntity<List<ProcessLog>> getAllProcessLogs() {
        List<ProcessLog> processLogs = processLogService.findAll();
        return ResponseEntity.ok(processLogs);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get process log by ID", description = "Retrieve a specific process log by its ID")
    public ResponseEntity<ProcessLog> getProcessLogById(@PathVariable String id) {
        Optional<ProcessLog> processLog = processLogService.findById(id);
        return processLog.map(ResponseEntity::ok)
                        .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/run-control/{runControlId}")
    @Operation(summary = "Get process logs by run control", description = "Retrieve process logs for a specific run control")
    public ResponseEntity<List<ProcessLog>> getProcessLogsByRunControl(@PathVariable String runControlId) {
        List<ProcessLog> processLogs = processLogService.findByRunControlId(runControlId);
        return ResponseEntity.ok(processLogs);
    }

    @GetMapping("/run-control/{runControlId}/latest")
    @Operation(summary = "Get latest process log", description = "Retrieve the latest process log for a run control")
    public ResponseEntity<ProcessLog> getLatestProcessLog(@PathVariable String runControlId) {
        Optional<ProcessLog> processLog = processLogService.findLatestByRunControlId(runControlId);
        return processLog.map(ResponseEntity::ok)
                        .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get process logs by status", description = "Retrieve process logs by status")
    public ResponseEntity<List<ProcessLog>> getProcessLogsByStatus(@PathVariable String status) {
        List<ProcessLog> processLogs = processLogService.findByStatus(status);
        return ResponseEntity.ok(processLogs);
    }

    @GetMapping("/run-control/{runControlId}/status/{status}")
    @Operation(summary = "Get process logs by run control and status", description = "Retrieve process logs for a run control with specific status")
    public ResponseEntity<List<ProcessLog>> getProcessLogsByRunControlAndStatus(
            @PathVariable String runControlId, 
            @PathVariable String status) {
        List<ProcessLog> processLogs = processLogService.findByRunControlIdAndStatus(runControlId, status);
        return ResponseEntity.ok(processLogs);
    }

    @GetMapping("/date-range")
    @Operation(summary = "Get process logs by date range", description = "Retrieve process logs within a date range")
    public ResponseEntity<List<ProcessLog>> getProcessLogsByDateRange(
            @Parameter(description = "Start date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @Parameter(description = "End date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<ProcessLog> processLogs = processLogService.findByDateRange(startDate, endDate);
        return ResponseEntity.ok(processLogs);
    }

    @PostMapping
    @Operation(summary = "Create process log", description = "Create a new process log")
    public ResponseEntity<ProcessLog> createProcessLog(@Valid @RequestBody ProcessLog processLog) {
        ProcessLog savedProcessLog = processLogService.save(processLog);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedProcessLog);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update process log", description = "Update an existing process log")
    public ResponseEntity<ProcessLog> updateProcessLog(@PathVariable String id, @Valid @RequestBody ProcessLog processLog) {
        ProcessLog updatedProcessLog = processLogService.update(id, processLog);
        return updatedProcessLog != null ? 
            ResponseEntity.ok(updatedProcessLog) : 
            ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete process log", description = "Delete a process log")
    public ResponseEntity<Void> deleteProcessLog(@PathVariable String id) {
        processLogService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/run-control/{runControlId}/count")
    @Operation(summary = "Count process logs by run control", description = "Get count of process logs for a run control")
    public ResponseEntity<Long> countProcessLogsByRunControl(
            @PathVariable String runControlId,
            @RequestParam(required = false) String status) {
        long count = status != null ? 
            processLogService.countByRunControlIdAndStatus(runControlId, status) : 
            processLogService.countByRunControlId(runControlId);
        return ResponseEntity.ok(count);
    }
}
