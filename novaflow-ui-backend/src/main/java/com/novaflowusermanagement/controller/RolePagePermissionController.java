package com.novaflowusermanagement.controller;

import com.novaflowusermanagement.entity.RolePagePermission;
import com.novaflowusermanagement.service.RolePagePermissionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/api/role-page-permissions")
@CrossOrigin(origins = "*")
@Tag(name = "Role Page Permission Management", description = "APIs for managing role-page-permission mappings")
public class RolePagePermissionController {

    @Autowired
    private RolePagePermissionService rolePagePermissionService;

    @GetMapping
    @PreAuthorize("@authz.hasPermission(authentication, 'view', '/permission-management')")
    @Operation(summary = "Get all role page permissions", description = "Retrieve all role-page-permission mappings")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved role page permissions")
    public ResponseEntity<List<RolePagePermission>> getAllRolePagePermissions() {
        List<RolePagePermission> permissions = rolePagePermissionService.getAllRolePagePermissions();
        return ResponseEntity.ok(permissions);
    }

    @GetMapping("/{id}")
    @PreAuthorize("@authz.hasPermission(authentication, 'view', '/permission-management')")
    @Operation(summary = "Get role page permission by ID", description = "Retrieve a specific role-page-permission by its ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Role page permission found"),
        @ApiResponse(responseCode = "404", description = "Role page permission not found")
    })
    public ResponseEntity<RolePagePermission> getRolePagePermissionById(@Parameter(description = "Role Page Permission ID") @PathVariable String id) {
        Optional<RolePagePermission> permission = rolePagePermissionService.getRolePagePermissionById(id);
        return permission.map(ResponseEntity::ok)
                        .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/by-roles")
    @PreAuthorize("@authz.hasPermission(authentication, 'view', '/permission-management')")
    @Operation(summary = "Get permissions by roles", description = "Retrieve all granted permissions for specified roles")
    public ResponseEntity<List<RolePagePermission>> getPermissionsByRoles(@RequestBody Set<String> roleNames) {
        List<RolePagePermission> permissions = rolePagePermissionService.getPermissionsByRoles(roleNames);
        return ResponseEntity.ok(permissions);
    }

    @GetMapping("/role/{roleName}/page/{pageId}/permission/{permissionTypeId}")
    @PreAuthorize("@authz.hasPermission(authentication, 'view', '/permission-management')")
    @Operation(summary = "Get specific role page permission", description = "Get permission for specific role, page, and permission type")
    public ResponseEntity<List<RolePagePermission>> getSpecificPermission(
            @Parameter(description = "Role name") @PathVariable String roleName,
            @Parameter(description = "Page ID") @PathVariable String pageId,
            @Parameter(description = "Permission Type ID") @PathVariable String permissionTypeId) {
        List<RolePagePermission> permissions = rolePagePermissionService.getPermissionsByRoleAndPage(roleName, pageId, permissionTypeId);
        return ResponseEntity.ok(permissions);
    }

    @PostMapping
    @PreAuthorize("@authz.hasPermission(authentication, 'edit', '/permission-management')")
    @Operation(summary = "Create role page permission", description = "Create a new role-page-permission mapping")
    @ApiResponse(responseCode = "201", description = "Role page permission created successfully")
    public ResponseEntity<RolePagePermission> createRolePagePermission(@Valid @RequestBody RolePagePermission rolePagePermission) {
        try {
            RolePagePermission createdPermission = rolePagePermissionService.createRolePagePermission(rolePagePermission);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdPermission);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("@authz.hasPermission(authentication, 'edit', '/permission-management')")
    @Operation(summary = "Update role page permission", description = "Update an existing role-page-permission mapping")
    public ResponseEntity<RolePagePermission> updateRolePagePermission(
            @Parameter(description = "Role Page Permission ID") @PathVariable String id, 
            @Valid @RequestBody RolePagePermission permissionDetails) {
        try {
            RolePagePermission updatedPermission = rolePagePermissionService.updateRolePagePermission(id, permissionDetails);
            if (updatedPermission != null) {
                return ResponseEntity.ok(updatedPermission);
            }
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/grant")
    @PreAuthorize("@authz.hasPermission(authentication, 'edit', '/permission-management')")
    @Operation(summary = "Grant permission", description = "Grant a specific permission to a role for a page")
    public ResponseEntity<RolePagePermission> grantPermission(@RequestBody GrantPermissionRequest request) {
        try {
            RolePagePermission permission = rolePagePermissionService.grantPermission(
                request.getRoleName(), 
                request.getPageId(), 
                request.getPermissionTypeId(), 
                request.getGrantedBy()
            );
            return ResponseEntity.ok(permission);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/revoke")
    @PreAuthorize("@authz.hasPermission(authentication, 'edit', '/permission-management')")
    @Operation(summary = "Revoke permission", description = "Revoke a specific permission from a role for a page")
    public ResponseEntity<Void> revokePermission(@RequestBody RevokePermissionRequest request) {
        boolean revoked = rolePagePermissionService.revokePermission(
            request.getRoleName(), 
            request.getPageId(), 
            request.getPermissionTypeId(), 
            request.getRevokedBy()
        );
        if (revoked) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("@authz.hasPermission(authentication, 'delete', '/permission-management')")
    @Operation(summary = "Delete role page permission", description = "Delete a role-page-permission mapping")
    @ApiResponse(responseCode = "204", description = "Role page permission deleted successfully")
    public ResponseEntity<Void> deleteRolePagePermission(@Parameter(description = "Role Page Permission ID") @PathVariable String id) {
        boolean deleted = rolePagePermissionService.deleteRolePagePermission(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // DTOs for grant/revoke operations
    @Schema(description = "Request to grant permission to a role")
    public static class GrantPermissionRequest {
        @Schema(description = "Role name", example = "nova-admin", required = true)
        private String roleName;

        @Schema(description = "Page ID", example = "PAGE001", required = true)
        private String pageId;

        @Schema(description = "Permission Type ID", example = "PERM001", required = true)
        private String permissionTypeId;

        @Schema(description = "User granting the permission", example = "admin", required = true)
        private String grantedBy;

        // Constructors
        public GrantPermissionRequest() {}

        public GrantPermissionRequest(String roleName, String pageId, String permissionTypeId, String grantedBy) {
            this.roleName = roleName;
            this.pageId = pageId;
            this.permissionTypeId = permissionTypeId;
            this.grantedBy = grantedBy;
        }

        // Getters and setters
        public String getRoleName() { return roleName; }
        public void setRoleName(String roleName) { this.roleName = roleName; }

        public String getPageId() { return pageId; }
        public void setPageId(String pageId) { this.pageId = pageId; }

        public String getPermissionTypeId() { return permissionTypeId; }
        public void setPermissionTypeId(String permissionTypeId) { this.permissionTypeId = permissionTypeId; }

        public String getGrantedBy() { return grantedBy; }
        public void setGrantedBy(String grantedBy) { this.grantedBy = grantedBy; }
    }

    @Schema(description = "Request to revoke permission from a role")
    public static class RevokePermissionRequest {
        @Schema(description = "Role name", example = "nova-viewer", required = true)
        private String roleName;

        @Schema(description = "Page ID", example = "PAGE001", required = true)
        private String pageId;

        @Schema(description = "Permission Type ID", example = "PERM001", required = true)
        private String permissionTypeId;

        @Schema(description = "User revoking the permission", example = "admin", required = true)
        private String revokedBy;

        // Constructors
        public RevokePermissionRequest() {}

        public RevokePermissionRequest(String roleName, String pageId, String permissionTypeId, String revokedBy) {
            this.roleName = roleName;
            this.pageId = pageId;
            this.permissionTypeId = permissionTypeId;
            this.revokedBy = revokedBy;
        }

        // Getters and setters
        public String getRoleName() { return roleName; }
        public void setRoleName(String roleName) { this.roleName = roleName; }

        public String getPageId() { return pageId; }
        public void setPageId(String pageId) { this.pageId = pageId; }

        public String getPermissionTypeId() { return permissionTypeId; }
        public void setPermissionTypeId(String permissionTypeId) { this.permissionTypeId = permissionTypeId; }

        public String getRevokedBy() { return revokedBy; }
        public void setRevokedBy(String revokedBy) { this.revokedBy = revokedBy; }
    }
}
