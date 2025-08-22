package com.novaflow.metadata.repository;

import com.novaflow.metadata.entity.HolidayCalendar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface HolidayCalendarRepository extends JpaRepository<HolidayCalendar, String> {
    
    @Query("SELECT DISTINCT hc FROM HolidayCalendar hc LEFT JOIN FETCH hc.holidayList")
    List<HolidayCalendar> findAllWithHolidays();
    
    @Query("SELECT DISTINCT hc FROM HolidayCalendar hc LEFT JOIN FETCH hc.runControls WHERE hc IN :calendars")
    List<HolidayCalendar> findWithRunControls(@Param("calendars") List<HolidayCalendar> calendars);
    
    List<HolidayCalendar> findByDomainId(String domainId);
    
    List<HolidayCalendar> findByDomainIdAndStatus(String domainId, Character status);
    
    List<HolidayCalendar> findByCountry(String country);
    
    List<HolidayCalendar> findByDomainIdAndCountry(String domainId, String country);
    
    Optional<HolidayCalendar> findByDomainIdAndName(String domainId, String name);
    
    @Query("SELECT hc FROM HolidayCalendar hc WHERE hc.domainId = :domainId AND hc.name LIKE %:name%")
    List<HolidayCalendar> findByDomainIdAndNameContaining(@Param("domainId") String domainId, @Param("name") String name);
    
    @Query("SELECT hc FROM HolidayCalendar hc WHERE hc.status = 'A' ORDER BY hc.name")
    List<HolidayCalendar> findAllActive();
    
    long countByDomainId(String domainId);
    
    long countByDomainIdAndStatus(String domainId, Character status);
}
