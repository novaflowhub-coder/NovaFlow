package com.novaflow.metadata.repository;

import com.novaflow.metadata.entity.DynamicDataRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DynamicDataRecordRepository extends JpaRepository<DynamicDataRecord, String> {
    
    List<DynamicDataRecord> findByDomainId(String domainId);
    
    List<DynamicDataRecord> findByDomainIdAndStatus(String domainId, String status);
    
    List<DynamicDataRecord> findByEntityType(String entityType);
    
    List<DynamicDataRecord> findByApprovalStatus(String approvalStatus);
    
    List<DynamicDataRecord> findByDomainIdAndEntityType(String domainId, String entityType);
    
    @Query("SELECT d FROM DynamicDataRecord d WHERE d.domainId = :domainId AND d.status = 'A'")
    List<DynamicDataRecord> findActiveByDomainId(@Param("domainId") String domainId);
    
    @Query("SELECT COUNT(d) FROM DynamicDataRecord d WHERE d.domainId = :domainId")
    long countByDomainId(@Param("domainId") String domainId);
    
    @Query("SELECT COUNT(d) FROM DynamicDataRecord d WHERE d.domainId = :domainId AND d.status = 'A'")
    long countActiveByDomainId(@Param("domainId") String domainId);
    
    Optional<DynamicDataRecord> findByIdAndDomainId(String id, String domainId);
}
