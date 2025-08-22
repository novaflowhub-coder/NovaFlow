package com.novaflow.metadata.repository;

import com.novaflow.metadata.entity.Approval;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ApprovalRepository extends JpaRepository<Approval, String> {
    
    List<Approval> findByEntityId(String entityId);
    
    List<Approval> findByEntityType(String entityType);
    
    List<Approval> findByRequestedBy(String requestedBy);
    
    List<Approval> findByApprovedBy(String approvedBy);
    
    List<Approval> findByStatus(String status);
    
    List<Approval> findByApprovalType(String approvalType);
    
    List<Approval> findByRequestedDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT a FROM Approval a WHERE a.entityId = :entityId AND a.entityType = :entityType ORDER BY a.requestedDate DESC")
    List<Approval> findByEntityIdAndEntityType(@Param("entityId") String entityId, @Param("entityType") String entityType);
    
    @Query("SELECT COUNT(a) FROM Approval a WHERE a.status = 'Pending'")
    long countPendingApprovals();
    
    @Query("SELECT COUNT(a) FROM Approval a WHERE a.approvedBy = :approvedBy")
    long countByApprovedBy(@Param("approvedBy") String approvedBy);
}
