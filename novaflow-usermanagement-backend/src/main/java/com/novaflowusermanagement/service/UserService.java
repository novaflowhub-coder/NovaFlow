package com.novaflowusermanagement.service;

import com.novaflowusermanagement.entity.User;
import com.novaflowusermanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }
    
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    
    public List<User> getUsersByStatus(String status) {
        return userRepository.findByStatus(status);
    }
    
    public List<User> getActiveUsers() {
        return userRepository.findByIsActive(true);
    }
    
    public List<User> searchUsers(String searchTerm) {
        return userRepository.findBySearchTerm(searchTerm);
    }
    
    public List<User> getUsersByRole(String roleId) {
        return userRepository.findByRoleId(roleId);
    }
    
    public User createUser(User user) {
        // Validate required fields
        if (user.getName() == null || user.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("User name is required");
        }
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("User email is required");
        }
        
        // Check for duplicate email
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalArgumentException("User with this email already exists");
        }
        
        // Check for duplicate username if provided
        if (user.getUsername() != null && !user.getUsername().trim().isEmpty()) {
            if (userRepository.findByUsername(user.getUsername()).isPresent()) {
                throw new IllegalArgumentException("User with this username already exists");
            }
        }
        
        if (user.getId() == null || user.getId().isEmpty()) {
            user.setId(UUID.randomUUID().toString());
        }
        user.setCreatedDate(LocalDateTime.now());
        return userRepository.save(user);
    }
    
    public User updateUser(String id, User userDetails) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            
            // Validate required fields
            if (userDetails.getName() == null || userDetails.getName().trim().isEmpty()) {
                throw new IllegalArgumentException("User name is required");
            }
            if (userDetails.getEmail() == null || userDetails.getEmail().trim().isEmpty()) {
                throw new IllegalArgumentException("User email is required");
            }
            
            // Check for duplicate email (excluding current user)
            Optional<User> existingEmailUser = userRepository.findByEmail(userDetails.getEmail());
            if (existingEmailUser.isPresent() && !existingEmailUser.get().getId().equals(id)) {
                throw new IllegalArgumentException("User with this email already exists");
            }
            
            // Check for duplicate username if provided (excluding current user)
            if (userDetails.getUsername() != null && !userDetails.getUsername().trim().isEmpty()) {
                Optional<User> existingUsernameUser = userRepository.findByUsername(userDetails.getUsername());
                if (existingUsernameUser.isPresent() && !existingUsernameUser.get().getId().equals(id)) {
                    throw new IllegalArgumentException("User with this username already exists");
                }
            }
            
            user.setName(userDetails.getName());
            user.setEmail(userDetails.getEmail());
            user.setUsername(userDetails.getUsername());
            user.setFullName(userDetails.getFullName());
            user.setDepartment(userDetails.getDepartment());
            user.setStatus(userDetails.getStatus());
            user.setIsActive(userDetails.getIsActive());
            user.setUpdatedBy(userDetails.getUpdatedBy());
            user.setUpdatedDate(LocalDateTime.now());
            return userRepository.save(user);
        }
        return null;
    }
    
    public User updateLastLogin(String id) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setLastLogin(LocalDateTime.now());
            return userRepository.save(user);
        }
        return null;
    }
    
    public User activateUser(String id, String updatedBy) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setIsActive(true);
            user.setStatus("Active");
            user.setUpdatedBy(updatedBy);
            user.setUpdatedDate(LocalDateTime.now());
            return userRepository.save(user);
        }
        return null;
    }
    
    public User deactivateUser(String id, String updatedBy) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setIsActive(false);
            user.setStatus("Inactive");
            user.setUpdatedBy(updatedBy);
            user.setUpdatedDate(LocalDateTime.now());
            return userRepository.save(user);
        }
        return null;
    }
    
    public boolean deleteUser(String id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
