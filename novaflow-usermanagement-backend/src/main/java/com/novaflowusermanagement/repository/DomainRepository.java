package com.novaflowusermanagement.repository;

import com.novaflowusermanagement.entity.Domain;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DomainRepository extends JpaRepository<Domain, String> {
    
    Optional<Domain> findByName(String name);
    
    Optional<Domain> findByCode(String code);
    
    List<Domain> findByIsActive(Boolean isActive);
    
    @Query("SELECT d FROM Domain d WHERE d.name LIKE %:searchTerm% OR d.description LIKE %:searchTerm% OR d.code LIKE %:searchTerm%")
    List<Domain> findBySearchTerm(@Param("searchTerm") String searchTerm);
}
