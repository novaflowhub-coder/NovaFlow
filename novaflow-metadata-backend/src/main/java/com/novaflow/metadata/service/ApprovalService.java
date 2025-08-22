package com.novaflow.metadata.service;

import com.novaflow.metadata.entity.Approval;
import com.novaflow.metadata.repository.ApprovalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ApprovalService {

    @Autowired
    private ApprovalRepository approvalRepository;

    public List<Approval> findAll() {
        return approvalRepository.findAll();
    }

    public Optional<Approval> findById(String id) {
        return approvalRepository.findById(id);
    }

    public List<Approval> findByEntityId(String entityId) {
        return approvalRepository.findByEntityId(entityId);
    }

    public List<Approval> findByEntityType(String entityType) {
        return approvalRepository.findByEntityType(entityType);
    }

    public List<Approval> findByRequestedBy(String requestedBy) {
        return approvalRepository.findByRequestedBy(requestedBy);
    }

    public List<Approval> findByApprovedBy(String approvedBy) {
        return approvalRepository.findByApprovedBy(approvedBy);
    }

    public List<Approval> findByStatus(String status) {
        return approvalRepository.findByStatus(status);
    }

    public List<Approval> findByApprovalType(String approvalType) {
        return approvalRepository.findByApprovalType(approvalType);
    }

    public List<Approval> findByEntityIdAndEntityType(String entityId, String entityType) {
        return approvalRepository.findByEntityIdAndEntityType(entityId, entityType);
    }

    public List<Approval> findByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return approvalRepository.findByRequestedDateBetween(startDate, endDate);
    }

    public Approval save(Approval approval) {
        if (approval.getRequestedDate() == null) {
            approval.setRequestedDate(LocalDateTime.now());
        }
        return approvalRepository.save(approval);
    }

    public Approval approve(String id, String approvedBy, String comments) {
        Optional<Approval> approval = approvalRepository.findById(id);
        if (approval.isPresent()) {
            Approval updated = approval.get();
            updated.setStatus("Approved");
            updated.setApprovedBy(approvedBy);
            updated.setApprovedDate(LocalDateTime.now());
            updated.setComments(comments);
            return approvalRepository.save(updated);
        }
        return null;
    }

    public Approval reject(String id, String approvedBy, String rejectionReason, String comments) {
        Optional<Approval> approval = approvalRepository.findById(id);
        if (approval.isPresent()) {
            Approval updated = approval.get();
            updated.setStatus("Rejected");
            updated.setApprovedBy(approvedBy);
            updated.setApprovedDate(LocalDateTime.now());
            updated.setRejectionReason(rejectionReason);
            updated.setComments(comments);
            return approvalRepository.save(updated);
        }
        return null;
    }

    public void deleteById(String id) {
        approvalRepository.deleteById(id);
    }

    public long countPendingApprovals() {
        return approvalRepository.countPendingApprovals();
    }

    public long countByApprovedBy(String approvedBy) {
        return approvalRepository.countByApprovedBy(approvedBy);
    }

    public Approval createApprovalRequest(String entityId, String entityType, String entityName, 
                                        String requestedBy, String approvalType, String comments) {
        Approval approval = new Approval();
        approval.setId(generateId());
        approval.setEntityId(entityId);
        approval.setEntityType(entityType);
        approval.setEntityName(entityName);
        approval.setRequestedBy(requestedBy);
        approval.setApprovalType(approvalType);
        approval.setComments(comments);
        approval.setRequestedDate(LocalDateTime.now());
        return save(approval);
    }

    private String generateId() {
        return "APP" + System.currentTimeMillis();
    }
}
