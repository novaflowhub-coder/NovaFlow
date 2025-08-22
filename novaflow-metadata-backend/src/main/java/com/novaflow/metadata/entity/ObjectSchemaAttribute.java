package com.novaflow.metadata.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import io.swagger.v3.oas.annotations.media.Schema;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "object_schema_attributes", schema = "metadata")
@Schema(description = "Schema attribute entity representing object field definitions")
public class ObjectSchemaAttribute {
    
    @Id
    @Schema(description = "Unique identifier for the attribute", example = "ATTR001")
    private String id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "integration_object_id")
    @JsonBackReference("integrationobject-attributes")
    @Schema(description = "Integration object this attribute belongs to")
    private IntegrationObject integrationObject;
    
    @NotBlank
    @Column(name = "attribute_name")
    @Schema(description = "Attribute name", example = "customer_id")
    private String attributeName;
    
    @NotBlank
    @Column(name = "data_type")
    @Schema(description = "Data type", example = "VARCHAR")
    private String dataType;
    
    @NotNull
    @Column(name = "is_nullable")
    @Schema(description = "Whether the attribute can be null", example = "false")
    private Boolean isNullable;
    
    @Column(name = "source_field")
    @Schema(description = "Source field mapping", example = "CUST_ID")
    private String sourceField;
    
    @Column(name = "sample_value")
    @Schema(description = "Sample value for reference", example = "CUST001")
    private String sampleValue;
    
    // Constructors
    public ObjectSchemaAttribute() {}
    
    public ObjectSchemaAttribute(String id, IntegrationObject integrationObject, String attributeName, String dataType, Boolean isNullable) {
        this.id = id;
        this.integrationObject = integrationObject;
        this.attributeName = attributeName;
        this.dataType = dataType;
        this.isNullable = isNullable;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public IntegrationObject getIntegrationObject() { return integrationObject; }
    public void setIntegrationObject(IntegrationObject integrationObject) { this.integrationObject = integrationObject; }
    
    public String getAttributeName() { return attributeName; }
    public void setAttributeName(String attributeName) { this.attributeName = attributeName; }
    
    public String getDataType() { return dataType; }
    public void setDataType(String dataType) { this.dataType = dataType; }
    
    public Boolean getIsNullable() { return isNullable; }
    public void setIsNullable(Boolean isNullable) { this.isNullable = isNullable; }
    
    public String getSourceField() { return sourceField; }
    public void setSourceField(String sourceField) { this.sourceField = sourceField; }
    
    public String getSampleValue() { return sampleValue; }
    public void setSampleValue(String sampleValue) { this.sampleValue = sampleValue; }
}
