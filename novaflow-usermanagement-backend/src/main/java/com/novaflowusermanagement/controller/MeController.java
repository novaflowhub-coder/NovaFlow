package com.novaflowusermanagement.controller;

import com.novaflowusermanagement.service.AuthorizationService;
import com.novaflowusermanagement.service.AuthorizationService.UserPermission;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api")
@Tag(name = "Authentication & Authorization", description = "User identity and permission management")
public class MeController {

    @Autowired
    private AuthorizationService authorizationService;

    @GetMapping("/me")
    @Operation(
        summary = "Get current user identity and permissions",
        description = "Returns current user's identity, roles, and all permissions across accessible pages"
    )
    @ApiResponse(responseCode = "200", description = "User identity retrieved successfully")
    @ApiResponse(responseCode = "401", description = "User not authenticated")
    public ResponseEntity<UserProfileResponse> getCurrentUser(
            Authentication authentication,
            @RequestParam(required = false) String domainId) {
        
        AuthorizationService.Identity identity = authorizationService.getCurrentIdentity(authentication);
        
        // Check if user exists in database - reject if not found
        if (!authorizationService.userExistsInDatabase(identity.email())) {
            return ResponseEntity.status(403).build(); // 403 Forbidden - user not authorized
        }
        
        Set<String> effectiveRoles = authorizationService.getEffectiveRoles(authentication, domainId);
        List<AuthorizationService.UserPermission> permissions = authorizationService.getAllPermissions(authentication, domainId);

        // Google OIDC: Return identity with DB-derived roles and permissions only
        UserProfileResponse response = new UserProfileResponse(
            identity.sub(),
            identity.email(),
            effectiveRoles,
            permissions
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/authorize")
    @Operation(
        summary = "Check user authorization for specific action",
        description = "Validates if the current user has permission to perform a specific action on a page"
    )
    @ApiResponse(responseCode = "200", description = "Authorization check completed")
    @ApiResponse(responseCode = "401", description = "User not authenticated")
    public ResponseEntity<AuthorizationResponse> authorize(
            Authentication authentication,
            @RequestBody AuthorizationRequest request) {
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        boolean allowed = authorizationService.hasPermission(
            authentication,
            request.getPermissionName(),
            request.getPagePath(),
            request.getDomainId()
        );

        return ResponseEntity.ok(new AuthorizationResponse(allowed));
    }

    // Response DTOs
    @Schema(description = "User profile information with roles and permissions")
    public static class UserProfileResponse {
        @Schema(description = "User's unique identifier")
        private final String sub;
        
        @Schema(description = "User's email address")
        private final String email;
        
        @Schema(description = "User's effective roles from database")
        private final Set<String> roles;
        
        @Schema(description = "User's permissions across all accessible pages")
        private final List<AuthorizationService.UserPermission> permissions;

        public UserProfileResponse(String sub, String email, Set<String> roles, List<AuthorizationService.UserPermission> permissions) {
            this.sub = sub;
            this.email = email;
            this.roles = roles;
            this.permissions = permissions;
        }

        // Getters
        public String getSub() { return sub; }
        public String getEmail() { return email; }
        public Set<String> getRoles() { return roles; }
        public List<AuthorizationService.UserPermission> getPermissions() { return permissions; }
    }

    @Schema(description = "Authorization request for permission checking")
    public static class AuthorizationRequest {
        @Schema(description = "Page path to check", example = "/user-management", required = true)
        private String pagePath;

        @Schema(description = "Permission name to check", example = "view", required = true)
        private String permissionName;

        @Schema(description = "Domain ID for context", example = "DOM001")
        private String domainId;

        // Constructors
        public AuthorizationRequest() {}

        public AuthorizationRequest(String pagePath, String permissionName, String domainId) {
            this.pagePath = pagePath;
            this.permissionName = permissionName;
            this.domainId = domainId;
        }

        // Getters and setters
        public String getPagePath() { return pagePath; }
        public void setPagePath(String pagePath) { this.pagePath = pagePath; }

        public String getPermissionName() { return permissionName; }
        public void setPermissionName(String permissionName) { this.permissionName = permissionName; }

        public String getDomainId() { return domainId; }
        public void setDomainId(String domainId) { this.domainId = domainId; }
    }

    @Schema(description = "Authorization response indicating if action is allowed")
    public static class AuthorizationResponse {
        @Schema(description = "Whether the action is allowed", example = "true")
        private boolean allowed;

        public AuthorizationResponse(boolean allowed) {
            this.allowed = allowed;
        }

        public boolean isAllowed() { return allowed; }
        public void setAllowed(boolean allowed) { this.allowed = allowed; }
    }
}
