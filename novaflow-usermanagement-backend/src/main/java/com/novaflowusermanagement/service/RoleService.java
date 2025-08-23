package com.novaflowusermanagement.service;

import com.novaflowusermanagement.entity.Role;
import com.novaflowusermanagement.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class RoleService {
    
    @Autowired
    private RoleRepository roleRepository;
    
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }
    
    public Optional<Role> getRoleById(String id) {
        return roleRepository.findById(id);
    }
    
    public List<Role> getRolesByDomain(String domainId) {
        return roleRepository.findByDomainId(domainId);
    }
    
    public List<Role> getRolesByName(String name) {
        return roleRepository.findByName(name);
    }
    
    public List<Role> searchRoles(String searchTerm) {
        return roleRepository.findBySearchTerm(searchTerm);
    }
    
    public List<Role> searchRolesByDomain(String domainId, String searchTerm) {
        return roleRepository.findByDomainIdAndSearchTerm(domainId, searchTerm);
    }
    
    public Role createRole(Role role) {
        // Validate required fields
        if (role.getName() == null || role.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Role name is required");
        }
        if (role.getDomainId() == null || role.getDomainId().trim().isEmpty()) {
            throw new IllegalArgumentException("Domain ID is required");
        }
        
        // Check for duplicate role name within the same domain
        Optional<Role> existingRole = roleRepository.findByDomainIdAndName(role.getDomainId(), role.getName());
        if (existingRole.isPresent()) {
            throw new IllegalArgumentException("Role with this name already exists in the domain");
        }
        
        if (role.getId() == null || role.getId().isEmpty()) {
            role.setId(UUID.randomUUID().toString());
        }
        role.setCreatedDate(LocalDateTime.now());
        return roleRepository.save(role);
    }
    
    public Role updateRole(String id, Role roleDetails) {
        Optional<Role> optionalRole = roleRepository.findById(id);
        if (optionalRole.isPresent()) {
            Role role = optionalRole.get();
            
            // Validate required fields
            if (roleDetails.getName() == null || roleDetails.getName().trim().isEmpty()) {
                throw new IllegalArgumentException("Role name is required");
            }
            if (roleDetails.getDomainId() == null || roleDetails.getDomainId().trim().isEmpty()) {
                throw new IllegalArgumentException("Domain ID is required");
            }
            
            // Check for duplicate role name within the same domain (excluding current role)
            Optional<Role> existingRole = roleRepository.findByDomainIdAndName(roleDetails.getDomainId(), roleDetails.getName());
            if (existingRole.isPresent() && !existingRole.get().getId().equals(id)) {
                throw new IllegalArgumentException("Role with this name already exists in the domain");
            }
            
            role.setName(roleDetails.getName());
            role.setDescription(roleDetails.getDescription());
            role.setDomainId(roleDetails.getDomainId());
            role.setPermissions(roleDetails.getPermissions());
            role.setUpdatedBy(roleDetails.getUpdatedBy());
            role.setUpdatedDate(LocalDateTime.now());
            return roleRepository.save(role);
        }
        return null;
    }
    
    public Role updateUserCount(String id, Integer userCount) {
        Optional<Role> optionalRole = roleRepository.findById(id);
        if (optionalRole.isPresent()) {
            Role role = optionalRole.get();
            role.setUserCount(userCount);
            role.setUpdatedDate(LocalDateTime.now());
            return roleRepository.save(role);
        }
        return null;
    }
    
    public boolean deleteRole(String id) {
        if (roleRepository.existsById(id)) {
            roleRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
