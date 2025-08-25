package com.novaflow.metadata.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import io.swagger.v3.oas.annotations.media.Schema;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "connections", schema = "metadata")
@Schema(description = "Connection entity representing versioned database and API connections")
public class Connection {
    
    @Id
    @Column(columnDefinition = "UUID")
    @Schema(description = "Unique identifier for this version row", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID id;
    
    @NotNull
    @Column(name = "connection_key", columnDefinition = "UUID")
    @Schema(description = "Stable identifier across all versions", example = "123e4567-e89b-12d3-a456-426614174001")
    @JsonProperty("connection_key")
    private UUID connectionKey;
    
    @NotBlank
    @Column(name = "domain_id")
    @Schema(description = "Domain ID this connection belongs to", example = "FINANCE")
    @JsonProperty("domain_id")
    private String domainId;
    
    @NotBlank
    @Schema(description = "Connection name", example = "Production Database")
    private String name;
    
    @NotBlank
    @Column(name = "type_code")
    @Schema(description = "Connection type code", example = "POSTGRES", allowableValues = {"POSTGRES", "SQLSERVER", "ORACLE", "REST", "FILE", "KAFKA", "WEBHOOK", "SFTP"})
    @JsonProperty("type_code")
    private String typeCode;
    
    @Schema(description = "Connection description", example = "Main production PostgreSQL database")
    private String description;
    
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "parameters", columnDefinition = "jsonb")
    @Schema(description = "Connection parameters as JSON")
    private Map<String, Object> parameters;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "metadata.connection_status")
    @Schema(description = "Connection status", example = "ACTIVE")
    private ConnectionStatus status = ConnectionStatus.ACTIVE;
    
    @NotNull
    @Column(name = "version_no")
    @Schema(description = "Version number", example = "1")
    @JsonProperty("version_no")
    private Integer versionNo = 1;
    
    @NotNull
    @Column(name = "is_current")
    @Schema(description = "Whether this is the current version", example = "true")
    @JsonProperty("is_current")
    private Boolean isCurrent = true;
    
    @Column(name = "last_tested_date", columnDefinition = "TIMESTAMPTZ")
    @Schema(description = "Last test timestamp")
    @JsonProperty("last_tested_date")
    private OffsetDateTime lastTestedDate;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "last_test_status", columnDefinition = "metadata.test_result_status")
    @Schema(description = "Last test result", example = "UNKNOWN")
    @JsonProperty("last_test_status")
    private TestResultStatus lastTestStatus = TestResultStatus.UNKNOWN;
    
    @Column(name = "last_test_error")
    @Schema(description = "Last test error message")
    @JsonProperty("last_test_error")
    private String lastTestError;
    
    @NotBlank
    @Column(name = "created_by")
    @Schema(description = "User who created this version", example = "admin@example.com")
    @JsonProperty("created_by")
    private String createdBy;
    
    @Column(name = "created_date", columnDefinition = "TIMESTAMPTZ")
    @Schema(description = "Creation timestamp")
    @JsonProperty("created_date")
    private OffsetDateTime createdDate;
    
    @Column(name = "last_modified_by")
    @Schema(description = "User who last modified the connection")
    @JsonProperty("last_modified_by")
    private String lastModifiedBy;
    
    @Column(name = "last_modified_date", columnDefinition = "TIMESTAMPTZ")
    @Schema(description = "Last modification timestamp")
    @JsonProperty("last_modified_date")
    private OffsetDateTime lastModifiedDate;
    
    @OneToMany(mappedBy = "connection", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<IntegrationObject> integrationObjects;

    // Enums
    public enum ConnectionStatus {
        ACTIVE, INACTIVE
    }
    
    public enum TestResultStatus {
        UNKNOWN, PASS, FAIL
    }
    
    // Constructors
    public Connection() {}
    
    public Connection(UUID connectionKey, String domainId, String name, String typeCode, String createdBy) {
        this.connectionKey = connectionKey;
        this.domainId = domainId;
        this.name = name;
        this.typeCode = typeCode;
        this.createdBy = createdBy;
        this.createdDate = OffsetDateTime.now();
    }
    
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
    
    public ConnectionStatus getStatus() { return status; }
    public void setStatus(ConnectionStatus status) { this.status = status; }
    
    public Integer getVersionNo() { return versionNo; }
    public void setVersionNo(Integer versionNo) { this.versionNo = versionNo; }
    
    public Boolean getIsCurrent() { return isCurrent; }
    public void setIsCurrent(Boolean isCurrent) { this.isCurrent = isCurrent; }
    
    public OffsetDateTime getLastTestedDate() { return lastTestedDate; }
    public void setLastTestedDate(OffsetDateTime lastTestedDate) { this.lastTestedDate = lastTestedDate; }
    
    public TestResultStatus getLastTestStatus() { return lastTestStatus; }
    public void setLastTestStatus(TestResultStatus lastTestStatus) { this.lastTestStatus = lastTestStatus; }
    
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
    
    public List<IntegrationObject> getIntegrationObjects() { return integrationObjects; }
    public void setIntegrationObjects(List<IntegrationObject> integrationObjects) { this.integrationObjects = integrationObjects; }
    
    @PrePersist
    protected void onCreate() {
        if (createdDate == null) {
            createdDate = OffsetDateTime.now();
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        lastModifiedDate = OffsetDateTime.now();
    }
}
