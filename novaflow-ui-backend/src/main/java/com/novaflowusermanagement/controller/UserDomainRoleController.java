package com.novaflowusermanagement.controller;

import com.novaflowusermanagement.entity.UserDomainRole;
import com.novaflowusermanagement.service.UserDomainRoleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/user-domain-roles")
@CrossOrigin(origins = "*")
@Tag(name = "User Domain Role Management", description = "APIs for managing user-domain-role assignments")
public class UserDomainRoleController {
    
    @Autowired
    private UserDomainRoleService userDomainRoleService;
    
    @GetMapping
    @Operation(summary = "Get all user domain roles", description = "Retrieve all user-domain-role assignments")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved user domain roles")
    public ResponseEntity<List<UserDomainRole>> getAllUserDomainRoles() {
        List<UserDomainRole> userDomainRoles = userDomainRoleService.getAllUserDomainRoles();
        return ResponseEntity.ok(userDomainRoles);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get user domain role by ID", description = "Retrieve a specific user-domain-role assignment by its ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Assignment found"),
        @ApiResponse(responseCode = "404", description = "Assignment not found")
    })
    public ResponseEntity<UserDomainRole> getUserDomainRoleById(@Parameter(description = "Assignment ID") @PathVariable String id) {
        Optional<UserDomainRole> userDomainRole = userDomainRoleService.getUserDomainRoleById(id);
        return userDomainRole.map(ResponseEntity::ok)
                            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/user/{userId}")
    @Operation(summary = "Get assignments by user", description = "Retrieve all role assignments for a specific user")
    public ResponseEntity<List<UserDomainRole>> getUserDomainRolesByUser(@Parameter(description = "User ID") @PathVariable String userId) {
        List<UserDomainRole> userDomainRoles = userDomainRoleService.getUserDomainRolesByUser(userId);
        return ResponseEntity.ok(userDomainRoles);
    }
    
    @GetMapping("/user/{userId}/active")
    @Operation(summary = "Get active assignments by user", description = "Retrieve active role assignments for a specific user")
    public ResponseEntity<List<UserDomainRole>> getActiveUserDomainRolesByUser(@Parameter(description = "User ID") @PathVariable String userId) {
        List<UserDomainRole> userDomainRoles = userDomainRoleService.getActiveUserDomainRolesByUser(userId);
        return ResponseEntity.ok(userDomainRoles);
    }
    
    @GetMapping("/domain/{domainId}")
    @Operation(summary = "Get assignments by domain", description = "Retrieve all role assignments for a specific domain")
    public ResponseEntity<List<UserDomainRole>> getUserDomainRolesByDomain(@Parameter(description = "Domain ID") @PathVariable String domainId) {
        List<UserDomainRole> userDomainRoles = userDomainRoleService.getUserDomainRolesByDomain(domainId);
        return ResponseEntity.ok(userDomainRoles);
    }
    
    @GetMapping("/domain/{domainId}/active")
    @Operation(summary = "Get active assignments by domain", description = "Retrieve active role assignments for a specific domain")
    public ResponseEntity<List<UserDomainRole>> getActiveUserDomainRolesByDomain(@Parameter(description = "Domain ID") @PathVariable String domainId) {
        List<UserDomainRole> userDomainRoles = userDomainRoleService.getActiveUserDomainRolesByDomain(domainId);
        return ResponseEntity.ok(userDomainRoles);
    }
    
    @GetMapping("/role/{roleId}")
    @Operation(summary = "Get assignments by role", description = "Retrieve all assignments for a specific role")
    public ResponseEntity<List<UserDomainRole>> getUserDomainRolesByRole(@Parameter(description = "Role ID") @PathVariable String roleId) {
        List<UserDomainRole> userDomainRoles = userDomainRoleService.getUserDomainRolesByRole(roleId);
        return ResponseEntity.ok(userDomainRoles);
    }
    
    @GetMapping("/user/{userId}/domain/{domainId}/active")
    @Operation(summary = "Get active assignments by user and domain", description = "Retrieve active role assignments for a specific user in a specific domain")
    public ResponseEntity<List<UserDomainRole>> getActiveUserDomainRolesByUserAndDomain(
            @Parameter(description = "User ID") @PathVariable String userId, 
            @Parameter(description = "Domain ID") @PathVariable String domainId) {
        List<UserDomainRole> userDomainRoles = userDomainRoleService.getActiveUserDomainRolesByUserAndDomain(userId, domainId);
        return ResponseEntity.ok(userDomainRoles);
    }
    
    @PostMapping
    @Operation(summary = "Create user domain role assignment", description = "Create a new user-domain-role assignment")
    @ApiResponse(responseCode = "201", description = "Assignment created successfully")
    public ResponseEntity<UserDomainRole> createUserDomainRole(@Valid @RequestBody UserDomainRole userDomainRole) {
        try {
            UserDomainRole createdUserDomainRole = userDomainRoleService.createUserDomainRole(userDomainRole);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdUserDomainRole);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update user domain role assignment", description = "Update an existing user-domain-role assignment")
    public ResponseEntity<UserDomainRole> updateUserDomainRole(@Parameter(description = "Assignment ID") @PathVariable String id, @Valid @RequestBody UserDomainRole userDomainRoleDetails) {
        UserDomainRole updatedUserDomainRole = userDomainRoleService.updateUserDomainRole(id, userDomainRoleDetails);
        if (updatedUserDomainRole != null) {
            return ResponseEntity.ok(updatedUserDomainRole);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete user domain role assignment", description = "Delete a user-domain-role assignment")
    @ApiResponse(responseCode = "204", description = "Assignment deleted successfully")
    public ResponseEntity<Void> deleteUserDomainRole(@Parameter(description = "Assignment ID") @PathVariable String id) {
        boolean deleted = userDomainRoleService.deleteUserDomainRole(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/{id}/activate")
    @Operation(summary = "Activate assignment", description = "Activate a user-domain-role assignment")
    public ResponseEntity<UserDomainRole> activateUserDomainRole(@Parameter(description = "Assignment ID") @PathVariable String id, @RequestParam String assignedBy) {
        UserDomainRole userDomainRole = userDomainRoleService.activateUserDomainRole(id, assignedBy);
        if (userDomainRole != null) {
            return ResponseEntity.ok(userDomainRole);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/{id}/deactivate")
    @Operation(summary = "Deactivate assignment", description = "Deactivate a user-domain-role assignment")
    public ResponseEntity<UserDomainRole> deactivateUserDomainRole(@Parameter(description = "Assignment ID") @PathVariable String id, @RequestParam String assignedBy) {
        UserDomainRole userDomainRole = userDomainRoleService.deactivateUserDomainRole(id, assignedBy);
        if (userDomainRole != null) {
            return ResponseEntity.ok(userDomainRole);
        }
        return ResponseEntity.notFound().build();
    }
}
