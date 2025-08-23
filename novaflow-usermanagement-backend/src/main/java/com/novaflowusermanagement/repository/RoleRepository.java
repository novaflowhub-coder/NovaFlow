package com.novaflowusermanagement.repository;

import com.novaflowusermanagement.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, String> {
    
    List<Role> findByDomainId(String domainId);
    
    List<Role> findByName(String name);
    
    Optional<Role> findByDomainIdAndName(String domainId, String name);
    
    @Query("SELECT r FROM Role r WHERE r.name LIKE %:searchTerm% OR r.description LIKE %:searchTerm%")
    List<Role> findBySearchTerm(@Param("searchTerm") String searchTerm);
    
    @Query("SELECT r FROM Role r WHERE r.domain.id = :domainId AND (r.name LIKE %:searchTerm% OR r.description LIKE %:searchTerm%)")
    List<Role> findByDomainIdAndSearchTerm(@Param("domainId") String domainId, @Param("searchTerm") String searchTerm);
}
