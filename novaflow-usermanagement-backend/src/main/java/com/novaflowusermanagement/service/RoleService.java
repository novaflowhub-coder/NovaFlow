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
            role.setName(roleDetails.getName());
            role.setDescription(roleDetails.getDescription());
            role.setDomain(roleDetails.getDomain());
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
