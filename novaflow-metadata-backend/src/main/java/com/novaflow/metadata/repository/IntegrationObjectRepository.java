package com.novaflow.metadata.repository;

import com.novaflow.metadata.entity.IntegrationObject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface IntegrationObjectRepository extends JpaRepository<IntegrationObject, String> {
    
    @Query("SELECT DISTINCT io FROM IntegrationObject io")
    List<IntegrationObject> findAllObjects();
    
    @Query("SELECT DISTINCT io FROM IntegrationObject io LEFT JOIN FETCH io.attributes WHERE io IN :objects")
    List<IntegrationObject> findWithAttributes(@Param("objects") List<IntegrationObject> objects);
    
    @Query("SELECT DISTINCT io FROM IntegrationObject io LEFT JOIN FETCH io.sourceRules WHERE io IN :objects")
    List<IntegrationObject> findWithSourceRules(@Param("objects") List<IntegrationObject> objects);
    
    @Query("SELECT DISTINCT io FROM IntegrationObject io LEFT JOIN FETCH io.targetRules WHERE io IN :objects")
    List<IntegrationObject> findWithTargetRules(@Param("objects") List<IntegrationObject> objects);
    
    @Query("SELECT DISTINCT io FROM IntegrationObject io LEFT JOIN FETCH io.sourceScaffolds WHERE io IN :objects")
    List<IntegrationObject> findWithSourceScaffolds(@Param("objects") List<IntegrationObject> objects);
    
    @Query("SELECT DISTINCT io FROM IntegrationObject io LEFT JOIN FETCH io.targetScaffolds WHERE io IN :objects")
    List<IntegrationObject> findWithTargetScaffolds(@Param("objects") List<IntegrationObject> objects);
    
    @Query("SELECT DISTINCT io FROM IntegrationObject io LEFT JOIN FETCH io.uiMetadataList ui LEFT JOIN FETCH ui.dynamicDataRecords WHERE io IN :objects")
    List<IntegrationObject> findWithUiMetadata(@Param("objects") List<IntegrationObject> objects);
    
    List<IntegrationObject> findByDomainId(String domainId);
    
    List<IntegrationObject> findByDomainIdAndStatus(String domainId, Character status);
    
    List<IntegrationObject> findByType(String type);
    
    List<IntegrationObject> findByDomainIdAndType(String domainId, String type);
    
    List<IntegrationObject> findByConnectionId(String connectionId);
    
    Optional<IntegrationObject> findByDomainIdAndName(String domainId, String name);
    
    @Query("SELECT io FROM IntegrationObject io WHERE io.domainId = :domainId AND io.name LIKE %:name%")
    List<IntegrationObject> findByDomainIdAndNameContaining(@Param("domainId") String domainId, @Param("name") String name);
    
    @Query("SELECT io FROM IntegrationObject io WHERE io.status = 'A' ORDER BY io.name")
    List<IntegrationObject> findAllActive();
    
    @Query("SELECT io FROM IntegrationObject io WHERE io.connection.id = :connectionId AND io.status = 'A'")
    List<IntegrationObject> findActiveByConnectionId(@Param("connectionId") String connectionId);
    
    long countByDomainId(String domainId);
    
    long countByDomainIdAndStatus(String domainId, Character status);
    
    long countByConnectionId(String connectionId);
}
