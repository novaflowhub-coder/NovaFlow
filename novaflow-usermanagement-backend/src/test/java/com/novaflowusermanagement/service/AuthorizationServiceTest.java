package com.novaflowusermanagement.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthorizationServiceTest {

    @Mock
    private AuditLogger auditLogger;

    @Mock
    private JdbcTemplate jdbcTemplate;

    @Mock
    private JwtAuthenticationToken jwtAuthenticationToken;

    @Mock
    private Authentication invalidAuthentication;

    @Mock
    private Jwt jwt;

    @InjectMocks
    private AuthorizationService authorizationService;

    @BeforeEach
    void setUp() {
        // No setup needed for Google OIDC - no groups configuration
    }

    @Test
    void getCurrentIdentity_ValidToken_ReturnsIdentity() {
        // Arrange
        when(jwtAuthenticationToken.getToken()).thenReturn(jwt);
        when(jwt.getClaimAsString("sub")).thenReturn("user123");
        when(jwt.getClaimAsString("email")).thenReturn("user@company.com");

        // Act
        AuthorizationService.Identity identity = authorizationService.getCurrentIdentity(jwtAuthenticationToken);

        // Assert
        assertNotNull(identity);
        assertEquals("user123", identity.sub());
        assertEquals("user@company.com", identity.email());
    }

    @Test
    void getCurrentIdentity_InvalidAuthentication_ThrowsException() {
        // Act & Assert
        assertThrows(AccessDeniedException.class, () -> {
            authorizationService.getCurrentIdentity(invalidAuthentication);
        });
    }

    @Test
    void getCurrentIdentity_MissingEmail_ThrowsException() {
        // Arrange
        when(jwtAuthenticationToken.getToken()).thenReturn(jwt);
        when(jwt.getClaimAsString("sub")).thenReturn("user123");
        when(jwt.getClaimAsString("email")).thenReturn(null);
        when(jwt.getClaimAsString("preferred_username")).thenReturn(null);

        // Act & Assert
        assertThrows(AccessDeniedException.class, () -> {
            authorizationService.getCurrentIdentity(jwtAuthenticationToken);
        });
    }

    @Test
    void getEffectiveRoles_DatabaseError_ReturnsEmptySet() {
        // Arrange
        when(jwtAuthenticationToken.getToken()).thenReturn(jwt);
        when(jwt.getClaimAsString("sub")).thenReturn("user123");
        when(jwt.getClaimAsString("email")).thenReturn("user@company.com");
        when(jdbcTemplate.queryForList(anyString(), eq(String.class), any(Object[].class)))
                .thenThrow(new RuntimeException("Database error"));

        // Act
        Set<String> roles = authorizationService.getEffectiveRoles(jwtAuthenticationToken);

        // Assert
        assertTrue(roles.isEmpty());
        verify(auditLogger).emit(eq("ROLE_QUERY"), eq("USER"), eq("user@company.com"), eq("ERROR"), anyString());
    }

    @Test
    void getEffectiveRoles_ValidUser_ReturnsDbRoles() {
        // Arrange
        when(jwtAuthenticationToken.getToken()).thenReturn(jwt);
        when(jwt.getClaimAsString("sub")).thenReturn("user123");
        when(jwt.getClaimAsString("email")).thenReturn("user@company.com");
        when(jdbcTemplate.queryForList(anyString(), eq(String.class), any(Object[].class)))
                .thenReturn(Arrays.asList("admin", "viewer"));

        // Act
        Set<String> roles = authorizationService.getEffectiveRoles(jwtAuthenticationToken);

        // Assert
        assertEquals(Set.of("admin", "viewer"), roles);
        verify(auditLogger).emit(eq("ROLE_QUERY"), eq("USER"), eq("user@company.com"), eq("SUCCESS"), anyString());
    }

    @Test
    void getEffectiveRoles_NoRoles_ReturnsEmptySet() {
        // Arrange
        when(jwtAuthenticationToken.getToken()).thenReturn(jwt);
        when(jwt.getClaimAsString("sub")).thenReturn("user123");
        when(jwt.getClaimAsString("email")).thenReturn("user@company.com");
        when(jdbcTemplate.queryForList(anyString(), eq(String.class), any(Object[].class)))
                .thenReturn(Collections.emptyList());

        // Act
        Set<String> roles = authorizationService.getEffectiveRoles(jwtAuthenticationToken);

        // Assert
        assertTrue(roles.isEmpty());
        verify(auditLogger).emit(eq("ROLE_QUERY"), eq("USER"), eq("user@company.com"), eq("SUCCESS"), anyString());
    }

    @Test
    void hasPermission_WithValidRoles_ReturnsTrue() {
        // Arrange
        when(jwtAuthenticationToken.getToken()).thenReturn(jwt);
        when(jwt.getClaimAsString("sub")).thenReturn("user123");
        when(jwt.getClaimAsString("email")).thenReturn("user@company.com");
        when(jdbcTemplate.queryForList(anyString(), eq(String.class), any(Object[].class)))
                .thenReturn(Arrays.asList("admin", "viewer"));
        when(jdbcTemplate.queryForObject(anyString(), eq(Boolean.class), anyString(), anyString(), any()))
                .thenReturn(true);

        // Act
        boolean hasPermission = authorizationService.hasPermission(jwtAuthenticationToken, "view", "/dashboard");

        // Assert
        assertTrue(hasPermission);
        verify(auditLogger).emit(eq("PERMISSION_CHECK"), eq("USER"), eq("user@company.com"), eq("SUCCESS"), anyString());
    }

    @Test
    void hasPermission_NoPermission_ReturnsFalse() {
        // Arrange
        when(jwtAuthenticationToken.getToken()).thenReturn(jwt);
        when(jwt.getClaimAsString("sub")).thenReturn("user123");
        when(jwt.getClaimAsString("email")).thenReturn("user@company.com");
        when(jdbcTemplate.queryForList(anyString(), eq(String.class), any(Object[].class)))
                .thenReturn(Arrays.asList("viewer"));
        when(jdbcTemplate.queryForObject(anyString(), eq(Boolean.class), anyString(), anyString(), any()))
                .thenReturn(false);

        // Act
        boolean hasPermission = authorizationService.hasPermission(jwtAuthenticationToken, "edit", "/dashboard");

        // Assert
        assertFalse(hasPermission);
        verify(auditLogger).emit(eq("PERMISSION_CHECK"), eq("USER"), eq("user@company.com"), eq("DENIED"), anyString());
    }

    @Test
    void hasPermission_DatabaseError_ReturnsFalse() {
        // Arrange
        when(jwtAuthenticationToken.getToken()).thenReturn(jwt);
        when(jwt.getClaimAsString("sub")).thenReturn("user123");
        when(jwt.getClaimAsString("email")).thenReturn("user@company.com");
        when(jdbcTemplate.queryForList(anyString(), eq(String.class), any(Object[].class)))
                .thenThrow(new RuntimeException("Database error"));

        // Act
        boolean hasPermission = authorizationService.hasPermission(jwtAuthenticationToken, "view", "/dashboard");

        // Assert
        assertFalse(hasPermission);
        verify(auditLogger).emit(eq("PERMISSION_CHECK"), eq("USER"), eq("user@company.com"), eq("ERROR"), anyString());
    }
}
