package com.novaflowusermanagement.repository;

import com.novaflowusermanagement.entity.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PageRepository extends JpaRepository<Page, String> {
    
    Optional<Page> findByPath(String path);
    
    List<Page> findByName(String name);
    
    Optional<Page> findByNameAndPath(String name, String path);
    
    @Query("SELECT p FROM Page p WHERE p.name LIKE %:searchTerm% OR p.description LIKE %:searchTerm% OR p.path LIKE %:searchTerm%")
    List<Page> findBySearchTerm(@Param("searchTerm") String searchTerm);
}
