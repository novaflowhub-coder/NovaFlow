package com.novaflowusermanagement.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import io.swagger.v3.oas.annotations.media.Schema;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;

@Entity
@Table(name = "role_page_permissions")
@Schema(description = "Entity representing role-page permissions", example = "{\"id\": \"RPP001\", \"roleName\": \"Admin\", \"pageId\": \"PAGE001\", \"permissionTypeId\": \"PERM001\", \"isGranted\": true}")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class RolePagePermission {
    
    @Id
    @Schema(description = "Unique identifier for the role-page permission", example = "RPP001")
    private String id;
    
    @NotBlank
    @Column(name = "role_name")
    @Schema(description = "Role name", example = "Administrator")
    private String roleName;
    
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "page_id")
    @Schema(description = "Page associated with the permission")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Page page;
    
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "permission_type_id")
    @Schema(description = "Permission type")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private PermissionType permissionType;
    
    @NotNull
    @Column(name = "is_granted")
    @Schema(description = "Whether the permission is granted", example = "true")
    private Boolean isGranted = false;
    
    @NotBlank
    @Column(name = "created_by")
    @Schema(description = "User who created the permission", example = "admin@example.com")
    private String createdBy;
    
    @Column(name = "created_date")
    @Schema(description = "Date when permission was created", example = "2025-08-23T10:00:00")
    private LocalDateTime createdDate;
    
    @Column(name = "last_modified_by")
    @Schema(description = "User who last modified the permission", example = "admin@example.com")
    private String lastModifiedBy;
    
    @Column(name = "last_modified_date")
    @Schema(description = "Date when permission was last modified", example = "2025-08-23T11:00:00")
    private LocalDateTime lastModifiedDate;
    
    // Constructors
    public RolePagePermission() {}
    
    public RolePagePermission(String id, String roleName, Page page, PermissionType permissionType, 
                             Boolean isGranted, String createdBy) {
        this.id = id;
        this.roleName = roleName;
        this.page = page;
        this.permissionType = permissionType;
        this.isGranted = isGranted;
        this.createdBy = createdBy;
        this.createdDate = LocalDateTime.now();
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getRoleName() { return roleName; }
    public void setRoleName(String roleName) { this.roleName = roleName; }
    
    public Page getPage() { return page; }
    public void setPage(Page page) { this.page = page; }
    
    public PermissionType getPermissionType() { return permissionType; }
    public void setPermissionType(PermissionType permissionType) { this.permissionType = permissionType; }
    
    public Boolean getIsGranted() { return isGranted; }
    public void setIsGranted(Boolean isGranted) { this.isGranted = isGranted; }
    
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
    }
    
    @PreUpdate
    protected void onUpdate() {
        lastModifiedDate = LocalDateTime.now();
    }
}
