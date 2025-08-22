package com.novaflow.metadata.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import io.swagger.v3.oas.annotations.media.Schema;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonRawValue;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "run_control_streams", schema = "metadata")
@Schema(description = "Run control stream configuration for real-time data triggers")
public class RunControlStream {
    
    @Id
    @Column(name = "run_control_id")
    @Schema(description = "Run control ID (primary key)", example = "RC001")
    private String runControlId;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "run_control_id")
    @MapsId
    @JsonBackReference("runcontrol-stream")
    @Schema(description = "Associated run control")
    private RunControl runControl;
    
    @NotBlank
    @Column(name = "source_id")
    @Schema(description = "Stream source identifier", example = "kafka-cluster-1")
    private String sourceId;
    
    @NotBlank
    @Schema(description = "Topic name for streaming", example = "customer-updates")
    private String topic;
    
    @JdbcTypeCode(SqlTypes.JSON)
    @JsonRawValue
    @Schema(description = "Stream parameters as JSON")
    private String parameters;
    
    // Constructors
    public RunControlStream() {}
    
    public RunControlStream(String runControlId, String sourceId, String topic) {
        this.runControlId = runControlId;
        this.sourceId = sourceId;
        this.topic = topic;
    }
    
    // Getters and Setters
    public String getRunControlId() { return runControlId; }
    public void setRunControlId(String runControlId) { this.runControlId = runControlId; }
    
    public RunControl getRunControl() { return runControl; }
    public void setRunControl(RunControl runControl) { this.runControl = runControl; }
    
    public String getSourceId() { return sourceId; }
    public void setSourceId(String sourceId) { this.sourceId = sourceId; }
    
    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }
    
    public String getParameters() { return parameters; }
    public void setParameters(String parameters) { this.parameters = parameters; }
}
