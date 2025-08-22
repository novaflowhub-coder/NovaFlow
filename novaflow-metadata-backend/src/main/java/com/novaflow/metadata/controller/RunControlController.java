package com.novaflow.metadata.controller;

import com.novaflow.metadata.entity.RunControl;
import com.novaflow.metadata.service.RunControlService;
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
@RequestMapping("/api/run-controls")
@Tag(name = "Run Control Management", description = "APIs for managing process execution controls")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class RunControlController {

    @Autowired
    private RunControlService runControlService;

    @GetMapping
    @Operation(summary = "Get all run controls", description = "Retrieve all run controls")
    public ResponseEntity<List<RunControl>> getAllRunControls() {
        List<RunControl> runControls = runControlService.getAllRunControls();
        return ResponseEntity.ok(runControls);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get run control by ID", description = "Retrieve a specific run control by its ID")
    public ResponseEntity<RunControl> getRunControlById(@PathVariable String id) {
        Optional<RunControl> runControl = runControlService.findById(id);
        return runControl.map(ResponseEntity::ok)
                        .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/domain/{domainId}")
    @Operation(summary = "Get run controls by domain", description = "Retrieve all run controls for a specific domain")
    public ResponseEntity<List<RunControl>> getRunControlsByDomain(
            @Parameter(description = "Domain ID") @PathVariable String domainId,
            @Parameter(description = "Include only active run controls") @RequestParam(defaultValue = "false") boolean activeOnly) {
        List<RunControl> runControls = activeOnly ? 
            runControlService.findActiveByDomainId(domainId) : 
            runControlService.findByDomainId(domainId);
        return ResponseEntity.ok(runControls);
    }

    @GetMapping("/execution-mode/{executionMode}")
    @Operation(summary = "Get run controls by execution mode", description = "Retrieve run controls by execution mode")
    public ResponseEntity<List<RunControl>> getRunControlsByExecutionMode(@PathVariable String executionMode) {
        List<RunControl> runControls = runControlService.findByExecutionMode(executionMode);
        return ResponseEntity.ok(runControls);
    }

    @GetMapping("/holiday-calendar/{holidayCalendarId}")
    @Operation(summary = "Get run controls by holiday calendar", description = "Retrieve run controls using a specific holiday calendar")
    public ResponseEntity<List<RunControl>> getRunControlsByHolidayCalendar(@PathVariable String holidayCalendarId) {
        List<RunControl> runControls = runControlService.findByHolidayCalendarId(holidayCalendarId);
        return ResponseEntity.ok(runControls);
    }

    @GetMapping("/search")
    @Operation(summary = "Search run controls", description = "Search run controls by name within a domain")
    public ResponseEntity<List<RunControl>> searchRunControls(
            @Parameter(description = "Domain ID") @RequestParam String domainId,
            @Parameter(description = "Search term") @RequestParam String name) {
        List<RunControl> runControls = runControlService.searchByName(domainId, name);
        return ResponseEntity.ok(runControls);
    }

    @PostMapping
    @Operation(summary = "Create run control", description = "Create a new run control")
    public ResponseEntity<RunControl> createRunControl(@Valid @RequestBody RunControl runControl) {
        RunControl savedRunControl = runControlService.save(runControl);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedRunControl);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update run control", description = "Update an existing run control")
    public ResponseEntity<RunControl> updateRunControl(@PathVariable String id, @Valid @RequestBody RunControl runControl) {
        RunControl updatedRunControl = runControlService.update(id, runControl);
        return updatedRunControl != null ? 
            ResponseEntity.ok(updatedRunControl) : 
            ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete run control", description = "Delete a run control")
    public ResponseEntity<Void> deleteRunControl(@PathVariable String id) {
        runControlService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/activate")
    @Operation(summary = "Activate run control", description = "Activate a run control")
    public ResponseEntity<RunControl> activateRunControl(
            @PathVariable String id,
            @Parameter(description = "User making the change") @RequestParam String modifiedBy) {
        RunControl activatedRunControl = runControlService.activate(id, modifiedBy);
        return activatedRunControl != null ? 
            ResponseEntity.ok(activatedRunControl) : 
            ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/deactivate")
    @Operation(summary = "Deactivate run control", description = "Deactivate a run control")
    public ResponseEntity<RunControl> deactivateRunControl(
            @PathVariable String id,
            @Parameter(description = "User making the change") @RequestParam String modifiedBy) {
        RunControl deactivatedRunControl = runControlService.deactivate(id, modifiedBy);
        return deactivatedRunControl != null ? 
            ResponseEntity.ok(deactivatedRunControl) : 
            ResponseEntity.notFound().build();
    }

    @GetMapping("/domain/{domainId}/count")
    @Operation(summary = "Count run controls by domain", description = "Get count of run controls for a domain")
    public ResponseEntity<Long> countRunControlsByDomain(
            @PathVariable String domainId,
            @RequestParam(defaultValue = "false") boolean activeOnly) {
        long count = activeOnly ? 
            runControlService.countActiveByDomainId(domainId) : 
            runControlService.countByDomainId(domainId);
        return ResponseEntity.ok(count);
    }
}
