package com.novaflow.metadata.service;

import com.novaflow.metadata.entity.RunControl;
import com.novaflow.metadata.repository.RunControlRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class RunControlService {

    @Autowired
    private RunControlRepository runControlRepository;

    public List<RunControl> getAllRunControls() {
        // Step 1: Load base objects with processLogs
        List<RunControl> controls = runControlRepository.findAllWithProcessLogs();
        
        if (controls.isEmpty()) {
            return controls;
        }
        
        // Step 2: Load remaining @OneToOne relationships in separate queries
        runControlRepository.findWithSchedule(controls);
        runControlRepository.findWithStream(controls);
        runControlRepository.findWithFileWatch(controls);
        
        return controls;
    }

    public Optional<RunControl> findById(String id) {
        return runControlRepository.findById(id);
    }

    public List<RunControl> findByDomainId(String domainId) {
        return runControlRepository.findByDomainId(domainId);
    }

    public List<RunControl> findActiveByDomainId(String domainId) {
        return runControlRepository.findActiveByDomainId(domainId);
    }

    public List<RunControl> findByExecutionMode(String executionMode) {
        return runControlRepository.findByExecutionMode(executionMode);
    }

    public List<RunControl> findByHolidayCalendarId(String holidayCalendarId) {
        return runControlRepository.findByHolidayCalendarId(holidayCalendarId);
    }

    public List<RunControl> searchByName(String domainId, String name) {
        return runControlRepository.findByDomainIdAndNameContainingIgnoreCase(domainId, name);
    }

    public RunControl save(RunControl runControl) {
        if (runControl.getCreatedDate() == null) {
            runControl.setCreatedDate(LocalDateTime.now());
        }
        runControl.setLastModifiedDate(LocalDateTime.now());
        return runControlRepository.save(runControl);
    }

    public RunControl update(String id, RunControl runControl) {
        Optional<RunControl> existingRunControl = runControlRepository.findById(id);
        if (existingRunControl.isPresent()) {
            RunControl updated = existingRunControl.get();
            updated.setName(runControl.getName());
            updated.setDescription(runControl.getDescription());
            updated.setExecutionMode(runControl.getExecutionMode());
            updated.setSteps(runControl.getSteps());
            if (runControl.getHolidayCalendar() != null) {
                updated.setHolidayCalendar(runControl.getHolidayCalendar());
            }
            updated.setStatus(runControl.getStatus());
            updated.setVersion(runControl.getVersion() != null ? runControl.getVersion() + 1 : 1);
            updated.setLastModifiedBy(runControl.getLastModifiedBy());
            updated.setLastModifiedDate(LocalDateTime.now());
            return runControlRepository.save(updated);
        }
        return null;
    }

    public void deleteById(String id) {
        runControlRepository.deleteById(id);
    }

    public RunControl activate(String id, String modifiedBy) {
        Optional<RunControl> runControl = runControlRepository.findById(id);
        if (runControl.isPresent()) {
            RunControl updated = runControl.get();
            updated.setStatus('A');
            updated.setLastModifiedBy(modifiedBy);
            updated.setLastModifiedDate(LocalDateTime.now());
            return runControlRepository.save(updated);
        }
        return null;
    }

    public RunControl deactivate(String id, String modifiedBy) {
        Optional<RunControl> runControl = runControlRepository.findById(id);
        if (runControl.isPresent()) {
            RunControl updated = runControl.get();
                updated.setStatus('I');
            updated.setLastModifiedBy(modifiedBy);
            updated.setLastModifiedDate(LocalDateTime.now());
            return runControlRepository.save(updated);
        }
        return null;
    }

    public long countByDomainId(String domainId) {
        return runControlRepository.countByDomainId(domainId);
    }

    public long countActiveByDomainId(String domainId) {
        return runControlRepository.countActiveByDomainId(domainId);
    }
}
