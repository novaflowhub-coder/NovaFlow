package com.novaflowusermanagement.service;

import com.novaflowusermanagement.entity.PermissionType;
import com.novaflowusermanagement.repository.PermissionTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PermissionTypeService {

    @Autowired
    private PermissionTypeRepository permissionTypeRepository;

    @Autowired
    private AuditLogger auditLogger;

    public List<PermissionType> getAllPermissionTypes() {
        return permissionTypeRepository.findAll();
    }

    public Optional<PermissionType> getPermissionTypeById(String id) {
        return permissionTypeRepository.findById(id);
    }

    public Optional<PermissionType> getPermissionTypeByName(String name) {
        return permissionTypeRepository.findByName(name);
    }

    public PermissionType createPermissionType(PermissionType permissionType) {
        if (permissionTypeRepository.existsByName(permissionType.getName())) {
            throw new IllegalArgumentException("Permission type with name '" + permissionType.getName() + "' already exists");
        }
        
        permissionType.setCreatedDate(LocalDateTime.now());
        PermissionType savedPermissionType = permissionTypeRepository.save(permissionType);
        
        auditLogger.emit("PERMISSION_TYPE_CREATED", "PERMISSION_TYPE", savedPermissionType.getId(), "SUCCESS", 
            "Permission type created: " + savedPermissionType.getName());
        
        return savedPermissionType;
    }

    public PermissionType updatePermissionType(String id, PermissionType permissionTypeDetails) {
        Optional<PermissionType> existingPermissionTypeOpt = permissionTypeRepository.findById(id);
        if (existingPermissionTypeOpt.isEmpty()) {
            return null;
        }

        PermissionType existingPermissionType = existingPermissionTypeOpt.get();
        
        // Check if name is being changed and if new name already exists
        if (!existingPermissionType.getName().equals(permissionTypeDetails.getName()) && 
            permissionTypeRepository.existsByName(permissionTypeDetails.getName())) {
            throw new IllegalArgumentException("Permission type with name '" + permissionTypeDetails.getName() + "' already exists");
        }

        existingPermissionType.setName(permissionTypeDetails.getName());
        existingPermissionType.setDescription(permissionTypeDetails.getDescription());
        existingPermissionType.setLastModifiedBy(permissionTypeDetails.getLastModifiedBy());
        existingPermissionType.setLastModifiedDate(LocalDateTime.now());

        PermissionType updatedPermissionType = permissionTypeRepository.save(existingPermissionType);
        
        auditLogger.emit("PERMISSION_TYPE_UPDATED", "PERMISSION_TYPE", updatedPermissionType.getId(), "SUCCESS", 
            "Permission type updated: " + updatedPermissionType.getName());
        
        return updatedPermissionType;
    }

    public boolean deletePermissionType(String id) {
        if (permissionTypeRepository.existsById(id)) {
            Optional<PermissionType> permissionTypeOpt = permissionTypeRepository.findById(id);
            permissionTypeRepository.deleteById(id);
            
            if (permissionTypeOpt.isPresent()) {
                PermissionType permissionType = permissionTypeOpt.get();
                auditLogger.emit("PERMISSION_TYPE_DELETED", "PERMISSION_TYPE", id, "SUCCESS", 
                    "Permission type deleted: " + permissionType.getName());
            }
            
            return true;
        }
        return false;
    }

    public List<PermissionType> searchPermissionTypes(String searchTerm) {
        return permissionTypeRepository.findAll().stream()
            .filter(permissionType -> permissionType.getName().toLowerCase().contains(searchTerm.toLowerCase()) ||
                                    (permissionType.getDescription() != null && permissionType.getDescription().toLowerCase().contains(searchTerm.toLowerCase())))
            .toList();
    }
}
