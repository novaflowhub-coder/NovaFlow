package com.novaflow.metadata.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.util.Map;

@Schema(description = "Request to create a new connection")
public class CreateConnectionRequest {
    
    @NotBlank(message = "Domain ID is required")
    @JsonProperty("domain_id")
    @Schema(description = "Domain ID this connection belongs to", example = "FINANCE")
    private String domainId;
    
    @NotBlank(message = "Name is required")
    @Schema(description = "Connection name", example = "Production Database")
    private String name;
    
    @NotBlank(message = "Type code is required")
    @Pattern(regexp = "^(POSTGRES|SQLSERVER|ORACLE|REST|FILE|KAFKA|WEBHOOK|SFTP)$", 
             message = "Type code must be one of: POSTGRES, SQLSERVER, ORACLE, REST, FILE, KAFKA, WEBHOOK, SFTP")
    @JsonProperty("type_code")
    @Schema(description = "Connection type code", example = "POSTGRES")
    private String typeCode;
    
    @Schema(description = "Connection description", example = "Main production PostgreSQL database")
    private String description;
    
    @NotNull(message = "Parameters are required")
    @Schema(description = "Connection parameters as JSON object", example = "{\"host\":\"localhost\",\"port\":5432}")
    private Map<String, Object> parameters;
    
    @Pattern(regexp = "^(ACTIVE|INACTIVE)$", message = "Status must be ACTIVE or INACTIVE")
    @Schema(description = "Connection status", example = "ACTIVE", defaultValue = "ACTIVE")
    private String status = "ACTIVE";
    
    // Constructors
    public CreateConnectionRequest() {}
    
    public CreateConnectionRequest(String domainId, String name, String typeCode, String description, 
                                 Map<String, Object> parameters, String status) {
        this.domainId = domainId;
        this.name = name;
        this.typeCode = typeCode;
        this.description = description;
        this.parameters = parameters;
        this.status = status;
    }
    
    // Getters and Setters
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
}
