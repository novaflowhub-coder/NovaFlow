package com.novaflow.metadata.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import io.swagger.v3.oas.annotations.media.Schema;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "run_control_file_watches", schema = "metadata")
@Schema(description = "Run control file watch configuration for file system triggers")
public class RunControlFileWatch {
    
    @Id
    @Column(name = "run_control_id")
    @Schema(description = "Run control ID (primary key)", example = "RC001")
    private String runControlId;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "run_control_id")
    @MapsId
    @JsonBackReference("runcontrol-filewatch")
    @Schema(description = "Associated run control")
    private RunControl runControl;
    
    @NotBlank
    @Schema(description = "Directory to watch", example = "/data/incoming")
    private String directory;
    
    @NotBlank
    @Column(name = "file_pattern")
    @Schema(description = "File pattern to match", example = "*.csv")
    private String filePattern;
    
    @NotBlank
    @Column(name = "event_type")
    @Schema(description = "File event type to trigger on", example = "All")
    private String eventType = "All";
    
    // Constructors
    public RunControlFileWatch() {}
    
    public RunControlFileWatch(String runControlId, String directory, String filePattern) {
        this.runControlId = runControlId;
        this.directory = directory;
        this.filePattern = filePattern;
    }
    
    // Getters and Setters
    public String getRunControlId() { return runControlId; }
    public void setRunControlId(String runControlId) { this.runControlId = runControlId; }
    
    public RunControl getRunControl() { return runControl; }
    public void setRunControl(RunControl runControl) { this.runControl = runControl; }
    
    public String getDirectory() { return directory; }
    public void setDirectory(String directory) { this.directory = directory; }
    
    public String getFilePattern() { return filePattern; }
    public void setFilePattern(String filePattern) { this.filePattern = filePattern; }
    
    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }
}
