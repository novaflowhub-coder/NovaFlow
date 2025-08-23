-- Complete cleanup and minimal admin setup
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
-- MINIMAL ADMIN SETUP
-- ============================================================================

-- Insert essential permission types
INSERT INTO user_management.permission_types (id, name, description, created_by) VALUES
('view', 'view', 'Can view the page', 'system'),
('read', 'read', 'Can read data', 'system'),
('create', 'create', 'Can create items', 'system'),
('edit', 'edit', 'Can edit items', 'system'),
('delete', 'delete', 'Can delete items', 'system');

-- Insert only user management page
INSERT INTO user_management.pages (id, name, path, description, created_by) VALUES
('page-users', 'Users', '/user-management/users', 'Manage users', 'system');

-- Insert admin domain
INSERT INTO user_management.domains (id, name, description, code, created_by) VALUES
('admin-domain', 'Administration', 'System administration', 'ADMIN', 'system');

-- Insert admin role
INSERT INTO user_management.roles (id, name, description, domain_id, created_by) VALUES
('admin-role', 'Administrator', 'System administrator', 'admin-domain', 'system');

-- Insert admin user
INSERT INTO user_management.users (id, name, username, email, full_name, status, is_active, created_by) VALUES
('admin-user', 'Admin', 'admin', 'novaflowhub@gmail.com', 'NovaFlow Administrator', 'Active', true, 'system');

-- Assign admin user to admin role
INSERT INTO user_management.user_domain_roles (id, user_id, role_id, is_active, assigned_by) VALUES
('admin-assignment', 'admin-user', 'admin-role', true, 'system');

-- Grant all permissions to Administrator role for users page only
INSERT INTO user_management.role_page_permissions (id, role_name, page_id, permission_type_id, is_granted, created_by) 
SELECT 
    CONCAT('perm-', p.id, '-', pt.id) as id,
    'Administrator' as role_name,
    p.id as page_id,
    pt.id as permission_type_id,
    true as is_granted,
    'system' as created_by
FROM user_management.pages p
CROSS JOIN user_management.permission_types pt
WHERE p.id = 'page-users';

-- ============================================================================
-- VERIFICATION
-- ============================================================================

SELECT 'Admin User' as check_type, email, is_active FROM users WHERE email = 'novaflowhub@gmail.com';
SELECT 'Admin Role' as check_type, r.name FROM users u JOIN user_domain_roles udr ON u.id = udr.user_id JOIN roles r ON udr.role_id = r.id WHERE u.email = 'novaflowhub@gmail.com';
SELECT 'Permissions' as check_type, COUNT(*) as granted_count FROM role_page_permissions WHERE role_name = 'Administrator' AND is_granted = true;
