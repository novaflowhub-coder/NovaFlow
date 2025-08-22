package com.novaflowusermanagement.repository;

import com.novaflowusermanagement.entity.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PageRepository extends JpaRepository<Page, String> {
    
    Optional<Page> findByPath(String path);
    
    @Query("SELECT p FROM Page p WHERE p.path = :path")
    Optional<Page> findByPathExact(@Param("path") String path);
    
    boolean existsByPath(String path);
}
