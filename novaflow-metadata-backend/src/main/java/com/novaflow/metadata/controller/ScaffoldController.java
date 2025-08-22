package com.novaflow.metadata.controller;

import com.novaflow.metadata.entity.Scaffold;
import com.novaflow.metadata.service.ScaffoldService;
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
@RequestMapping("/api/scaffolds")
@Tag(name = "Scaffold Management", description = "APIs for managing data transformation scaffolds")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class ScaffoldController {

    @Autowired
    private ScaffoldService scaffoldService;

    @GetMapping
    @Operation(summary = "Get all scaffolds", description = "Retrieve all scaffolds")
    public ResponseEntity<List<Scaffold>> getAllScaffolds() {
        List<Scaffold> scaffolds = scaffoldService.findAll();
        return ResponseEntity.ok(scaffolds);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get scaffold by ID", description = "Retrieve a specific scaffold by its ID")
    public ResponseEntity<Scaffold> getScaffoldById(@PathVariable String id) {
        Optional<Scaffold> scaffold = scaffoldService.findById(id);
        return scaffold.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/domain/{domainId}")
    @Operation(summary = "Get scaffolds by domain", description = "Retrieve all scaffolds for a specific domain")
    public ResponseEntity<List<Scaffold>> getScaffoldsByDomain(
            @Parameter(description = "Domain ID") @PathVariable String domainId,
            @Parameter(description = "Include only active scaffolds") @RequestParam(defaultValue = "false") boolean activeOnly) {
        List<Scaffold> scaffolds = activeOnly ? 
            scaffoldService.findActiveByDomainId(domainId) : 
            scaffoldService.findByDomainId(domainId);
        return ResponseEntity.ok(scaffolds);
    }

    @GetMapping("/source/{sourceObjectId}")
    @Operation(summary = "Get scaffolds by source object", description = "Retrieve scaffolds for a specific source object")
    public ResponseEntity<List<Scaffold>> getScaffoldsBySourceObject(@PathVariable String sourceObjectId) {
        List<Scaffold> scaffolds = scaffoldService.findBySourceObjectId(sourceObjectId);
        return ResponseEntity.ok(scaffolds);
    }

    @GetMapping("/target/{targetObjectId}")
    @Operation(summary = "Get scaffolds by target object", description = "Retrieve scaffolds for a specific target object")
    public ResponseEntity<List<Scaffold>> getScaffoldsByTargetObject(@PathVariable String targetObjectId) {
        List<Scaffold> scaffolds = scaffoldService.findByTargetObjectId(targetObjectId);
        return ResponseEntity.ok(scaffolds);
    }

    @GetMapping("/search")
    @Operation(summary = "Search scaffolds", description = "Search scaffolds by name within a domain")
    public ResponseEntity<List<Scaffold>> searchScaffolds(
            @Parameter(description = "Domain ID") @RequestParam String domainId,
            @Parameter(description = "Search term") @RequestParam String name) {
        List<Scaffold> scaffolds = scaffoldService.searchByName(domainId, name);
        return ResponseEntity.ok(scaffolds);
    }

    @PostMapping
    @Operation(summary = "Create scaffold", description = "Create a new scaffold")
    public ResponseEntity<Scaffold> createScaffold(@Valid @RequestBody Scaffold scaffold) {
        Scaffold savedScaffold = scaffoldService.save(scaffold);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedScaffold);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update scaffold", description = "Update an existing scaffold")
    public ResponseEntity<Scaffold> updateScaffold(@PathVariable String id, @Valid @RequestBody Scaffold scaffold) {
        Scaffold updatedScaffold = scaffoldService.update(id, scaffold);
        return updatedScaffold != null ? 
            ResponseEntity.ok(updatedScaffold) : 
            ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete scaffold", description = "Delete a scaffold")
    public ResponseEntity<Void> deleteScaffold(@PathVariable String id) {
        scaffoldService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/activate")
    @Operation(summary = "Activate scaffold", description = "Activate a scaffold")
    public ResponseEntity<Scaffold> activateScaffold(
            @PathVariable String id,
            @Parameter(description = "User making the change") @RequestParam String modifiedBy) {
        Scaffold activatedScaffold = scaffoldService.activate(id, modifiedBy);
        return activatedScaffold != null ? 
            ResponseEntity.ok(activatedScaffold) : 
            ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/deactivate")
    @Operation(summary = "Deactivate scaffold", description = "Deactivate a scaffold")
    public ResponseEntity<Scaffold> deactivateScaffold(
            @PathVariable String id,
            @Parameter(description = "User making the change") @RequestParam String modifiedBy) {
        Scaffold deactivatedScaffold = scaffoldService.deactivate(id, modifiedBy);
        return deactivatedScaffold != null ? 
            ResponseEntity.ok(deactivatedScaffold) : 
            ResponseEntity.notFound().build();
    }

    @GetMapping("/domain/{domainId}/count")
    @Operation(summary = "Count scaffolds by domain", description = "Get count of scaffolds for a domain")
    public ResponseEntity<Long> countScaffoldsByDomain(
            @PathVariable String domainId,
            @RequestParam(defaultValue = "false") boolean activeOnly) {
        long count = activeOnly ? 
            scaffoldService.countActiveByDomainId(domainId) : 
            scaffoldService.countByDomainId(domainId);
        return ResponseEntity.ok(count);
    }
}
