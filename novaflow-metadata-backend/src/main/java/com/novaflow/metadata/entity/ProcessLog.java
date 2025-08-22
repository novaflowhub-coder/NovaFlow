package com.novaflow.metadata.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import io.swagger.v3.oas.annotations.media.Schema;
import com.fasterxml.jackson.annotation.JsonBackReference;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "process_logs", schema = "metadata")
@Schema(description = "Process log entity for tracking execution history and results")
public class ProcessLog {
    
    @Id
    @Schema(description = "Unique identifier for the process log", example = "LOG001")
    private String id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "run_control_id")
    @JsonBackReference("runcontrol-processlogs")
    @Schema(description = "Run control this log belongs to")
    private RunControl runControl;
    
    @NotBlank
    @Column(name = "execution_id")
    @Schema(description = "Execution ID for grouping related logs", example = "EXEC_20240821_001")
    private String executionId;
    
    @NotNull
    @Column(name = "start_time")
    @Schema(description = "Process start time")
    private LocalDateTime startTime;
    
    @Column(name = "end_time")
    @Schema(description = "Process end time")
    private LocalDateTime endTime;
    
    @NotBlank
    @Schema(description = "Process status", example = "Running")
    private String status;
    
    @Column(name = "total_records")
    @Schema(description = "Total number of records processed", example = "1000")
    private Integer totalRecords = 0;
    
    @Column(name = "success_records")
    @Schema(description = "Number of successfully processed records", example = "950")
    private Integer successRecords = 0;
    
    @Column(name = "error_records")
    @Schema(description = "Number of records with errors", example = "50")
    private Integer errorRecords = 0;
    
    @JdbcTypeCode(SqlTypes.JSON)
    @Schema(description = "Detailed logs as JSON array")
    private Map<String, Object> logs;
    
    @NotBlank
    @Column(name = "created_by")
    @Schema(description = "User who created the log", example = "user001")
    private String createdBy;
    
    @Column(name = "created_date")
    @Schema(description = "Creation timestamp")
    private LocalDateTime createdDate;
    
    @Column(name = "last_modified_by")
    @Schema(description = "User who last modified the log")
    private String lastModifiedBy;
    
    @Column(name = "last_modified_date")
    @Schema(description = "Last modification timestamp")
    private LocalDateTime lastModifiedDate;
    
    @NotBlank
    @Column(name = "triggered_by")
    @Schema(description = "User or system that triggered the process", example = "system")
    private String triggeredBy;
    
    // Constructors
    public ProcessLog() {}
    
    public ProcessLog(String id, RunControl runControl, String executionId, String status, String triggeredBy) {
        this.id = id;
        this.runControl = runControl;
        this.executionId = executionId;
        this.status = status;
        this.triggeredBy = triggeredBy;
        this.startTime = LocalDateTime.now();
        this.createdDate = LocalDateTime.now();
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public RunControl getRunControl() { return runControl; }
    public void setRunControl(RunControl runControl) { this.runControl = runControl; }
    
    public String getExecutionId() { return executionId; }
    public void setExecutionId(String executionId) { this.executionId = executionId; }
    
    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }
    
    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public Integer getTotalRecords() { return totalRecords; }
    public void setTotalRecords(Integer totalRecords) { this.totalRecords = totalRecords; }
    
    public Integer getSuccessRecords() { return successRecords; }
    public void setSuccessRecords(Integer successRecords) { this.successRecords = successRecords; }
    
    public Integer getErrorRecords() { return errorRecords; }
    public void setErrorRecords(Integer errorRecords) { this.errorRecords = errorRecords; }
    
    public Map<String, Object> getLogs() { return logs; }
    public void setLogs(Map<String, Object> logs) { this.logs = logs; }
    
    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
    
    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }
    
    public String getTriggeredBy() { return triggeredBy; }
    public void setTriggeredBy(String triggeredBy) { this.triggeredBy = triggeredBy; }
    
    public String getLastModifiedBy() { return lastModifiedBy; }
    public void setLastModifiedBy(String lastModifiedBy) { this.lastModifiedBy = lastModifiedBy; }
    
    public LocalDateTime getLastModifiedDate() { return lastModifiedDate; }
    public void setLastModifiedDate(LocalDateTime lastModifiedDate) { this.lastModifiedDate = lastModifiedDate; }
    
    @PrePersist
    protected void onCreate() {
        createdDate = LocalDateTime.now();
        if (startTime == null) {
            startTime = LocalDateTime.now();
        }
    }
}
