package com.novaflow.metadata.repository;

import com.novaflow.metadata.entity.RunControlFileWatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RunControlFileWatchRepository extends JpaRepository<RunControlFileWatch, String> {
    
    List<RunControlFileWatch> findByRunControlId(String runControlId);
    
    List<RunControlFileWatch> findByDirectory(String directory);
    
    List<RunControlFileWatch> findByEventType(String eventType);
    
    List<RunControlFileWatch> findByFilePatternContainingIgnoreCase(String filePattern);
    
    @Query("SELECT COUNT(f) FROM RunControlFileWatch f WHERE f.runControlId = :runControlId")
    long countByRunControlId(@Param("runControlId") String runControlId);
}
