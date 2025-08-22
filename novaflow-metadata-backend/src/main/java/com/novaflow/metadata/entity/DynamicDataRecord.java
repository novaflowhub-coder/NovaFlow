package com.novaflow.metadata.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import io.swagger.v3.oas.annotations.media.Schema;
import com.fasterxml.jackson.annotation.JsonBackReference;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "dynamic_data_records", schema = "metadata")
@Schema(description = "Dynamic data record entity for storing form data based on UI metadata")
public class DynamicDataRecord {
    
    @Id
    @Schema(description = "Unique identifier for the dynamic data record", example = "DDR001")
    private String id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ui_metadata_id")
    @JsonBackReference("uimetadata-dynamicdata")
    @Schema(description = "UI metadata this record belongs to")
    private UIMetadata uiMetadata;
    
    @NotBlank
    @Column(name = "domain_id")
    @Schema(description = "Domain identifier", example = "DOMAIN001")
    private String domainId;
    
    @NotBlank
    @Column(name = "entity_type")
    @Schema(description = "Type of entity", example = "Connection")
    private String entityType;
    
    @NotNull
    @JdbcTypeCode(SqlTypes.JSON)
    @Schema(description = "Dynamic field data as JSON")
    private Map<String, Object> data;
    
    @Column(name = "approval_status")
    @Schema(description = "Approval status", example = "Pending")
    private String approvalStatus = "Draft";
    
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "approval_workflow")
    @Schema(description = "Approval workflow configuration as JSON")
    private Map<String, Object> approvalWorkflow;
    
    @Schema(description = "Version number", example = "1")
    private Integer version;
    
    @NotNull
    @Schema(description = "Record status", example = "A")
    private Character status = 'I';
    
    @NotBlank
    @Column(name = "created_by")
    @Schema(description = "User who created the record", example = "user001")
    private String createdBy;
    
    @Column(name = "created_date")
    @Schema(description = "Creation timestamp")
    private LocalDateTime createdDate;
    
    @Column(name = "peer_reviewed_by")
    @Schema(description = "User who peer reviewed")
    private String peerReviewedBy;
    
    @Column(name = "peer_reviewed_date")
    @Schema(description = "Peer review timestamp")
    private LocalDateTime peerReviewedDate;
    
    @Column(name = "approved_by")
    @Schema(description = "User who approved")
    private String approvedBy;
    
    @Column(name = "approved_date")
    @Schema(description = "Approval timestamp")
    private LocalDateTime approvedDate;
    
    @Column(name = "last_modified_by")
    @Schema(description = "User who last modified the record")
    private String lastModifiedBy;
    
    @Column(name = "last_modified_date")
    @Schema(description = "Last modification timestamp")
    private LocalDateTime lastModifiedDate;
    
    // Constructors
    public DynamicDataRecord() {}
    
    public DynamicDataRecord(String id, UIMetadata uiMetadata, Map<String, Object> data, String createdBy) {
        this.id = id;
        this.uiMetadata = uiMetadata;
        this.data = data;
        this.createdBy = createdBy;
        this.createdDate = LocalDateTime.now();
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public UIMetadata getUiMetadata() { return uiMetadata; }
    public void setUiMetadata(UIMetadata uiMetadata) { this.uiMetadata = uiMetadata; }
    
    public String getDomainId() { return domainId; }
    public void setDomainId(String domainId) { this.domainId = domainId; }
    
    public String getEntityType() { return entityType; }
    public void setEntityType(String entityType) { this.entityType = entityType; }
    
    public Map<String, Object> getData() { return data; }
    public void setData(Map<String, Object> data) { this.data = data; }
    
    public String getApprovalStatus() { return approvalStatus; }
    public void setApprovalStatus(String approvalStatus) { this.approvalStatus = approvalStatus; }
    
    public Map<String, Object> getApprovalWorkflow() { return approvalWorkflow; }
    public void setApprovalWorkflow(Map<String, Object> approvalWorkflow) { this.approvalWorkflow = approvalWorkflow; }
    
    public Integer getVersion() { return version; }
    public void setVersion(Integer version) { this.version = version; }
    
    public Character getStatus() { return status; }
    public void setStatus(Character status) { this.status = status; }
    
    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
    
    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }
    
    public String getPeerReviewedBy() { return peerReviewedBy; }
    public void setPeerReviewedBy(String peerReviewedBy) { this.peerReviewedBy = peerReviewedBy; }
    
    public LocalDateTime getPeerReviewedDate() { return peerReviewedDate; }
    public void setPeerReviewedDate(LocalDateTime peerReviewedDate) { this.peerReviewedDate = peerReviewedDate; }
    
    public String getApprovedBy() { return approvedBy; }
    public void setApprovedBy(String approvedBy) { this.approvedBy = approvedBy; }
    
    public LocalDateTime getApprovedDate() { return approvedDate; }
    public void setApprovedDate(LocalDateTime approvedDate) { this.approvedDate = approvedDate; }
    
    public String getLastModifiedBy() { return lastModifiedBy; }
    public void setLastModifiedBy(String lastModifiedBy) { this.lastModifiedBy = lastModifiedBy; }
    
    public LocalDateTime getLastModifiedDate() { return lastModifiedDate; }
    public void setLastModifiedDate(LocalDateTime lastModifiedDate) { this.lastModifiedDate = lastModifiedDate; }
    
    @PrePersist
    protected void onCreate() {
        createdDate = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        lastModifiedDate = LocalDateTime.now();
    }
}
