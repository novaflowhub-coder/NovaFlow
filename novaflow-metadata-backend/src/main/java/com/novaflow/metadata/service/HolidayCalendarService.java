package com.novaflow.metadata.service;

import com.novaflow.metadata.entity.HolidayCalendar;
import com.novaflow.metadata.repository.HolidayCalendarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class HolidayCalendarService {

    @Autowired
    private HolidayCalendarRepository holidayCalendarRepository;

    public List<HolidayCalendar> getAllHolidayCalendars() {
        // Step 1: Load base calendars with holidayList
        List<HolidayCalendar> calendars = holidayCalendarRepository.findAllWithHolidays();
        
        if (calendars.isEmpty()) {
            return calendars;
        }
        
        // Step 2: Load runControls collection in separate query
        holidayCalendarRepository.findWithRunControls(calendars);
        
        return calendars;
    }

    public Optional<HolidayCalendar> findById(String id) {
        return holidayCalendarRepository.findById(id);
    }

    public List<HolidayCalendar> findByDomainId(String domainId) {
        return holidayCalendarRepository.findByDomainId(domainId);
    }

    public List<HolidayCalendar> findByCountry(String country) {
        return holidayCalendarRepository.findByCountry(country);
    }

    public HolidayCalendar save(HolidayCalendar holidayCalendar) {
        return holidayCalendarRepository.save(holidayCalendar);
    }

    public void deleteById(String id) {
        holidayCalendarRepository.deleteById(id);
    }
}
