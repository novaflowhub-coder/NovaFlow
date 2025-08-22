package com.novaflow.metadata.service;

import com.novaflow.metadata.entity.Rule;
import com.novaflow.metadata.repository.RuleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class RuleService {

    @Autowired
    private RuleRepository ruleRepository;

    public List<Rule> getAllRules() {
        return ruleRepository.findAll();
    }

    public Optional<Rule> getRuleById(String id) {
        return ruleRepository.findById(id);
    }

    public List<Rule> getRulesByDomain(String domainId) {
        return ruleRepository.findByDomainId(domainId);
    }

    public List<Rule> getActiveRulesByDomain(String domainId) {
        return ruleRepository.findActiveRulesByDomain(domainId, LocalDateTime.now());
    }

    public List<Rule> getRulesByType(String ruleType) {
        return ruleRepository.findByRuleType(ruleType);
    }

    public List<Rule> getRulesBySourceObject(String sourceObjectId) {
        return ruleRepository.findBySourceObjectId(sourceObjectId);
    }

    public List<Rule> getRulesByTargetObject(String targetObjectId) {
        return ruleRepository.findByTargetObjectId(targetObjectId);
    }

    public List<Rule> searchRulesByName(String domainId, String name) {
        return ruleRepository.findByDomainIdAndNameContaining(domainId, name);
    }

    public List<Rule> getActiveRules() {
        return ruleRepository.findActiveRules(LocalDateTime.now());
    }

    public Rule createRule(Rule rule) {
        rule.setCreatedDate(LocalDateTime.now());
        rule.setVersion(1);
        if (rule.getEffectiveDate() == null) {
            rule.setEffectiveDate(LocalDateTime.now());
        }
        return ruleRepository.save(rule);
    }

    public Rule updateRule(String id, Rule ruleDetails) {
        return ruleRepository.findById(id)
                .map(rule -> {
                    rule.setName(ruleDetails.getName());
                    rule.setDescription(ruleDetails.getDescription());
                    rule.setRuleType(ruleDetails.getRuleType());
                    rule.setSourceObject(ruleDetails.getSourceObject());
                    rule.setTargetObject(ruleDetails.getTargetObject());
                    rule.setExpression(ruleDetails.getExpression());
                    rule.setPriority(ruleDetails.getPriority());
                    rule.setEffectiveDate(ruleDetails.getEffectiveDate());
                    rule.setStatus(ruleDetails.getStatus());
                    rule.setConditions(ruleDetails.getConditions());
                    rule.setActions(ruleDetails.getActions());
                    rule.setLastModifiedBy(ruleDetails.getLastModifiedBy());
                    rule.setLastModifiedDate(LocalDateTime.now());
                    rule.setVersion(rule.getVersion() + 1);
                    return ruleRepository.save(rule);
                })
                .orElseThrow(() -> new RuntimeException("Rule not found with id: " + id));
    }

    public void deleteRule(String id) {
        ruleRepository.deleteById(id);
    }

    public void activateRule(String id, String modifiedBy) {
        ruleRepository.findById(id)
                .map(rule -> {
                    rule.setStatus('A');
                    rule.setLastModifiedBy(modifiedBy);
                    rule.setLastModifiedDate(LocalDateTime.now());
                    return ruleRepository.save(rule);
                })
                .orElseThrow(() -> new RuntimeException("Rule not found with id: " + id));
    }

    public void deactivateRule(String id, String modifiedBy) {
        ruleRepository.findById(id)
                .map(rule -> {
                    rule.setStatus('I');
                    rule.setLastModifiedBy(modifiedBy);
                    rule.setLastModifiedDate(LocalDateTime.now());
                    return ruleRepository.save(rule);
                })
                .orElseThrow(() -> new RuntimeException("Rule not found with id: " + id));
    }

    public long getRuleCountByDomain(String domainId) {
        return ruleRepository.countByDomainId(domainId);
    }

    public long getActiveRuleCountByDomain(String domainId) {
        return ruleRepository.countByDomainIdAndStatus(domainId, 'A');
    }

    public long getRuleCountByType(String ruleType) {
        return ruleRepository.countByRuleType(ruleType);
    }

    public boolean existsByDomainAndName(String domainId, String name) {
        return ruleRepository.findByDomainIdAndName(domainId, name).isPresent();
    }
}
