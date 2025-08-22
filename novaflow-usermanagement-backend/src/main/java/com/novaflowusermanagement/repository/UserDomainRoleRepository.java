package com.novaflowusermanagement.repository;

import com.novaflowusermanagement.entity.UserDomainRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserDomainRoleRepository extends JpaRepository<UserDomainRole, String> {
    
    List<UserDomainRole> findByUserId(String userId);
    
    List<UserDomainRole> findByDomainId(String domainId);
    
    List<UserDomainRole> findByRoleId(String roleId);
    
    List<UserDomainRole> findByIsActive(Boolean isActive);
    
    @Query("SELECT udr FROM UserDomainRole udr WHERE udr.user.id = :userId AND udr.isActive = true")
    List<UserDomainRole> findActiveByUserId(@Param("userId") String userId);
    
    @Query("SELECT udr FROM UserDomainRole udr WHERE udr.domain.id = :domainId AND udr.isActive = true")
    List<UserDomainRole> findActiveByDomainId(@Param("domainId") String domainId);
    
    Optional<UserDomainRole> findByUserIdAndDomainIdAndRoleId(String userId, String domainId, String roleId);
    
    @Query("SELECT udr FROM UserDomainRole udr WHERE udr.user.id = :userId AND udr.domain.id = :domainId AND udr.isActive = true")
    List<UserDomainRole> findActiveByUserIdAndDomainId(@Param("userId") String userId, @Param("domainId") String domainId);
}
