package com.novaflowusermanagement.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import io.swagger.v3.oas.annotations.media.Schema;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "roles")
@Schema(description = "Role entity representing user roles within domains", example = "{\"id\": \"ROLE001\", \"name\": \"Finance Manager\", \"description\": \"Manages financial operations\", \"domain_id\": \"DOM001\", \"user_count\": 0, \"created_by\": \"system\"}")
public class Role {
    
    @Id
    @Schema(description = "Unique identifier for the role", example = "ROLE001")
    private String id;
    
    @NotBlank
    @Schema(description = "Role name", example = "Finance Manager")
    private String name;
    
    @Schema(description = "Role description", example = "Manages financial operations and reporting")
    private String description;
    
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "domain_id")
    @JsonBackReference("domain-roles")
    private Domain domain;
    
    @Column(name = "user_count")
    @Schema(description = "Number of users assigned to this role", example = "5")
    private Integer userCount = 0;
    
    @JdbcTypeCode(SqlTypes.JSON)
    @Schema(description = "JSON object containing role permissions", example = "{\"read\": true, \"write\": true, \"delete\": false}")
    private Map<String, Object> permissions;
    
    @NotBlank
    @Column(name = "created_by")
    @Schema(description = "User who created the role", example = "system")
    private String createdBy;
    
    @Column(name = "created_date")
    @Schema(description = "Date when role was created", example = "2025-08-21T20:00:00")
    private LocalDateTime createdDate;
    
    @Column(name = "updated_by")
    @Schema(description = "User who last updated the role", example = "admin")
    private String updatedBy;
    
    @Column(name = "updated_date")
    @Schema(description = "Date when role was last updated", example = "2025-08-21T21:00:00")
    private LocalDateTime updatedDate;
    
    @OneToMany(mappedBy = "role", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference("role-userdomainroles")
    private List<UserDomainRole> userDomainRoles;
    
    // Constructors
    public Role() {}
    
    public Role(String id, String name, String description, Domain domain, String createdBy) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.domain = domain;
        this.createdBy = createdBy;
        this.createdDate = LocalDateTime.now();
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public Domain getDomain() { return domain; }
    public void setDomain(Domain domain) { this.domain = domain; }
    
    public Integer getUserCount() { return userCount; }
    public void setUserCount(Integer userCount) { this.userCount = userCount; }
    
    public Map<String, Object> getPermissions() { return permissions; }
    public void setPermissions(Map<String, Object> permissions) { this.permissions = permissions; }
    
    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
    
    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }
    
    public String getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }
    
    public LocalDateTime getUpdatedDate() { return updatedDate; }
    public void setUpdatedDate(LocalDateTime updatedDate) { this.updatedDate = updatedDate; }
    
    public List<UserDomainRole> getUserDomainRoles() { return userDomainRoles; }
    public void setUserDomainRoles(List<UserDomainRole> userDomainRoles) { this.userDomainRoles = userDomainRoles; }
    
    @PrePersist
    protected void onCreate() {
        createdDate = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedDate = LocalDateTime.now();
    }
}
