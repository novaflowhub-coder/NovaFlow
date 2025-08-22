package com.novaflow.metadata.repository;

import com.novaflow.metadata.entity.Connection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ConnectionRepository extends JpaRepository<Connection, String> {
    
    @Query("SELECT c FROM Connection c")
    List<Connection> findAllConnections();
    
    
    List<Connection> findByDomainId(String domainId);
    
    List<Connection> findByDomainIdAndStatus(String domainId, Character status);
    
    List<Connection> findByType(String type);
    
    List<Connection> findByDomainIdAndType(String domainId, String type);
    
    Optional<Connection> findByDomainIdAndName(String domainId, String name);
    
    @Query("SELECT c FROM Connection c WHERE c.domainId = :domainId AND c.name LIKE %:name%")
    List<Connection> findByDomainIdAndNameContaining(@Param("domainId") String domainId, @Param("name") String name);
    
    @Query("SELECT c FROM Connection c WHERE c.status = 'A' ORDER BY c.name")
    List<Connection> findAllActive();
    
    long countByDomainId(String domainId);
    
    long countByDomainIdAndStatus(String domainId, Character status);
}
