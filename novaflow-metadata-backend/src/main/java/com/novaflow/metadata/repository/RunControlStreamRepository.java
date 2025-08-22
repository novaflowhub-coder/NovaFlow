package com.novaflow.metadata.repository;

import com.novaflow.metadata.entity.RunControlStream;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RunControlStreamRepository extends JpaRepository<RunControlStream, String> {
    
    List<RunControlStream> findByRunControlId(String runControlId);
    
    List<RunControlStream> findBySourceId(String sourceId);
    
    List<RunControlStream> findByTopic(String topic);
    
    @Query("SELECT COUNT(s) FROM RunControlStream s WHERE s.runControlId = :runControlId")
    long countByRunControlId(@Param("runControlId") String runControlId);
}
