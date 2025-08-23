package com.novaflowusermanagement.service;

import com.novaflowusermanagement.entity.Page;
import com.novaflowusermanagement.repository.PageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PageService {

    @Autowired
    private PageRepository pageRepository;

    public List<Page> getAllPages() {
        return pageRepository.findAll();
    }

    public Optional<Page> getPageById(String id) {
        return pageRepository.findById(id);
    }

    public List<Page> searchPages(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return getAllPages();
        }
        return pageRepository.findBySearchTerm(searchTerm.trim());
    }

    public Page createPage(Page page) {
        // Validate required fields
        if (page.getName() == null || page.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Page name is required");
        }
        if (page.getPath() == null || page.getPath().trim().isEmpty()) {
            throw new IllegalArgumentException("Page path is required");
        }
        if (page.getCreatedBy() == null || page.getCreatedBy().trim().isEmpty()) {
            throw new IllegalArgumentException("Created by is required");
        }
        
        // Check for duplicate path
        Optional<Page> existingPage = pageRepository.findByPath(page.getPath());
        if (existingPage.isPresent()) {
            throw new IllegalArgumentException("Page with this path already exists");
        }
        
        if (page.getId() == null || page.getId().isEmpty()) {
            page.setId(UUID.randomUUID().toString());
        }
        page.setCreatedDate(LocalDateTime.now());
        
        return pageRepository.save(page);
    }

    public Page updatePage(String id, Page pageDetails) {
        Optional<Page> optionalPage = pageRepository.findById(id);
        if (optionalPage.isPresent()) {
            Page page = optionalPage.get();
            
            // Validate required fields
            if (pageDetails.getName() == null || pageDetails.getName().trim().isEmpty()) {
                throw new IllegalArgumentException("Page name is required");
            }
            if (pageDetails.getPath() == null || pageDetails.getPath().trim().isEmpty()) {
                throw new IllegalArgumentException("Page path is required");
            }
            
            // Check for duplicate path (excluding current page)
            Optional<Page> existingPage = pageRepository.findByPath(pageDetails.getPath());
            if (existingPage.isPresent() && !existingPage.get().getId().equals(id)) {
                throw new IllegalArgumentException("Page with this path already exists");
            }
            
            page.setName(pageDetails.getName());
            page.setPath(pageDetails.getPath());
            page.setDescription(pageDetails.getDescription());
            page.setLastModifiedBy(pageDetails.getLastModifiedBy());
            page.setLastModifiedDate(LocalDateTime.now());
            
            return pageRepository.save(page);
        } else {
            throw new RuntimeException("Page not found with id: " + id);
        }
    }

    public void deletePage(String id) {
        if (pageRepository.existsById(id)) {
            pageRepository.deleteById(id);
        } else {
            throw new RuntimeException("Page not found with id: " + id);
        }
    }
}
