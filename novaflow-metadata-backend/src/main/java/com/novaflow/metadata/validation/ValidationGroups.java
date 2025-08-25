package com.novaflow.metadata.validation;

/**
 * Validation groups for different operations
 */
public class ValidationGroups {
    
    /**
     * Validation group for create operations
     */
    public interface OnCreate {}
    
    /**
     * Validation group for update operations
     */
    public interface OnUpdate {}
    
    /**
     * Validation group for version operations
     */
    public interface OnVersion {}
}
