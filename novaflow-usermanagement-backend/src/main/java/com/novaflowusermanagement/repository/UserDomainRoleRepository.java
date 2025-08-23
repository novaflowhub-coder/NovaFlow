package com.novaflowusermanagement.repository;

import com.novaflowusermanagement.entity.UserDomainRole;
import com.novaflowusermanagement.dto.UserDomainRoleDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserDomainRoleRepository extends JpaRepository<UserDomainRole, String> {
    
    List<UserDomainRole> findByUserId(String userId);
    
    List<UserDomainRole> findByRoleId(String roleId);
    
    List<UserDomainRole> findByIsActive(Boolean isActive);
    
    @Query("SELECT udr FROM UserDomainRole udr WHERE udr.user.id = :userId AND udr.isActive = true")
    List<UserDomainRole> findActiveByUserId(@Param("userId") String userId);
    
    Optional<UserDomainRole> findByUserIdAndRoleId(String userId, String roleId);
    
    // Custom queries to return DTOs with joined data
    @Query("SELECT new com.novaflowusermanagement.dto.UserDomainRoleDTO(" +
           "udr.id, udr.user.id, udr.role.id, udr.isActive, udr.assignedBy, udr.assignedDate, " +
           "u.name, u.email, r.name, r.description, d.name) " +
           "FROM UserDomainRole udr " +
           "JOIN udr.user u " +
           "JOIN udr.role r " +
           "JOIN r.domain d " +
           "ORDER BY udr.assignedDate DESC")
    List<UserDomainRoleDTO> findAllWithJoinedData();
    
    @Query("SELECT new com.novaflowusermanagement.dto.UserDomainRoleDTO(" +
           "udr.id, udr.user.id, udr.role.id, udr.isActive, udr.assignedBy, udr.assignedDate, " +
           "u.name, u.email, r.name, r.description, d.name) " +
           "FROM UserDomainRole udr " +
           "JOIN udr.user u " +
           "JOIN udr.role r " +
           "JOIN r.domain d " +
           "WHERE udr.id = :id")
    Optional<UserDomainRoleDTO> findByIdWithJoinedData(@Param("id") String id);
    
    @Query("SELECT new com.novaflowusermanagement.dto.UserDomainRoleDTO(" +
           "udr.id, udr.user.id, udr.role.id, udr.isActive, udr.assignedBy, udr.assignedDate, " +
           "u.name, u.email, r.name, r.description, d.name) " +
           "FROM UserDomainRole udr " +
           "JOIN udr.user u " +
           "JOIN udr.role r " +
           "JOIN r.domain d " +
           "WHERE udr.user.id = :userId " +
           "ORDER BY udr.assignedDate DESC")
    List<UserDomainRoleDTO> findByUserIdWithJoinedData(@Param("userId") String userId);
    
    @Query("SELECT new com.novaflowusermanagement.dto.UserDomainRoleDTO(" +
           "udr.id, udr.user.id, udr.role.id, udr.isActive, udr.assignedBy, udr.assignedDate, " +
           "u.name, u.email, r.name, r.description, d.name) " +
           "FROM UserDomainRole udr " +
           "JOIN udr.user u " +
           "JOIN udr.role r " +
           "JOIN r.domain d " +
           "WHERE udr.role.id = :roleId " +
           "ORDER BY udr.assignedDate DESC")
    List<UserDomainRoleDTO> findByRoleIdWithJoinedData(@Param("roleId") String roleId);
    
    @Query("SELECT new com.novaflowusermanagement.dto.UserDomainRoleDTO(" +
           "udr.id, udr.user.id, udr.role.id, udr.isActive, udr.assignedBy, udr.assignedDate, " +
           "u.name, u.email, r.name, r.description, d.name) " +
           "FROM UserDomainRole udr " +
           "JOIN udr.user u " +
           "JOIN udr.role r " +
           "JOIN r.domain d " +
           "WHERE udr.user.id = :userId AND udr.isActive = true " +
           "ORDER BY udr.assignedDate DESC")
    List<UserDomainRoleDTO> findActiveByUserIdWithJoinedData(@Param("userId") String userId);
    
    @Query("SELECT new com.novaflowusermanagement.dto.UserDomainRoleDTO(" +
           "udr.id, udr.user.id, udr.role.id, udr.isActive, udr.assignedBy, udr.assignedDate, " +
           "u.name, u.email, r.name, r.description, d.name) " +
           "FROM UserDomainRole udr " +
           "JOIN udr.user u " +
           "JOIN udr.role r " +
           "JOIN r.domain d " +
           "WHERE (LOWER(u.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "   OR LOWER(u.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "   OR LOWER(r.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
           "ORDER BY udr.assignedDate DESC")
    List<UserDomainRoleDTO> findAllWithJoinedDataBySearch(@Param("searchTerm") String searchTerm);
}
