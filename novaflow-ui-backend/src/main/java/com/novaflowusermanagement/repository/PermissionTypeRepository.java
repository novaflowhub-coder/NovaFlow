package com.novaflowusermanagement.repository;

import com.novaflowusermanagement.entity.PermissionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PermissionTypeRepository extends JpaRepository<PermissionType, String> {
    
    Optional<PermissionType> findByName(String name);
    
    @Query("SELECT pt FROM PermissionType pt WHERE pt.name = :name")
    Optional<PermissionType> findByNameExact(@Param("name") String name);
    
    boolean existsByName(String name);
}
