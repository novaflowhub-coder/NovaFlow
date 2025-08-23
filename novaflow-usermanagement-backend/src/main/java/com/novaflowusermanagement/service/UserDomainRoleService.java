package com.novaflowusermanagement.service;

import com.novaflowusermanagement.entity.UserDomainRole;
import com.novaflowusermanagement.entity.User;
import com.novaflowusermanagement.entity.Role;
import com.novaflowusermanagement.dto.UserDomainRoleDTO;
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
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private RoleService roleService;
    
    // DTO methods with joined data
    public List<UserDomainRoleDTO> getAllUserDomainRolesWithJoinedData() {
        return userDomainRoleRepository.findAllWithJoinedData();
    }
    
    public Optional<UserDomainRoleDTO> getUserDomainRoleByIdWithJoinedData(String id) {
        return userDomainRoleRepository.findByIdWithJoinedData(id);
    }
    
    public List<UserDomainRoleDTO> getUserDomainRolesByUserWithJoinedData(String userId) {
        return userDomainRoleRepository.findByUserIdWithJoinedData(userId);
    }
    
    public List<UserDomainRoleDTO> getActiveUserDomainRolesByUserWithJoinedData(String userId) {
        return userDomainRoleRepository.findActiveByUserIdWithJoinedData(userId);
    }
    
    public List<UserDomainRoleDTO> getUserDomainRolesByRoleWithJoinedData(String roleId) {
        return userDomainRoleRepository.findByRoleIdWithJoinedData(roleId);
    }
    
    public List<UserDomainRoleDTO> searchUserDomainRolesWithJoinedData(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return getAllUserDomainRolesWithJoinedData();
        }
        return userDomainRoleRepository.findAllWithJoinedDataBySearch(searchTerm.trim());
    }
    
    // Original entity methods (kept for backward compatibility)
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
    
    public List<UserDomainRole> getUserDomainRolesByRole(String roleId) {
        return userDomainRoleRepository.findByRoleId(roleId);
    }
    
    public UserDomainRole createUserDomainRole(UserDomainRole userDomainRole) {
        if (userDomainRole.getId() == null || userDomainRole.getId().isEmpty()) {
            userDomainRole.setId(UUID.randomUUID().toString());
        }
        userDomainRole.setAssignedDate(LocalDateTime.now());
        return userDomainRoleRepository.save(userDomainRole);
    }
    
    // New method to create UserDomainRole from IDs
    public UserDomainRole createUserDomainRoleFromIds(String userId, String roleId, String assignedBy) {
        // Fetch User and Role entities
        Optional<User> userOpt = userService.getUserById(userId);
        Optional<Role> roleOpt = roleService.getRoleById(roleId);
        
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found with ID: " + userId);
        }
        if (roleOpt.isEmpty()) {
            throw new RuntimeException("Role not found with ID: " + roleId);
        }
        
        UserDomainRole userDomainRole = new UserDomainRole();
        userDomainRole.setId(UUID.randomUUID().toString());
        userDomainRole.setUser(userOpt.get());
        userDomainRole.setRole(roleOpt.get());
        userDomainRole.setIsActive(true);
        userDomainRole.setAssignedBy(assignedBy);
        userDomainRole.setAssignedDate(LocalDateTime.now());
        
        return userDomainRoleRepository.save(userDomainRole);
    }
    
    public UserDomainRole updateUserDomainRole(String id, UserDomainRole userDomainRoleDetails) {
        Optional<UserDomainRole> optionalUserDomainRole = userDomainRoleRepository.findById(id);
        if (optionalUserDomainRole.isPresent()) {
            UserDomainRole userDomainRole = optionalUserDomainRole.get();
            // Only update fields that are allowed to be changed
            // Don't update user and role as they should remain the same
            if (userDomainRoleDetails.getIsActive() != null) {
                userDomainRole.setIsActive(userDomainRoleDetails.getIsActive());
            }
            if (userDomainRoleDetails.getAssignedBy() != null) {
                userDomainRole.setAssignedBy(userDomainRoleDetails.getAssignedBy());
            }
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
    
    // Additional DTO methods for create/update operations
    public UserDomainRoleDTO createUserDomainRoleWithJoinedData(UserDomainRole userDomainRole) {
        UserDomainRole created = createUserDomainRole(userDomainRole);
        Optional<UserDomainRoleDTO> dto = getUserDomainRoleByIdWithJoinedData(created.getId());
        return dto.orElse(null);
    }
    
    public UserDomainRoleDTO createUserDomainRoleFromIdsWithJoinedData(String userId, String roleId, String assignedBy) {
        UserDomainRole created = createUserDomainRoleFromIds(userId, roleId, assignedBy);
        Optional<UserDomainRoleDTO> dto = getUserDomainRoleByIdWithJoinedData(created.getId());
        return dto.orElse(null);
    }
    
    public UserDomainRoleDTO updateUserDomainRoleWithJoinedData(String id, UserDomainRole userDomainRoleDetails) {
        UserDomainRole updated = updateUserDomainRole(id, userDomainRoleDetails);
        if (updated != null) {
            Optional<UserDomainRoleDTO> dto = getUserDomainRoleByIdWithJoinedData(updated.getId());
            return dto.orElse(null);
        }
        return null;
    }
    
    public UserDomainRoleDTO activateUserDomainRoleWithJoinedData(String id, String assignedBy) {
        UserDomainRole activated = activateUserDomainRole(id, assignedBy);
        if (activated != null) {
            Optional<UserDomainRoleDTO> dto = getUserDomainRoleByIdWithJoinedData(activated.getId());
            return dto.orElse(null);
        }
        return null;
    }
    
    public UserDomainRoleDTO deactivateUserDomainRoleWithJoinedData(String id, String assignedBy) {
        UserDomainRole deactivated = deactivateUserDomainRole(id, assignedBy);
        if (deactivated != null) {
            Optional<UserDomainRoleDTO> dto = getUserDomainRoleByIdWithJoinedData(deactivated.getId());
            return dto.orElse(null);
        }
        return null;
    }
}
