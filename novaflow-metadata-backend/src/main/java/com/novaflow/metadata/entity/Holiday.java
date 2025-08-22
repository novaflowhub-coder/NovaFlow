package com.novaflow.metadata.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import io.swagger.v3.oas.annotations.media.Schema;
import com.fasterxml.jackson.annotation.JsonBackReference;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "holidays", schema = "metadata")
@Schema(description = "Holiday entity representing individual holidays")
public class Holiday {
    
    @Id
    @Schema(description = "Unique identifier for the holiday", example = "HOL001")
    private String id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "calendar_id")
    @JsonBackReference("calendar-holidays")
    @Schema(description = "Holiday calendar this holiday belongs to")
    private HolidayCalendar holidayCalendar;
    
    @NotNull
    @Schema(description = "Holiday date", example = "2024-01-01")
    private LocalDate date;
    
    @NotBlank
    @Schema(description = "Holiday name", example = "New Year's Day")
    private String name;
    
    @Schema(description = "Holiday description", example = "Federal holiday celebrating the new year")
    private String description;
    
    @NotNull
    @Schema(description = "Whether the holiday is recurring", example = "true")
    private Boolean recurring = false;
    
    @NotBlank
    @Column(name = "created_by")
    @Schema(description = "User who created the holiday", example = "system")
    private String createdBy;
    
    @Column(name = "created_date")
    @Schema(description = "Creation timestamp")
    private LocalDateTime createdDate;
    
    @Column(name = "last_modified_by")
    @Schema(description = "User who last modified the holiday")
    private String lastModifiedBy;
    
    @Column(name = "last_modified_date")
    @Schema(description = "Last modification timestamp")
    private LocalDateTime lastModifiedDate;
    
    // Constructors
    public Holiday() {}
    
    public Holiday(String id, HolidayCalendar holidayCalendar, LocalDate date, String name, String createdBy) {
        this.id = id;
        this.holidayCalendar = holidayCalendar;
        this.date = date;
        this.name = name;
        this.createdBy = createdBy;
        this.createdDate = LocalDateTime.now();
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public HolidayCalendar getHolidayCalendar() { return holidayCalendar; }
    public void setHolidayCalendar(HolidayCalendar holidayCalendar) { this.holidayCalendar = holidayCalendar; }
    
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public Boolean getRecurring() { return recurring; }
    public void setRecurring(Boolean recurring) { this.recurring = recurring; }
    
    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
    
    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }
    
    public String getLastModifiedBy() { return lastModifiedBy; }
    public void setLastModifiedBy(String lastModifiedBy) { this.lastModifiedBy = lastModifiedBy; }
    
    public LocalDateTime getLastModifiedDate() { return lastModifiedDate; }
    public void setLastModifiedDate(LocalDateTime lastModifiedDate) { this.lastModifiedDate = lastModifiedDate; }
    
    @PrePersist
    protected void onCreate() {
        createdDate = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        lastModifiedDate = LocalDateTime.now();
    }
}
