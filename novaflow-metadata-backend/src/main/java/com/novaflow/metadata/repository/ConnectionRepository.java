package com.novaflow.metadata.repository;

import com.novaflow.metadata.entity.Connection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ConnectionRepository extends JpaRepository<Connection, UUID> {
    
    // Find current connections only (is_current = true)
    @Query("SELECT c FROM Connection c WHERE c.isCurrent = true ORDER BY c.name")
    List<Connection> findAllCurrentConnections();
    
    // Find current connections by domain
    @Query("SELECT c FROM Connection c WHERE c.domainId = :domainId AND c.isCurrent = true ORDER BY c.name")
    List<Connection> findCurrentConnectionsByDomain(@Param("domainId") String domainId);
    
    // Find current active connections by domain
    @Query("SELECT c FROM Connection c WHERE c.domainId = :domainId AND c.status = 'ACTIVE' AND c.isCurrent = true ORDER BY c.name")
    List<Connection> findCurrentActiveConnectionsByDomain(@Param("domainId") String domainId);
    
    // Find current connections by domain and type
    @Query("SELECT c FROM Connection c WHERE c.domainId = :domainId AND c.typeCode = :typeCode AND c.isCurrent = true ORDER BY c.name")
    List<Connection> findCurrentConnectionsByDomainAndType(@Param("domainId") String domainId, @Param("typeCode") String typeCode);
    
    // Check if current connection exists with same name in domain+type (for uniqueness validation)
    @Query("SELECT c FROM Connection c WHERE c.domainId = :domainId AND c.typeCode = :typeCode AND LOWER(c.name) = LOWER(:name) AND c.isCurrent = true")
    Optional<Connection> findCurrentConnectionByDomainTypeAndName(@Param("domainId") String domainId, @Param("typeCode") String typeCode, @Param("name") String name);
    
    // Search current connections by name within domain
    @Query("SELECT c FROM Connection c WHERE c.domainId = :domainId AND c.isCurrent = true AND LOWER(c.name) LIKE LOWER(CONCAT('%', :name, '%')) ORDER BY c.name")
    List<Connection> searchCurrentConnectionsByName(@Param("domainId") String domainId, @Param("name") String name);
    
    // Get all versions of a connection by connection_key (for history)
    @Query("SELECT c FROM Connection c WHERE c.connectionKey = :connectionKey ORDER BY c.versionNo DESC")
    List<Connection> findConnectionHistory(@Param("connectionKey") UUID connectionKey);
    
    // Get current version by connection_key
    @Query("SELECT c FROM Connection c WHERE c.connectionKey = :connectionKey AND c.isCurrent = true")
    Optional<Connection> findCurrentConnectionByKey(@Param("connectionKey") UUID connectionKey);
    
    // Count current connections by domain
    @Query("SELECT COUNT(c) FROM Connection c WHERE c.domainId = :domainId AND c.isCurrent = true")
    long countCurrentConnectionsByDomain(@Param("domainId") String domainId);
    
    // Count current active connections by domain
    @Query("SELECT COUNT(c) FROM Connection c WHERE c.domainId = :domainId AND c.status = 'ACTIVE' AND c.isCurrent = true")
    long countCurrentActiveConnectionsByDomain(@Param("domainId") String domainId);
    
    // Get domains that user has access to (for domain-scoped authorization)
    @Query(value = """
        SELECT DISTINCT c.domain_id 
        FROM metadata.connections c 
        WHERE c.domain_id IN (
            SELECT DISTINCT r.domain_id 
            FROM user_management.users u
            JOIN user_management.user_domain_roles udr ON u.id = udr.user_id AND udr.is_active = TRUE
            JOIN user_management.roles r ON udr.role_id = r.id
            WHERE u.email = :userEmail AND u.is_active = TRUE
        ) AND c.is_current = TRUE
        ORDER BY c.domain_id
        """, nativeQuery = true)
    List<String> findAccessibleDomainsByUser(@Param("userEmail") String userEmail);
}
