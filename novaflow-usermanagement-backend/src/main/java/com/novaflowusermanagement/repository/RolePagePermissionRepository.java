package com.novaflowusermanagement.repository;

import com.novaflowusermanagement.entity.RolePagePermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RolePagePermissionRepository extends JpaRepository<RolePagePermission, String> {
    
    List<RolePagePermission> findByRoleName(String roleName);
    
    List<RolePagePermission> findByPageId(String pageId);
    
    List<RolePagePermission> findByPermissionTypeId(String permissionTypeId);
    
    List<RolePagePermission> findByIsGranted(Boolean isGranted);
    
    @Query("SELECT rpp FROM RolePagePermission rpp WHERE rpp.roleName = :roleName AND rpp.isGranted = true")
    List<RolePagePermission> findGrantedPermissionsByRole(@Param("roleName") String roleName);
    
    @Query("SELECT rpp FROM RolePagePermission rpp WHERE rpp.page.id = :pageId AND rpp.isGranted = true")
    List<RolePagePermission> findGrantedPermissionsByPage(@Param("pageId") String pageId);
    
    @Query("SELECT rpp FROM RolePagePermission rpp WHERE rpp.roleName = :roleName AND rpp.page.id = :pageId")
    List<RolePagePermission> findByRoleNameAndPageId(@Param("roleName") String roleName, @Param("pageId") String pageId);
    
    @Query("SELECT rpp FROM RolePagePermission rpp WHERE rpp.roleName = :roleName AND rpp.page.id = :pageId AND rpp.permissionType.id = :permissionTypeId")
    Optional<RolePagePermission> findByRoleNameAndPageIdAndPermissionTypeId(
        @Param("roleName") String roleName, 
        @Param("pageId") String pageId, 
        @Param("permissionTypeId") String permissionTypeId);
    
    @Query("SELECT rpp FROM RolePagePermission rpp " +
           "JOIN FETCH rpp.page p " +
           "JOIN FETCH rpp.permissionType pt " +
           "WHERE rpp.roleName = :roleName " +
           "ORDER BY p.name, pt.name")
    List<RolePagePermission> findByRoleNameWithJoinedData(@Param("roleName") String roleName);
    
    @Query("SELECT rpp FROM RolePagePermission rpp " +
           "JOIN FETCH rpp.page p " +
           "JOIN FETCH rpp.permissionType pt " +
           "ORDER BY rpp.roleName, p.name, pt.name")
    List<RolePagePermission> findAllWithJoinedData();
    
    @Query("SELECT rpp FROM RolePagePermission rpp " +
           "JOIN FETCH rpp.page p " +
           "JOIN FETCH rpp.permissionType pt " +
           "WHERE (LOWER(rpp.roleName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "   OR LOWER(p.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "   OR LOWER(pt.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
           "ORDER BY rpp.roleName, p.name, pt.name")
    List<RolePagePermission> findAllWithJoinedDataBySearch(@Param("searchTerm") String searchTerm);
}
