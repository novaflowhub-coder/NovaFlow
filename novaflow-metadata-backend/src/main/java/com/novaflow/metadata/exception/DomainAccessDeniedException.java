package com.novaflow.metadata.exception;

/**
 * Exception thrown when access to a domain is denied
 */
public class DomainAccessDeniedException extends RuntimeException {
    
    public DomainAccessDeniedException(String message) {
        super(message);
    }
    
    public DomainAccessDeniedException(String message, Throwable cause) {
        super(message, cause);
    }
}
