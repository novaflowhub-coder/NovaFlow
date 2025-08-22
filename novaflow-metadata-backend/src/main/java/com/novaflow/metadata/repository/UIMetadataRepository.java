package com.novaflow.metadata.repository;

import com.novaflow.metadata.entity.UIMetadata;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UIMetadataRepository extends JpaRepository<UIMetadata, String> {
    
    @Query("SELECT DISTINCT u FROM UIMetadata u LEFT JOIN FETCH u.dynamicDataRecords")
    List<UIMetadata> findAllWithDynamicData();
    
    List<UIMetadata> findByDomainId(String domainId);
    
    List<UIMetadata> findByDomainIdAndStatus(String domainId, String status);
    
    @Query("SELECT u FROM UIMetadata u WHERE u.sourceObject.id = :sourceObjectId")
    List<UIMetadata> findBySourceObjectId(@Param("sourceObjectId") String sourceObjectId);
    
    
    List<UIMetadata> findByDomainIdAndNameContainingIgnoreCase(String domainId, String name);
    
    @Query("SELECT u FROM UIMetadata u WHERE u.domainId = :domainId AND u.status = 'A'")
    List<UIMetadata> findActiveByDomainId(@Param("domainId") String domainId);
    
    @Query("SELECT COUNT(u) FROM UIMetadata u WHERE u.domainId = :domainId")
    long countByDomainId(@Param("domainId") String domainId);
    
    @Query("SELECT COUNT(u) FROM UIMetadata u WHERE u.domainId = :domainId AND u.status = 'A'")
    long countActiveByDomainId(@Param("domainId") String domainId);
    
    Optional<UIMetadata> findByIdAndDomainId(String id, String domainId);
}
