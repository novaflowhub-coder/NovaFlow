package com.novaflow.metadata.service;

import com.novaflow.metadata.entity.DynamicDataRecord;
import com.novaflow.metadata.repository.DynamicDataRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class DynamicDataRecordService {

    @Autowired
    private DynamicDataRecordRepository dynamicDataRecordRepository;

    public List<DynamicDataRecord> findAll() {
        return dynamicDataRecordRepository.findAll();
    }

    public Optional<DynamicDataRecord> findById(String id) {
        return dynamicDataRecordRepository.findById(id);
    }

    public List<DynamicDataRecord> findByDomainId(String domainId) {
        return dynamicDataRecordRepository.findByDomainId(domainId);
    }

    public List<DynamicDataRecord> findActiveByDomainId(String domainId) {
        return dynamicDataRecordRepository.findActiveByDomainId(domainId);
    }

    public List<DynamicDataRecord> findByEntityType(String entityType) {
        return dynamicDataRecordRepository.findByEntityType(entityType);
    }

    public List<DynamicDataRecord> findByApprovalStatus(String approvalStatus) {
        return dynamicDataRecordRepository.findByApprovalStatus(approvalStatus);
    }

    public List<DynamicDataRecord> findByDomainIdAndEntityType(String domainId, String entityType) {
        return dynamicDataRecordRepository.findByDomainIdAndEntityType(domainId, entityType);
    }

    public DynamicDataRecord save(DynamicDataRecord dynamicDataRecord) {
        if (dynamicDataRecord.getCreatedDate() == null) {
            dynamicDataRecord.setCreatedDate(LocalDateTime.now());
        }
        dynamicDataRecord.setLastModifiedDate(LocalDateTime.now());
        return dynamicDataRecordRepository.save(dynamicDataRecord);
    }

    public DynamicDataRecord update(String id, DynamicDataRecord dynamicDataRecord) {
        Optional<DynamicDataRecord> existingRecord = dynamicDataRecordRepository.findById(id);
        if (existingRecord.isPresent()) {
            DynamicDataRecord updated = existingRecord.get();
            updated.setEntityType(dynamicDataRecord.getEntityType());
            updated.setData(dynamicDataRecord.getData());
            updated.setApprovalStatus(dynamicDataRecord.getApprovalStatus());
            updated.setApprovalWorkflow(dynamicDataRecord.getApprovalWorkflow());
            updated.setStatus(dynamicDataRecord.getStatus());
            updated.setVersion(dynamicDataRecord.getVersion() != null ? dynamicDataRecord.getVersion() + 1 : 1);
            updated.setLastModifiedBy(dynamicDataRecord.getLastModifiedBy());
            updated.setLastModifiedDate(LocalDateTime.now());
            return dynamicDataRecordRepository.save(updated);
        }
        return null;
    }

    public void deleteById(String id) {
        dynamicDataRecordRepository.deleteById(id);
    }

    public DynamicDataRecord activate(String id, String modifiedBy) {
        Optional<DynamicDataRecord> record = dynamicDataRecordRepository.findById(id);
        if (record.isPresent()) {
            DynamicDataRecord updated = record.get();
            updated.setStatus('A');
            updated.setLastModifiedBy(modifiedBy);
            updated.setLastModifiedDate(LocalDateTime.now());
            return dynamicDataRecordRepository.save(updated);
        }
        return null;
    }

    public DynamicDataRecord deactivate(String id, String modifiedBy) {
        Optional<DynamicDataRecord> record = dynamicDataRecordRepository.findById(id);
        if (record.isPresent()) {
            DynamicDataRecord updated = record.get();
            updated.setStatus('I');
            updated.setLastModifiedBy(modifiedBy);
            updated.setLastModifiedDate(LocalDateTime.now());
            return dynamicDataRecordRepository.save(updated);
        }
        return null;
    }

    public long countByDomainId(String domainId) {
        return dynamicDataRecordRepository.countByDomainId(domainId);
    }

    public long countActiveByDomainId(String domainId) {
        return dynamicDataRecordRepository.countActiveByDomainId(domainId);
    }
}
