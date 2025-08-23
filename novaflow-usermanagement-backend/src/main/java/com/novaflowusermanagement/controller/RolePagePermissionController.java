package com.novaflowusermanagement.controller;

import com.novaflowusermanagement.entity.RolePagePermission;
import com.novaflowusermanagement.service.RolePagePermissionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
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

@RestController
@RequestMapping("/api/role-page-permissions")
@CrossOrigin(origins = "*")
@Tag(name = "Role Page Permission Management", description = "APIs for managing role-page permissions")
public class RolePagePermissionController {
    
    @Autowired
    private RolePagePermissionService rolePagePermissionService;
    
    @GetMapping
    @PreAuthorize("@authz.hasPermission(authentication, 'READ', '/user-management/role-page-permissions')")
    @Operation(summary = "Get all role page permissions", description = "Retrieve all role-page permissions with optional search")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved role page permissions")
    public ResponseEntity<List<RolePagePermission>> getAllRolePagePermissions(
            @Parameter(description = "Search term to filter by role name, page name, or permission type") 
            @RequestParam(required = false) String search) {
        List<RolePagePermission> permissions;
        if (search != null && !search.trim().isEmpty()) {
            permissions = rolePagePermissionService.searchRolePagePermissions(search);
        } else {
            permissions = rolePagePermissionService.getAllRolePagePermissions();
        }
        return ResponseEntity.ok(permissions);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("@authz.hasPermission(authentication, 'READ', '/user-management/role-page-permissions')")
    @Operation(summary = "Get role page permission by ID", description = "Retrieve a specific role-page permission by its ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Permission found"),
        @ApiResponse(responseCode = "404", description = "Permission not found")
    })
    public ResponseEntity<RolePagePermission> getRolePagePermissionById(@Parameter(description = "Permission ID") @PathVariable String id) {
        Optional<RolePagePermission> permission = rolePagePermissionService.getRolePagePermissionById(id);
        return permission.map(ResponseEntity::ok)
                        .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/role/{roleName}")
    @PreAuthorize("@authz.hasPermission(authentication, 'READ', '/user-management/role-page-permissions')")
    @Operation(summary = "Get permissions by role", description = "Retrieve all permissions for a specific role")
    public ResponseEntity<List<RolePagePermission>> getPermissionsByRole(@Parameter(description = "Role name") @PathVariable String roleName) {
        List<RolePagePermission> permissions = rolePagePermissionService.getRolePagePermissionsByRole(roleName);
        return ResponseEntity.ok(permissions);
    }
    
    @GetMapping("/role/{roleName}/granted")
    @PreAuthorize("@authz.hasPermission(authentication, 'READ', '/user-management/role-page-permissions')")
    @Operation(summary = "Get granted permissions by role", description = "Retrieve only granted permissions for a specific role")
    public ResponseEntity<List<RolePagePermission>> getGrantedPermissionsByRole(@Parameter(description = "Role name") @PathVariable String roleName) {
        List<RolePagePermission> permissions = rolePagePermissionService.getGrantedPermissionsByRole(roleName);
        return ResponseEntity.ok(permissions);
    }
    
    @GetMapping("/page/{pageId}")
    @PreAuthorize("@authz.hasPermission(authentication, 'READ', '/user-management/role-page-permissions')")
    @Operation(summary = "Get permissions by page", description = "Retrieve all permissions for a specific page")
    public ResponseEntity<List<RolePagePermission>> getPermissionsByPage(@Parameter(description = "Page ID") @PathVariable String pageId) {
        List<RolePagePermission> permissions = rolePagePermissionService.getRolePagePermissionsByPage(pageId);
        return ResponseEntity.ok(permissions);
    }
    
    @GetMapping("/page/{pageId}/granted")
    @PreAuthorize("@authz.hasPermission(authentication, 'READ', '/user-management/role-page-permissions')")
    @Operation(summary = "Get granted permissions by page", description = "Retrieve only granted permissions for a specific page")
    public ResponseEntity<List<RolePagePermission>> getGrantedPermissionsByPage(@Parameter(description = "Page ID") @PathVariable String pageId) {
        List<RolePagePermission> permissions = rolePagePermissionService.getGrantedPermissionsByPage(pageId);
        return ResponseEntity.ok(permissions);
    }
    
    @PostMapping
    @PreAuthorize("@authz.hasPermission(authentication, 'WRITE', '/user-management/role-page-permissions')")
    @Operation(summary = "Create role page permission", description = "Create a new role-page permission")
    @ApiResponse(responseCode = "201", description = "Permission created successfully")
    public ResponseEntity<RolePagePermission> createRolePagePermission(@Valid @RequestBody RolePagePermission rolePagePermission) {
        try {
            RolePagePermission createdPermission = rolePagePermissionService.createRolePagePermission(rolePagePermission);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdPermission);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    @PostMapping("/create")
    @PreAuthorize("@authz.hasPermission(authentication, 'WRITE', '/user-management/role-page-permissions')")
    @Operation(summary = "Create role page permission from IDs", description = "Create a new role-page permission using IDs")
    @ApiResponse(responseCode = "201", description = "Permission created successfully")
    public ResponseEntity<RolePagePermission> createRolePagePermissionFromIds(
            @Parameter(description = "Role name") @RequestParam String roleName,
            @Parameter(description = "Page ID") @RequestParam String pageId,
            @Parameter(description = "Permission type ID") @RequestParam String permissionTypeId,
            @Parameter(description = "Whether permission is granted") @RequestParam Boolean isGranted,
            @Parameter(description = "User creating the permission") @RequestParam String createdBy) {
        try {
            RolePagePermission createdPermission = rolePagePermissionService.createRolePagePermissionFromIds(
                roleName, pageId, permissionTypeId, isGranted, createdBy);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdPermission);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("@authz.hasPermission(authentication, 'WRITE', '/user-management/role-page-permissions')")
    @Operation(summary = "Update role page permission", description = "Update an existing role-page permission")
    public ResponseEntity<RolePagePermission> updateRolePagePermission(
            @Parameter(description = "Permission ID") @PathVariable String id, 
            @Valid @RequestBody RolePagePermission rolePagePermissionDetails) {
        RolePagePermission updatedPermission = rolePagePermissionService.updateRolePagePermission(id, rolePagePermissionDetails);
        if (updatedPermission != null) {
            return ResponseEntity.ok(updatedPermission);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/{id}/grant")
    @PreAuthorize("@authz.hasPermission(authentication, 'WRITE', '/user-management/role-page-permissions')")
    @Operation(summary = "Grant permission", description = "Grant a role-page permission")
    public ResponseEntity<RolePagePermission> grantPermission(
            @Parameter(description = "Permission ID") @PathVariable String id, 
            @Parameter(description = "User granting the permission") @RequestParam String modifiedBy) {
        RolePagePermission permission = rolePagePermissionService.grantPermission(id, modifiedBy);
        if (permission != null) {
            return ResponseEntity.ok(permission);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/{id}/revoke")
    @PreAuthorize("@authz.hasPermission(authentication, 'WRITE', '/user-management/role-page-permissions')")
    @Operation(summary = "Revoke permission", description = "Revoke a role-page permission")
    public ResponseEntity<RolePagePermission> revokePermission(
            @Parameter(description = "Permission ID") @PathVariable String id, 
            @Parameter(description = "User revoking the permission") @RequestParam String modifiedBy) {
        RolePagePermission permission = rolePagePermissionService.revokePermission(id, modifiedBy);
        if (permission != null) {
            return ResponseEntity.ok(permission);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping("/bulk-update")
    @PreAuthorize("@authz.hasPermission(authentication, 'WRITE', '/user-management/role-page-permissions')")
    @Operation(summary = "Bulk update role permissions", description = "Update multiple permissions for a role")
    public ResponseEntity<Void> bulkUpdateRolePermissions(
            @Parameter(description = "Role name") @RequestParam String roleName,
            @Parameter(description = "Page IDs") @RequestParam List<String> pageIds,
            @Parameter(description = "Permission type IDs") @RequestParam List<String> permissionTypeIds,
            @Parameter(description = "Whether permissions are granted") @RequestParam Boolean isGranted,
            @Parameter(description = "User making the changes") @RequestParam String modifiedBy) {
        try {
            rolePagePermissionService.bulkUpdateRolePermissions(roleName, pageIds, permissionTypeIds, isGranted, modifiedBy);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("@authz.hasPermission(authentication, 'DELETE', '/user-management/role-page-permissions')")
    @Operation(summary = "Delete role page permission", description = "Delete a role-page permission")
    @ApiResponse(responseCode = "204", description = "Permission deleted successfully")
    public ResponseEntity<Void> deleteRolePagePermission(@Parameter(description = "Permission ID") @PathVariable String id) {
        boolean deleted = rolePagePermissionService.deleteRolePagePermission(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
