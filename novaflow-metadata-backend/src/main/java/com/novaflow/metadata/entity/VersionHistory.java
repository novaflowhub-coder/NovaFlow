package com.novaflow.metadata.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import io.swagger.v3.oas.annotations.media.Schema;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "version_history", schema = "metadata")
@Schema(description = "Version history entity for tracking changes to entities")
public class VersionHistory {
    
    @Id
    @Schema(description = "Unique identifier for the version history record", example = "VH001")
    private String id;
    
    @NotBlank
    @Column(name = "entity_id")
    @Schema(description = "ID of the entity that was changed", example = "CONN001")
    private String entityId;
    
    @NotBlank
    @Column(name = "entity_type")
    @Schema(description = "Type of entity", example = "Connection")
    private String entityType;
    
    @NotBlank
    @Column(name = "entity_name")
    @Schema(description = "Name of the entity", example = "Production Database")
    private String entityName;
    
    @NotNull
    @Schema(description = "Version number", example = "2")
    private Integer version;
    
    @NotBlank
    @Column(name = "change_type")
    @Schema(description = "Type of change", example = "Update")
    private String changeType;
    
    @NotBlank
    @Column(name = "changed_by")
    @Schema(description = "User who made the change", example = "admin")
    private String changedBy;
    
    @Column(name = "changed_date")
    @Schema(description = "Change timestamp")
    private LocalDateTime changedDate;
    
    @Column(name = "change_description")
    @Schema(description = "Description of the change", example = "Updated connection parameters")
    private String changeDescription;
    
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "previous_state")
    @Schema(description = "Previous state of the entity as JSON")
    private Map<String, Object> previousState;
    
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "new_state")
    @Schema(description = "New state of the entity as JSON")
    private Map<String, Object> newState;
    
    // Constructors
    public VersionHistory() {}
    
    public VersionHistory(String id, String entityId, String entityType, String entityName, Integer version, String changeType, String changedBy) {
        this.id = id;
        this.entityId = entityId;
        this.entityType = entityType;
        this.entityName = entityName;
        this.version = version;
        this.changeType = changeType;
        this.changedBy = changedBy;
        this.changedDate = LocalDateTime.now();
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
    
    public Integer getVersion() { return version; }
    public void setVersion(Integer version) { this.version = version; }
    
    public String getChangeType() { return changeType; }
    public void setChangeType(String changeType) { this.changeType = changeType; }
    
    public String getChangedBy() { return changedBy; }
    public void setChangedBy(String changedBy) { this.changedBy = changedBy; }
    
    public LocalDateTime getChangedDate() { return changedDate; }
    public void setChangedDate(LocalDateTime changedDate) { this.changedDate = changedDate; }
    
    public String getChangeDescription() { return changeDescription; }
    public void setChangeDescription(String changeDescription) { this.changeDescription = changeDescription; }
    
    public Map<String, Object> getPreviousState() { return previousState; }
    public void setPreviousState(Map<String, Object> previousState) { this.previousState = previousState; }
    
    public Map<String, Object> getNewState() { return newState; }
    public void setNewState(Map<String, Object> newState) { this.newState = newState; }
    
    @PrePersist
    protected void onCreate() {
        changedDate = LocalDateTime.now();
    }
}
