package com.novaflowusermanagement.controller;

import com.novaflowusermanagement.entity.PermissionType;
import com.novaflowusermanagement.service.PermissionTypeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/permission-types")
@Tag(name = "Permission Types", description = "Permission type management operations")
public class PermissionTypeController {

    @Autowired
    private PermissionTypeService permissionTypeService;

    @GetMapping
    @Operation(summary = "Get all permission types", description = "Retrieve all permission types with optional search")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved permission types")
    })
    public ResponseEntity<List<PermissionType>> getAllPermissionTypes(
            @Parameter(description = "Search term to filter permission types") 
            @RequestParam(required = false) String search) {
        try {
            List<PermissionType> permissionTypes;
            if (search != null && !search.trim().isEmpty()) {
                permissionTypes = permissionTypeService.searchPermissionTypes(search);
            } else {
                permissionTypes = permissionTypeService.getAllPermissionTypes();
            }
            return ResponseEntity.ok(permissionTypes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get permission type by ID", description = "Retrieve a specific permission type by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved permission type"),
        @ApiResponse(responseCode = "404", description = "Permission type not found")
    })
    public ResponseEntity<PermissionType> getPermissionTypeById(
            @Parameter(description = "Permission type ID") 
            @PathVariable String id) {
        try {
            Optional<PermissionType> permissionType = permissionTypeService.getPermissionTypeById(id);
            return permissionType.map(ResponseEntity::ok)
                                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping
    @Operation(summary = "Create new permission type", description = "Create a new permission type")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Permission type created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    public ResponseEntity<?> createPermissionType(@RequestBody PermissionType permissionType) {
        try {
            PermissionType createdPermissionType = permissionTypeService.createPermissionType(permissionType);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdPermissionType);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create permission type");
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update permission type", description = "Update an existing permission type")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Permission type updated successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input data"),
        @ApiResponse(responseCode = "404", description = "Permission type not found")
    })
    public ResponseEntity<?> updatePermissionType(
            @Parameter(description = "Permission type ID") 
            @PathVariable String id, 
            @RequestBody PermissionType permissionTypeDetails) {
        try {
            PermissionType updatedPermissionType = permissionTypeService.updatePermissionType(id, permissionTypeDetails);
            return ResponseEntity.ok(updatedPermissionType);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update permission type");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update permission type");
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete permission type", description = "Delete a permission type by ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Permission type deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Permission type not found")
    })
    public ResponseEntity<?> deletePermissionType(
            @Parameter(description = "Permission type ID") 
            @PathVariable String id) {
        try {
            permissionTypeService.deletePermissionType(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete permission type");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete permission type");
        }
    }
}
