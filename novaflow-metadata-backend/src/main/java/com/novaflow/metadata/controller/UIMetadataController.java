package com.novaflow.metadata.controller;

import com.novaflow.metadata.entity.UIMetadata;
import com.novaflow.metadata.service.UIMetadataService;
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
@RequestMapping("/api/ui-metadata")
@Tag(name = "UI Metadata Management", description = "APIs for managing user interface metadata")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class UIMetadataController {

    @Autowired
    private UIMetadataService uiMetadataService;

    @GetMapping
    @Operation(summary = "Get all UI metadata", description = "Retrieve all UI metadata")
    public ResponseEntity<List<UIMetadata>> getAllUIMetadata() {
        List<UIMetadata> uiMetadataList = uiMetadataService.findAll();
        return ResponseEntity.ok(uiMetadataList);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get UI metadata by ID", description = "Retrieve specific UI metadata by its ID")
    public ResponseEntity<UIMetadata> getUIMetadataById(@PathVariable String id) {
        Optional<UIMetadata> uiMetadata = uiMetadataService.findById(id);
        return uiMetadata.map(ResponseEntity::ok)
                        .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/domain/{domainId}")
    @Operation(summary = "Get UI metadata by domain", description = "Retrieve all UI metadata for a specific domain")
    public ResponseEntity<List<UIMetadata>> getUIMetadataByDomain(
            @Parameter(description = "Domain ID") @PathVariable String domainId,
            @Parameter(description = "Include only active UI metadata") @RequestParam(defaultValue = "false") boolean activeOnly) {
        List<UIMetadata> uiMetadataList = activeOnly ? 
            uiMetadataService.findActiveByDomainId(domainId) : 
            uiMetadataService.findByDomainId(domainId);
        return ResponseEntity.ok(uiMetadataList);
    }

    @GetMapping("/source-object/{sourceObjectId}")
    @Operation(summary = "Get UI metadata by source object", description = "Retrieve UI metadata for a specific source object")
    public ResponseEntity<List<UIMetadata>> getUIMetadataBySourceObject(@PathVariable String sourceObjectId) {
        List<UIMetadata> uiMetadataList = uiMetadataService.findBySourceObjectId(sourceObjectId);
        return ResponseEntity.ok(uiMetadataList);
    }

    @GetMapping("/search")
    @Operation(summary = "Search UI metadata", description = "Search UI metadata by name within a domain")
    public ResponseEntity<List<UIMetadata>> searchUIMetadata(
            @Parameter(description = "Domain ID") @RequestParam String domainId,
            @Parameter(description = "Search term") @RequestParam String name) {
        List<UIMetadata> uiMetadataList = uiMetadataService.searchByName(domainId, name);
        return ResponseEntity.ok(uiMetadataList);
    }

    @PostMapping
    @Operation(summary = "Create UI metadata", description = "Create new UI metadata")
    public ResponseEntity<UIMetadata> createUIMetadata(@Valid @RequestBody UIMetadata uiMetadata) {
        UIMetadata savedUIMetadata = uiMetadataService.save(uiMetadata);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUIMetadata);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update UI metadata", description = "Update existing UI metadata")
    public ResponseEntity<UIMetadata> updateUIMetadata(@PathVariable String id, @Valid @RequestBody UIMetadata uiMetadata) {
        UIMetadata updatedUIMetadata = uiMetadataService.update(id, uiMetadata);
        return updatedUIMetadata != null ? 
            ResponseEntity.ok(updatedUIMetadata) : 
            ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete UI metadata", description = "Delete UI metadata")
    public ResponseEntity<Void> deleteUIMetadata(@PathVariable String id) {
        uiMetadataService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/activate")
    @Operation(summary = "Activate UI metadata", description = "Activate UI metadata")
    public ResponseEntity<UIMetadata> activateUIMetadata(
            @PathVariable String id,
            @Parameter(description = "User making the change") @RequestParam String modifiedBy) {
        UIMetadata activatedUIMetadata = uiMetadataService.activate(id, modifiedBy);
        return activatedUIMetadata != null ? 
            ResponseEntity.ok(activatedUIMetadata) : 
            ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/deactivate")
    @Operation(summary = "Deactivate UI metadata", description = "Deactivate UI metadata")
    public ResponseEntity<UIMetadata> deactivateUIMetadata(
            @PathVariable String id,
            @Parameter(description = "User making the change") @RequestParam String modifiedBy) {
        UIMetadata deactivatedUIMetadata = uiMetadataService.deactivate(id, modifiedBy);
        return deactivatedUIMetadata != null ? 
            ResponseEntity.ok(deactivatedUIMetadata) : 
            ResponseEntity.notFound().build();
    }

    @GetMapping("/domain/{domainId}/count")
    @Operation(summary = "Count UI metadata by domain", description = "Get count of UI metadata for a domain")
    public ResponseEntity<Long> countUIMetadataByDomain(
            @PathVariable String domainId,
            @RequestParam(defaultValue = "false") boolean activeOnly) {
        long count = activeOnly ? 
            uiMetadataService.countActiveByDomainId(domainId) : 
            uiMetadataService.countByDomainId(domainId);
        return ResponseEntity.ok(count);
    }
}
