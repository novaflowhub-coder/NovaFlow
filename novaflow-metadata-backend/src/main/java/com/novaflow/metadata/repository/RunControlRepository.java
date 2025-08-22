package com.novaflow.metadata.repository;

import com.novaflow.metadata.entity.RunControl;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface RunControlRepository extends JpaRepository<RunControl, String> {
    
    @Query("SELECT DISTINCT rc FROM RunControl rc LEFT JOIN FETCH rc.processLogs")
    List<RunControl> findAllWithProcessLogs();
    
    @Query("SELECT DISTINCT rc FROM RunControl rc LEFT JOIN FETCH rc.runControlSchedule WHERE rc IN :controls")
    List<RunControl> findWithSchedule(@Param("controls") List<RunControl> controls);
    
    @Query("SELECT DISTINCT rc FROM RunControl rc LEFT JOIN FETCH rc.runControlStream WHERE rc IN :controls")
    List<RunControl> findWithStream(@Param("controls") List<RunControl> controls);
    
    @Query("SELECT DISTINCT rc FROM RunControl rc LEFT JOIN FETCH rc.runControlFileWatch WHERE rc IN :controls")
    List<RunControl> findWithFileWatch(@Param("controls") List<RunControl> controls);
    
    List<RunControl> findByDomainId(String domainId);
    
    List<RunControl> findByDomainIdAndStatus(String domainId, String status);
    
    List<RunControl> findByExecutionMode(String executionMode);
    
    @Query("SELECT r FROM RunControl r WHERE r.holidayCalendar.id = :holidayCalendarId")
    List<RunControl> findByHolidayCalendarId(@Param("holidayCalendarId") String holidayCalendarId);
    
    List<RunControl> findByDomainIdAndNameContainingIgnoreCase(String domainId, String name);
    
    @Query("SELECT r FROM RunControl r WHERE r.domainId = :domainId AND r.status = 'A'")
    List<RunControl> findActiveByDomainId(@Param("domainId") String domainId);
    
    @Query("SELECT COUNT(r) FROM RunControl r WHERE r.domainId = :domainId")
    long countByDomainId(@Param("domainId") String domainId);
    
    @Query("SELECT COUNT(r) FROM RunControl r WHERE r.domainId = :domainId AND r.status = 'A'")
    long countActiveByDomainId(@Param("domainId") String domainId);
    
    Optional<RunControl> findByIdAndDomainId(String id, String domainId);
}
