package com.novaflow.metadata.repository;

import com.novaflow.metadata.entity.ObjectSchemaAttribute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ObjectSchemaAttributeRepository extends JpaRepository<ObjectSchemaAttribute, String> {
    
    List<ObjectSchemaAttribute> findByIntegrationObjectId(String integrationObjectId);
    
    List<ObjectSchemaAttribute> findByAttributeName(String attributeName);
    
    List<ObjectSchemaAttribute> findByDataType(String dataType);
    
    List<ObjectSchemaAttribute> findByIsNullable(Boolean isNullable);
    
    @Query("SELECT osa FROM ObjectSchemaAttribute osa WHERE osa.integrationObject.id = :integrationObjectId AND osa.attributeName LIKE %:attributeName%")
    List<ObjectSchemaAttribute> findByIntegrationObjectIdAndAttributeNameContaining(@Param("integrationObjectId") String integrationObjectId, @Param("attributeName") String attributeName);
    
    @Query("SELECT osa FROM ObjectSchemaAttribute osa WHERE osa.integrationObject.id = :integrationObjectId ORDER BY osa.attributeName")
    List<ObjectSchemaAttribute> findByIntegrationObjectIdOrderByAttributeName(@Param("integrationObjectId") String integrationObjectId);
    
    long countByIntegrationObjectId(String integrationObjectId);
    
    long countByDataType(String dataType);
}
