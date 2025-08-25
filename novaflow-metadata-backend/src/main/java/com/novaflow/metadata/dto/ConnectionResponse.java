package com.novaflow.metadata.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.OffsetDateTime;
import java.util.Map;
import java.util.UUID;

@Schema(description = "Connection response with all fields")
public class ConnectionResponse {
    
    @Schema(description = "Unique identifier for this version row", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID id;
    
    @JsonProperty("connection_key")
    @Schema(description = "Stable identifier across all versions", example = "123e4567-e89b-12d3-a456-426614174001")
    private UUID connectionKey;
    
    @JsonProperty("domain_id")
    @Schema(description = "Domain ID this connection belongs to", example = "FINANCE")
    private String domainId;
    
    @Schema(description = "Connection name", example = "Production Database")
    private String name;
    
    @JsonProperty("type_code")
    @Schema(description = "Connection type code", example = "POSTGRES")
    private String typeCode;
    
    @Schema(description = "Connection description", example = "Main production PostgreSQL database")
    private String description;
    
    @Schema(description = "Connection parameters as JSON object")
    private Map<String, Object> parameters;
    
    @Schema(description = "Connection status", example = "ACTIVE")
    private String status;
    
    @JsonProperty("version_no")
    @Schema(description = "Version number", example = "1")
    private Integer versionNo;
    
    @JsonProperty("is_current")
    @Schema(description = "Whether this is the current version", example = "true")
    private Boolean isCurrent;
    
    @JsonProperty("last_tested_date")
    @Schema(description = "Last test timestamp")
    private OffsetDateTime lastTestedDate;
    
    @JsonProperty("last_test_status")
    @Schema(description = "Last test result", example = "UNKNOWN")
    private String lastTestStatus;
    
    @JsonProperty("last_test_error")
    @Schema(description = "Last test error message")
    private String lastTestError;
    
    @JsonProperty("created_by")
    @Schema(description = "User who created this version", example = "admin@example.com")
    private String createdBy;
    
    @JsonProperty("created_date")
    @Schema(description = "Creation timestamp")
    private OffsetDateTime createdDate;
    
    @JsonProperty("last_modified_by")
    @Schema(description = "User who last modified the connection")
    private String lastModifiedBy;
    
    @JsonProperty("last_modified_date")
    @Schema(description = "Last modification timestamp")
    private OffsetDateTime lastModifiedDate;
    
    // Constructors
    public ConnectionResponse() {}
    
    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    
    public UUID getConnectionKey() { return connectionKey; }
    public void setConnectionKey(UUID connectionKey) { this.connectionKey = connectionKey; }
    
    public String getDomainId() { return domainId; }
    public void setDomainId(String domainId) { this.domainId = domainId; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getTypeCode() { return typeCode; }
    public void setTypeCode(String typeCode) { this.typeCode = typeCode; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public Map<String, Object> getParameters() { return parameters; }
    public void setParameters(Map<String, Object> parameters) { this.parameters = parameters; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public Integer getVersionNo() { return versionNo; }
    public void setVersionNo(Integer versionNo) { this.versionNo = versionNo; }
    
    public Boolean getIsCurrent() { return isCurrent; }
    public void setIsCurrent(Boolean isCurrent) { this.isCurrent = isCurrent; }
    
    public OffsetDateTime getLastTestedDate() { return lastTestedDate; }
    public void setLastTestedDate(OffsetDateTime lastTestedDate) { this.lastTestedDate = lastTestedDate; }
    
    public String getLastTestStatus() { return lastTestStatus; }
    public void setLastTestStatus(String lastTestStatus) { this.lastTestStatus = lastTestStatus; }
    
    public String getLastTestError() { return lastTestError; }
    public void setLastTestError(String lastTestError) { this.lastTestError = lastTestError; }
    
    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
    
    public OffsetDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(OffsetDateTime createdDate) { this.createdDate = createdDate; }
    
    public String getLastModifiedBy() { return lastModifiedBy; }
    public void setLastModifiedBy(String lastModifiedBy) { this.lastModifiedBy = lastModifiedBy; }
    
    public OffsetDateTime getLastModifiedDate() { return lastModifiedDate; }
    public void setLastModifiedDate(OffsetDateTime lastModifiedDate) { this.lastModifiedDate = lastModifiedDate; }
}
