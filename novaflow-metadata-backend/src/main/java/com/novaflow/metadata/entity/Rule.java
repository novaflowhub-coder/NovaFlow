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
@Table(name = "rules", schema = "metadata")
@Schema(description = "Rule entity representing validation, business, and transformation rules")
public class Rule {
    
    @Id
    @Schema(description = "Unique identifier for the rule", example = "RULE001")
    private String id;
    
    @NotBlank
    @Schema(description = "Rule name", example = "Customer ID Validation")
    private String name;
    
    @Schema(description = "Rule description", example = "Validates customer ID format")
    private String description;
    
    @NotBlank
    @Column(name = "rule_type")
    @Schema(description = "Rule type", example = "Validation")
    private String ruleType;
    
    @NotBlank
    @Column(name = "domain_id")
    @Schema(description = "Domain ID this rule belongs to", example = "DOM001")
    private String domainId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_object_id")
    @JsonBackReference("sourceobject-rules")
    @Schema(description = "Source integration object")
    private IntegrationObject sourceObject;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_object_id")
    @JsonBackReference("targetobject-rules")
    @Schema(description = "Target integration object")
    private IntegrationObject targetObject;
    
    @Schema(description = "Rule expression", example = "LENGTH(customer_id) = 8")
    private String expression;
    
    @Schema(description = "Rule priority", example = "1")
    private Integer priority = 1;
    
    @NotNull
    @Column(name = "effective_date")
    @Schema(description = "Effective date for the rule")
    private LocalDateTime effectiveDate;
    
    @NotNull
    @Schema(description = "Rule status", example = "I")
    private Character status = 'I';
    
    @NotNull
    @Schema(description = "Version number", example = "1")
    private Integer version = 1;
    
    @JdbcTypeCode(SqlTypes.JSON)
    @JsonRawValue
    @Schema(description = "Rule conditions as JSON array")
    private String conditions;
    
    @JdbcTypeCode(SqlTypes.JSON)
    @JsonRawValue
    @Schema(description = "Rule actions as JSON array")
    private String actions;
    
    @NotBlank
    @Column(name = "created_by")
    @Schema(description = "User who created the rule", example = "system")
    private String createdBy;
    
    @Column(name = "created_date")
    @Schema(description = "Creation timestamp")
    private LocalDateTime createdDate;
    
    @Column(name = "last_modified_by")
    @Schema(description = "User who last modified the rule")
    private String lastModifiedBy;
    
    @Column(name = "last_modified_date")
    @Schema(description = "Last modification timestamp")
    private LocalDateTime lastModifiedDate;
    
    // Constructors
    public Rule() {}
    
    public Rule(String id, String name, String ruleType, String domainId, IntegrationObject sourceObject, String createdBy) {
        this.id = id;
        this.name = name;
        this.ruleType = ruleType;
        this.domainId = domainId;
        this.sourceObject = sourceObject;
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
    
    public String getRuleType() { return ruleType; }
    public void setRuleType(String ruleType) { this.ruleType = ruleType; }
    
    public String getDomainId() { return domainId; }
    public void setDomainId(String domainId) { this.domainId = domainId; }
    
    public IntegrationObject getSourceObject() { return sourceObject; }
    public void setSourceObject(IntegrationObject sourceObject) { this.sourceObject = sourceObject; }
    
    public IntegrationObject getTargetObject() { return targetObject; }
    public void setTargetObject(IntegrationObject targetObject) { this.targetObject = targetObject; }
    
    public String getExpression() { return expression; }
    public void setExpression(String expression) { this.expression = expression; }
    
    public Integer getPriority() { return priority; }
    public void setPriority(Integer priority) { this.priority = priority; }
    
    public LocalDateTime getEffectiveDate() { return effectiveDate; }
    public void setEffectiveDate(LocalDateTime effectiveDate) { this.effectiveDate = effectiveDate; }
    
    public Character getStatus() { return status; }
    public void setStatus(Character status) { this.status = status; }
    
    public Integer getVersion() { return version; }
    public void setVersion(Integer version) { this.version = version; }
    
    public String getConditions() { return conditions; }
    public void setConditions(String conditions) { this.conditions = conditions; }
    
    public String getActions() { return actions; }
    public void setActions(String actions) { this.actions = actions; }
    
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
