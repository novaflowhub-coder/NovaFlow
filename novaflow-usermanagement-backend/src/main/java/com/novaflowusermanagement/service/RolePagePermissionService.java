package com.novaflowusermanagement.service;

import com.novaflowusermanagement.entity.RolePagePermission;
import com.novaflowusermanagement.entity.Page;
import com.novaflowusermanagement.entity.PermissionType;
import com.novaflowusermanagement.repository.RolePagePermissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class RolePagePermissionService {
    
    @Autowired
    private RolePagePermissionRepository rolePagePermissionRepository;
    
    @Autowired
    private PageService pageService;
    
    @Autowired
    private PermissionTypeService permissionTypeService;
    
    public List<RolePagePermission> getAllRolePagePermissions() {
        return rolePagePermissionRepository.findAllWithJoinedData();
    }
    
    public List<RolePagePermission> searchRolePagePermissions(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return getAllRolePagePermissions();
        }
        return rolePagePermissionRepository.findAllWithJoinedDataBySearch(searchTerm.trim());
    }
    
    public Optional<RolePagePermission> getRolePagePermissionById(String id) {
        return rolePagePermissionRepository.findById(id);
    }
    
    public List<RolePagePermission> getRolePagePermissionsByRole(String roleName) {
        return rolePagePermissionRepository.findByRoleNameWithJoinedData(roleName);
    }
    
    public List<RolePagePermission> getRolePagePermissionsByPage(String pageId) {
        return rolePagePermissionRepository.findByPageId(pageId);
    }
    
    public List<RolePagePermission> getGrantedPermissionsByRole(String roleName) {
        return rolePagePermissionRepository.findGrantedPermissionsByRole(roleName);
    }
    
    public List<RolePagePermission> getGrantedPermissionsByPage(String pageId) {
        return rolePagePermissionRepository.findGrantedPermissionsByPage(pageId);
    }
    
    public RolePagePermission createRolePagePermission(RolePagePermission rolePagePermission) {
        if (rolePagePermission.getId() == null || rolePagePermission.getId().isEmpty()) {
            rolePagePermission.setId(UUID.randomUUID().toString());
        }
        rolePagePermission.setCreatedDate(LocalDateTime.now());
        return rolePagePermissionRepository.save(rolePagePermission);
    }
    
    public RolePagePermission createRolePagePermissionFromIds(String roleName, String pageId, 
                                                            String permissionTypeId, Boolean isGranted, 
                                                            String createdBy) {
        // Fetch Page and PermissionType entities
        Optional<Page> pageOpt = pageService.getPageById(pageId);
        Optional<PermissionType> permissionTypeOpt = permissionTypeService.getPermissionTypeById(permissionTypeId);
        
        if (pageOpt.isEmpty()) {
            throw new RuntimeException("Page not found with ID: " + pageId);
        }
        if (permissionTypeOpt.isEmpty()) {
            throw new RuntimeException("Permission type not found with ID: " + permissionTypeId);
        }
        
        // Check if permission already exists
        Optional<RolePagePermission> existing = rolePagePermissionRepository
            .findByRoleNameAndPageIdAndPermissionTypeId(roleName, pageId, permissionTypeId);
        
        if (existing.isPresent()) {
            // Update existing permission
            RolePagePermission existingPermission = existing.get();
            existingPermission.setIsGranted(isGranted);
            existingPermission.setLastModifiedBy(createdBy);
            existingPermission.setLastModifiedDate(LocalDateTime.now());
            return rolePagePermissionRepository.save(existingPermission);
        } else {
            // Create new permission
            RolePagePermission rolePagePermission = new RolePagePermission();
            rolePagePermission.setId(UUID.randomUUID().toString());
            rolePagePermission.setRoleName(roleName);
            rolePagePermission.setPage(pageOpt.get());
            rolePagePermission.setPermissionType(permissionTypeOpt.get());
            rolePagePermission.setIsGranted(isGranted);
            rolePagePermission.setCreatedBy(createdBy);
            rolePagePermission.setCreatedDate(LocalDateTime.now());
            
            return rolePagePermissionRepository.save(rolePagePermission);
        }
    }
    
    public RolePagePermission updateRolePagePermission(String id, RolePagePermission rolePagePermissionDetails) {
        Optional<RolePagePermission> optionalRolePagePermission = rolePagePermissionRepository.findById(id);
        if (optionalRolePagePermission.isPresent()) {
            RolePagePermission rolePagePermission = optionalRolePagePermission.get();
            
            if (rolePagePermissionDetails.getRoleName() != null) {
                rolePagePermission.setRoleName(rolePagePermissionDetails.getRoleName());
            }
            if (rolePagePermissionDetails.getIsGranted() != null) {
                rolePagePermission.setIsGranted(rolePagePermissionDetails.getIsGranted());
            }
            if (rolePagePermissionDetails.getLastModifiedBy() != null) {
                rolePagePermission.setLastModifiedBy(rolePagePermissionDetails.getLastModifiedBy());
            }
            
            rolePagePermission.setLastModifiedDate(LocalDateTime.now());
            return rolePagePermissionRepository.save(rolePagePermission);
        }
        return null;
    }
    
    public boolean deleteRolePagePermission(String id) {
        if (rolePagePermissionRepository.existsById(id)) {
            rolePagePermissionRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    public RolePagePermission grantPermission(String id, String modifiedBy) {
        Optional<RolePagePermission> optionalRolePagePermission = rolePagePermissionRepository.findById(id);
        if (optionalRolePagePermission.isPresent()) {
            RolePagePermission rolePagePermission = optionalRolePagePermission.get();
            rolePagePermission.setIsGranted(true);
            rolePagePermission.setLastModifiedBy(modifiedBy);
            rolePagePermission.setLastModifiedDate(LocalDateTime.now());
            return rolePagePermissionRepository.save(rolePagePermission);
        }
        return null;
    }
    
    public RolePagePermission revokePermission(String id, String modifiedBy) {
        Optional<RolePagePermission> optionalRolePagePermission = rolePagePermissionRepository.findById(id);
        if (optionalRolePagePermission.isPresent()) {
            RolePagePermission rolePagePermission = optionalRolePagePermission.get();
            rolePagePermission.setIsGranted(false);
            rolePagePermission.setLastModifiedBy(modifiedBy);
            rolePagePermission.setLastModifiedDate(LocalDateTime.now());
            return rolePagePermissionRepository.save(rolePagePermission);
        }
        return null;
    }
    
    public void bulkUpdateRolePermissions(String roleName, List<String> pageIds, 
                                        List<String> permissionTypeIds, Boolean isGranted, 
                                        String modifiedBy) {
        for (String pageId : pageIds) {
            for (String permissionTypeId : permissionTypeIds) {
                createRolePagePermissionFromIds(roleName, pageId, permissionTypeId, isGranted, modifiedBy);
            }
        }
    }
}
