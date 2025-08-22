package com.novaflowusermanagement.service;

import com.novaflowusermanagement.entity.Page;
import com.novaflowusermanagement.repository.PageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PageService {

    @Autowired
    private PageRepository pageRepository;

    @Autowired
    private AuditLogger auditLogger;

    public List<Page> getAllPages() {
        return pageRepository.findAll();
    }

    public Optional<Page> getPageById(String id) {
        return pageRepository.findById(id);
    }

    public Optional<Page> getPageByPath(String path) {
        return pageRepository.findByPath(path);
    }

    public Page createPage(Page page) {
        if (pageRepository.existsByPath(page.getPath())) {
            throw new IllegalArgumentException("Page with path '" + page.getPath() + "' already exists");
        }
        
        page.setCreatedDate(LocalDateTime.now());
        Page savedPage = pageRepository.save(page);
        
        auditLogger.emit("PAGE_CREATED", "PAGE", savedPage.getId(), "SUCCESS", 
            "Page created: " + savedPage.getName() + " (" + savedPage.getPath() + ")");
        
        return savedPage;
    }

    public Page updatePage(String id, Page pageDetails) {
        Optional<Page> existingPageOpt = pageRepository.findById(id);
        if (existingPageOpt.isEmpty()) {
            return null;
        }

        Page existingPage = existingPageOpt.get();
        
        // Check if path is being changed and if new path already exists
        if (!existingPage.getPath().equals(pageDetails.getPath()) && 
            pageRepository.existsByPath(pageDetails.getPath())) {
            throw new IllegalArgumentException("Page with path '" + pageDetails.getPath() + "' already exists");
        }

        existingPage.setName(pageDetails.getName());
        existingPage.setPath(pageDetails.getPath());
        existingPage.setDescription(pageDetails.getDescription());
        existingPage.setLastModifiedBy(pageDetails.getLastModifiedBy());
        existingPage.setLastModifiedDate(LocalDateTime.now());

        Page updatedPage = pageRepository.save(existingPage);
        
        auditLogger.emit("PAGE_UPDATED", "PAGE", updatedPage.getId(), "SUCCESS", 
            "Page updated: " + updatedPage.getName() + " (" + updatedPage.getPath() + ")");
        
        return updatedPage;
    }

    public boolean deletePage(String id) {
        if (pageRepository.existsById(id)) {
            Optional<Page> pageOpt = pageRepository.findById(id);
            pageRepository.deleteById(id);
            
            if (pageOpt.isPresent()) {
                Page page = pageOpt.get();
                auditLogger.emit("PAGE_DELETED", "PAGE", id, "SUCCESS", 
                    "Page deleted: " + page.getName() + " (" + page.getPath() + ")");
            }
            
            return true;
        }
        return false;
    }

    public List<Page> searchPages(String searchTerm) {
        return pageRepository.findAll().stream()
            .filter(page -> page.getName().toLowerCase().contains(searchTerm.toLowerCase()) ||
                           page.getPath().toLowerCase().contains(searchTerm.toLowerCase()) ||
                           (page.getDescription() != null && page.getDescription().toLowerCase().contains(searchTerm.toLowerCase())))
            .toList();
    }
}
