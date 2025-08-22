package com.novaflowusermanagement.controller;

import com.novaflowusermanagement.entity.Domain;
import com.novaflowusermanagement.service.DomainService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/domains")
@CrossOrigin(origins = "*")
@Tag(name = "Domain Management", description = "APIs for managing business domains")
public class DomainController {
    
    @Autowired
    private DomainService domainService;
    
    @GetMapping
    @Operation(summary = "Get all domains", description = "Retrieve all domains in the system")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved domains")
    public ResponseEntity<List<Domain>> getAllDomains() {
        List<Domain> domains = domainService.getAllDomains();
        return ResponseEntity.ok(domains);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get domain by ID", description = "Retrieve a specific domain by its ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Domain found"),
        @ApiResponse(responseCode = "404", description = "Domain not found")
    })
    public ResponseEntity<Domain> getDomainById(@Parameter(description = "Domain ID") @PathVariable String id) {
        Optional<Domain> domain = domainService.getDomainById(id);
        return domain.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/name/{name}")
    @Operation(summary = "Get domain by name", description = "Retrieve a domain by its name")
    public ResponseEntity<Domain> getDomainByName(@Parameter(description = "Domain name") @PathVariable String name) {
        Optional<Domain> domain = domainService.getDomainByName(name);
        return domain.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/code/{code}")
    @Operation(summary = "Get domain by code", description = "Retrieve a domain by its code")
    public ResponseEntity<Domain> getDomainByCode(@Parameter(description = "Domain code") @PathVariable String code) {
        Optional<Domain> domain = domainService.getDomainByCode(code);
        return domain.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/active")
    @Operation(summary = "Get active domains", description = "Retrieve all active domains")
    public ResponseEntity<List<Domain>> getActiveDomains() {
        List<Domain> domains = domainService.getActiveDomains();
        return ResponseEntity.ok(domains);
    }
    
    @GetMapping("/search")
    @Operation(summary = "Search domains", description = "Search domains by name, description, or code")
    public ResponseEntity<List<Domain>> searchDomains(@Parameter(description = "Search term") @RequestParam String term) {
        List<Domain> domains = domainService.searchDomains(term);
        return ResponseEntity.ok(domains);
    }
    
    @GetMapping("/{id}/user-count")
    @Operation(summary = "Get active user count", description = "Get the number of active users in a domain")
    public ResponseEntity<Long> getActiveUserCount(@Parameter(description = "Domain ID") @PathVariable String id) {
        Long count = domainService.getActiveUserCount(id);
        return ResponseEntity.ok(count);
    }
    
    @PostMapping
    @Operation(summary = "Create domain", description = "Create a new domain")
    @ApiResponse(responseCode = "201", description = "Domain created successfully")
    public ResponseEntity<Domain> createDomain(@Valid @RequestBody Domain domain) {
        try {
            Domain createdDomain = domainService.createDomain(domain);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdDomain);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update domain", description = "Update an existing domain")
    public ResponseEntity<Domain> updateDomain(@Parameter(description = "Domain ID") @PathVariable String id, @Valid @RequestBody Domain domainDetails) {
        Domain updatedDomain = domainService.updateDomain(id, domainDetails);
        if (updatedDomain != null) {
            return ResponseEntity.ok(updatedDomain);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/{id}/activate")
    @Operation(summary = "Activate domain", description = "Activate a domain")
    public ResponseEntity<Domain> activateDomain(@Parameter(description = "Domain ID") @PathVariable String id, @RequestParam String modifiedBy) {
        Domain domain = domainService.activateDomain(id, modifiedBy);
        if (domain != null) {
            return ResponseEntity.ok(domain);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/{id}/deactivate")
    @Operation(summary = "Deactivate domain", description = "Deactivate a domain")
    public ResponseEntity<Domain> deactivateDomain(@Parameter(description = "Domain ID") @PathVariable String id, @RequestParam String modifiedBy) {
        Domain domain = domainService.deactivateDomain(id, modifiedBy);
        if (domain != null) {
            return ResponseEntity.ok(domain);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete domain", description = "Delete a domain")
    @ApiResponse(responseCode = "204", description = "Domain deleted successfully")
    public ResponseEntity<Void> deleteDomain(@Parameter(description = "Domain ID") @PathVariable String id) {
        boolean deleted = domainService.deleteDomain(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
