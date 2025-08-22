package com.novaflow.metadata.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import io.swagger.v3.oas.annotations.media.Schema;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "connections", schema = "metadata")
@Schema(description = "Connection entity representing database and API connections")
public class Connection {
    
    @Id
    @Schema(description = "Unique identifier for the connection", example = "CONN001")
    private String id;
    
    @NotBlank
    @Schema(description = "Connection name", example = "Production Database")
    private String name;
    
    @NotBlank
    @Schema(description = "Connection type", example = "Database Server")
    private String type;
    
    @Schema(description = "Connection description", example = "Main production PostgreSQL database")
    private String description;
    
    @NotBlank
    @Column(name = "domain_id")
    @Schema(description = "Domain ID this connection belongs to", example = "DOM001")
    private String domainId;
    
    @Schema(description = "Host address", example = "localhost")
    private String host;
    
    @Schema(description = "Port number", example = "5432")
    private Integer port;
    
    @Schema(description = "Database name", example = "novaflow")
    private String database;
    
    @Schema(description = "Username for connection", example = "db_user")
    private String username;
    
    @Column(name = "base_url")
    @Schema(description = "Base URL for API connections", example = "https://api.example.com")
    private String baseUrl;
    
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "connection_parameters")
    @Schema(description = "Additional connection parameters as JSON")
    private Map<String, Object> connectionParameters;
    
    @NotNull
    @Schema(description = "Connection status", example = "A")
    private Character status = 'A';
    
    @NotNull
    @Schema(description = "Version number", example = "1")
    private Integer version = 1;
    
    @NotBlank
    @Column(name = "created_by")
    @Schema(description = "User who created the connection", example = "system")
    private String createdBy;
    
    @Column(name = "created_date")
    @Schema(description = "Creation timestamp")
    private LocalDateTime createdDate;
    
    @Column(name = "last_modified_by")
    @Schema(description = "User who last modified the connection")
    private String lastModifiedBy;
    
    @Column(name = "last_modified_date")
    @Schema(description = "Last modification timestamp")
    private LocalDateTime lastModifiedDate;
    
    @OneToMany(mappedBy = "connection", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<IntegrationObject> integrationObjects;
    
    // Constructors
    public Connection() {}
    
    public Connection(String id, String name, String type, String domainId, String createdBy) {
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
    
    public String getHost() { return host; }
    public void setHost(String host) { this.host = host; }
    
    public Integer getPort() { return port; }
    public void setPort(Integer port) { this.port = port; }
    
    public String getDatabase() { return database; }
    public void setDatabase(String database) { this.database = database; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getBaseUrl() { return baseUrl; }
    public void setBaseUrl(String baseUrl) { this.baseUrl = baseUrl; }
    
    public Map<String, Object> getConnectionParameters() { return connectionParameters; }
    public void setConnectionParameters(Map<String, Object> connectionParameters) { this.connectionParameters = connectionParameters; }
    
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
    
    public List<IntegrationObject> getIntegrationObjects() { return integrationObjects; }
    public void setIntegrationObjects(List<IntegrationObject> integrationObjects) { this.integrationObjects = integrationObjects; }
    
    @PrePersist
    protected void onCreate() {
        createdDate = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        lastModifiedDate = LocalDateTime.now();
    }
}
