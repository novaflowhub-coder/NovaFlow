package com.novaflow.metadata.repository;

import com.novaflow.metadata.entity.VersionHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VersionHistoryRepository extends JpaRepository<VersionHistory, String> {
    
    List<VersionHistory> findByEntityId(String entityId);
    
    List<VersionHistory> findByEntityIdOrderByVersionDesc(String entityId);
    
    List<VersionHistory> findByEntityType(String entityType);
    
    List<VersionHistory> findByChangedBy(String changedBy);
    
    List<VersionHistory> findByChangeType(String changeType);
    
    List<VersionHistory> findByChangedDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT v FROM VersionHistory v WHERE v.entityId = :entityId AND v.entityType = :entityType ORDER BY v.version DESC")
    List<VersionHistory> findByEntityIdAndEntityType(@Param("entityId") String entityId, @Param("entityType") String entityType);
    
    @Query("SELECT COUNT(v) FROM VersionHistory v WHERE v.entityId = :entityId")
    long countByEntityId(@Param("entityId") String entityId);
    
    @Query("SELECT MAX(v.version) FROM VersionHistory v WHERE v.entityId = :entityId")
    Integer findMaxVersionByEntityId(@Param("entityId") String entityId);
}
