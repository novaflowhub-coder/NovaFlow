package com.novaflowusermanagement.service;

import com.novaflowusermanagement.entity.User;
import com.novaflowusermanagement.entity.RolePagePermission;
import com.novaflowusermanagement.repository.UserRepository;
import com.novaflowusermanagement.repository.RolePagePermissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service("authz")
public class AuthorizationService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RolePagePermissionRepository rolePagePermissionRepository;

    @Autowired
    private AuditLogger auditLogger;

    @Value("${okta.groups.claim:groups}")
    private String groupsClaim;

    @Value("${okta.groups.prefix:nova-}")
    private String groupsPrefix;

    /**
     * Get current user identity from JWT token
     */
    public UserIdentity getCurrentIdentity(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            return null;
        }

        Jwt jwt = (Jwt) auth.getPrincipal();
        String sub = jwt.getClaimAsString("sub");
        String email = jwt.getClaimAsString("email");
        List<String> groups = jwt.getClaimAsStringList(groupsClaim);
        
        if (groups == null) {
            groups = new ArrayList<>();
        }

        // Filter groups that start with nova- prefix
        List<String> novaGroups = groups.stream()
            .filter(group -> group.startsWith(groupsPrefix))
            .collect(Collectors.toList());

        return new UserIdentity(sub, email, novaGroups);
    }

    /**
     * Get effective roles for a user, combining Okta groups and database roles
     */
    public Set<String> getEffectiveRoles(Authentication auth, String domainId) {
        UserIdentity identity = getCurrentIdentity(auth);
        if (identity == null) {
            return new HashSet<>();
        }

        Set<String> effectiveRoles = new HashSet<>();

        // Add Okta groups (filtered for nova- prefix)
        effectiveRoles.addAll(identity.getGroups());

        // Add database roles for the user in the specified domain
        Optional<User> userOpt = userRepository.findByEmail(identity.getEmail());
        if (userOpt.isPresent() && domainId != null) {
            User user = userOpt.get();
            Set<String> dbRoles = user.getUserDomainRoles().stream()
                .filter(udr -> udr.getIsActive() && 
                              udr.getDomain().getId().equals(domainId))
                .map(udr -> udr.getRole().getName())
                .collect(Collectors.toSet());
            effectiveRoles.addAll(dbRoles);
        }

        return effectiveRoles;
    }

    /**
     * Check if user has specific permission for a page
     */
    public boolean hasPermission(Authentication auth, String permissionName, String pagePath, String domainId) {
        try {
            Set<String> effectiveRoles = getEffectiveRoles(auth, domainId);
            
            if (effectiveRoles.isEmpty()) {
                auditLogger.emit("ACCESS_DENIED", "PERMISSION_CHECK", pagePath, "DENIED", 
                    "No effective roles found for user");
                return false;
            }

            // Query role_page_permissions for granted permissions
            List<RolePagePermission> grantedPermissions = rolePagePermissionRepository
                .findGrantedPermissions(effectiveRoles, pagePath, permissionName);

            boolean hasPermission = !grantedPermissions.isEmpty();
            
            if (!hasPermission) {
                auditLogger.emit("ACCESS_DENIED", "PERMISSION_CHECK", pagePath, "DENIED", 
                    String.format("Permission '%s' not granted for roles: %s", permissionName, effectiveRoles));
            }

            return hasPermission;
        } catch (Exception e) {
            auditLogger.emit("ACCESS_ERROR", "PERMISSION_CHECK", pagePath, "ERROR", 
                "Exception during permission check: " + e.getMessage());
            return false;
        }
    }

    /**
     * Overloaded method without domainId
     */
    public boolean hasPermission(Authentication auth, String permissionName, String pagePath) {
        return hasPermission(auth, permissionName, pagePath, null);
    }

    /**
     * Get all permissions for a user across all pages they can access
     */
    public List<UserPermission> getAllPermissions(Authentication auth, String domainId) {
        Set<String> effectiveRoles = getEffectiveRoles(auth, domainId);
        
        if (effectiveRoles.isEmpty()) {
            return new ArrayList<>();
        }

        List<RolePagePermission> allPermissions = rolePagePermissionRepository
            .findAllGrantedPermissionsByRoles(effectiveRoles);

        return allPermissions.stream()
            .map(rpp -> new UserPermission(
                rpp.getPage().getPath(),
                rpp.getPage().getName(),
                rpp.getPermissionType().getName()
            ))
            .distinct()
            .collect(Collectors.toList());
    }

    // Inner classes for data transfer
    public static class UserIdentity {
        private final String sub;
        private final String email;
        private final List<String> groups;

        public UserIdentity(String sub, String email, List<String> groups) {
            this.sub = sub;
            this.email = email;
            this.groups = groups != null ? groups : new ArrayList<>();
        }

        public String getSub() { return sub; }
        public String getEmail() { return email; }
        public List<String> getGroups() { return groups; }
    }

    public static class UserPermission {
        private final String page;
        private final String pageName;
        private final String permission;

        public UserPermission(String page, String pageName, String permission) {
            this.page = page;
            this.pageName = pageName;
            this.permission = permission;
        }

        public String getPage() { return page; }
        public String getPageName() { return pageName; }
        public String getPermission() { return permission; }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            UserPermission that = (UserPermission) o;
            return Objects.equals(page, that.page) && Objects.equals(permission, that.permission);
        }

        @Override
        public int hashCode() {
            return Objects.hash(page, permission);
        }
    }
}
