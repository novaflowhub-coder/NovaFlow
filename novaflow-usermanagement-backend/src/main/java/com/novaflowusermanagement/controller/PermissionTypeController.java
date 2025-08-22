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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/permission-types")
@CrossOrigin(origins = "*")
@Tag(name = "Permission Type Management", description = "APIs for managing permission types")
public class PermissionTypeController {

    @Autowired
    private PermissionTypeService permissionTypeService;

    @GetMapping
    @PreAuthorize("@authz.hasPermission(authentication, 'view', '/permission-management')")
    @Operation(summary = "Get all permission types", description = "Retrieve all permission types")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved permission types")
    public ResponseEntity<List<PermissionType>> getAllPermissionTypes() {
        List<PermissionType> permissionTypes = permissionTypeService.getAllPermissionTypes();
        return ResponseEntity.ok(permissionTypes);
    }

    @GetMapping("/{id}")
    @PreAuthorize("@authz.hasPermission(authentication, 'view', '/permission-management')")
    @Operation(summary = "Get permission type by ID", description = "Retrieve a specific permission type by its ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Permission type found"),
        @ApiResponse(responseCode = "404", description = "Permission type not found")
    })
    public ResponseEntity<PermissionType> getPermissionTypeById(@Parameter(description = "Permission Type ID") @PathVariable String id) {
        Optional<PermissionType> permissionType = permissionTypeService.getPermissionTypeById(id);
        return permissionType.map(ResponseEntity::ok)
                           .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/name/{name}")
    @PreAuthorize("@authz.hasPermission(authentication, 'view', '/permission-management')")
    @Operation(summary = "Get permission type by name", description = "Retrieve a permission type by its name")
    public ResponseEntity<PermissionType> getPermissionTypeByName(@Parameter(description = "Permission Type name") @PathVariable String name) {
        Optional<PermissionType> permissionType = permissionTypeService.getPermissionTypeByName(name);
        return permissionType.map(ResponseEntity::ok)
                           .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    @PreAuthorize("@authz.hasPermission(authentication, 'view', '/permission-management')")
    @Operation(summary = "Search permission types", description = "Search permission types by name or description")
    public ResponseEntity<List<PermissionType>> searchPermissionTypes(@Parameter(description = "Search term") @RequestParam String term) {
        List<PermissionType> permissionTypes = permissionTypeService.searchPermissionTypes(term);
        return ResponseEntity.ok(permissionTypes);
    }

    @PostMapping
    @PreAuthorize("@authz.hasPermission(authentication, 'edit', '/permission-management')")
    @Operation(summary = "Create permission type", description = "Create a new permission type")
    @ApiResponse(responseCode = "201", description = "Permission type created successfully")
    public ResponseEntity<PermissionType> createPermissionType(@Valid @RequestBody PermissionType permissionType) {
        try {
            PermissionType createdPermissionType = permissionTypeService.createPermissionType(permissionType);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdPermissionType);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("@authz.hasPermission(authentication, 'edit', '/permission-management')")
    @Operation(summary = "Update permission type", description = "Update an existing permission type")
    public ResponseEntity<PermissionType> updatePermissionType(@Parameter(description = "Permission Type ID") @PathVariable String id, 
                                                             @Valid @RequestBody PermissionType permissionTypeDetails) {
        try {
            PermissionType updatedPermissionType = permissionTypeService.updatePermissionType(id, permissionTypeDetails);
            if (updatedPermissionType != null) {
                return ResponseEntity.ok(updatedPermissionType);
            }
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("@authz.hasPermission(authentication, 'delete', '/permission-management')")
    @Operation(summary = "Delete permission type", description = "Delete a permission type")
    @ApiResponse(responseCode = "204", description = "Permission type deleted successfully")
    public ResponseEntity<Void> deletePermissionType(@Parameter(description = "Permission Type ID") @PathVariable String id) {
        boolean deleted = permissionTypeService.deletePermissionType(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
