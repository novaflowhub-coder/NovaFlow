package com.novaflowusermanagement.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import io.swagger.v3.oas.annotations.media.Schema;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
@Schema(description = "User entity representing system users", example = "{\"id\": \"USR001\", \"name\": \"John Doe\", \"email\": \"john.doe@company.com\", \"username\": \"jdoe\", \"full_name\": \"John Michael Doe\", \"department\": \"Finance\", \"status\": \"Active\", \"is_active\": true, \"created_by\": \"system\"}")
public class User {
    
    @Id
    @Schema(description = "Unique identifier for the user", example = "USR001")
    private String id;
    
    @NotBlank
    @Schema(description = "User display name", example = "John Doe")
    private String name;
    
    @NotBlank
    @Email
    @Column(unique = true)
    @Schema(description = "User email address", example = "john.doe@company.com")
    private String email;
    
    @Column(unique = true)
    @Schema(description = "Username for login", example = "jdoe")
    private String username;
    
    @Column(name = "full_name")
    @Schema(description = "Full name of the user", example = "John Michael Doe")
    private String fullName;
    
    @Schema(description = "Department the user belongs to", example = "Finance Department")
    private String department;
    
    @NotNull
    @Schema(description = "User status", example = "Active")
    private String status = "Active";
    
    @NotNull
    @Column(name = "is_active")
    @Schema(description = "Whether the user is active", example = "true")
    private Boolean isActive = true;
    
    @Column(name = "last_login")
    @Schema(description = "Last login timestamp", example = "2025-08-21T19:30:00")
    private LocalDateTime lastLogin;
    
    @NotBlank
    @Column(name = "created_by")
    @Schema(description = "User who created this user", example = "system")
    private String createdBy;
    
    @Column(name = "created_date")
    @Schema(description = "Date when user was created", example = "2025-08-21T20:00:00")
    private LocalDateTime createdDate;
    
    @Column(name = "updated_by")
    @Schema(description = "User who last updated this user", example = "admin")
    private String updatedBy;
    
    @Column(name = "updated_date")
    @Schema(description = "Date when user was last updated", example = "2025-08-21T21:00:00")
    private LocalDateTime updatedDate;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference("user-userdomainroles")
    private List<UserDomainRole> userDomainRoles;
    
    // Constructors
    public User() {}
    
    public User(String id, String name, String email, String createdBy) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.createdBy = createdBy;
        this.createdDate = LocalDateTime.now();
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    
    public LocalDateTime getLastLogin() { return lastLogin; }
    public void setLastLogin(LocalDateTime lastLogin) { this.lastLogin = lastLogin; }
    
    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
    
    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }
    
    public String getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }
    
    public LocalDateTime getUpdatedDate() { return updatedDate; }
    public void setUpdatedDate(LocalDateTime updatedDate) { this.updatedDate = updatedDate; }
    
    public List<UserDomainRole> getUserDomainRoles() { return userDomainRoles; }
    public void setUserDomainRoles(List<UserDomainRole> userDomainRoles) { this.userDomainRoles = userDomainRoles; }
    
    @PrePersist
    protected void onCreate() {
        createdDate = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedDate = LocalDateTime.now();
    }
}
