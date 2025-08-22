package com.novaflow.metadata.repository;

import com.novaflow.metadata.entity.RunControlSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RunControlScheduleRepository extends JpaRepository<RunControlSchedule, String> {
    
    List<RunControlSchedule> findByRunControlId(String runControlId);
    
    @Query("SELECT s FROM RunControlSchedule s WHERE s.holidayCalendar.id = :holidayCalendarId")
    List<RunControlSchedule> findByHolidayCalendarId(@Param("holidayCalendarId") String holidayCalendarId);
    
    List<RunControlSchedule> findByTimezone(String timezone);
    
    List<RunControlSchedule> findBySkipOnHoliday(Boolean skipOnHoliday);
    
    List<RunControlSchedule> findByRunOnNextBusinessDay(Boolean runOnNextBusinessDay);
    
    @Query("SELECT COUNT(s) FROM RunControlSchedule s WHERE s.runControlId = :runControlId")
    long countByRunControlId(@Param("runControlId") String runControlId);
}
