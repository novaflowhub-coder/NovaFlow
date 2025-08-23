package com.novaflowusermanagement.controller;

import com.novaflowusermanagement.entity.UserDomainRole;
import com.novaflowusermanagement.dto.UserDomainRoleDTO;
import com.novaflowusermanagement.dto.CreateUserDomainRoleRequest;
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
@Tag(name = "User Role Assignment Management", description = "APIs for managing user-role assignments")
public class UserDomainRoleController {
    
    @Autowired
    private UserDomainRoleService userDomainRoleService;
    
    @GetMapping
    @Operation(summary = "Get all user role assignments", description = "Retrieve all user-role assignments with joined user and role data")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved user role assignments")
    public ResponseEntity<List<UserDomainRoleDTO>> getAllUserDomainRoles(
            @Parameter(description = "Search term to filter by user name, email, or role name") 
            @RequestParam(required = false) String search) {
        List<UserDomainRoleDTO> userDomainRoles;
        if (search != null && !search.trim().isEmpty()) {
            userDomainRoles = userDomainRoleService.searchUserDomainRolesWithJoinedData(search);
        } else {
            userDomainRoles = userDomainRoleService.getAllUserDomainRolesWithJoinedData();
        }
        return ResponseEntity.ok(userDomainRoles);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get user role assignment by ID", description = "Retrieve a specific user-role assignment by its ID with joined data")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Assignment found"),
        @ApiResponse(responseCode = "404", description = "Assignment not found")
    })
    public ResponseEntity<UserDomainRoleDTO> getUserDomainRoleById(@Parameter(description = "Assignment ID") @PathVariable String id) {
        Optional<UserDomainRoleDTO> userDomainRole = userDomainRoleService.getUserDomainRoleByIdWithJoinedData(id);
        return userDomainRole.map(ResponseEntity::ok)
                            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/user/{userId}")
    @Operation(summary = "Get assignments by user", description = "Retrieve all role assignments for a specific user with joined data")
    public ResponseEntity<List<UserDomainRoleDTO>> getUserDomainRolesByUser(@Parameter(description = "User ID") @PathVariable String userId) {
        List<UserDomainRoleDTO> userDomainRoles = userDomainRoleService.getUserDomainRolesByUserWithJoinedData(userId);
        return ResponseEntity.ok(userDomainRoles);
    }
    
    @GetMapping("/user/{userId}/active")
    @Operation(summary = "Get active assignments by user", description = "Retrieve active role assignments for a specific user with joined data")
    public ResponseEntity<List<UserDomainRoleDTO>> getActiveUserDomainRolesByUser(@Parameter(description = "User ID") @PathVariable String userId) {
        List<UserDomainRoleDTO> userDomainRoles = userDomainRoleService.getActiveUserDomainRolesByUserWithJoinedData(userId);
        return ResponseEntity.ok(userDomainRoles);
    }
    
    @GetMapping("/role/{roleId}")
    @Operation(summary = "Get assignments by role", description = "Retrieve all assignments for a specific role with joined data")
    public ResponseEntity<List<UserDomainRoleDTO>> getUserDomainRolesByRole(@Parameter(description = "Role ID") @PathVariable String roleId) {
        List<UserDomainRoleDTO> userDomainRoles = userDomainRoleService.getUserDomainRolesByRoleWithJoinedData(roleId);
        return ResponseEntity.ok(userDomainRoles);
    }
    
    @PostMapping
    @Operation(summary = "Create user role assignment", description = "Create a new user-role assignment")
    @ApiResponse(responseCode = "201", description = "Assignment created successfully")
    public ResponseEntity<UserDomainRoleDTO> createUserDomainRole(@Valid @RequestBody CreateUserDomainRoleRequest request) {
        try {
            UserDomainRoleDTO createdUserDomainRole = userDomainRoleService.createUserDomainRoleFromIdsWithJoinedData(
                request.getUserId(), request.getRoleId(), request.getAssignedBy());
            return ResponseEntity.status(HttpStatus.CREATED).body(createdUserDomainRole);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update user role assignment", description = "Update an existing user-role assignment")
    public ResponseEntity<UserDomainRoleDTO> updateUserDomainRole(@Parameter(description = "Assignment ID") @PathVariable String id, @Valid @RequestBody UserDomainRole userDomainRoleDetails) {
        UserDomainRoleDTO updatedUserDomainRole = userDomainRoleService.updateUserDomainRoleWithJoinedData(id, userDomainRoleDetails);
        if (updatedUserDomainRole != null) {
            return ResponseEntity.ok(updatedUserDomainRole);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete user role assignment", description = "Delete a user-role assignment")
    @ApiResponse(responseCode = "204", description = "Assignment deleted successfully")
    public ResponseEntity<Void> deleteUserDomainRole(@Parameter(description = "Assignment ID") @PathVariable String id) {
        boolean deleted = userDomainRoleService.deleteUserDomainRole(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/{id}/activate")
    @Operation(summary = "Activate assignment", description = "Activate a user-role assignment")
    public ResponseEntity<UserDomainRoleDTO> activateUserDomainRole(@Parameter(description = "Assignment ID") @PathVariable String id, @RequestParam String assignedBy) {
        UserDomainRoleDTO userDomainRole = userDomainRoleService.activateUserDomainRoleWithJoinedData(id, assignedBy);
        if (userDomainRole != null) {
            return ResponseEntity.ok(userDomainRole);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/{id}/deactivate")
    @Operation(summary = "Deactivate assignment", description = "Deactivate a user-role assignment")
    public ResponseEntity<UserDomainRoleDTO> deactivateUserDomainRole(@Parameter(description = "Assignment ID") @PathVariable String id, @RequestParam String assignedBy) {
        UserDomainRoleDTO userDomainRole = userDomainRoleService.deactivateUserDomainRoleWithJoinedData(id, assignedBy);
        if (userDomainRole != null) {
            return ResponseEntity.ok(userDomainRole);
        }
        return ResponseEntity.notFound().build();
    }
}
