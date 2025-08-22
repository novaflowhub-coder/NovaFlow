package com.novaflowusermanagement.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import io.swagger.v3.oas.annotations.media.Schema;
import com.fasterxml.jackson.annotation.JsonBackReference;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_domain_roles")
@Schema(description = "Entity representing user-domain-role assignments", example = "{\"id\": \"UDR001\", \"user_id\": \"USR001\", \"domain_id\": \"DOM001\", \"role_id\": \"ROLE001\", \"is_active\": true, \"assigned_by\": \"system\"}")
public class UserDomainRole {
    
    @Id
    @Schema(description = "Unique identifier for the user-domain-role assignment", example = "UDR001")
    private String id;
    
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonBackReference("user-userdomainroles")
    @Schema(description = "User assigned to the role")
    private User user;
    
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "domain_id")
    @JsonBackReference("domain-userdomainroles")
    @Schema(description = "Domain where the role is assigned")
    private Domain domain;
    
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id")
    @JsonBackReference("role-userdomainroles")
    @Schema(description = "Role assigned to the user")
    private Role role;
    
    @NotNull
    @Column(name = "is_active")
    @Schema(description = "Whether the assignment is active", example = "true")
    private Boolean isActive = true;
    
    @NotBlank
    @Column(name = "assigned_by")
    @Schema(description = "User who made the assignment", example = "system")
    private String assignedBy;
    
    @Column(name = "assigned_date")
    @Schema(description = "Date when assignment was made", example = "2025-08-21T20:00:00")
    private LocalDateTime assignedDate;
    
    // Constructors
    public UserDomainRole() {}
    
    public UserDomainRole(String id, User user, Domain domain, Role role, String assignedBy) {
        this.id = id;
        this.user = user;
        this.domain = domain;
        this.role = role;
        this.assignedBy = assignedBy;
        this.assignedDate = LocalDateTime.now();
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public Domain getDomain() { return domain; }
    public void setDomain(Domain domain) { this.domain = domain; }
    
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    
    public String getAssignedBy() { return assignedBy; }
    public void setAssignedBy(String assignedBy) { this.assignedBy = assignedBy; }
    
    public LocalDateTime getAssignedDate() { return assignedDate; }
    public void setAssignedDate(LocalDateTime assignedDate) { this.assignedDate = assignedDate; }
    
    @PrePersist
    protected void onCreate() {
        assignedDate = LocalDateTime.now();
    }
}
