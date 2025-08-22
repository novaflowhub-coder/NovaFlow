package com.novaflow.metadata.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import io.swagger.v3.oas.annotations.media.Schema;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonRawValue;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "ui_metadata", schema = "metadata")
@Schema(description = "UI metadata entity for dynamic form and interface generation")
public class UIMetadata {
    
    @Id
    @Schema(description = "Unique identifier for the UI metadata", example = "UI001")
    private String id;
    
    @NotBlank
    @Schema(description = "UI metadata name", example = "Customer Form")
    private String name;
    
    @Schema(description = "UI metadata description", example = "Dynamic form for customer data entry")
    private String description;
    
    @NotBlank
    @Column(name = "domain_id")
    @Schema(description = "Domain ID this UI metadata belongs to", example = "DOM001")
    private String domainId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_object_id")
    @JsonBackReference("integrationobject-uimetadata")
    @Schema(description = "Source integration object")
    private IntegrationObject sourceObject;
    
    @NotBlank
    @Column(name = "layout_type")
    @Schema(description = "Layout type", example = "form")
    private String layoutType;
    
    @NotNull
    @Column(name = "effective_date")
    @Schema(description = "Effective date for the UI metadata")
    private LocalDateTime effectiveDate;
    
    @NotNull
    @Schema(description = "UI metadata status", example = "I")
    private Character status = 'I';
    
    @NotBlank
    @Column(name = "approval_status")
    @Schema(description = "Approval status", example = "Draft")
    private String approvalStatus = "Draft";
    
    @NotNull
    @Schema(description = "Version number", example = "1")
    private Integer version = 1;
    
    @JdbcTypeCode(SqlTypes.JSON)
    @JsonRawValue
    @Schema(description = "UI field definitions as JSON array")
    private String fields;
    
    
    @JdbcTypeCode(SqlTypes.JSON)
    @JsonRawValue
    @Schema(description = "UI section definitions as JSON array")
    private String sections;
    
    @JdbcTypeCode(SqlTypes.JSON)
    @JsonRawValue
    @Schema(description = "UI configuration as JSON")
    private String configuration;
    
    @NotBlank
    @Column(name = "created_by")
    @Schema(description = "User who created the UI metadata", example = "system")
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
    @Schema(description = "User who last modified the UI metadata")
    private String lastModifiedBy;
    
    @Column(name = "last_modified_date")
    @Schema(description = "Last modification timestamp")
    private LocalDateTime lastModifiedDate;
    
    @OneToMany(mappedBy = "uiMetadata", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonManagedReference("uimetadata-dynamicdata")
    private List<DynamicDataRecord> dynamicDataRecords;
    
    // Constructors
    public UIMetadata() {}
    
    public UIMetadata(String id, String name, String domainId, IntegrationObject sourceObject, String layoutType, String createdBy) {
        this.id = id;
        this.name = name;
        this.domainId = domainId;
        this.sourceObject = sourceObject;
        this.layoutType = layoutType;
        this.createdBy = createdBy;
        this.effectiveDate = LocalDateTime.now();
        this.createdDate = LocalDateTime.now();
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getDomainId() { return domainId; }
    public void setDomainId(String domainId) { this.domainId = domainId; }
    
    public IntegrationObject getSourceObject() { return sourceObject; }
    public void setSourceObject(IntegrationObject sourceObject) { this.sourceObject = sourceObject; }
    
    public String getSourceObjectId() { return sourceObject != null ? sourceObject.getId() : null; }
    
    public String getLayoutType() { return layoutType; }
    public void setLayoutType(String layoutType) { this.layoutType = layoutType; }
    
    public LocalDateTime getEffectiveDate() { return effectiveDate; }
    public void setEffectiveDate(LocalDateTime effectiveDate) { this.effectiveDate = effectiveDate; }
    
    public Character getStatus() { return status; }
    public void setStatus(Character status) { this.status = status; }
    
    public String getApprovalStatus() { return approvalStatus; }
    public void setApprovalStatus(String approvalStatus) { this.approvalStatus = approvalStatus; }
    
    public Integer getVersion() { return version; }
    public void setVersion(Integer version) { this.version = version; }
    
    public String getFields() { return fields; }
    public void setFields(String fields) { this.fields = fields; }
    
    
    public String getSections() { return sections; }
    public void setSections(String sections) { this.sections = sections; }
    
    public String getConfiguration() { return configuration; }
    public void setConfiguration(String configuration) { this.configuration = configuration; }
    
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
    
    public List<DynamicDataRecord> getDynamicDataRecords() { return dynamicDataRecords; }
    public void setDynamicDataRecords(List<DynamicDataRecord> dynamicDataRecords) { this.dynamicDataRecords = dynamicDataRecords; }
    
    @PrePersist
    protected void onCreate() {
        createdDate = LocalDateTime.now();
        if (effectiveDate == null) {
            effectiveDate = LocalDateTime.now();
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        lastModifiedDate = LocalDateTime.now();
    }
}
