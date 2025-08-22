package com.novaflowusermanagement.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import io.swagger.v3.oas.annotations.media.Schema;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "domains")
@Schema(description = "Domain entity representing business domains in the system", example = "{\"id\": \"DOM001\", \"name\": \"Finance Department\", \"description\": \"Financial data and processes\", \"code\": \"FIN\", \"is_active\": true, \"created_by\": \"system\"}")
public class Domain {
    
    @Id
    @Schema(description = "Unique identifier for the domain", example = "DOM001")
    private String id;
    
    @NotBlank
    @Column(unique = true)
    @Schema(description = "Domain name", example = "Finance Department")
    private String name;
    
    @Schema(description = "Domain description", example = "Financial data and processes")
    private String description;
    
    @NotBlank
    @Column(unique = true)
    @Schema(description = "Domain code", example = "FIN")
    private String code;
    
    @NotNull
    @Column(name = "is_active")
    @Schema(description = "Whether the domain is active", example = "true")
    private Boolean isActive = true;
    
    @NotBlank
    @Column(name = "created_by")
    @Schema(description = "User who created the domain", example = "system")
    private String createdBy;
    
    @Column(name = "created_date")
    @Schema(description = "Date when domain was created", example = "2025-08-21T20:00:00")
    private LocalDateTime createdDate;
    
    @Column(name = "last_modified_by")
    @Schema(description = "User who last modified the domain", example = "admin")
    private String lastModifiedBy;
    
    @Column(name = "last_modified_date")
    @Schema(description = "Date when domain was last modified", example = "2025-08-21T21:00:00")
    private LocalDateTime lastModifiedDate;
    
    @OneToMany(mappedBy = "domain", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference("domain-roles")
    private List<Role> roles;
    
    @OneToMany(mappedBy = "domain", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference("domain-userdomainroles")
    private List<UserDomainRole> userDomainRoles;
    
    // Constructors
    public Domain() {}
    
    public Domain(String id, String name, String description, String code, String createdBy) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.code = code;
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
    
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    
    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
    
    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }
    
    public String getLastModifiedBy() { return lastModifiedBy; }
    public void setLastModifiedBy(String lastModifiedBy) { this.lastModifiedBy = lastModifiedBy; }
    
    public LocalDateTime getLastModifiedDate() { return lastModifiedDate; }
    public void setLastModifiedDate(LocalDateTime lastModifiedDate) { this.lastModifiedDate = lastModifiedDate; }
    
    public List<Role> getRoles() { return roles; }
    public void setRoles(List<Role> roles) { this.roles = roles; }
    
    public List<UserDomainRole> getUserDomainRoles() { return userDomainRoles; }
    public void setUserDomainRoles(List<UserDomainRole> userDomainRoles) { this.userDomainRoles = userDomainRoles; }
    
    @PrePersist
    protected void onCreate() {
        createdDate = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        lastModifiedDate = LocalDateTime.now();
    }
}
