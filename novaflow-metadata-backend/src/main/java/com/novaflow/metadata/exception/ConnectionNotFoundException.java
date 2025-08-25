package com.novaflow.metadata.exception;

/**
 * Exception thrown when a connection is not found
 */
public class ConnectionNotFoundException extends RuntimeException {
    
    public ConnectionNotFoundException(String message) {
        super(message);
    }
    
    public ConnectionNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
