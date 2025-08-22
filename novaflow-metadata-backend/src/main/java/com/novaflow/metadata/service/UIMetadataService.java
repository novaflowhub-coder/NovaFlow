package com.novaflow.metadata.service;

import com.novaflow.metadata.entity.UIMetadata;
import com.novaflow.metadata.repository.UIMetadataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UIMetadataService {

    @Autowired
    private UIMetadataRepository uiMetadataRepository;

    public List<UIMetadata> findAll() {
        return uiMetadataRepository.findAllWithDynamicData();
    }

    public Optional<UIMetadata> findById(String id) {
        return uiMetadataRepository.findById(id);
    }

    public List<UIMetadata> findByDomainId(String domainId) {
        return uiMetadataRepository.findByDomainId(domainId);
    }

    public List<UIMetadata> findActiveByDomainId(String domainId) {
        return uiMetadataRepository.findActiveByDomainId(domainId);
    }

    public List<UIMetadata> findBySourceObjectId(String sourceObjectId) {
        return uiMetadataRepository.findBySourceObjectId(sourceObjectId);
    }


    public List<UIMetadata> searchByName(String domainId, String name) {
        return uiMetadataRepository.findByDomainIdAndNameContainingIgnoreCase(domainId, name);
    }

    public UIMetadata save(UIMetadata uiMetadata) {
        if (uiMetadata.getCreatedDate() == null) {
            uiMetadata.setCreatedDate(LocalDateTime.now());
        }
        uiMetadata.setLastModifiedDate(LocalDateTime.now());
        return uiMetadataRepository.save(uiMetadata);
    }

    public UIMetadata update(String id, UIMetadata uiMetadata) {
        Optional<UIMetadata> existingUIMetadata = uiMetadataRepository.findById(id);
        if (existingUIMetadata.isPresent()) {
            UIMetadata updated = existingUIMetadata.get();
            updated.setName(uiMetadata.getName());
            updated.setDescription(uiMetadata.getDescription());
            if (uiMetadata.getSourceObject() != null) {
                updated.setSourceObject(uiMetadata.getSourceObject());
            }
            updated.setFields(uiMetadata.getFields());
            updated.setSections(uiMetadata.getSections());
            updated.setConfiguration(uiMetadata.getConfiguration());
            updated.setStatus(uiMetadata.getStatus());
            updated.setVersion(uiMetadata.getVersion() != null ? uiMetadata.getVersion() + 1 : 1);
            updated.setLastModifiedBy(uiMetadata.getLastModifiedBy());
            updated.setLastModifiedDate(LocalDateTime.now());
            return uiMetadataRepository.save(updated);
        }
        return null;
    }

    public void deleteById(String id) {
        uiMetadataRepository.deleteById(id);
    }

    public UIMetadata activate(String id, String modifiedBy) {
        Optional<UIMetadata> uiMetadata = uiMetadataRepository.findById(id);
        if (uiMetadata.isPresent()) {
            UIMetadata updated = uiMetadata.get();
            updated.setStatus('A');
            updated.setLastModifiedBy(modifiedBy);
            updated.setLastModifiedDate(LocalDateTime.now());
            return uiMetadataRepository.save(updated);
        }
        return null;
    }

    public UIMetadata deactivate(String id, String modifiedBy) {
        Optional<UIMetadata> uiMetadata = uiMetadataRepository.findById(id);
        if (uiMetadata.isPresent()) {
            UIMetadata updated = uiMetadata.get();
            updated.setStatus('I');
            updated.setLastModifiedBy(modifiedBy);
            updated.setLastModifiedDate(LocalDateTime.now());
            return uiMetadataRepository.save(updated);
        }
        return null;
    }

    public long countByDomainId(String domainId) {
        return uiMetadataRepository.countByDomainId(domainId);
    }

    public long countActiveByDomainId(String domainId) {
        return uiMetadataRepository.countActiveByDomainId(domainId);
    }
}
