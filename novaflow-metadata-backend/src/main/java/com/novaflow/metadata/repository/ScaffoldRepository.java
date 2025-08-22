package com.novaflow.metadata.repository;

import com.novaflow.metadata.entity.Scaffold;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ScaffoldRepository extends JpaRepository<Scaffold, String> {
    
    List<Scaffold> findByDomainId(String domainId);
    
    List<Scaffold> findByDomainIdAndStatus(String domainId, String status);
    
    @Query("SELECT s FROM Scaffold s WHERE s.sourceObject.id = :sourceObjectId")
    List<Scaffold> findBySourceObjectId(@Param("sourceObjectId") String sourceObjectId);
    
    @Query("SELECT s FROM Scaffold s WHERE s.targetObject.id = :targetObjectId")
    List<Scaffold> findByTargetObjectId(@Param("targetObjectId") String targetObjectId);
    
    List<Scaffold> findByDomainIdAndNameContainingIgnoreCase(String domainId, String name);
    
    @Query("SELECT s FROM Scaffold s WHERE s.domainId = :domainId AND s.status = 'A'")
    List<Scaffold> findActiveByDomainId(@Param("domainId") String domainId);
    
    @Query("SELECT COUNT(s) FROM Scaffold s WHERE s.domainId = :domainId")
    long countByDomainId(@Param("domainId") String domainId);
    
    @Query("SELECT COUNT(s) FROM Scaffold s WHERE s.domainId = :domainId AND s.status = 'A'")
    long countActiveByDomainId(@Param("domainId") String domainId);
    
    Optional<Scaffold> findByIdAndDomainId(String id, String domainId);
}
