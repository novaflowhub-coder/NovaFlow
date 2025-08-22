package com.novaflow.metadata.service;

import com.novaflow.metadata.entity.Scaffold;
import com.novaflow.metadata.repository.ScaffoldRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ScaffoldService {

    @Autowired
    private ScaffoldRepository scaffoldRepository;

    public List<Scaffold> findAll() {
        return scaffoldRepository.findAll();
    }

    public Optional<Scaffold> findById(String id) {
        return scaffoldRepository.findById(id);
    }

    public List<Scaffold> findByDomainId(String domainId) {
        return scaffoldRepository.findByDomainId(domainId);
    }

    public List<Scaffold> findActiveByDomainId(String domainId) {
        return scaffoldRepository.findActiveByDomainId(domainId);
    }

    public List<Scaffold> findBySourceObjectId(String sourceObjectId) {
        return scaffoldRepository.findBySourceObjectId(sourceObjectId);
    }

    public List<Scaffold> findByTargetObjectId(String targetObjectId) {
        return scaffoldRepository.findByTargetObjectId(targetObjectId);
    }

    public List<Scaffold> searchByName(String domainId, String name) {
        return scaffoldRepository.findByDomainIdAndNameContainingIgnoreCase(domainId, name);
    }

    public Scaffold save(Scaffold scaffold) {
        if (scaffold.getCreatedDate() == null) {
            scaffold.setCreatedDate(LocalDateTime.now());
        }
        scaffold.setLastModifiedDate(LocalDateTime.now());
        return scaffoldRepository.save(scaffold);
    }

    public Scaffold update(String id, Scaffold scaffold) {
        Optional<Scaffold> existingScaffold = scaffoldRepository.findById(id);
        if (existingScaffold.isPresent()) {
            Scaffold updated = existingScaffold.get();
            updated.setName(scaffold.getName());
            updated.setDescription(scaffold.getDescription());
            if (scaffold.getSourceObject() != null) {
                updated.setSourceObject(scaffold.getSourceObject());
            }
            if (scaffold.getTargetObject() != null) {
                updated.setTargetObject(scaffold.getTargetObject());
            }
            updated.setFilters(scaffold.getFilters());
            updated.setAggregations(scaffold.getAggregations());
            updated.setOrdering(scaffold.getOrdering());
            updated.setStatus(scaffold.getStatus());
            updated.setVersion(scaffold.getVersion() != null ? scaffold.getVersion() + 1 : 1);
            updated.setLastModifiedBy(scaffold.getLastModifiedBy());
            updated.setLastModifiedDate(LocalDateTime.now());
            return scaffoldRepository.save(updated);
        }
        return null;
    }

    public void deleteById(String id) {
        scaffoldRepository.deleteById(id);
    }

    public Scaffold activate(String id, String modifiedBy) {
        Optional<Scaffold> scaffold = scaffoldRepository.findById(id);
        if (scaffold.isPresent()) {
            Scaffold updated = scaffold.get();
            if (updated != null) {
                updated.setStatus('A');
                updated.setLastModifiedBy(modifiedBy);
                updated.setLastModifiedDate(LocalDateTime.now());
                return scaffoldRepository.save(updated);
            }
        }
        return null;
    }

    public Scaffold deactivate(String id, String modifiedBy) {
        Optional<Scaffold> scaffold = scaffoldRepository.findById(id);
        if (scaffold.isPresent()) {
            Scaffold updated = scaffold.get();
            if (updated != null) {
                updated.setStatus('I');
                updated.setLastModifiedBy(modifiedBy);
                updated.setLastModifiedDate(LocalDateTime.now());
                return scaffoldRepository.save(updated);
            }
        }
        return null;
    }

    public long countByDomainId(String domainId) {
        return scaffoldRepository.countByDomainId(domainId);
    }

    public long countActiveByDomainId(String domainId) {
        return scaffoldRepository.countActiveByDomainId(domainId);
    }
}
