package com.novaflowusermanagement.service;

import com.novaflowusermanagement.entity.UserDomainRole;
import com.novaflowusermanagement.repository.UserDomainRoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserDomainRoleService {
    
    @Autowired
    private UserDomainRoleRepository userDomainRoleRepository;
    
    public List<UserDomainRole> getAllUserDomainRoles() {
        return userDomainRoleRepository.findAll();
    }
    
    public Optional<UserDomainRole> getUserDomainRoleById(String id) {
        return userDomainRoleRepository.findById(id);
    }
    
    public List<UserDomainRole> getUserDomainRolesByUser(String userId) {
        return userDomainRoleRepository.findByUserId(userId);
    }
    
    public List<UserDomainRole> getActiveUserDomainRolesByUser(String userId) {
        return userDomainRoleRepository.findActiveByUserId(userId);
    }
    
    public List<UserDomainRole> getUserDomainRolesByDomain(String domainId) {
        return userDomainRoleRepository.findByDomainId(domainId);
    }
    
    public List<UserDomainRole> getActiveUserDomainRolesByDomain(String domainId) {
        return userDomainRoleRepository.findActiveByDomainId(domainId);
    }
    
    public List<UserDomainRole> getUserDomainRolesByRole(String roleId) {
        return userDomainRoleRepository.findByRoleId(roleId);
    }
    
    public List<UserDomainRole> getActiveUserDomainRolesByUserAndDomain(String userId, String domainId) {
        return userDomainRoleRepository.findActiveByUserIdAndDomainId(userId, domainId);
    }
    
    public UserDomainRole createUserDomainRole(UserDomainRole userDomainRole) {
        if (userDomainRole.getId() == null || userDomainRole.getId().isEmpty()) {
            userDomainRole.setId(UUID.randomUUID().toString());
        }
        userDomainRole.setAssignedDate(LocalDateTime.now());
        return userDomainRoleRepository.save(userDomainRole);
    }
    
    public UserDomainRole updateUserDomainRole(String id, UserDomainRole userDomainRoleDetails) {
        Optional<UserDomainRole> optionalUserDomainRole = userDomainRoleRepository.findById(id);
        if (optionalUserDomainRole.isPresent()) {
            UserDomainRole userDomainRole = optionalUserDomainRole.get();
            userDomainRole.setUser(userDomainRoleDetails.getUser());
            userDomainRole.setDomain(userDomainRoleDetails.getDomain());
            userDomainRole.setRole(userDomainRoleDetails.getRole());
            userDomainRole.setIsActive(userDomainRoleDetails.getIsActive());
            userDomainRole.setAssignedBy(userDomainRoleDetails.getAssignedBy());
            return userDomainRoleRepository.save(userDomainRole);
        }
        return null;
    }
    
    public UserDomainRole activateUserDomainRole(String id, String assignedBy) {
        Optional<UserDomainRole> optionalUserDomainRole = userDomainRoleRepository.findById(id);
        if (optionalUserDomainRole.isPresent()) {
            UserDomainRole userDomainRole = optionalUserDomainRole.get();
            userDomainRole.setIsActive(true);
            userDomainRole.setAssignedBy(assignedBy);
            return userDomainRoleRepository.save(userDomainRole);
        }
        return null;
    }
    
    public UserDomainRole deactivateUserDomainRole(String id, String assignedBy) {
        Optional<UserDomainRole> optionalUserDomainRole = userDomainRoleRepository.findById(id);
        if (optionalUserDomainRole.isPresent()) {
            UserDomainRole userDomainRole = optionalUserDomainRole.get();
            userDomainRole.setIsActive(false);
            userDomainRole.setAssignedBy(assignedBy);
            return userDomainRoleRepository.save(userDomainRole);
        }
        return null;
    }
    
    public boolean deleteUserDomainRole(String id) {
        if (userDomainRoleRepository.existsById(id)) {
            userDomainRoleRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
