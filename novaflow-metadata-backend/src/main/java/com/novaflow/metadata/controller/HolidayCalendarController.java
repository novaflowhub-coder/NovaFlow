package com.novaflow.metadata.controller;

import com.novaflow.metadata.entity.HolidayCalendar;
import com.novaflow.metadata.service.HolidayCalendarService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/holiday-calendars")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "https://your-frontend-domain.com"})
@Tag(name = "Holiday Calendar", description = "Holiday calendar management API")
public class HolidayCalendarController {

    @Autowired
    private HolidayCalendarService holidayCalendarService;

    @GetMapping
    @Operation(summary = "Get all holiday calendars", description = "Retrieve all holiday calendars with their holidays and run controls")
    public ResponseEntity<List<HolidayCalendar>> getAllHolidayCalendars() {
        List<HolidayCalendar> calendars = holidayCalendarService.getAllHolidayCalendars();
        return ResponseEntity.ok(calendars);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get holiday calendar by ID", description = "Retrieve a specific holiday calendar by its ID")
    public ResponseEntity<HolidayCalendar> getHolidayCalendarById(@PathVariable String id) {
        Optional<HolidayCalendar> calendar = holidayCalendarService.findById(id);
        return calendar.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/domain/{domainId}")
    @Operation(summary = "Get holiday calendars by domain", description = "Retrieve all holiday calendars for a specific domain")
    public ResponseEntity<List<HolidayCalendar>> getHolidayCalendarsByDomain(@PathVariable String domainId) {
        List<HolidayCalendar> calendars = holidayCalendarService.findByDomainId(domainId);
        return ResponseEntity.ok(calendars);
    }

    @GetMapping("/country/{country}")
    @Operation(summary = "Get holiday calendars by country", description = "Retrieve all holiday calendars for a specific country")
    public ResponseEntity<List<HolidayCalendar>> getHolidayCalendarsByCountry(@PathVariable String country) {
        List<HolidayCalendar> calendars = holidayCalendarService.findByCountry(country);
        return ResponseEntity.ok(calendars);
    }

    @PostMapping
    @Operation(summary = "Create holiday calendar", description = "Create a new holiday calendar")
    public ResponseEntity<HolidayCalendar> createHolidayCalendar(@RequestBody HolidayCalendar holidayCalendar) {
        HolidayCalendar saved = holidayCalendarService.save(holidayCalendar);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update holiday calendar", description = "Update an existing holiday calendar")
    public ResponseEntity<HolidayCalendar> updateHolidayCalendar(@PathVariable String id, @RequestBody HolidayCalendar holidayCalendar) {
        holidayCalendar.setId(id);
        HolidayCalendar updated = holidayCalendarService.save(holidayCalendar);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete holiday calendar", description = "Delete a holiday calendar by ID")
    public ResponseEntity<Void> deleteHolidayCalendar(@PathVariable String id) {
        holidayCalendarService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
