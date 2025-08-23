-- NovaFlow Database Cleanup and Admin Setup Script
-- This script removes all starter data and creates a single admin user with full access

-- ============================================================================
-- CLEANUP ALL STARTER DATA
-- ============================================================================

-- Delete in reverse dependency order to avoid foreign key constraint violations

-- Clean up metadata schema tables first (they reference user_management.domains)
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

-- Clean up user management schema data
DELETE FROM user_management.role_page_permissions;
DELETE FROM user_management.user_domain_roles;
DELETE FROM user_management.users;
DELETE FROM user_management.roles;
DELETE FROM user_management.pages;
DELETE FROM user_management.permission_types;
DELETE FROM user_management.domains;

-- ============================================================================
-- CREATE ADMIN SETUP
-- ============================================================================

-- Insert essential permission types
INSERT INTO user_management.permission_types (id, name, description, created_by) VALUES
('view', 'View', 'Can view the page and its content', 'system'),
('read', 'Read', 'Can read data and content', 'system'),
('create', 'Create', 'Can create new items', 'system'),
('edit', 'Edit', 'Can edit existing items', 'system'),
('write', 'Write', 'Can write and modify data', 'system'),
('delete', 'Delete', 'Can delete items', 'system'),
('admin', 'Admin', 'Full administrative access', 'system'),
('approve', 'Approve', 'Can approve changes', 'system');

-- Insert all pages for the NovaFlow system
INSERT INTO user_management.pages (id, name, path, description, created_by) VALUES
-- Main application pages
('page-dashboard', 'Dashboard', '/dashboard', 'Main dashboard and analytics', 'system'),
('page-connections', 'Connections', '/connections', 'Manage system connections', 'system'),
('page-object-manager', 'Object Manager', '/object-manager', 'Manage integration objects and schemas', 'system'),
('page-rule-definition', 'Rule Definition', '/rule-definition', 'Create and edit individual rules', 'system'),
('page-rule-set-definition', 'Rule Set Definition', '/rule-set-definition', 'Create and manage rule sets', 'system'),
('page-run-control-definition', 'Run Control Definition', '/run-control-definition', 'Define execution controls', 'system'),
('page-process-monitor', 'Process Monitor', '/process-monitor', 'Monitor rule execution', 'system'),
('page-approvals', 'Approvals', '/approvals', 'Review and approve changes', 'system'),
('page-ui-metadata', 'UI Metadata', '/ui-metadata-list', 'Manage dynamic UI definitions', 'system'),
('page-holiday-calendars', 'Holiday Calendars', '/holiday-calendars', 'Manage holiday calendars', 'system'),
('page-version-history', 'Version History', '/version-history', 'View entity change history', 'system'),

-- User management pages
('page-user-management', 'User Management', '/user-management', 'Main user management page', 'system'),
('page-users', 'Users', '/user-management/users', 'Manage users', 'system'),
('page-roles', 'Roles', '/user-management/roles', 'Manage roles', 'system'),
('page-pages', 'Pages', '/user-management/pages', 'Manage pages', 'system'),
('page-permission-types', 'Permission Types', '/user-management/permission-types', 'Manage permission types', 'system'),
('page-assignments', 'Assignments', '/user-management/assignments', 'Manage user role assignments', 'system'),
('page-role-page-permissions', 'Role-Page Permissions', '/user-management/role-page-permissions', 'Manage role-page permissions', 'system'),

-- Domain management
('page-domains', 'Domains', '/domains', 'Manage business domains', 'system');

-- Insert default domain
INSERT INTO user_management.domains (id, name, description, code, created_by) VALUES
('admin-domain', 'Administration', 'System administration domain', 'ADMIN', 'system');

-- Insert super admin role
INSERT INTO user_management.roles (id, name, description, domain_id, created_by) VALUES
('super-admin-role', 'Super Administrator', 'Full system access and administration', 'admin-domain', 'system');

-- Insert admin user with novaflowhub@gmail.com email
INSERT INTO user_management.users (id, name, username, email, full_name, status, created_by) VALUES
('admin-user', 'NovaFlow Administrator', 'admin', 'novaflowhub@gmail.com', 'NovaFlow Administrator', 'Active', 'system');

-- Assign admin user to super admin role
INSERT INTO user_management.user_domain_roles (id, user_id, role_id, assigned_by) VALUES
('admin-assignment', 'admin-user', 'super-admin-role', 'system');

-- Grant full permissions to Super Administrator role on all pages
INSERT INTO user_management.role_page_permissions (id, role_name, page_id, permission_type_id, is_granted, created_by) 
SELECT 
    CONCAT('perm-', p.id, '-', pt.id) as id,
    'Super Administrator' as role_name,
    p.id as page_id,
    pt.id as permission_type_id,
    true as is_granted,
    'system' as created_by
FROM user_management.pages p
CROSS JOIN user_management.permission_types pt;

-- ============================================================================
-- VERIFICATION QUERIES (Optional - comment out in production)
-- ============================================================================

-- Verify the setup
SELECT 'Admin User Created' as status, email, full_name 
FROM user_management.users 
WHERE email = 'novaflowhub@gmail.com';

SELECT 'Role Assignment' as status, u.email, r.name as role_name, d.name as domain_name
FROM user_management.user_domain_roles udr
JOIN user_management.users u ON udr.user_id = u.id
JOIN user_management.roles r ON udr.role_id = r.id
JOIN user_management.domains d ON r.domain_id = d.id
WHERE u.email = 'novaflowhub@gmail.com';

SELECT 'Permission Count' as status, COUNT(*) as total_permissions
FROM user_management.role_page_permissions 
WHERE role_name = 'Super Administrator';

SELECT 'Pages Count' as status, COUNT(*) as total_pages
FROM user_management.pages;

SELECT 'Permission Types Count' as status, COUNT(*) as total_permission_types
FROM user_management.permission_types;
