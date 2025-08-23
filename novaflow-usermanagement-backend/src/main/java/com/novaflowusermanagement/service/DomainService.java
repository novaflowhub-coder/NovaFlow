package com.novaflowusermanagement.service;

import com.novaflowusermanagement.entity.Domain;
import com.novaflowusermanagement.repository.DomainRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class DomainService {
    
    @Autowired
    private DomainRepository domainRepository;
    
    public List<Domain> getAllDomains() {
        return domainRepository.findAll();
    }
    
    public Optional<Domain> getDomainById(String id) {
        return domainRepository.findById(id);
    }
    
    public Optional<Domain> getDomainByName(String name) {
        return domainRepository.findByName(name);
    }
    
    public Optional<Domain> getDomainByCode(String code) {
        return domainRepository.findByCode(code);
    }
    
    public List<Domain> getActiveDomains() {
        return domainRepository.findByIsActive(true);
    }
    
    public List<Domain> searchDomains(String searchTerm) {
        return domainRepository.findBySearchTerm(searchTerm);
    }
    
    public Domain createDomain(Domain domain) {
        if (domain.getId() == null || domain.getId().isEmpty()) {
            domain.setId(UUID.randomUUID().toString());
        }
        domain.setCreatedDate(LocalDateTime.now());
        return domainRepository.save(domain);
    }
    
    public Domain updateDomain(String id, Domain domainDetails) {
        Optional<Domain> optionalDomain = domainRepository.findById(id);
        if (optionalDomain.isPresent()) {
            Domain domain = optionalDomain.get();
            domain.setName(domainDetails.getName());
            domain.setDescription(domainDetails.getDescription());
            domain.setCode(domainDetails.getCode());
            domain.setIsActive(domainDetails.getIsActive());
            domain.setLastModifiedBy(domainDetails.getLastModifiedBy());
            domain.setLastModifiedDate(LocalDateTime.now());
            return domainRepository.save(domain);
        }
        return null;
    }
    
    public Domain activateDomain(String id, String modifiedBy) {
        Optional<Domain> optionalDomain = domainRepository.findById(id);
        if (optionalDomain.isPresent()) {
            Domain domain = optionalDomain.get();
            domain.setIsActive(true);
            domain.setLastModifiedBy(modifiedBy);
            domain.setLastModifiedDate(LocalDateTime.now());
            return domainRepository.save(domain);
        }
        return null;
    }
    
    public Domain deactivateDomain(String id, String modifiedBy) {
        Optional<Domain> optionalDomain = domainRepository.findById(id);
        if (optionalDomain.isPresent()) {
            Domain domain = optionalDomain.get();
            domain.setIsActive(false);
            domain.setLastModifiedBy(modifiedBy);
            domain.setLastModifiedDate(LocalDateTime.now());
            return domainRepository.save(domain);
        }
        return null;
    }
    
    public boolean deleteDomain(String id) {
        if (domainRepository.existsById(id)) {
            domainRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
