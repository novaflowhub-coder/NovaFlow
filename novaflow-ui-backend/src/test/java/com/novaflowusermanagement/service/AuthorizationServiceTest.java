package com.novaflowusermanagement.service;

import com.novaflowusermanagement.entity.*;
import com.novaflowusermanagement.repository.UserRepository;
import com.novaflowusermanagement.repository.RolePagePermissionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthorizationServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RolePagePermissionRepository rolePagePermissionRepository;

    @Mock
    private AuditLogger auditLogger;

    @Mock
    private Authentication authentication;

    @Mock
    private Jwt jwt;

    @InjectMocks
    private AuthorizationService authorizationService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(authorizationService, "groupsClaim", "groups");
        ReflectionTestUtils.setField(authorizationService, "groupsPrefix", "nova-");
    }

    @Test
    void getCurrentIdentity_ValidToken_ReturnsUserIdentity() {
        // Arrange
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(jwt);
        when(jwt.getClaimAsString("sub")).thenReturn("user123");
        when(jwt.getClaimAsString("email")).thenReturn("user@company.com");
        when(jwt.getClaimAsStringList("groups")).thenReturn(Arrays.asList("nova-admin", "nova-viewer", "other-group"));

        // Act
        AuthorizationService.UserIdentity identity = authorizationService.getCurrentIdentity(authentication);

        // Assert
        assertNotNull(identity);
        assertEquals("user123", identity.getSub());
        assertEquals("user@company.com", identity.getEmail());
        assertEquals(Arrays.asList("nova-admin", "nova-viewer"), identity.getGroups());
    }

    @Test
    void getCurrentIdentity_UnauthenticatedUser_ReturnsNull() {
        // Arrange
        when(authentication.isAuthenticated()).thenReturn(false);

        // Act
        AuthorizationService.UserIdentity identity = authorizationService.getCurrentIdentity(authentication);

        // Assert
        assertNull(identity);
    }

    @Test
    void getCurrentIdentity_NoGroups_ReturnsEmptyGroups() {
        // Arrange
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(jwt);
        when(jwt.getClaimAsString("sub")).thenReturn("user123");
        when(jwt.getClaimAsString("email")).thenReturn("user@company.com");
        when(jwt.getClaimAsStringList("groups")).thenReturn(null);

        // Act
        AuthorizationService.UserIdentity identity = authorizationService.getCurrentIdentity(authentication);

        // Assert
        assertNotNull(identity);
        assertTrue(identity.getGroups().isEmpty());
    }

    @Test
    void getEffectiveRoles_OktaGroupsOnly_ReturnsFilteredGroups() {
        // Arrange
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(jwt);
        when(jwt.getClaimAsString("email")).thenReturn("user@company.com");
        when(jwt.getClaimAsStringList("groups")).thenReturn(Arrays.asList("nova-admin", "nova-viewer", "other-group"));
        when(userRepository.findByEmail("user@company.com")).thenReturn(Optional.empty());

        // Act
        Set<String> effectiveRoles = authorizationService.getEffectiveRoles(authentication, "DOM001");

        // Assert
        assertEquals(2, effectiveRoles.size());
        assertTrue(effectiveRoles.contains("nova-admin"));
        assertTrue(effectiveRoles.contains("nova-viewer"));
        assertFalse(effectiveRoles.contains("other-group"));
    }

    @Test
    void getEffectiveRoles_WithDatabaseRoles_CombinesOktaAndDbRoles() {
        // Arrange
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(jwt);
        when(jwt.getClaimAsString("email")).thenReturn("user@company.com");
        when(jwt.getClaimAsStringList("groups")).thenReturn(Arrays.asList("nova-admin"));

        // Mock user with domain roles
        User user = new User();
        Domain domain = new Domain();
        domain.setId("DOM001");
        Role role = new Role();
        role.setName("finance-manager");
        
        UserDomainRole udr = new UserDomainRole();
        udr.setUser(user);
        udr.setDomain(domain);
        udr.setRole(role);
        udr.setIsActive(true);
        
        user.setUserDomainRoles(Arrays.asList(udr));
        when(userRepository.findByEmail("user@company.com")).thenReturn(Optional.of(user));

        // Act
        Set<String> effectiveRoles = authorizationService.getEffectiveRoles(authentication, "DOM001");

        // Assert
        assertEquals(2, effectiveRoles.size());
        assertTrue(effectiveRoles.contains("nova-admin"));
        assertTrue(effectiveRoles.contains("finance-manager"));
    }

    @Test
    void hasPermission_GrantedPermission_ReturnsTrue() {
        // Arrange
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(jwt);
        when(jwt.getClaimAsString("email")).thenReturn("user@company.com");
        when(jwt.getClaimAsStringList("groups")).thenReturn(Arrays.asList("nova-admin"));
        when(userRepository.findByEmail("user@company.com")).thenReturn(Optional.empty());

        // Mock granted permission
        RolePagePermission permission = new RolePagePermission();
        when(rolePagePermissionRepository.findGrantedPermissions(
            eq(Set.of("nova-admin")), eq("/user-management"), eq("view")))
            .thenReturn(Arrays.asList(permission));

        // Act
        boolean hasPermission = authorizationService.hasPermission(authentication, "view", "/user-management", null);

        // Assert
        assertTrue(hasPermission);
        verify(auditLogger, never()).emit(eq("ACCESS_DENIED"), any(), any(), any(), any());
    }

    @Test
    void hasPermission_NoGrantedPermission_ReturnsFalse() {
        // Arrange
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(jwt);
        when(jwt.getClaimAsString("email")).thenReturn("user@company.com");
        when(jwt.getClaimAsStringList("groups")).thenReturn(Arrays.asList("nova-viewer"));
        when(userRepository.findByEmail("user@company.com")).thenReturn(Optional.empty());

        // Mock no granted permissions
        when(rolePagePermissionRepository.findGrantedPermissions(
            eq(Set.of("nova-viewer")), eq("/user-management"), eq("edit")))
            .thenReturn(Arrays.asList());

        // Act
        boolean hasPermission = authorizationService.hasPermission(authentication, "edit", "/user-management", null);

        // Assert
        assertFalse(hasPermission);
        verify(auditLogger).emit(eq("ACCESS_DENIED"), eq("PERMISSION_CHECK"), eq("/user-management"), eq("DENIED"), anyString());
    }

    @Test
    void hasPermission_NoEffectiveRoles_ReturnsFalse() {
        // Arrange
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(jwt);
        when(jwt.getClaimAsString("email")).thenReturn("user@company.com");
        when(jwt.getClaimAsStringList("groups")).thenReturn(Arrays.asList("other-group")); // No nova- prefix
        when(userRepository.findByEmail("user@company.com")).thenReturn(Optional.empty());

        // Act
        boolean hasPermission = authorizationService.hasPermission(authentication, "view", "/user-management", null);

        // Assert
        assertFalse(hasPermission);
        verify(auditLogger).emit(eq("ACCESS_DENIED"), eq("PERMISSION_CHECK"), eq("/user-management"), eq("DENIED"), 
            eq("No effective roles found for user"));
    }

    @Test
    void hasPermission_ExceptionThrown_ReturnsFalseAndLogsError() {
        // Arrange
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(jwt);
        when(jwt.getClaimAsString("email")).thenReturn("user@company.com");
        when(jwt.getClaimAsStringList("groups")).thenReturn(Arrays.asList("nova-admin"));
        when(userRepository.findByEmail("user@company.com")).thenThrow(new RuntimeException("Database error"));

        // Act
        boolean hasPermission = authorizationService.hasPermission(authentication, "view", "/user-management", null);

        // Assert
        assertFalse(hasPermission);
        verify(auditLogger).emit(eq("ACCESS_ERROR"), eq("PERMISSION_CHECK"), eq("/user-management"), eq("ERROR"), 
            contains("Exception during permission check"));
    }

    @Test
    void getAllPermissions_WithGrantedPermissions_ReturnsUserPermissions() {
        // Arrange
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(jwt);
        when(jwt.getClaimAsString("email")).thenReturn("user@company.com");
        when(jwt.getClaimAsStringList("groups")).thenReturn(Arrays.asList("nova-admin"));
        when(userRepository.findByEmail("user@company.com")).thenReturn(Optional.empty());

        // Mock permissions
        Page page = new Page();
        page.setPath("/dashboard");
        page.setName("Dashboard");
        
        PermissionType permissionType = new PermissionType();
        permissionType.setName("view");
        
        RolePagePermission permission = new RolePagePermission();
        permission.setPage(page);
        permission.setPermissionType(permissionType);
        
        when(rolePagePermissionRepository.findAllGrantedPermissionsByRoles(eq(Set.of("nova-admin"))))
            .thenReturn(Arrays.asList(permission));

        // Act
        List<AuthorizationService.UserPermission> permissions = 
            authorizationService.getAllPermissions(authentication, null);

        // Assert
        assertEquals(1, permissions.size());
        AuthorizationService.UserPermission userPermission = permissions.get(0);
        assertEquals("/dashboard", userPermission.getPage());
        assertEquals("Dashboard", userPermission.getPageName());
        assertEquals("view", userPermission.getPermission());
    }
}
