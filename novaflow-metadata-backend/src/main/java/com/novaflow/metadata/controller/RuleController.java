package com.novaflow.metadata.controller;

import com.novaflow.metadata.entity.Rule;
import com.novaflow.metadata.service.RuleService;
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
@RequestMapping("/api/rules")
@Tag(name = "Rules", description = "Rule management APIs")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class RuleController {

    @Autowired
    private RuleService ruleService;

    @GetMapping
    @Operation(summary = "Get all rules", description = "Retrieve all rules in the system")
    public ResponseEntity<List<Rule>> getAllRules() {
        List<Rule> rules = ruleService.getAllRules();
        return ResponseEntity.ok(rules);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get rule by ID", description = "Retrieve a specific rule by its ID")
    public ResponseEntity<Rule> getRuleById(
            @Parameter(description = "Rule ID") @PathVariable String id) {
        return ruleService.getRuleById(id)
                .map(rule -> ResponseEntity.ok(rule))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/domain/{domainId}")
    @Operation(summary = "Get rules by domain", description = "Retrieve all rules for a specific domain")
    public ResponseEntity<List<Rule>> getRulesByDomain(
            @Parameter(description = "Domain ID") @PathVariable String domainId) {
        List<Rule> rules = ruleService.getRulesByDomain(domainId);
        return ResponseEntity.ok(rules);
    }

    @GetMapping("/domain/{domainId}/active")
    @Operation(summary = "Get active rules by domain", description = "Retrieve all active rules for a specific domain")
    public ResponseEntity<List<Rule>> getActiveRulesByDomain(
            @Parameter(description = "Domain ID") @PathVariable String domainId) {
        List<Rule> rules = ruleService.getActiveRulesByDomain(domainId);
        return ResponseEntity.ok(rules);
    }

    @GetMapping("/type/{ruleType}")
    @Operation(summary = "Get rules by type", description = "Retrieve all rules of a specific type")
    public ResponseEntity<List<Rule>> getRulesByType(
            @Parameter(description = "Rule type") @PathVariable String ruleType) {
        List<Rule> rules = ruleService.getRulesByType(ruleType);
        return ResponseEntity.ok(rules);
    }

    @GetMapping("/source-object/{sourceObjectId}")
    @Operation(summary = "Get rules by source object", description = "Retrieve all rules for a specific source object")
    public ResponseEntity<List<Rule>> getRulesBySourceObject(
            @Parameter(description = "Source object ID") @PathVariable String sourceObjectId) {
        List<Rule> rules = ruleService.getRulesBySourceObject(sourceObjectId);
        return ResponseEntity.ok(rules);
    }

    @GetMapping("/target-object/{targetObjectId}")
    @Operation(summary = "Get rules by target object", description = "Retrieve all rules for a specific target object")
    public ResponseEntity<List<Rule>> getRulesByTargetObject(
            @Parameter(description = "Target object ID") @PathVariable String targetObjectId) {
        List<Rule> rules = ruleService.getRulesByTargetObject(targetObjectId);
        return ResponseEntity.ok(rules);
    }

    @GetMapping("/active")
    @Operation(summary = "Get all active rules", description = "Retrieve all currently active rules")
    public ResponseEntity<List<Rule>> getActiveRules() {
        List<Rule> rules = ruleService.getActiveRules();
        return ResponseEntity.ok(rules);
    }

    @GetMapping("/search")
    @Operation(summary = "Search rules by name", description = "Search rules by name within a domain")
    public ResponseEntity<List<Rule>> searchRulesByName(
            @Parameter(description = "Domain ID") @RequestParam String domainId,
            @Parameter(description = "Search term") @RequestParam String name) {
        List<Rule> rules = ruleService.searchRulesByName(domainId, name);
        return ResponseEntity.ok(rules);
    }

    @PostMapping
    @Operation(summary = "Create rule", description = "Create a new rule")
    public ResponseEntity<Rule> createRule(@Valid @RequestBody Rule rule) {
        if (ruleService.existsByDomainAndName(rule.getDomainId(), rule.getName())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        Rule createdRule = ruleService.createRule(rule);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdRule);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update rule", description = "Update an existing rule")
    public ResponseEntity<Rule> updateRule(
            @Parameter(description = "Rule ID") @PathVariable String id,
            @Valid @RequestBody Rule ruleDetails) {
        try {
            Rule updatedRule = ruleService.updateRule(id, ruleDetails);
            return ResponseEntity.ok(updatedRule);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete rule", description = "Delete a rule")
    public ResponseEntity<Void> deleteRule(
            @Parameter(description = "Rule ID") @PathVariable String id) {
        try {
            ruleService.deleteRule(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/activate")
    @Operation(summary = "Activate rule", description = "Activate a rule")
    public ResponseEntity<Void> activateRule(
            @Parameter(description = "Rule ID") @PathVariable String id,
            @Parameter(description = "User making the change") @RequestParam String modifiedBy) {
        try {
            ruleService.activateRule(id, modifiedBy);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/deactivate")
    @Operation(summary = "Deactivate rule", description = "Deactivate a rule")
    public ResponseEntity<Void> deactivateRule(
            @Parameter(description = "Rule ID") @PathVariable String id,
            @Parameter(description = "User making the change") @RequestParam String modifiedBy) {
        try {
            ruleService.deactivateRule(id, modifiedBy);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/domain/{domainId}/count")
    @Operation(summary = "Get rule count by domain", description = "Get total number of rules in a domain")
    public ResponseEntity<Long> getRuleCountByDomain(
            @Parameter(description = "Domain ID") @PathVariable String domainId) {
        long count = ruleService.getRuleCountByDomain(domainId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/domain/{domainId}/count/active")
    @Operation(summary = "Get active rule count by domain", description = "Get number of active rules in a domain")
    public ResponseEntity<Long> getActiveRuleCountByDomain(
            @Parameter(description = "Domain ID") @PathVariable String domainId) {
        long count = ruleService.getActiveRuleCountByDomain(domainId);
        return ResponseEntity.ok(count);
    }
}
