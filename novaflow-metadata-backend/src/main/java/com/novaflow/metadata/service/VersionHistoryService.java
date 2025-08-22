package com.novaflow.metadata.service;

import com.novaflow.metadata.entity.VersionHistory;
import com.novaflow.metadata.repository.VersionHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class VersionHistoryService {

    @Autowired
    private VersionHistoryRepository versionHistoryRepository;

    public List<VersionHistory> findAll() {
        return versionHistoryRepository.findAll();
    }

    public Optional<VersionHistory> findById(String id) {
        return versionHistoryRepository.findById(id);
    }

    public List<VersionHistory> findByEntityId(String entityId) {
        return versionHistoryRepository.findByEntityIdOrderByVersionDesc(entityId);
    }

    public List<VersionHistory> findByEntityType(String entityType) {
        return versionHistoryRepository.findByEntityType(entityType);
    }

    public List<VersionHistory> findByChangedBy(String changedBy) {
        return versionHistoryRepository.findByChangedBy(changedBy);
    }

    public List<VersionHistory> findByChangeType(String changeType) {
        return versionHistoryRepository.findByChangeType(changeType);
    }

    public List<VersionHistory> findByEntityIdAndEntityType(String entityId, String entityType) {
        return versionHistoryRepository.findByEntityIdAndEntityType(entityId, entityType);
    }

    public List<VersionHistory> findByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return versionHistoryRepository.findByChangedDateBetween(startDate, endDate);
    }

    public VersionHistory save(VersionHistory versionHistory) {
        if (versionHistory.getChangedDate() == null) {
            versionHistory.setChangedDate(LocalDateTime.now());
        }
        return versionHistoryRepository.save(versionHistory);
    }

    public void deleteById(String id) {
        versionHistoryRepository.deleteById(id);
    }

    public long countByEntityId(String entityId) {
        return versionHistoryRepository.countByEntityId(entityId);
    }

    public Integer getNextVersionNumber(String entityId) {
        Integer maxVersion = versionHistoryRepository.findMaxVersionByEntityId(entityId);
        return maxVersion != null ? maxVersion + 1 : 1;
    }

    public VersionHistory createVersionHistory(String entityId, String entityType, String entityName, 
                                             String changeType, String changedBy, String changeDescription) {
        VersionHistory versionHistory = new VersionHistory();
        versionHistory.setId(generateId());
        versionHistory.setEntityId(entityId);
        versionHistory.setEntityType(entityType);
        versionHistory.setEntityName(entityName);
        versionHistory.setVersion(getNextVersionNumber(entityId));
        versionHistory.setChangeType(changeType);
        versionHistory.setChangedBy(changedBy);
        versionHistory.setChangeDescription(changeDescription);
        versionHistory.setChangedDate(LocalDateTime.now());
        return save(versionHistory);
    }

    private String generateId() {
        return "VH" + System.currentTimeMillis();
    }
}
