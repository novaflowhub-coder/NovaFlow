package com.novaflow.metadata.controller;

import com.novaflow.metadata.entity.Approval;
import com.novaflow.metadata.service.ApprovalService;
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

// @RestController // DISABLED - Enable later
@RequestMapping("/api/approvals")
@Tag(name = "Approval Management", description = "APIs for managing approval workflows")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class ApprovalController {

    @Autowired
    private ApprovalService approvalService;

    @GetMapping
    @Operation(summary = "Get all approvals", description = "Retrieve all approval records")
    public ResponseEntity<List<Approval>> getAllApprovals() {
        List<Approval> approvals = approvalService.findAll();
        return ResponseEntity.ok(approvals);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get approval by ID", description = "Retrieve specific approval by its ID")
    public ResponseEntity<Approval> getApprovalById(@PathVariable String id) {
        Optional<Approval> approval = approvalService.findById(id);
        return approval.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/entity/{entityId}")
    @Operation(summary = "Get approvals by entity ID", description = "Retrieve approvals for a specific entity")
    public ResponseEntity<List<Approval>> getApprovalsByEntityId(@PathVariable String entityId) {
        List<Approval> approvals = approvalService.findByEntityId(entityId);
        return ResponseEntity.ok(approvals);
    }

    @GetMapping("/entity-type/{entityType}")
    @Operation(summary = "Get approvals by entity type", description = "Retrieve approvals by entity type")
    public ResponseEntity<List<Approval>> getApprovalsByEntityType(@PathVariable String entityType) {
        List<Approval> approvals = approvalService.findByEntityType(entityType);
        return ResponseEntity.ok(approvals);
    }

    @GetMapping("/requested-by/{requestedBy}")
    @Operation(summary = "Get approvals by requester", description = "Retrieve approvals by user who requested them")
    public ResponseEntity<List<Approval>> getApprovalsByRequestedBy(@PathVariable String requestedBy) {
        List<Approval> approvals = approvalService.findByRequestedBy(requestedBy);
        return ResponseEntity.ok(approvals);
    }

    @GetMapping("/approved-by/{approvedBy}")
    @Operation(summary = "Get approvals by approver", description = "Retrieve approvals by user who approved them")
    public ResponseEntity<List<Approval>> getApprovalsByApprovedBy(@PathVariable String approvedBy) {
        List<Approval> approvals = approvalService.findByApprovedBy(approvedBy);
        return ResponseEntity.ok(approvals);
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get approvals by status", description = "Retrieve approvals by status")
    public ResponseEntity<List<Approval>> getApprovalsByStatus(@PathVariable String status) {
        List<Approval> approvals = approvalService.findByStatus(status);
        return ResponseEntity.ok(approvals);
    }

    @GetMapping("/approval-type/{approvalType}")
    @Operation(summary = "Get approvals by type", description = "Retrieve approvals by approval type")
    public ResponseEntity<List<Approval>> getApprovalsByType(@PathVariable String approvalType) {
        List<Approval> approvals = approvalService.findByApprovalType(approvalType);
        return ResponseEntity.ok(approvals);
    }

    @GetMapping("/entity/{entityId}/entity-type/{entityType}")
    @Operation(summary = "Get approvals by entity ID and type", description = "Retrieve approvals for specific entity ID and type")
    public ResponseEntity<List<Approval>> getApprovalsByEntityIdAndType(
            @PathVariable String entityId, 
            @PathVariable String entityType) {
        List<Approval> approvals = approvalService.findByEntityIdAndEntityType(entityId, entityType);
        return ResponseEntity.ok(approvals);
    }

    @GetMapping("/date-range")
    @Operation(summary = "Get approvals by date range", description = "Retrieve approvals within a date range")
    public ResponseEntity<List<Approval>> getApprovalsByDateRange(
            @Parameter(description = "Start date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @Parameter(description = "End date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<Approval> approvals = approvalService.findByDateRange(startDate, endDate);
        return ResponseEntity.ok(approvals);
    }

    @PostMapping
    @Operation(summary = "Create approval", description = "Create new approval request")
    public ResponseEntity<Approval> createApproval(@Valid @RequestBody Approval approval) {
        Approval savedApproval = approvalService.save(approval);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedApproval);
    }

    @PostMapping("/request")
    @Operation(summary = "Create approval request", description = "Create approval request with basic information")
    public ResponseEntity<Approval> createApprovalRequest(
            @Parameter(description = "Entity ID") @RequestParam String entityId,
            @Parameter(description = "Entity type") @RequestParam String entityType,
            @Parameter(description = "Entity name") @RequestParam String entityName,
            @Parameter(description = "Requested by user") @RequestParam String requestedBy,
            @Parameter(description = "Approval type") @RequestParam String approvalType,
            @Parameter(description = "Comments") @RequestParam(required = false) String comments) {
        Approval approval = approvalService.createApprovalRequest(
            entityId, entityType, entityName, requestedBy, approvalType, comments);
        return ResponseEntity.status(HttpStatus.CREATED).body(approval);
    }

    @PutMapping("/{id}/approve")
    @Operation(summary = "Approve request", description = "Approve an approval request")
    public ResponseEntity<Approval> approveRequest(
            @PathVariable String id,
            @Parameter(description = "User approving") @RequestParam String approvedBy,
            @Parameter(description = "Comments") @RequestParam(required = false) String comments) {
        Approval approvedApproval = approvalService.approve(id, approvedBy, comments);
        return approvedApproval != null ? 
            ResponseEntity.ok(approvedApproval) : 
            ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/reject")
    @Operation(summary = "Reject request", description = "Reject an approval request")
    public ResponseEntity<Approval> rejectRequest(
            @PathVariable String id,
            @Parameter(description = "User rejecting") @RequestParam String approvedBy,
            @Parameter(description = "Rejection reason") @RequestParam String rejectionReason,
            @Parameter(description = "Comments") @RequestParam(required = false) String comments) {
        Approval rejectedApproval = approvalService.reject(id, approvedBy, rejectionReason, comments);
        return rejectedApproval != null ? 
            ResponseEntity.ok(rejectedApproval) : 
            ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete approval", description = "Delete approval record")
    public ResponseEntity<Void> deleteApproval(@PathVariable String id) {
        approvalService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/pending/count")
    @Operation(summary = "Count pending approvals", description = "Get count of pending approval requests")
    public ResponseEntity<Long> countPendingApprovals() {
        long count = approvalService.countPendingApprovals();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/approved-by/{approvedBy}/count")
    @Operation(summary = "Count approvals by approver", description = "Get count of approvals by specific approver")
    public ResponseEntity<Long> countApprovalsByApprover(@PathVariable String approvedBy) {
        long count = approvalService.countByApprovedBy(approvedBy);
        return ResponseEntity.ok(count);
    }
}
