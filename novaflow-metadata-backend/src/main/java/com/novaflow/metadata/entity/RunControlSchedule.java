package com.novaflow.metadata.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import io.swagger.v3.oas.annotations.media.Schema;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "run_control_schedules", schema = "metadata")
@Schema(description = "Run control schedule configuration for cron-based triggers")
public class RunControlSchedule {
    
    @Id
    @Column(name = "run_control_id")
    @Schema(description = "Run control ID (primary key)", example = "RC001")
    private String runControlId;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "run_control_id")
    @MapsId
    @JsonBackReference("runcontrol-schedule")
    @Schema(description = "Associated run control")
    private RunControl runControl;
    
    @NotBlank
    @Column(name = "cron_expression")
    @Schema(description = "Cron expression for scheduling", example = "0 2 * * *")
    private String cronExpression;
    
    @NotBlank
    @Schema(description = "Timezone for schedule", example = "UTC")
    private String timezone = "UTC";
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "holiday_calendar_id")
    @Schema(description = "Holiday calendar for schedule adjustments")
    private HolidayCalendar holidayCalendar;
    
    @NotNull
    @Column(name = "skip_on_holiday")
    @Schema(description = "Whether to skip execution on holidays", example = "false")
    private Boolean skipOnHoliday = false;
    
    @NotNull
    @Column(name = "run_on_next_business_day")
    @Schema(description = "Whether to run on next business day if skipped", example = "false")
    private Boolean runOnNextBusinessDay = false;
    
    // Constructors
    public RunControlSchedule() {}
    
    public RunControlSchedule(String runControlId, String cronExpression, String timezone) {
        this.runControlId = runControlId;
        this.cronExpression = cronExpression;
        this.timezone = timezone;
    }
    
    // Getters and Setters
    public String getRunControlId() { return runControlId; }
    public void setRunControlId(String runControlId) { this.runControlId = runControlId; }
    
    public RunControl getRunControl() { return runControl; }
    public void setRunControl(RunControl runControl) { this.runControl = runControl; }
    
    public String getCronExpression() { return cronExpression; }
    public void setCronExpression(String cronExpression) { this.cronExpression = cronExpression; }
    
    public String getTimezone() { return timezone; }
    public void setTimezone(String timezone) { this.timezone = timezone; }
    
    public HolidayCalendar getHolidayCalendar() { return holidayCalendar; }
    public void setHolidayCalendar(HolidayCalendar holidayCalendar) { this.holidayCalendar = holidayCalendar; }
    
    public Boolean getSkipOnHoliday() { return skipOnHoliday; }
    public void setSkipOnHoliday(Boolean skipOnHoliday) { this.skipOnHoliday = skipOnHoliday; }
    
    public Boolean getRunOnNextBusinessDay() { return runOnNextBusinessDay; }
    public void setRunOnNextBusinessDay(Boolean runOnNextBusinessDay) { this.runOnNextBusinessDay = runOnNextBusinessDay; }
}
