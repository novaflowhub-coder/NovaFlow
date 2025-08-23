package com.novaflowusermanagement.controller;

import com.novaflowusermanagement.entity.Role;
import com.novaflowusermanagement.service.RoleService;
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
@RequestMapping("/api/roles")
@CrossOrigin(origins = "*")
@Tag(name = "Role Management", description = "APIs for managing user roles")
public class RoleController {
    
    @Autowired
    private RoleService roleService;
    
    @GetMapping
    @PreAuthorize("@authz.hasPermission(authentication, 'READ', '/user-management/roles')")
    @Operation(summary = "Get all roles", description = "Retrieve all roles in the system")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved roles")
    public ResponseEntity<List<Role>> getAllRoles() {
        List<Role> roles = roleService.getAllRoles();
        return ResponseEntity.ok(roles);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("@authz.hasPermission(authentication, 'READ', '/user-management/roles')")
    @Operation(summary = "Get role by ID", description = "Retrieve a specific role by its ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Role found"),
        @ApiResponse(responseCode = "404", description = "Role not found")
    })
    public ResponseEntity<Role> getRoleById(@Parameter(description = "Role ID") @PathVariable String id) {
        Optional<Role> role = roleService.getRoleById(id);
        return role.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/domain/{domainId}")
    @PreAuthorize("@authz.hasPermission(authentication, 'READ', '/user-management/roles')")
    @Operation(summary = "Get roles by domain", description = "Retrieve roles for a specific domain")
    public ResponseEntity<List<Role>> getRolesByDomain(@Parameter(description = "Domain ID") @PathVariable String domainId) {
        List<Role> roles = roleService.getRolesByDomain(domainId);
        return ResponseEntity.ok(roles);
    }
    
    @GetMapping("/name/{name}")
    @PreAuthorize("@authz.hasPermission(authentication, 'READ', '/user-management/roles')")
    @Operation(summary = "Get roles by name", description = "Retrieve roles by name")
    public ResponseEntity<List<Role>> getRolesByName(@Parameter(description = "Role name") @PathVariable String name) {
        List<Role> roles = roleService.getRolesByName(name);
        return ResponseEntity.ok(roles);
    }
    
    @GetMapping("/search")
    @PreAuthorize("@authz.hasPermission(authentication, 'READ', '/user-management/roles')")
    @Operation(summary = "Search roles", description = "Search roles by name or description")
    public ResponseEntity<List<Role>> searchRoles(@Parameter(description = "Search term") @RequestParam String term) {
        List<Role> roles = roleService.searchRoles(term);
        return ResponseEntity.ok(roles);
    }
    
    @GetMapping("/domain/{domainId}/search")
    @PreAuthorize("@authz.hasPermission(authentication, 'READ', '/user-management/roles')")
    @Operation(summary = "Search roles by domain", description = "Search roles within a specific domain")
    public ResponseEntity<List<Role>> searchRolesByDomain(
            @Parameter(description = "Domain ID") @PathVariable String domainId,
            @Parameter(description = "Search term") @RequestParam String term) {
        List<Role> roles = roleService.searchRolesByDomain(domainId, term);
        return ResponseEntity.ok(roles);
    }
    
    @PostMapping
    @PreAuthorize("@authz.hasPermission(authentication, 'CREATE', '/user-management/roles')")
    @Operation(summary = "Create role", description = "Create a new role")
    @ApiResponse(responseCode = "201", description = "Role created successfully")
    public ResponseEntity<?> createRole(@Valid @RequestBody Role role) {
        try {
            Role createdRole = roleService.createRole(role);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdRole);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred: " + e.getMessage());
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("@authz.hasPermission(authentication, 'UPDATE', '/user-management/roles')")
    @Operation(summary = "Update role", description = "Update an existing role")
    public ResponseEntity<Role> updateRole(@Parameter(description = "Role ID") @PathVariable String id, @RequestBody Role roleDetails) {
        try {
            Role updatedRole = roleService.updateRole(id, roleDetails);
            if (updatedRole != null) {
                return ResponseEntity.ok(updatedRole);
            }
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
    @PutMapping("/{id}/user-count")
    @PreAuthorize("@authz.hasPermission(authentication, 'UPDATE', '/user-management/roles')")
    @Operation(summary = "Update user count", description = "Update the user count for a role")
    public ResponseEntity<Role> updateUserCount(@Parameter(description = "Role ID") @PathVariable String id, @RequestParam Integer userCount) {
        Role role = roleService.updateUserCount(id, userCount);
        if (role != null) {
            return ResponseEntity.ok(role);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("@authz.hasPermission(authentication, 'DELETE', '/user-management/roles')")
    @Operation(summary = "Delete role", description = "Delete a role")
    @ApiResponse(responseCode = "204", description = "Role deleted successfully")
    public ResponseEntity<Void> deleteRole(@Parameter(description = "Role ID") @PathVariable String id) {
        boolean deleted = roleService.deleteRole(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
