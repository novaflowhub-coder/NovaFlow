package com.novaflowusermanagement.service;

import com.novaflowusermanagement.entity.RolePagePermission;
import com.novaflowusermanagement.entity.Page;
import com.novaflowusermanagement.entity.PermissionType;
import com.novaflowusermanagement.repository.RolePagePermissionRepository;
import com.novaflowusermanagement.repository.PageRepository;
import com.novaflowusermanagement.repository.PermissionTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@Transactional
public class RolePagePermissionService {

    @Autowired
    private RolePagePermissionRepository rolePagePermissionRepository;

    @Autowired
    private PageRepository pageRepository;

    @Autowired
    private PermissionTypeRepository permissionTypeRepository;

    @Autowired
    private AuditLogger auditLogger;

    public List<RolePagePermission> getAllRolePagePermissions() {
        return rolePagePermissionRepository.findAll();
    }

    public Optional<RolePagePermission> getRolePagePermissionById(String id) {
        return rolePagePermissionRepository.findById(id);
    }

    public List<RolePagePermission> getPermissionsByRoles(Set<String> roleNames) {
        return rolePagePermissionRepository.findAllGrantedPermissionsByRoles(roleNames);
    }

    public List<RolePagePermission> getPermissionsByRoleAndPage(String roleName, String pageId, String permissionTypeId) {
        return rolePagePermissionRepository.findByRoleNameAndPageIdAndPermissionTypeId(roleName, pageId, permissionTypeId);
    }

    public RolePagePermission createRolePagePermission(RolePagePermission rolePagePermission) {
        // Validate that page and permission type exist
        Optional<Page> pageOpt = pageRepository.findById(rolePagePermission.getPage().getId());
        Optional<PermissionType> permissionTypeOpt = permissionTypeRepository.findById(rolePagePermission.getPermissionType().getId());
        
        if (pageOpt.isEmpty()) {
            throw new IllegalArgumentException("Page with ID '" + rolePagePermission.getPage().getId() + "' does not exist");
        }
        if (permissionTypeOpt.isEmpty()) {
            throw new IllegalArgumentException("Permission type with ID '" + rolePagePermission.getPermissionType().getId() + "' does not exist");
        }

        rolePagePermission.setPage(pageOpt.get());
        rolePagePermission.setPermissionType(permissionTypeOpt.get());
        rolePagePermission.setCreatedDate(LocalDateTime.now());
        
        RolePagePermission savedPermission = rolePagePermissionRepository.save(rolePagePermission);
        
        auditLogger.emitPermissionChange(
            savedPermission.getRoleName(),
            savedPermission.getPage().getId(),
            savedPermission.getPermissionType().getId(),
            savedPermission.getIsGranted(),
            savedPermission.getCreatedBy()
        );
        
        return savedPermission;
    }

    public RolePagePermission updateRolePagePermission(String id, RolePagePermission permissionDetails) {
        Optional<RolePagePermission> existingPermissionOpt = rolePagePermissionRepository.findById(id);
        if (existingPermissionOpt.isEmpty()) {
            return null;
        }

        RolePagePermission existingPermission = existingPermissionOpt.get();
        boolean wasGranted = existingPermission.getIsGranted();
        
        existingPermission.setRoleName(permissionDetails.getRoleName());
        existingPermission.setIsGranted(permissionDetails.getIsGranted());
        existingPermission.setLastModifiedBy(permissionDetails.getLastModifiedBy());
        existingPermission.setLastModifiedDate(LocalDateTime.now());

        // Update page and permission type if provided
        if (permissionDetails.getPage() != null && permissionDetails.getPage().getId() != null) {
            Optional<Page> pageOpt = pageRepository.findById(permissionDetails.getPage().getId());
            if (pageOpt.isPresent()) {
                existingPermission.setPage(pageOpt.get());
            }
        }

        if (permissionDetails.getPermissionType() != null && permissionDetails.getPermissionType().getId() != null) {
            Optional<PermissionType> permissionTypeOpt = permissionTypeRepository.findById(permissionDetails.getPermissionType().getId());
            if (permissionTypeOpt.isPresent()) {
                existingPermission.setPermissionType(permissionTypeOpt.get());
            }
        }

        RolePagePermission updatedPermission = rolePagePermissionRepository.save(existingPermission);
        
        // Log audit event if grant status changed
        if (wasGranted != updatedPermission.getIsGranted()) {
            auditLogger.emitPermissionChange(
                updatedPermission.getRoleName(),
                updatedPermission.getPage().getId(),
                updatedPermission.getPermissionType().getId(),
                updatedPermission.getIsGranted(),
                updatedPermission.getLastModifiedBy()
            );
        }
        
        return updatedPermission;
    }

