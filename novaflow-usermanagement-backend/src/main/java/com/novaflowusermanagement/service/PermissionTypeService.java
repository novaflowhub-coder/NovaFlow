package com.novaflowusermanagement.service;

import com.novaflowusermanagement.entity.PermissionType;
import com.novaflowusermanagement.repository.PermissionTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PermissionTypeService {

    @Autowired
    private PermissionTypeRepository permissionTypeRepository;

    public List<PermissionType> getAllPermissionTypes() {
        return permissionTypeRepository.findAll();
    }

    public Optional<PermissionType> getPermissionTypeById(String id) {
        return permissionTypeRepository.findById(id);
    }

    public List<PermissionType> searchPermissionTypes(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return getAllPermissionTypes();
        }
        return permissionTypeRepository.findBySearchTerm(searchTerm.trim());
    }

    public PermissionType createPermissionType(PermissionType permissionType) {
        // Validate required fields
        if (permissionType.getName() == null || permissionType.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Permission type name is required");
        }
        if (permissionType.getCreatedBy() == null || permissionType.getCreatedBy().trim().isEmpty()) {
            throw new IllegalArgumentException("Created by is required");
        }
        
        // Check for duplicate name
        Optional<PermissionType> existingPermissionType = permissionTypeRepository.findByName(permissionType.getName());
        if (existingPermissionType.isPresent()) {
            throw new IllegalArgumentException("Permission type with this name already exists");
        }
        
        if (permissionType.getId() == null || permissionType.getId().isEmpty()) {
            permissionType.setId(UUID.randomUUID().toString());
        }
        permissionType.setCreatedDate(LocalDateTime.now());
        
        return permissionTypeRepository.save(permissionType);
    }

    public PermissionType updatePermissionType(String id, PermissionType permissionTypeDetails) {
        Optional<PermissionType> optionalPermissionType = permissionTypeRepository.findById(id);
        if (optionalPermissionType.isPresent()) {
            PermissionType permissionType = optionalPermissionType.get();
            
            // Validate required fields
            if (permissionTypeDetails.getName() == null || permissionTypeDetails.getName().trim().isEmpty()) {
                throw new IllegalArgumentException("Permission type name is required");
            }
            
            // Check for duplicate name (excluding current permission type)
            Optional<PermissionType> existingPermissionType = permissionTypeRepository.findByName(permissionTypeDetails.getName());
            if (existingPermissionType.isPresent() && !existingPermissionType.get().getId().equals(id)) {
                throw new IllegalArgumentException("Permission type with this name already exists");
            }
            
            permissionType.setName(permissionTypeDetails.getName());
            permissionType.setDescription(permissionTypeDetails.getDescription());
            permissionType.setLastModifiedBy(permissionTypeDetails.getLastModifiedBy());
            permissionType.setLastModifiedDate(LocalDateTime.now());
            
            return permissionTypeRepository.save(permissionType);
        } else {
            throw new RuntimeException("Permission type not found with id: " + id);
        }
    }

    public void deletePermissionType(String id) {
        if (permissionTypeRepository.existsById(id)) {
            permissionTypeRepository.deleteById(id);
        } else {
            throw new RuntimeException("Permission type not found with id: " + id);
        }
    }
}
