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
@Table(name = "rule_sets", schema = "metadata")
@Schema(description = "Rule set entity for grouping and organizing rules")
public class RuleSet {
    
    @Id
    @Schema(description = "Unique identifier for the rule set", example = "RULESET001")
    private String id;
    
    @NotBlank
    @Schema(description = "Rule set name", example = "Customer Validation Rules")
    private String name;
    
    @Schema(description = "Rule set description", example = "All validation rules for customer data")
    private String description;
    
    @NotBlank
    @Column(name = "domain_id")
    @Schema(description = "Domain ID this rule set belongs to", example = "DOM001")
    private String domainId;
    
    @NotBlank
    @Column(name = "execution_order")
    @Schema(description = "Execution order", example = "Sequential")
    private String executionOrder = "Sequential";
    
    @NotNull
    @Column(name = "effective_date")
    @Schema(description = "Effective date for the rule set")
    private LocalDateTime effectiveDate;
    
    @NotNull
    @Schema(description = "Rule set status", example = "I")
    private Character status = 'I';
    
    @NotNull
    @Schema(description = "Version number", example = "1")
    private Integer version = 1;
    
    @JdbcTypeCode(SqlTypes.JSON)
    @Schema(description = "Rules array with order and status")
    private Map<String, Object> rules;
    
    @NotBlank
    @Column(name = "created_by")
    @Schema(description = "User who created the rule set", example = "system")
    private String createdBy;
    
    @Column(name = "created_date")
    @Schema(description = "Creation timestamp")
    private LocalDateTime createdDate;
    
    @Column(name = "last_modified_by")
    @Schema(description = "User who last modified the rule set")
    private String lastModifiedBy;
    
    @Column(name = "last_modified_date")
    @Schema(description = "Last modification timestamp")
    private LocalDateTime lastModifiedDate;
    
    // Constructors
    public RuleSet() {}
    
    public RuleSet(String id, String name, String domainId, String createdBy) {
        this.id = id;
        this.name = name;
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
    
    public String getDomainId() { return domainId; }
    public void setDomainId(String domainId) { this.domainId = domainId; }
    
    public String getExecutionOrder() { return executionOrder; }
    public void setExecutionOrder(String executionOrder) { this.executionOrder = executionOrder; }
    
    public LocalDateTime getEffectiveDate() { return effectiveDate; }
    public void setEffectiveDate(LocalDateTime effectiveDate) { this.effectiveDate = effectiveDate; }
    
    public Character getStatus() { return status; }
    public void setStatus(Character status) { this.status = status; }
    
    public Integer getVersion() { return version; }
    public void setVersion(Integer version) { this.version = version; }
    
    public Map<String, Object> getRules() { return rules; }
    public void setRules(Map<String, Object> rules) { this.rules = rules; }
    
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
