package com.novaflowusermanagement.repository;

import com.novaflowusermanagement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByUsername(String username);
    
    List<User> findByStatus(String status);
    
    List<User> findByIsActive(Boolean isActive);
    
    @Query("SELECT u FROM User u WHERE u.name LIKE %:searchTerm% OR u.email LIKE %:searchTerm% OR u.department LIKE %:searchTerm%")
    List<User> findBySearchTerm(@Param("searchTerm") String searchTerm);
    
    @Query("SELECT u FROM User u JOIN u.userDomainRoles udr WHERE udr.domain.id = :domainId AND udr.isActive = true")
    List<User> findByDomainId(@Param("domainId") String domainId);
    
    @Query("SELECT u FROM User u JOIN u.userDomainRoles udr WHERE udr.role.id = :roleId AND udr.isActive = true")
    List<User> findByRoleId(@Param("roleId") String roleId);
}
