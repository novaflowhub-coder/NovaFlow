package com.novaflowusermanagement.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

@Schema(description = "DTO for user-role assignments with joined user and role data")
public class UserDomainRoleDTO {
    
    @Schema(description = "Unique identifier for the user-role assignment", example = "UDR001")
    private String id;
    
    @Schema(description = "User ID", example = "USR001")
    private String userId;
    
    @Schema(description = "Role ID", example = "ROLE001")
    private String roleId;
    
    @Schema(description = "Whether the assignment is active", example = "true")
    private Boolean isActive;
    
    @Schema(description = "User who made the assignment", example = "system")
    private String assignedBy;
    
    @Schema(description = "Date when assignment was made", example = "2025-08-21T20:00:00")
    private LocalDateTime assignedDate;
    
    // Joined user data
    @Schema(description = "User name", example = "john.doe")
    private String userName;
    
    @Schema(description = "User email", example = "john.doe@example.com")
    private String userEmail;
    
    // Joined role data
    @Schema(description = "Role name", example = "Administrator")
    private String roleName;
    
    @Schema(description = "Role description", example = "System administrator role")
    private String roleDescription;
    
    @Schema(description = "Domain name", example = "Default Domain")
    private String domainName;
    
    // Constructors
    public UserDomainRoleDTO() {}
    
    public UserDomainRoleDTO(String id, String userId, String roleId, Boolean isActive, 
                           String assignedBy, LocalDateTime assignedDate,
                           String userName, String userEmail, 
                           String roleName, String roleDescription, String domainName) {
        this.id = id;
        this.userId = userId;
        this.roleId = roleId;
        this.isActive = isActive;
        this.assignedBy = assignedBy;
        this.assignedDate = assignedDate;
        this.userName = userName;
        this.userEmail = userEmail;
        this.roleName = roleName;
        this.roleDescription = roleDescription;
        this.domainName = domainName;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public String getRoleId() { return roleId; }
    public void setRoleId(String roleId) { this.roleId = roleId; }
    
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    
    public String getAssignedBy() { return assignedBy; }
    public void setAssignedBy(String assignedBy) { this.assignedBy = assignedBy; }
    
    public LocalDateTime getAssignedDate() { return assignedDate; }
    public void setAssignedDate(LocalDateTime assignedDate) { this.assignedDate = assignedDate; }
    
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    
    public String getRoleName() { return roleName; }
    public void setRoleName(String roleName) { this.roleName = roleName; }
    
    public String getRoleDescription() { return roleDescription; }
    public void setRoleDescription(String roleDescription) { this.roleDescription = roleDescription; }
    
    public String getDomainName() { return domainName; }
    public void setDomainName(String domainName) { this.domainName = domainName; }
}
