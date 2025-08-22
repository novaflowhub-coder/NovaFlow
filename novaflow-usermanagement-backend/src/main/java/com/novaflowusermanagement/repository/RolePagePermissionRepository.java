package com.novaflowusermanagement.repository;

import com.novaflowusermanagement.entity.RolePagePermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface RolePagePermissionRepository extends JpaRepository<RolePagePermission, String> {
    
    @Query("SELECT rpp FROM RolePagePermission rpp " +
           "JOIN FETCH rpp.page p " +
           "JOIN FETCH rpp.permissionType pt " +
           "WHERE rpp.roleName IN :roleNames " +
           "AND p.path = :pagePath " +
           "AND pt.name = :permissionName " +
           "AND rpp.isGranted = true")
    List<RolePagePermission> findGrantedPermissions(
        @Param("roleNames") Set<String> roleNames,
        @Param("pagePath") String pagePath,
        @Param("permissionName") String permissionName
    );
    
    @Query("SELECT rpp FROM RolePagePermission rpp " +
           "JOIN FETCH rpp.page p " +
           "JOIN FETCH rpp.permissionType pt " +
           "WHERE rpp.roleName IN :roleNames " +
           "AND rpp.isGranted = true")
    List<RolePagePermission> findAllGrantedPermissionsByRoles(@Param("roleNames") Set<String> roleNames);
    
    @Query("SELECT rpp FROM RolePagePermission rpp " +
           "WHERE rpp.roleName = :roleName " +
           "AND rpp.page.id = :pageId " +
           "AND rpp.permissionType.id = :permissionTypeId")
    List<RolePagePermission> findByRoleNameAndPageIdAndPermissionTypeId(
        @Param("roleName") String roleName,
        @Param("pageId") String pageId,
        @Param("permissionTypeId") String permissionTypeId
    );
}
