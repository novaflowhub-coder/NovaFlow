package com.novaflow.metadata.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import io.swagger.v3.oas.annotations.media.Schema;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonRawValue;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.LocalDateTime;

@Entity
@Table(name = "scaffolds", schema = "metadata")
@Schema(description = "Scaffold entity for data transformation and processing configurations")
public class Scaffold {
    
    @Id
    @Schema(description = "Unique identifier for the scaffold", example = "SCAFFOLD001")
    private String id;
    
    @NotBlank
    @Schema(description = "Scaffold name", example = "Customer Data Transform")
    private String name;
    
    @Schema(description = "Scaffold description", example = "Transform customer data from source to target format")
    private String description;
    
    @NotBlank
    @Schema(description = "Scaffold type", example = "Scaffold_In")
    private String type;
    
    @NotBlank
    @Column(name = "domain_id")
    @Schema(description = "Domain ID this scaffold belongs to", example = "DOM001")
    private String domainId;
    
    @Column(name = "source_object_name")
    @Schema(description = "Source object name", example = "customer_raw")
    private String sourceObjectName;
    
    @Column(name = "target_object_name")
    @Schema(description = "Target object name", example = "customer_processed")
    private String targetObjectName;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_object_id")
    @JsonBackReference("sourceobject-scaffolds")
    @Schema(description = "Source integration object")
    private IntegrationObject sourceObject;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_object_id")
    @JsonBackReference("targetobject-scaffolds")
    @Schema(description = "Target integration object")
    private IntegrationObject targetObject;
    
    @NotNull
    @Column(name = "effective_date")
    @Schema(description = "Effective date for the scaffold")
    private LocalDateTime effectiveDate;
    
    @NotNull
    @Schema(description = "Scaffold status", example = "I")
    private Character status = 'I';
    
    @NotNull
    @Schema(description = "Version number", example = "1")
    private Integer version = 1;
    
    
    @JdbcTypeCode(SqlTypes.JSON)
    @JsonRawValue
    @Schema(description = "Column transformations as JSON array")
    private String columns;
    
    @JdbcTypeCode(SqlTypes.JSON)
    @JsonRawValue
    @Schema(description = "Aggregation rules as JSON array")
    private String aggregations;
    
    @JdbcTypeCode(SqlTypes.JSON)
    @JsonRawValue
    @Schema(description = "Filter conditions as JSON array")
    private String filters;
    
    @JdbcTypeCode(SqlTypes.JSON)
    @JsonRawValue
    @Schema(description = "Ordering rules as JSON array")
    private String ordering;
    
    @Column(name = "connection_string")
    @Schema(description = "Connection string for scaffold execution")
    private String connectionString;
    
    @JdbcTypeCode(SqlTypes.JSON)
    @JsonRawValue
    @Schema(description = "Additional configuration as JSON")
    private String configuration;
    
    @NotBlank
    @Column(name = "created_by")
    @Schema(description = "User who created the scaffold", example = "system")
    private String createdBy;
    
    @Column(name = "created_date")
    @Schema(description = "Creation timestamp")
    private LocalDateTime createdDate;
    
    @Column(name = "last_modified_by")
    @Schema(description = "User who last modified the scaffold")
    private String lastModifiedBy;
    
    @Column(name = "last_modified_date")
    @Schema(description = "Last modification timestamp")
    private LocalDateTime lastModifiedDate;
    
    // Constructors
    public Scaffold() {}
    
    public Scaffold(String id, String name, String type, String domainId, String createdBy) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.domainId = domainId;
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
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public String getDomainId() { return domainId; }
    public void setDomainId(String domainId) { this.domainId = domainId; }
    
    public String getSourceObjectName() { return sourceObjectName; }
    public void setSourceObjectName(String sourceObjectName) { this.sourceObjectName = sourceObjectName; }
    
    public String getTargetObjectName() { return targetObjectName; }
    public void setTargetObjectName(String targetObjectName) { this.targetObjectName = targetObjectName; }
    
    public IntegrationObject getSourceObject() { return sourceObject; }
    public void setSourceObject(IntegrationObject sourceObject) { this.sourceObject = sourceObject; }
    
    public IntegrationObject getTargetObject() { return targetObject; }
    public void setTargetObject(IntegrationObject targetObject) { this.targetObject = targetObject; }
    
    public String getSourceObjectId() { return sourceObject != null ? sourceObject.getId() : null; }
    public String getTargetObjectId() { return targetObject != null ? targetObject.getId() : null; }
    
    
    public LocalDateTime getEffectiveDate() { return effectiveDate; }
    public void setEffectiveDate(LocalDateTime effectiveDate) { this.effectiveDate = effectiveDate; }
    
    public Character getStatus() { return status; }
    public void setStatus(Character status) { this.status = status; }
    
    public Integer getVersion() { return version; }
    public void setVersion(Integer version) { this.version = version; }
    
    public String getColumns() { return columns; }
    public void setColumns(String columns) { this.columns = columns; }
    
    public String getAggregations() { return aggregations; }
    public void setAggregations(String aggregations) { this.aggregations = aggregations; }
    
    public String getFilters() { return filters; }
    public void setFilters(String filters) { this.filters = filters; }
    
    public String getOrdering() { return ordering; }
    public void setOrdering(String ordering) { this.ordering = ordering; }
    
    public String getConnectionString() { return connectionString; }
    public void setConnectionString(String connectionString) { this.connectionString = connectionString; }
    
    public String getConfiguration() { return configuration; }
    public void setConfiguration(String configuration) { this.configuration = configuration; }
    
    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
    
    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }
    
    public String getLastModifiedBy() { return lastModifiedBy; }
    public void setLastModifiedBy(String lastModifiedBy) { this.lastModifiedBy = lastModifiedBy; }
    
    public LocalDateTime getLastModifiedDate() { return lastModifiedDate; }
    public void setLastModifiedDate(LocalDateTime lastModifiedDate) { this.lastModifiedDate = lastModifiedDate; }
    
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
