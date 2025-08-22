package com.novaflow.metadata.service;

import com.novaflow.metadata.entity.Connection;
import com.novaflow.metadata.repository.ConnectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ConnectionService {

    @Autowired
    private ConnectionRepository connectionRepository;

    public List<Connection> getAllConnections() {
        return connectionRepository.findAllConnections();
    }

    public Optional<Connection> getConnectionById(String id) {
        return connectionRepository.findById(id);
    }

    public List<Connection> getConnectionsByDomain(String domainId) {
        return connectionRepository.findByDomainId(domainId);
    }

    public List<Connection> getActiveConnectionsByDomain(String domainId) {
        return connectionRepository.findByDomainIdAndStatus(domainId, 'A');
    }

    public List<Connection> getConnectionsByType(String type) {
        return connectionRepository.findByType(type);
    }

    public List<Connection> getConnectionsByDomainAndType(String domainId, String type) {
        return connectionRepository.findByDomainIdAndType(domainId, type);
    }

    public List<Connection> searchConnectionsByName(String domainId, String name) {
        return connectionRepository.findByDomainIdAndNameContaining(domainId, name);
    }

    public Connection createConnection(Connection connection) {
        connection.setCreatedDate(LocalDateTime.now());
        connection.setVersion(1);
        return connectionRepository.save(connection);
    }

    public Connection updateConnection(String id, Connection connectionDetails) {
        return connectionRepository.findById(id)
                .map(connection -> {
                    connection.setName(connectionDetails.getName());
                    connection.setType(connectionDetails.getType());
                    connection.setDescription(connectionDetails.getDescription());
                    connection.setHost(connectionDetails.getHost());
                    connection.setPort(connectionDetails.getPort());
                    connection.setDatabase(connectionDetails.getDatabase());
                    connection.setUsername(connectionDetails.getUsername());
                    connection.setBaseUrl(connectionDetails.getBaseUrl());
                    connection.setConnectionParameters(connectionDetails.getConnectionParameters());
                    connection.setStatus(connectionDetails.getStatus());
                    connection.setLastModifiedBy(connectionDetails.getLastModifiedBy());
                    connection.setLastModifiedDate(LocalDateTime.now());
                    connection.setVersion(connection.getVersion() + 1);
                    return connectionRepository.save(connection);
                })
                .orElseThrow(() -> new RuntimeException("Connection not found with id: " + id));
    }

    public void deleteConnection(String id) {
        connectionRepository.deleteById(id);
    }

    public void deactivateConnection(String id, String modifiedBy) {
        connectionRepository.findById(id)
                .map(connection -> {
                    connection.setStatus('I');
                    connection.setLastModifiedBy(modifiedBy);
                    connection.setLastModifiedDate(LocalDateTime.now());
                    return connectionRepository.save(connection);
                })
                .orElseThrow(() -> new RuntimeException("Connection not found with id: " + id));
    }

    public void activateConnection(String id, String modifiedBy) {
        connectionRepository.findById(id)
                .map(connection -> {
                    connection.setStatus('A');
                    connection.setLastModifiedBy(modifiedBy);
                    connection.setLastModifiedDate(LocalDateTime.now());
                    return connectionRepository.save(connection);
                })
                .orElseThrow(() -> new RuntimeException("Connection not found with id: " + id));
    }

    public long getConnectionCountByDomain(String domainId) {
        return connectionRepository.countByDomainId(domainId);
    }

    public long getActiveConnectionCountByDomain(String domainId) {
        return connectionRepository.countByDomainIdAndStatus(domainId, 'A');
    }

    public boolean existsByDomainAndName(String domainId, String name) {
        return connectionRepository.findByDomainIdAndName(domainId, name).isPresent();
    }
}
