package com.novaflow.metadata.service;

import com.novaflow.metadata.entity.ProcessLog;
import com.novaflow.metadata.repository.ProcessLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProcessLogService {

    @Autowired
    private ProcessLogRepository processLogRepository;

    public List<ProcessLog> findAll() {
        return processLogRepository.findAll();
    }

    public Optional<ProcessLog> findById(String id) {
        return processLogRepository.findById(id);
    }

    public List<ProcessLog> findByRunControlId(String runControlId) {
        return processLogRepository.findByRunControlIdOrderByCreatedDateDesc(runControlId);
    }

    public List<ProcessLog> findByStatus(String status) {
        return processLogRepository.findByStatus(status);
    }

    public List<ProcessLog> findByRunControlIdAndStatus(String runControlId, String status) {
        return processLogRepository.findByRunControlIdAndStatus(runControlId, status);
    }

    public List<ProcessLog> findByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return processLogRepository.findByCreatedDateBetween(startDate, endDate);
    }

    public Optional<ProcessLog> findLatestByRunControlId(String runControlId) {
        return processLogRepository.findTopByRunControlIdOrderByCreatedDateDesc(runControlId);
    }

    public ProcessLog save(ProcessLog processLog) {
        if (processLog.getCreatedDate() == null) {
            processLog.setCreatedDate(LocalDateTime.now());
        }
        processLog.setLastModifiedDate(LocalDateTime.now());
        return processLogRepository.save(processLog);
    }

    public ProcessLog update(String id, ProcessLog processLog) {
        Optional<ProcessLog> existingProcessLog = processLogRepository.findById(id);
        if (existingProcessLog.isPresent()) {
            ProcessLog updated = existingProcessLog.get();
            updated.setStatus(processLog.getStatus());
            updated.setLogs(processLog.getLogs());
            updated.setLastModifiedBy(processLog.getLastModifiedBy());
            updated.setLastModifiedDate(LocalDateTime.now());
            return processLogRepository.save(updated);
        }
        return null;
    }

    public void deleteById(String id) {
        processLogRepository.deleteById(id);
    }

    public long countByRunControlId(String runControlId) {
        return processLogRepository.countByRunControlId(runControlId);
    }

    public long countByRunControlIdAndStatus(String runControlId, String status) {
        return processLogRepository.countByRunControlIdAndStatus(runControlId, status);
    }
}
