package com.novaflowusermanagement.service;

import com.novaflowusermanagement.entity.User;
import com.novaflowusermanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service("authz")
public class AuthorizationService {

    // Identity record for Google OIDC
    public record Identity(String sub, String email) {}

    @Autowired
    private UserRepository userRepository;


    @Autowired
    private AuditLogger auditLogger;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Value("${rbac.cache.ttl.seconds:600}")
    private int cacheTtlSeconds;

    /**
     * Extract user identity from Google JWT token.
     * For DB-only RBAC, we ignore any groups in the JWT.
     */
    public Identity getCurrentIdentity(Authentication authentication) {
        if (!(authentication instanceof JwtAuthenticationToken)) {
            auditLogger.emit("AUTH_FAILED", "USER", authentication.getName(), "DENIED", "Invalid authentication type");
            throw new AccessDeniedException("Invalid authentication type");
        }

        JwtAuthenticationToken jwtAuth = (JwtAuthenticationToken) authentication;
        Jwt jwt = jwtAuth.getToken();

        String sub = jwt.getClaimAsString("sub");
        String email = jwt.getClaimAsString("email");
        
        // Fallback to preferred_username if email is not present
        if (email == null || email.isEmpty()) {
            email = jwt.getClaimAsString("preferred_username");
        }

        if (sub == null || email == null || email.isEmpty()) {
            auditLogger.emit("AUTH_FAILED", "USER", sub != null ? sub : "unknown", "DENIED", "Missing required claims (sub/email)");
            throw new AccessDeniedException("Missing required email claim");
        }

        return new Identity(sub, email);
    }

    /**
     * Get effective roles for a user from database only - DB-only RBAC
     */
    @Cacheable(value = "userRoles", key = "#authentication.name + ':' + (#domainId != null ? #domainId : 'null')")
    public Set<String> getEffectiveRoles(Authentication authentication, String domainId) {
        Identity identity = getCurrentIdentity(authentication);
        
        String sql = """
            SELECT DISTINCT r.name
            FROM user_management.users u
            JOIN user_management.user_domain_roles udr ON udr.user_id = u.id AND udr.is_active = TRUE
            JOIN user_management.roles r ON r.id = udr.role_id
            WHERE u.email = ?
            AND (? IS NULL OR udr.domain_id = ?)
        """;

        try {
            List<String> roles = jdbcTemplate.queryForList(
                sql, 
                String.class, 
                identity.email(), 
                domainId, 
                domainId
            );
            
            auditLogger.emit("ROLE_QUERY", "USER", identity.email(), "SUCCESS", roles.size() + " roles found");
            return new HashSet<>(roles);
        } catch (Exception e) {
            auditLogger.emit("ROLE_QUERY", "USER", identity.email(), "ERROR", "Failed to get effective roles: " + e.getMessage());
            return new HashSet<>();
        }
    }

    /**
     * Check if user has specific permission for a page - DB-only RBAC
     */
    @Cacheable(value = "userPermissions", key = "#authentication.name + ':' + #pagePath + ':' + #permissionName + ':' + (#domainId != null ? #domainId : 'null')")
    public boolean hasPermission(Authentication authentication, String permissionName, String pagePath, String domainId) {
        try {
            // First get user's effective roles
            Set<String> roles = getEffectiveRoles(authentication, domainId);
            if (roles.isEmpty()) {
                Identity identity = getCurrentIdentity(authentication);
                auditLogger.emit("PERMISSION_CHECK", "USER", identity.email(), "DENIED", "No roles found for user");
                return false;
            }

            // Check if any role grants the permission for the page
            String sql = """
                SELECT EXISTS (
                    SELECT 1
                    FROM user_management.role_page_permissions rpp
                    JOIN user_management.pages p ON p.id = rpp.page_id
                    JOIN user_management.permission_types pt ON pt.id = rpp.permission_type_id
                    WHERE p.path = ?
                    AND pt.name = ?
                    AND rpp.is_granted = TRUE
                    AND rpp.role_name = ANY(?)
                )
            """;

            boolean hasPermission = jdbcTemplate.queryForObject(
                sql, 
                Boolean.class, 
                pagePath, 
                permissionName, 
                roles.toArray(new String[0])
            );

            Identity identity = getCurrentIdentity(authentication);
            
            if (hasPermission) {
                auditLogger.emit("PERMISSION_CHECK", "USER", identity.email(), "SUCCESS", 
                    String.format("Permission %s granted for page %s", permissionName, pagePath));
            } else {
                auditLogger.emit("PERMISSION_CHECK", "USER", identity.email(), "DENIED", 
                    String.format("Permission %s denied for page %s", permissionName, pagePath));
            }

            return hasPermission;

        } catch (Exception e) {
            Identity identity = getCurrentIdentity(authentication);
            auditLogger.emit("PERMISSION_CHECK", "USER", identity.email(), "ERROR", "Permission check failed: " + e.getMessage());
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
     * Get all permissions for a user across all pages for a domain - used by /me endpoint
     */
    @Cacheable(value = "userAllPermissions", key = "#authentication.name + ':' + (#domainId != null ? #domainId : 'null')")
    public List<UserPermission> getAllPermissions(Authentication authentication, String domainId) {
        try {
            Set<String> roles = getEffectiveRoles(authentication, domainId);
            if (roles.isEmpty()) {
                return new ArrayList<>();
            }

            String sql = """
                SELECT DISTINCT p.path, pt.name as permission_name
                FROM user_management.role_page_permissions rpp
                JOIN user_management.pages p ON p.id = rpp.page_id
                JOIN user_management.permission_types pt ON pt.id = rpp.permission_type_id
                WHERE rpp.is_granted = TRUE
                AND rpp.role_name = ANY(?)
                ORDER BY p.path, pt.name
            """;

            return jdbcTemplate.query(sql, (rs, rowNum) -> 
                new UserPermission(rs.getString("path"), "", rs.getString("permission_name")),
                (Object) roles.toArray(new String[0])
            );

        } catch (Exception e) {
            Identity identity = getCurrentIdentity(authentication);
            auditLogger.emit("PERMISSION_QUERY", "USER", identity.email(), "ERROR", "Failed to get all permissions: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    // Inner classes for data transfer

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
