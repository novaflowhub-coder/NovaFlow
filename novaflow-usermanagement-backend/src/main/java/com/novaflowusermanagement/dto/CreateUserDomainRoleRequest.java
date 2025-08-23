package com.novaflowusermanagement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Request DTO for creating user-role assignments")
public class CreateUserDomainRoleRequest {
    
    @NotBlank
    @Schema(description = "User ID", example = "USER001")
    private String userId;
    
    @NotBlank
    @Schema(description = "Role ID", example = "ROLE001")
    private String roleId;
    
    @NotBlank
    @Schema(description = "User who made the assignment", example = "system")
    private String assignedBy;
    
    // Constructors
    public CreateUserDomainRoleRequest() {}
    
    public CreateUserDomainRoleRequest(String userId, String roleId, String assignedBy) {
        this.userId = userId;
        this.roleId = roleId;
        this.assignedBy = assignedBy;
    }
    
    // Getters and Setters
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public String getRoleId() { return roleId; }
    public void setRoleId(String roleId) { this.roleId = roleId; }
    
    public String getAssignedBy() { return assignedBy; }
    public void setAssignedBy(String assignedBy) { this.assignedBy = assignedBy; }
}
