package com.novaflowusermanagement.controller;

import com.novaflowusermanagement.service.AuthorizationService;
import com.novaflowusermanagement.service.AuthorizationService.UserIdentity;
import com.novaflowusermanagement.service.AuthorizationService.UserPermission;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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
        
        UserIdentity identity = authorizationService.getCurrentIdentity(authentication);
        if (identity == null) {
            return ResponseEntity.status(401).build();
        }

        Set<String> effectiveRoles = authorizationService.getEffectiveRoles(authentication, domainId);
        List<UserPermission> permissions = authorizationService.getAllPermissions(authentication, domainId);

        UserProfileResponse response = new UserProfileResponse(
            identity.getSub(),
            identity.getEmail(),
            identity.getGroups(),
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

    // DTOs
    @Schema(description = "User profile response containing identity and permissions")
    public static class UserProfileResponse {
        @Schema(description = "User subject identifier", example = "00u1234567890abcdef")
        private String sub;

        @Schema(description = "User email address", example = "user@company.com")
        private String email;

        @Schema(description = "Okta groups starting with nova-", example = "[\"nova-admin\", \"nova-viewer\"]")
        private List<String> groups;

        @Schema(description = "Effective roles from Okta and database", example = "[\"nova-admin\", \"finance-manager\"]")
        private Set<String> roles;

        @Schema(description = "All permissions user has across pages")
        private List<UserPermission> permissions;

        public UserProfileResponse(String sub, String email, List<String> groups, Set<String> roles, List<UserPermission> permissions) {
            this.sub = sub;
            this.email = email;
            this.groups = groups;
            this.roles = roles;
            this.permissions = permissions;
        }

        // Getters and setters
        public String getSub() { return sub; }
        public void setSub(String sub) { this.sub = sub; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public List<String> getGroups() { return groups; }
        public void setGroups(List<String> groups) { this.groups = groups; }

        public Set<String> getRoles() { return roles; }
        public void setRoles(Set<String> roles) { this.roles = roles; }

        public List<UserPermission> getPermissions() { return permissions; }
        public void setPermissions(List<UserPermission> permissions) { this.permissions = permissions; }
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
