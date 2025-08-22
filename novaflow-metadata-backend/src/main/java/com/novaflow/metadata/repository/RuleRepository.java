package com.novaflow.metadata.repository;

import com.novaflow.metadata.entity.Rule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface RuleRepository extends JpaRepository<Rule, String> {
    
    List<Rule> findByDomainId(String domainId);
    
    List<Rule> findByDomainIdAndStatus(String domainId, Character status);
    
    List<Rule> findByRuleType(String ruleType);
    
    List<Rule> findByDomainIdAndRuleType(String domainId, String ruleType);
    
    List<Rule> findBySourceObjectId(String sourceObjectId);
    
    List<Rule> findByTargetObjectId(String targetObjectId);
    
    Optional<Rule> findByDomainIdAndName(String domainId, String name);
    
    @Query("SELECT r FROM Rule r WHERE r.domainId = :domainId AND r.name LIKE %:name%")
    List<Rule> findByDomainIdAndNameContaining(@Param("domainId") String domainId, @Param("name") String name);
    
    @Query("SELECT r FROM Rule r WHERE r.status = 'A' AND r.effectiveDate <= :currentDate ORDER BY r.priority, r.name")
    List<Rule> findActiveRules(@Param("currentDate") LocalDateTime currentDate);
    
    @Query("SELECT r FROM Rule r WHERE r.domainId = :domainId AND r.status = 'A' AND r.effectiveDate <= :currentDate ORDER BY r.priority, r.name")
    List<Rule> findActiveRulesByDomain(@Param("domainId") String domainId, @Param("currentDate") LocalDateTime currentDate);
    
    long countByDomainId(String domainId);
    
    long countByDomainIdAndStatus(String domainId, Character status);
    
    long countByRuleType(String ruleType);
}
