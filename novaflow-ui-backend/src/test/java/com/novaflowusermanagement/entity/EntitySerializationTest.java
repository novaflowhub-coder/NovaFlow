package com.novaflowusermanagement.entity;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import java.time.LocalDateTime;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class EntitySerializationTest {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    public void testDomainSerialization() throws Exception {
        Domain domain = new Domain();
        domain.setId("DOM001");
        domain.setName("Test Domain");
        domain.setDescription("Test Description");
        domain.setCode("TEST");
        domain.setIsActive(true);
        domain.setCreatedBy("system");
        domain.setCreatedDate(LocalDateTime.now());

        // This should not throw StackOverflowError due to circular references
        String json = objectMapper.writeValueAsString(domain);
        assertNotNull(json);
        assertTrue(json.contains("DOM001"));
        assertTrue(json.contains("Test Domain"));
    }

    @Test
    public void testUserSerialization() throws Exception {
        User user = new User();
        user.setId("USR001");
        user.setName("John Doe");
        user.setEmail("john.doe@test.com");
        user.setUsername("jdoe");
        user.setFullName("John Michael Doe");
        user.setDepartment("IT");
        user.setStatus("Active");
        user.setIsActive(true);
        user.setCreatedBy("system");
        user.setCreatedDate(LocalDateTime.now());

        // This should not throw StackOverflowError due to circular references
        String json = objectMapper.writeValueAsString(user);
        assertNotNull(json);
        assertTrue(json.contains("USR001"));
        assertTrue(json.contains("John Doe"));
    }

    @Test
    public void testRoleSerialization() throws Exception {
        Domain domain = new Domain();
        domain.setId("DOM001");
        domain.setName("Test Domain");
        domain.setCode("TEST");
        domain.setIsActive(true);
        domain.setCreatedBy("system");

        Role role = new Role();
        role.setId("ROLE001");
        role.setName("Test Role");
        role.setDescription("Test Role Description");
        role.setDomain(domain);
        role.setUserCount(0);
        role.setCreatedBy("system");
        role.setCreatedDate(LocalDateTime.now());

        // This should not throw StackOverflowError due to circular references
        String json = objectMapper.writeValueAsString(role);
        assertNotNull(json);
        assertTrue(json.contains("ROLE001"));
        assertTrue(json.contains("Test Role"));
    }

    @Test
    public void testUserDomainRoleSerialization() throws Exception {
        Domain domain = new Domain();
        domain.setId("DOM001");
        domain.setName("Test Domain");
        domain.setCode("TEST");
        domain.setIsActive(true);
        domain.setCreatedBy("system");

        User user = new User();
        user.setId("USR001");
        user.setName("John Doe");
        user.setEmail("john.doe@test.com");
        user.setIsActive(true);
        user.setCreatedBy("system");

        Role role = new Role();
        role.setId("ROLE001");
        role.setName("Test Role");
        role.setDomain(domain);
        role.setCreatedBy("system");

        UserDomainRole userDomainRole = new UserDomainRole();
        userDomainRole.setId("UDR001");
        userDomainRole.setUser(user);
        userDomainRole.setDomain(domain);
        userDomainRole.setRole(role);
        userDomainRole.setIsActive(true);
        userDomainRole.setAssignedBy("system");
        userDomainRole.setAssignedDate(LocalDateTime.now());

        // This should not throw StackOverflowError due to circular references
        String json = objectMapper.writeValueAsString(userDomainRole);
        assertNotNull(json);
        assertTrue(json.contains("UDR001"));
    }
}
