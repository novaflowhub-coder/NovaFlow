package com.novaflow.metadata.service;

import com.novaflow.metadata.entity.IntegrationObject;
import com.novaflow.metadata.repository.IntegrationObjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class IntegrationObjectService {

    @Autowired
    private IntegrationObjectRepository integrationObjectRepository;

    public List<IntegrationObject> getAllIntegrationObjects() {
        return integrationObjectRepository.findAllObjects();
    }

    public Optional<IntegrationObject> getIntegrationObjectById(String id) {
        return integrationObjectRepository.findById(id);
    }

    public List<IntegrationObject> getIntegrationObjectsByDomain(String domainId) {
        return integrationObjectRepository.findByDomainId(domainId);
    }

    public List<IntegrationObject> getActiveIntegrationObjectsByDomain(String domainId) {
        return integrationObjectRepository.findByDomainIdAndStatus(domainId, 'A');
    }

    public List<IntegrationObject> getIntegrationObjectsByType(String type) {
        return integrationObjectRepository.findByType(type);
    }

    public List<IntegrationObject> getIntegrationObjectsByConnection(String connectionId) {
        return integrationObjectRepository.findByConnectionId(connectionId);
    }

    public List<IntegrationObject> getActiveIntegrationObjectsByConnection(String connectionId) {
        return integrationObjectRepository.findActiveByConnectionId(connectionId);
    }

    public List<IntegrationObject> searchIntegrationObjectsByName(String domainId, String name) {
        return integrationObjectRepository.findByDomainIdAndNameContaining(domainId, name);
    }

    public IntegrationObject createIntegrationObject(IntegrationObject integrationObject) {
        integrationObject.setCreatedDate(LocalDateTime.now());
        integrationObject.setVersion(1);
        return integrationObjectRepository.save(integrationObject);
    }

    public IntegrationObject updateIntegrationObject(String id, IntegrationObject objectDetails) {
        return integrationObjectRepository.findById(id)
                .map(object -> {
                    object.setName(objectDetails.getName());
                    object.setType(objectDetails.getType());
                    object.setDescription(objectDetails.getDescription());
                    object.setConnection(objectDetails.getConnection());
                    object.setStatus(objectDetails.getStatus());
                    object.setLastModifiedBy(objectDetails.getLastModifiedBy());
                    object.setLastModifiedDate(LocalDateTime.now());
                    object.setVersion(object.getVersion() + 1);
                    return integrationObjectRepository.save(object);
                })
                .orElseThrow(() -> new RuntimeException("Integration object not found with id: " + id));
    }

    public void deleteIntegrationObject(String id) {
        integrationObjectRepository.deleteById(id);
    }

    public void deactivateIntegrationObject(String id, String modifiedBy) {
        integrationObjectRepository.findById(id)
                .map(object -> {
                    object.setStatus('I');
                    object.setLastModifiedBy(modifiedBy);
                    object.setLastModifiedDate(LocalDateTime.now());
                    return integrationObjectRepository.save(object);
                })
                .orElseThrow(() -> new RuntimeException("Integration object not found with id: " + id));
    }

    public void activateIntegrationObject(String id, String modifiedBy) {
        integrationObjectRepository.findById(id)
                .map(object -> {
                    object.setStatus('A');
                    object.setLastModifiedBy(modifiedBy);
                    object.setLastModifiedDate(LocalDateTime.now());
                    return integrationObjectRepository.save(object);
                })
                .orElseThrow(() -> new RuntimeException("Integration object not found with id: " + id));
    }

    public long getIntegrationObjectCountByDomain(String domainId) {
        return integrationObjectRepository.countByDomainId(domainId);
    }

    public long getActiveIntegrationObjectCountByDomain(String domainId) {
        return integrationObjectRepository.countByDomainIdAndStatus(domainId, 'A');
    }

    public long getIntegrationObjectCountByConnection(String connectionId) {
        return integrationObjectRepository.countByConnectionId(connectionId);
    }

    public boolean existsByDomainAndName(String domainId, String name) {
        return integrationObjectRepository.findByDomainIdAndName(domainId, name).isPresent();
    }
}
