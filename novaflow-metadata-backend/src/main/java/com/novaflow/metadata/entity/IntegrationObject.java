package com.novaflow.metadata.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import io.swagger.v3.oas.annotations.media.Schema;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "integration_objects", schema = "metadata")
@Schema(description = "Integration object entity representing tables, views, APIs, files, and queues")
public class IntegrationObject {
    
    @Id
    @Schema(description = "Unique identifier for the integration object", example = "OBJ001")
    private String id;
    
    @NotBlank
    @Schema(description = "Object name", example = "Customer Table")
    private String name;
    
    @NotBlank
    @Schema(description = "Object type", example = "Table")
    private String type;
    
    @Schema(description = "Object description", example = "Customer master data table")
    private String description;
    
    @NotBlank
    @Column(name = "domain_id")
    @Schema(description = "Domain ID this object belongs to", example = "DOM001")
    private String domainId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "connection_id")
    @JsonBackReference("connection-integrationobjects")
    @Schema(description = "Connection this object belongs to")
    private Connection connection;
    
    @NotNull
    @Schema(description = "Object status", example = "A")
    private Character status = 'A';
    
    @NotNull
    @Schema(description = "Version number", example = "1")
    private Integer version = 1;
    
    @NotBlank
    @Column(name = "created_by")
    @Schema(description = "User who created the object", example = "system")
    private String createdBy;
    
    @Column(name = "created_date")
    @Schema(description = "Creation timestamp")
    private LocalDateTime createdDate;
    
    @Column(name = "last_modified_by")
    @Schema(description = "User who last modified the object")
    private String lastModifiedBy;
    
    @Column(name = "last_modified_date")
    @Schema(description = "Last modification timestamp")
    private LocalDateTime lastModifiedDate;
    
    @OneToMany(mappedBy = "integrationObject", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonManagedReference("integrationobject-attributes")
    private List<ObjectSchemaAttribute> attributes;
    
    @OneToMany(mappedBy = "sourceObject", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonManagedReference("sourceobject-rules")
    private List<Rule> sourceRules;
    
    @OneToMany(mappedBy = "targetObject", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonManagedReference("targetobject-rules")
    private List<Rule> targetRules;
    
    @OneToMany(mappedBy = "sourceObject", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonManagedReference("sourceobject-scaffolds")
    private List<Scaffold> sourceScaffolds;
    
    @OneToMany(mappedBy = "targetObject", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonManagedReference("targetobject-scaffolds")
    private List<Scaffold> targetScaffolds;
    
    @OneToMany(mappedBy = "sourceObject", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonManagedReference("integrationobject-uimetadata")
    private List<UIMetadata> uiMetadataList;
    
    // Constructors
    public IntegrationObject() {}
    
    public IntegrationObject(String id, String name, String type, String domainId, String createdBy) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.domainId = domainId;
        this.createdBy = createdBy;
        this.createdDate = LocalDateTime.now();
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getDomainId() { return domainId; }
    public void setDomainId(String domainId) { this.domainId = domainId; }
    
    public Connection getConnection() { return connection; }
    public void setConnection(Connection connection) { this.connection = connection; }
    
    public Character getStatus() { return status; }
    public void setStatus(Character status) { this.status = status; }
    
    public Integer getVersion() { return version; }
    public void setVersion(Integer version) { this.version = version; }
    
    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
    
    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }
    
    public String getLastModifiedBy() { return lastModifiedBy; }
    public void setLastModifiedBy(String lastModifiedBy) { this.lastModifiedBy = lastModifiedBy; }
    
    public LocalDateTime getLastModifiedDate() { return lastModifiedDate; }
    public void setLastModifiedDate(LocalDateTime lastModifiedDate) { this.lastModifiedDate = lastModifiedDate; }
    
    public List<ObjectSchemaAttribute> getAttributes() { return attributes; }
    public void setAttributes(List<ObjectSchemaAttribute> attributes) { this.attributes = attributes; }
    
    public List<Rule> getSourceRules() { return sourceRules; }
    public void setSourceRules(List<Rule> sourceRules) { this.sourceRules = sourceRules; }
    
    public List<Rule> getTargetRules() { return targetRules; }
    public void setTargetRules(List<Rule> targetRules) { this.targetRules = targetRules; }
    
    public List<Scaffold> getSourceScaffolds() { return sourceScaffolds; }
    public void setSourceScaffolds(List<Scaffold> sourceScaffolds) { this.sourceScaffolds = sourceScaffolds; }
    
    public List<Scaffold> getTargetScaffolds() { return targetScaffolds; }
    public void setTargetScaffolds(List<Scaffold> targetScaffolds) { this.targetScaffolds = targetScaffolds; }
    
    public List<UIMetadata> getUiMetadataList() { return uiMetadataList; }
    public void setUiMetadataList(List<UIMetadata> uiMetadataList) { this.uiMetadataList = uiMetadataList; }
    
    @PrePersist
    protected void onCreate() {
        createdDate = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        lastModifiedDate = LocalDateTime.now();
    }
}
