package com.novaflow.metadata.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import io.swagger.v3.oas.annotations.media.Schema;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonRawValue;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "run_controls", schema = "metadata")
@Schema(description = "Run control entity for managing execution workflows and triggers")
public class RunControl {
    
    @Id
    @Schema(description = "Unique identifier for the run control", example = "RC001")
    private String id;
    
    @NotBlank
    @Schema(description = "Run control name", example = "Daily Customer Data Processing")
    private String name;
    
    @Schema(description = "Run control description", example = "Daily processing of customer data updates")
    private String description;
    
    @NotBlank
    @Column(name = "domain_id")
    @Schema(description = "Domain ID this run control belongs to", example = "DOM001")
    private String domainId;
    
    @NotBlank
    @Column(name = "trigger_type")
    @Schema(description = "Trigger type", example = "Scheduled")
    private String triggerType;
    
    @Column(name = "schedule_expression")
    @Schema(description = "Schedule expression (cron format)", example = "0 2 * * *")
    private String scheduleExpression;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "holiday_calendar_id")
    @JsonBackReference("calendar-runcontrols")
    @Schema(description = "Holiday calendar for scheduling")
    private HolidayCalendar holidayCalendar;
    
    @NotNull
    @Column(name = "effective_date")
    @Schema(description = "Effective date for the run control")
    private LocalDateTime effectiveDate;
    
    @NotNull
    @Schema(description = "Run control status", example = "I")
    private Character status = 'I';
    
    @NotNull
    @Schema(description = "Version number", example = "1")
    private Integer version = 1;
    
    @Column(name = "execution_mode")
    @Schema(description = "Execution mode", example = "Sequential")
    private String executionMode = "Sequential";
    
    @JdbcTypeCode(SqlTypes.JSON)
    @JsonRawValue
    @Schema(description = "Run control steps as JSON array")
    private String steps;
    
    @NotBlank
    @Column(name = "created_by")
    @Schema(description = "User who created the run control", example = "system")
    private String createdBy;
    
    @Column(name = "created_date")
    @Schema(description = "Creation timestamp")
    private LocalDateTime createdDate;
    
    @Column(name = "last_modified_by")
    @Schema(description = "User who last modified the run control")
    private String lastModifiedBy;
    
    @Column(name = "last_modified_date")
    @Schema(description = "Last modification timestamp")
    private LocalDateTime lastModifiedDate;
    
    @OneToMany(mappedBy = "runControl", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference("runcontrol-processlogs")
    private List<ProcessLog> processLogs;
    
    @OneToOne(mappedBy = "runControl", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference("runcontrol-schedule")
    private RunControlSchedule runControlSchedule;
    
    @OneToOne(mappedBy = "runControl", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference("runcontrol-stream")
    private RunControlStream runControlStream;
    
    @OneToOne(mappedBy = "runControl", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference("runcontrol-filewatch")
    private RunControlFileWatch runControlFileWatch;
    
    // Constructors
    public RunControl() {}
    
    public RunControl(String id, String name, String domainId, String triggerType, String createdBy) {
        this.id = id;
        this.name = name;
        this.domainId = domainId;
        this.triggerType = triggerType;
        this.createdBy = createdBy;
        this.effectiveDate = LocalDateTime.now();
        this.createdDate = LocalDateTime.now();
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getDomainId() { return domainId; }
    public void setDomainId(String domainId) { this.domainId = domainId; }
    
    public String getTriggerType() { return triggerType; }
    public void setTriggerType(String triggerType) { this.triggerType = triggerType; }
    
    public String getScheduleExpression() { return scheduleExpression; }
    public void setScheduleExpression(String scheduleExpression) { this.scheduleExpression = scheduleExpression; }
    
    public HolidayCalendar getHolidayCalendar() { return holidayCalendar; }
    public void setHolidayCalendar(HolidayCalendar holidayCalendar) { this.holidayCalendar = holidayCalendar; }
    
    public String getHolidayCalendarId() { return holidayCalendar != null ? holidayCalendar.getId() : null; }
    
    public LocalDateTime getEffectiveDate() { return effectiveDate; }
    public void setEffectiveDate(LocalDateTime effectiveDate) { this.effectiveDate = effectiveDate; }
    
    public Character getStatus() { return status; }
    public void setStatus(Character status) { this.status = status; }
    
    public Integer getVersion() { return version; }
    public void setVersion(Integer version) { this.version = version; }
    
    public String getExecutionMode() { return executionMode; }
    public void setExecutionMode(String executionMode) { this.executionMode = executionMode; }
    
    public String getSteps() { return steps; }
    public void setSteps(String steps) { this.steps = steps; }
    
    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
    
    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }
    
    public String getLastModifiedBy() { return lastModifiedBy; }
    public void setLastModifiedBy(String lastModifiedBy) { this.lastModifiedBy = lastModifiedBy; }
    
    public LocalDateTime getLastModifiedDate() { return lastModifiedDate; }
    public void setLastModifiedDate(LocalDateTime lastModifiedDate) { this.lastModifiedDate = lastModifiedDate; }
    
    public List<ProcessLog> getProcessLogs() { return processLogs; }
    public void setProcessLogs(List<ProcessLog> processLogs) { this.processLogs = processLogs; }
    
    public RunControlSchedule getRunControlSchedule() { return runControlSchedule; }
    public void setRunControlSchedule(RunControlSchedule runControlSchedule) { this.runControlSchedule = runControlSchedule; }
    
    public RunControlStream getRunControlStream() { return runControlStream; }
    public void setRunControlStream(RunControlStream runControlStream) { this.runControlStream = runControlStream; }
    
    public RunControlFileWatch getRunControlFileWatch() { return runControlFileWatch; }
    public void setRunControlFileWatch(RunControlFileWatch runControlFileWatch) { this.runControlFileWatch = runControlFileWatch; }
    
    @PrePersist
    protected void onCreate() {
        createdDate = LocalDateTime.now();
        if (effectiveDate == null) {
            effectiveDate = LocalDateTime.now();
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        lastModifiedDate = LocalDateTime.now();
    }
}
