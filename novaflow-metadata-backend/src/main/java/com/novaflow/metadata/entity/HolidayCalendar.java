package com.novaflow.metadata.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import io.swagger.v3.oas.annotations.media.Schema;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "holiday_calendars", schema = "metadata")
@Schema(description = "Holiday calendar entity for managing business holidays")
public class HolidayCalendar {
    
    @Id
    @Schema(description = "Unique identifier for the holiday calendar", example = "CAL001")
    private String id;
    
    @NotBlank
    @Schema(description = "Calendar name", example = "US Federal Holidays")
    private String name;
    
    @Schema(description = "Calendar description", example = "United States federal holiday calendar")
    private String description;
    
    @NotBlank
    @Column(name = "domain_id")
    @Schema(description = "Domain ID this calendar belongs to", example = "DOM001")
    private String domainId;
    
    @NotBlank
    @Schema(description = "Country code", example = "US")
    private String country;
    
    @JdbcTypeCode(SqlTypes.JSON)
    @Schema(description = "Holidays as JSON array")
    private Map<String, Object> holidays;
    
    @NotNull
    @Schema(description = "Calendar status", example = "A")
    private Character status = 'A';
    
    @NotBlank
    @Column(name = "created_by")
    @Schema(description = "User who created the calendar", example = "system")
    private String createdBy;
    
    @Column(name = "created_date")
    @Schema(description = "Creation timestamp")
    private LocalDateTime createdDate;
    
    @Column(name = "last_modified_by")
    @Schema(description = "User who last modified the calendar")
    private String lastModifiedBy;
    
    @Column(name = "last_modified_date")
    @Schema(description = "Last modification timestamp")
    private LocalDateTime lastModifiedDate;
    
    @OneToMany(mappedBy = "holidayCalendar", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference("calendar-holidays")
    private List<Holiday> holidayList;
    
    @OneToMany(mappedBy = "holidayCalendar", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference("calendar-runcontrols")
    private List<RunControl> runControls;
    
    // Constructors
    public HolidayCalendar() {}
    
    public HolidayCalendar(String id, String name, String domainId, String country, String createdBy) {
        this.id = id;
        this.name = name;
        this.domainId = domainId;
        this.country = country;
        this.createdBy = createdBy;
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
    
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    
    public Map<String, Object> getHolidays() { return holidays; }
    public void setHolidays(Map<String, Object> holidays) { this.holidays = holidays; }
    
    public Character getStatus() { return status; }
    public void setStatus(Character status) { this.status = status; }
    
    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
    
    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }
    
    public String getLastModifiedBy() { return lastModifiedBy; }
    public void setLastModifiedBy(String lastModifiedBy) { this.lastModifiedBy = lastModifiedBy; }
    
    public LocalDateTime getLastModifiedDate() { return lastModifiedDate; }
    public void setLastModifiedDate(LocalDateTime lastModifiedDate) { this.lastModifiedDate = lastModifiedDate; }
    
    public List<Holiday> getHolidayList() { return holidayList; }
    public void setHolidayList(List<Holiday> holidayList) { this.holidayList = holidayList; }
    
    public List<RunControl> getRunControls() { return runControls; }
    public void setRunControls(List<RunControl> runControls) { this.runControls = runControls; }
    
    @PrePersist
    protected void onCreate() {
        createdDate = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        lastModifiedDate = LocalDateTime.now();
    }
}
