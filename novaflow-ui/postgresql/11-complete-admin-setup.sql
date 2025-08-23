-- Complete cleanup and admin setup for all user management pages and domains
SET search_path TO user_management, public;

-- ============================================================================
-- COMPLETE CLEANUP
-- ============================================================================

-- Clean up metadata schema tables first
DELETE FROM metadata.run_control_file_watches;
DELETE FROM metadata.run_control_streams;
DELETE FROM metadata.run_control_schedules;
DELETE FROM metadata.process_logs;
DELETE FROM metadata.run_controls;
DELETE FROM metadata.holidays;
DELETE FROM metadata.holiday_calendars;
DELETE FROM metadata.dynamic_data_records;
DELETE FROM metadata.ui_metadata;
DELETE FROM metadata.version_history;
DELETE FROM metadata.approvals;
DELETE FROM metadata.rule_sets;
DELETE FROM metadata.rules;
DELETE FROM metadata.object_schema_attributes;
DELETE FROM metadata.scaffolds;
DELETE FROM metadata.integration_objects;
DELETE FROM metadata.connections;

-- Clean up user management schema
DELETE FROM user_management.role_page_permissions;
DELETE FROM user_management.user_domain_roles;
DELETE FROM user_management.users;
DELETE FROM user_management.roles;
DELETE FROM user_management.pages;
DELETE FROM user_management.permission_types;
DELETE FROM user_management.domains;

-- ============================================================================
-- COMPLETE ADMIN SETUP
-- ============================================================================

-- Insert all permission types (exact names from backend controllers)
INSERT INTO user_management.permission_types (id, name, description, created_by) VALUES
-- UserController uses lowercase
('view', 'view', 'Can view', 'system'),
('edit', 'edit', 'Can edit', 'system'),
('delete', 'delete', 'Can delete', 'system'),
-- Other controllers use uppercase
('READ', 'READ', 'Can READ', 'system'),
('CREATE', 'CREATE', 'Can CREATE', 'system'),
('UPDATE', 'UPDATE', 'Can UPDATE', 'system'),
('WRITE', 'WRITE', 'Can WRITE', 'system'),
('DELETE', 'DELETE', 'Can DELETE', 'system');

-- Insert all pages with exact backend authorization paths
INSERT INTO user_management.pages (id, name, path, description, created_by) VALUES
-- User management pages
('page-users', 'Users', '/user-management', 'UserController path', 'system'),
('page-roles', 'Roles', '/user-management/roles', 'RoleController path', 'system'),
('page-pages', 'Pages', '/user-management/pages', 'PageController path', 'system'),
('page-permission-types', 'Permission Types', '/user-management/permission-types', 'PermissionTypeController path', 'system'),
('page-role-permissions', 'Role Page Permissions', '/user-management/role-page-permissions', 'RolePagePermissionController path', 'system'),
-- Domain management
('page-domains', 'Domains', '/domains', 'DomainController path', 'system');

-- Insert admin domain
INSERT INTO user_management.domains (id, name, description, code, created_by) VALUES
('admin-domain', 'Administration', 'System administration domain', 'ADMIN', 'system');

-- Insert admin role
INSERT INTO user_management.roles (id, name, description, domain_id, created_by) VALUES
('admin-role', 'Administrator', 'System administrator with full access', 'admin-domain', 'system');

-- Insert admin user
INSERT INTO user_management.users (id, name, username, email, full_name, status, is_active, created_by) VALUES
('admin-user', 'Admin', 'admin', 'novaflowhub@gmail.com', 'NovaFlow Administrator', 'Active', true, 'system');

-- Assign admin user to admin role
INSERT INTO user_management.user_domain_roles (id, user_id, role_id, is_active, assigned_by) VALUES
('admin-assignment', 'admin-user', 'admin-role', true, 'system');

-- Grant ALL permissions to Administrator role for ALL pages
INSERT INTO user_management.role_page_permissions (id, role_name, page_id, permission_type_id, is_granted, created_by) 
SELECT 
    CONCAT('perm-', p.id, '-', pt.id) as id,
    'Administrator' as role_name,
    p.id as page_id,
    pt.id as permission_type_id,
    true as is_granted,
    'system' as created_by
FROM user_management.pages p
CROSS JOIN user_management.permission_types pt;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Verify admin user setup
SELECT '1. Admin User' as check_type, email, is_active, status FROM users WHERE email = 'novaflowhub@gmail.com';

-- Verify role assignment
SELECT '2. Admin Role' as check_type, r.name as role_name, d.name as domain_name 
FROM users u 
JOIN user_domain_roles udr ON u.id = udr.user_id 
JOIN roles r ON udr.role_id = r.id 
JOIN domains d ON r.domain_id = d.id
WHERE u.email = 'novaflowhub@gmail.com';

-- Verify all pages created
SELECT '3. Pages Created' as check_type, COUNT(*) as page_count, 
       STRING_AGG(name, ', ' ORDER BY name) as page_names 
FROM pages;

-- Verify permission types created
SELECT '4. Permission Types' as check_type, COUNT(*) as perm_type_count,
       STRING_AGG(name, ', ' ORDER BY name) as permission_names
FROM permission_types;

-- Verify total permissions granted
SELECT '5. Total Permissions' as check_type, COUNT(*) as total_permissions
FROM role_page_permissions 
WHERE role_name = 'Administrator' AND is_granted = true;

-- Test specific backend authorization checks
SELECT '6. UserController Test' as check_type, 
       EXISTS (SELECT 1 FROM role_page_permissions rpp 
               JOIN pages p ON p.id = rpp.page_id 
               JOIN permission_types pt ON pt.id = rpp.permission_type_id 
               WHERE p.path = '/user-management' AND pt.name = 'view' 
               AND rpp.is_granted = TRUE AND rpp.role_name = 'Administrator') as has_user_access;

SELECT '7. DomainController Test' as check_type, 
       EXISTS (SELECT 1 FROM role_page_permissions rpp 
               JOIN pages p ON p.id = rpp.page_id 
               JOIN permission_types pt ON pt.id = rpp.permission_type_id 
               WHERE p.path = '/domains' AND pt.name = 'READ' 
               AND rpp.is_granted = TRUE AND rpp.role_name = 'Administrator') as has_domain_access;

SELECT '8. RoleController Test' as check_type, 
       EXISTS (SELECT 1 FROM role_page_permissions rpp 
               JOIN pages p ON p.id = rpp.page_id 
               JOIN permission_types pt ON pt.id = rpp.permission_type_id 
               WHERE p.path = '/user-management/roles' AND pt.name = 'READ' 
               AND rpp.is_granted = TRUE AND rpp.role_name = 'Administrator') as has_role_access;

-- Show permissions breakdown by page
SELECT '9. Permissions by Page' as check_type, p.name as page_name, p.path, 
       COUNT(*) as permission_count
FROM role_page_permissions rpp
JOIN pages p ON p.id = rpp.page_id
WHERE rpp.role_name = 'Administrator' AND rpp.is_granted = true
GROUP BY p.id, p.name, p.path
ORDER BY p.name;
