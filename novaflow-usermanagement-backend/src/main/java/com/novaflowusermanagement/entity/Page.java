package com.novaflowusermanagement.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import io.swagger.v3.oas.annotations.media.Schema;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "pages")
@Schema(description = "Page entity representing application pages for permission management")
public class Page {
    
    @Id
    @Schema(description = "Unique identifier for the page", example = "PAGE001")
    private String id;
    
    @NotBlank
    @Schema(description = "Page name", example = "User Management")
    private String name;
    
    @NotBlank
    @Column(unique = true)
    @Schema(description = "Page path", example = "/user-management")
    private String path;
    
    @Schema(description = "Page description", example = "User management and administration page")
    private String description;
    
    @NotBlank
    @Column(name = "created_by")
    @Schema(description = "User who created the page", example = "system")
    private String createdBy;
    
    @Column(name = "created_date")
    @Schema(description = "Date when page was created", example = "2025-08-21T20:00:00")
    private LocalDateTime createdDate;
    
    @Column(name = "last_modified_by")
    @Schema(description = "User who last modified the page", example = "admin")
    private String lastModifiedBy;
    
    @Column(name = "last_modified_date")
    @Schema(description = "Date when page was last modified", example = "2025-08-21T21:00:00")
    private LocalDateTime lastModifiedDate;
    
    @OneToMany(mappedBy = "page", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference("page-rolepagepermissions")
    private List<RolePagePermission> rolePagePermissions;
    
    // Constructors
    public Page() {}
    
    public Page(String id, String name, String path, String description, String createdBy) {
        this.id = id;
        this.name = name;
        this.path = path;
        this.description = description;
        this.createdBy = createdBy;
        this.createdDate = LocalDateTime.now();
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getPath() { return path; }
    public void setPath(String path) { this.path = path; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
    
    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }
    
    public String getLastModifiedBy() { return lastModifiedBy; }
    public void setLastModifiedBy(String lastModifiedBy) { this.lastModifiedBy = lastModifiedBy; }
    
    public LocalDateTime getLastModifiedDate() { return lastModifiedDate; }
    public void setLastModifiedDate(LocalDateTime lastModifiedDate) { this.lastModifiedDate = lastModifiedDate; }
    
    public List<RolePagePermission> getRolePagePermissions() { return rolePagePermissions; }
    public void setRolePagePermissions(List<RolePagePermission> rolePagePermissions) { this.rolePagePermissions = rolePagePermissions; }
    
    @PrePersist
    protected void onCreate() {
        createdDate = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        lastModifiedDate = LocalDateTime.now();
    }
}
