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

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/pages")
@Tag(name = "Pages", description = "Page management operations")
public class PageController {

    @Autowired
    private PageService pageService;

    @GetMapping
    @PreAuthorize("@authz.hasPermission(authentication, 'READ', '/user-management/pages')")
    @Operation(summary = "Get all pages", description = "Retrieve all pages with optional search")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved pages")
    })
    public ResponseEntity<List<Page>> getAllPages(
            @Parameter(description = "Search term to filter pages") 
            @RequestParam(required = false) String search) {
        try {
            List<Page> pages;
            if (search != null && !search.trim().isEmpty()) {
                pages = pageService.searchPages(search);
            } else {
                pages = pageService.getAllPages();
            }
            return ResponseEntity.ok(pages);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("@authz.hasPermission(authentication, 'READ', '/user-management/pages')")
    @Operation(summary = "Get page by ID", description = "Retrieve a specific page by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved page"),
        @ApiResponse(responseCode = "404", description = "Page not found")
    })
    public ResponseEntity<Page> getPageById(
            @Parameter(description = "Page ID") 
            @PathVariable String id) {
        try {
            Optional<Page> page = pageService.getPageById(id);
            return page.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping
    @PreAuthorize("@authz.hasPermission(authentication, 'CREATE', '/user-management/pages')")
    @Operation(summary = "Create new page", description = "Create a new page")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Page created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    public ResponseEntity<?> createPage(@RequestBody Page page) {
        try {
            Page createdPage = pageService.createPage(page);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdPage);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create page");
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("@authz.hasPermission(authentication, 'UPDATE', '/user-management/pages')")
    @Operation(summary = "Update page", description = "Update an existing page")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Page updated successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input data"),
        @ApiResponse(responseCode = "404", description = "Page not found")
    })
    public ResponseEntity<?> updatePage(
            @Parameter(description = "Page ID") 
            @PathVariable String id, 
            @RequestBody Page pageDetails) {
        try {
            Page updatedPage = pageService.updatePage(id, pageDetails);
            return ResponseEntity.ok(updatedPage);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update page");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update page");
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("@authz.hasPermission(authentication, 'DELETE', '/user-management/pages')")
    @Operation(summary = "Delete page", description = "Delete a page by ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Page deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Page not found")
    })
    public ResponseEntity<?> deletePage(
            @Parameter(description = "Page ID") 
            @PathVariable String id) {
        try {
            pageService.deletePage(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete page");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete page");
        }
    }
}