    public RolePagePermission grantPermission(String roleName, String pageId, String permissionTypeId, String grantedBy) {
        List<RolePagePermission> existing = rolePagePermissionRepository.findByRoleNameAndPageIdAndPermissionTypeId(roleName, pageId, permissionTypeId);
        
        if (!existing.isEmpty()) {
            RolePagePermission permission = existing.get(0);
            permission.setIsGranted(true);
            permission.setLastModifiedBy(grantedBy);
            permission.setLastModifiedDate(LocalDateTime.now());
            
            RolePagePermission updatedPermission = rolePagePermissionRepository.save(permission);
            auditLogger.emitPermissionChange(roleName, pageId, permissionTypeId, true, grantedBy);
            return updatedPermission;
        } else {
            // Create new permission
            Optional<Page> pageOpt = pageRepository.findById(pageId);
            Optional<PermissionType> permissionTypeOpt = permissionTypeRepository.findById(permissionTypeId);
            
            if (pageOpt.isEmpty() || permissionTypeOpt.isEmpty()) {
                throw new IllegalArgumentException("Page or Permission Type not found");
            }

            RolePagePermission newPermission = new RolePagePermission();
            newPermission.setId(java.util.UUID.randomUUID().toString());
            newPermission.setRoleName(roleName);
            newPermission.setPage(pageOpt.get());
            newPermission.setPermissionType(permissionTypeOpt.get());
            newPermission.setIsGranted(true);
            newPermission.setCreatedBy(grantedBy);
            newPermission.setCreatedDate(LocalDateTime.now());
            
            RolePagePermission savedPermission = rolePagePermissionRepository.save(newPermission);
            auditLogger.emitPermissionChange(roleName, pageId, permissionTypeId, true, grantedBy);
            return savedPermission;
        }
    }

    public boolean revokePermission(String roleName, String pageId, String permissionTypeId, String revokedBy) {
        List<RolePagePermission> existing = rolePagePermissionRepository.findByRoleNameAndPageIdAndPermissionTypeId(roleName, pageId, permissionTypeId);
        
        if (!existing.isEmpty()) {
            RolePagePermission permission = existing.get(0);
            permission.setIsGranted(false);
            permission.setLastModifiedBy(revokedBy);
            permission.setLastModifiedDate(LocalDateTime.now());
            
            rolePagePermissionRepository.save(permission);
            auditLogger.emitPermissionChange(roleName, pageId, permissionTypeId, false, revokedBy);
            return true;
        }
        return false;
    }

    public boolean deleteRolePagePermission(String id) {
        if (rolePagePermissionRepository.existsById(id)) {
            Optional<RolePagePermission> permissionOpt = rolePagePermissionRepository.findById(id);
            rolePagePermissionRepository.deleteById(id);
            
            if (permissionOpt.isPresent()) {
                RolePagePermission permission = permissionOpt.get();
                auditLogger.emit("ROLE_PAGE_PERMISSION_DELETED", "ROLE_PAGE_PERMISSION", id, "SUCCESS", 
                    String.format("Role page permission deleted: %s on %s", 
                        permission.getRoleName(), permission.getPage().getPath()));
            }
            
            return true;
        }
        return false;
    }
}
