package com.novaflowusermanagement.controller;

import com.novaflowusermanagement.entity.Page;
import com.novaflowusermanagement.service.PageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/pages")
@CrossOrigin(origins = "*")
@Tag(name = "Page Management", description = "APIs for managing application pages and their permissions")
public class PageController {

    @Autowired
    private PageService pageService;

    @GetMapping
    @PreAuthorize("@authz.hasPermission(authentication, 'view', '/page-management')")
    @Operation(summary = "Get all pages", description = "Retrieve all application pages")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved pages")
    public ResponseEntity<List<Page>> getAllPages() {
        List<Page> pages = pageService.getAllPages();
        return ResponseEntity.ok(pages);
    }

    @GetMapping("/{id}")
    @PreAuthorize("@authz.hasPermission(authentication, 'view', '/page-management')")
    @Operation(summary = "Get page by ID", description = "Retrieve a specific page by its ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Page found"),
        @ApiResponse(responseCode = "404", description = "Page not found")
    })
    public ResponseEntity<Page> getPageById(@Parameter(description = "Page ID") @PathVariable String id) {
        Optional<Page> page = pageService.getPageById(id);
        return page.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/path/{path}")
    @PreAuthorize("@authz.hasPermission(authentication, 'view', '/page-management')")
    @Operation(summary = "Get page by path", description = "Retrieve a page by its path")
    public ResponseEntity<Page> getPageByPath(@Parameter(description = "Page path") @PathVariable String path) {
        // URL decode the path parameter
        String decodedPath = java.net.URLDecoder.decode(path, java.nio.charset.StandardCharsets.UTF_8);
        Optional<Page> page = pageService.getPageByPath(decodedPath);
        return page.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    @PreAuthorize("@authz.hasPermission(authentication, 'view', '/page-management')")
    @Operation(summary = "Search pages", description = "Search pages by name, path, or description")
    public ResponseEntity<List<Page>> searchPages(@Parameter(description = "Search term") @RequestParam String term) {
        List<Page> pages = pageService.searchPages(term);
        return ResponseEntity.ok(pages);
    }

    @PostMapping
    @PreAuthorize("@authz.hasPermission(authentication, 'edit', '/page-management')")
    @Operation(summary = "Create page", description = "Create a new application page")
    @ApiResponse(responseCode = "201", description = "Page created successfully")
    public ResponseEntity<Page> createPage(@Valid @RequestBody Page page) {
        try {
            Page createdPage = pageService.createPage(page);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdPage);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("@authz.hasPermission(authentication, 'edit', '/page-management')")
    @Operation(summary = "Update page", description = "Update an existing page")
    public ResponseEntity<Page> updatePage(@Parameter(description = "Page ID") @PathVariable String id, 
                                          @Valid @RequestBody Page pageDetails) {
        try {
            Page updatedPage = pageService.updatePage(id, pageDetails);
            if (updatedPage != null) {
                return ResponseEntity.ok(updatedPage);
            }
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("@authz.hasPermission(authentication, 'delete', '/page-management')")
    @Operation(summary = "Delete page", description = "Delete a page")
    @ApiResponse(responseCode = "204", description = "Page deleted successfully")
    public ResponseEntity<Void> deletePage(@Parameter(description = "Page ID") @PathVariable String id) {
        boolean deleted = pageService.deletePage(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
