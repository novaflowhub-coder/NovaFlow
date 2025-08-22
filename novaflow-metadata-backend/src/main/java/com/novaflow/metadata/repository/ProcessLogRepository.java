package com.novaflow.metadata.repository;

import com.novaflow.metadata.entity.ProcessLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProcessLogRepository extends JpaRepository<ProcessLog, String> {
    
    List<ProcessLog> findByRunControlId(String runControlId);
    
    List<ProcessLog> findByRunControlIdOrderByCreatedDateDesc(String runControlId);
    
    List<ProcessLog> findByStatus(String status);
    
    List<ProcessLog> findByCreatedDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT p FROM ProcessLog p WHERE p.runControl.id = :runControlId AND p.status = :status ORDER BY p.createdDate DESC")
    List<ProcessLog> findByRunControlIdAndStatus(@Param("runControlId") String runControlId, @Param("status") String status);
    
    @Query("SELECT COUNT(p) FROM ProcessLog p WHERE p.runControl.id = :runControlId")
    long countByRunControlId(@Param("runControlId") String runControlId);
    
    @Query("SELECT COUNT(p) FROM ProcessLog p WHERE p.runControl.id = :runControlId AND p.status = :status")
    long countByRunControlIdAndStatus(@Param("runControlId") String runControlId, @Param("status") String status);
    
    Optional<ProcessLog> findTopByRunControlIdOrderByCreatedDateDesc(String runControlId);
}
