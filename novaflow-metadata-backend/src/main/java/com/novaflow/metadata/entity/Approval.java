package com.novaflow.metadata.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

@Entity
@Table(name = "approvals", schema = "metadata")
@Schema(description = "Approval entity for tracking approval workflows")
public class Approval {
    
    @Id
    @Schema(description = "Unique identifier for the approval", example = "APP001")
    private String id;
    
    @NotBlank
    @Column(name = "entity_id")
    @Schema(description = "ID of the entity requiring approval", example = "CONN001")
    private String entityId;
    
    @NotBlank
    @Column(name = "entity_type")
    @Schema(description = "Type of entity", example = "Connection")
    private String entityType;
    
    @NotBlank
    @Column(name = "entity_name")
    @Schema(description = "Name of the entity", example = "Production Database")
    private String entityName;
    
    @NotBlank
    @Column(name = "requested_by")
    @Schema(description = "User who requested approval", example = "user001")
    private String requestedBy;
    
    @Column(name = "requested_date")
    @Schema(description = "Request timestamp")
    private LocalDateTime requestedDate;
    
    @NotBlank
    @Column(name = "approval_type")
    @Schema(description = "Type of approval", example = "Peer Review")
    private String approvalType;
    
    @NotBlank
    @Schema(description = "Approval status", example = "Pending")
    private String status = "Pending";
    
    @Column(name = "approved_by")
    @Schema(description = "User who approved/rejected", example = "manager001")
    private String approvedBy;
    
    @Column(name = "approved_date")
    @Schema(description = "Approval/rejection timestamp")
    private LocalDateTime approvedDate;
    
    @Column(name = "rejection_reason")
    @Schema(description = "Reason for rejection", example = "Missing required fields")
    private String rejectionReason;
    
    @Schema(description = "Additional comments", example = "Please review connection parameters")
    private String comments;
    
    // Constructors
    public Approval() {}
    
    public Approval(String id, String entityId, String entityType, String entityName, String requestedBy, String approvalType) {
        this.id = id;
        this.entityId = entityId;
        this.entityType = entityType;
        this.entityName = entityName;
        this.requestedBy = requestedBy;
        this.approvalType = approvalType;
        this.requestedDate = LocalDateTime.now();
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getEntityId() { return entityId; }
    public void setEntityId(String entityId) { this.entityId = entityId; }
    
    public String getEntityType() { return entityType; }
    public void setEntityType(String entityType) { this.entityType = entityType; }
    
    public String getEntityName() { return entityName; }
    public void setEntityName(String entityName) { this.entityName = entityName; }
    
    public String getRequestedBy() { return requestedBy; }
    public void setRequestedBy(String requestedBy) { this.requestedBy = requestedBy; }
    
    public LocalDateTime getRequestedDate() { return requestedDate; }
    public void setRequestedDate(LocalDateTime requestedDate) { this.requestedDate = requestedDate; }
    
    public String getApprovalType() { return approvalType; }
    public void setApprovalType(String approvalType) { this.approvalType = approvalType; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getApprovedBy() { return approvedBy; }
    public void setApprovedBy(String approvedBy) { this.approvedBy = approvedBy; }
    
    public LocalDateTime getApprovedDate() { return approvedDate; }
    public void setApprovedDate(LocalDateTime approvedDate) { this.approvedDate = approvedDate; }
    
    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
    
    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }
    
    @PrePersist
    protected void onCreate() {
        requestedDate = LocalDateTime.now();
    }
}
