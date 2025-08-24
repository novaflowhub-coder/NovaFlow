-- COMPLETE USER MANAGEMENT CLEANUP AND ADMIN SETUP
-- This script completely resets and sets up user management with admin user

-- ============================================================================
-- CLEANUP - Remove all existing data
-- ============================================================================

DELETE FROM user_management.role_page_permissions;
DELETE FROM user_management.user_domain_roles;
DELETE FROM user_management.users;
DELETE FROM user_management.roles;
DELETE FROM user_management.pages;
DELETE FROM user_management.permission_types;
DELETE FROM user_management.domains;

-- ============================================================================
-- DOMAINS
-- ============================================================================

INSERT INTO user_management.domains (id, name, description, code, is_active, created_by, created_date) VALUES
('default-domain', 'Default Domain', 'Default system domain', 'DEFAULT', true, 'system', NOW()),
('admin-domain', 'Administration', 'Administrative domain', 'ADMIN', true, 'system', NOW());

-- ============================================================================
-- PERMISSION TYPES
-- ============================================================================

INSERT INTO user_management.permission_types (id, name, description, created_by, created_date) VALUES
('perm-read', 'READ', 'Read access permission', 'system', NOW()),
('perm-create', 'CREATE', 'Create access permission', 'system', NOW()),
('perm-update', 'UPDATE', 'Update access permission', 'system', NOW()),
('perm-delete', 'DELETE', 'Delete access permission', 'system', NOW()),
('perm-write', 'WRITE', 'Write access permission (create/update combined)', 'system', NOW());

-- ============================================================================
-- PAGES
-- ============================================================================

INSERT INTO user_management.pages (id, name, path, description, created_by, created_date) VALUES
('page-user-mgmt', 'User Management', '/user-management', 'User management main page', 'system', NOW()),
('page-users', 'Users', '/user-management/users', 'User management - users page', 'system', NOW()),
('page-roles', 'Roles', '/user-management/roles', 'User management - roles page', 'system', NOW()),
('page-pages', 'Pages', '/user-management/pages', 'User management - pages page', 'system', NOW()),
('page-permission-types', 'Permission Types', '/user-management/permission-types', 'User management - permission types page', 'system', NOW()),
('page-role-page-permissions', 'Role Page Permissions', '/user-management/role-page-permissions', 'User management - role page permissions page', 'system', NOW()),
('page-user-domain-roles', 'User Domain Roles', '/user-management/user-domain-roles', 'User management - user domain roles page', 'system', NOW()),
('page-domains', 'Domains', '/domains', 'Domain management page', 'system', NOW());

-- ============================================================================
-- ROLES
-- ============================================================================

INSERT INTO user_management.roles (id, name, description, domain_id, user_count, created_by, created_date) VALUES
('admin-role', 'Administrator', 'System administrator with full access', 'admin-domain', 1, 'system', NOW()),
('user-role', 'User', 'Standard user role', 'default-domain', 0, 'system', NOW());

-- ============================================================================
-- USERS
-- ============================================================================

INSERT INTO user_management.users (id, name, email, username, full_name, department, status, is_active, created_by, created_date) VALUES
('admin-user', 'Admin User', 'novaflowhub@gmail.com', 'admin', 'NovaFlow Administrator', 'IT', 'Active', true, 'system', NOW());

-- ============================================================================
-- USER DOMAIN ROLES
-- ============================================================================

INSERT INTO user_management.user_domain_roles (id, user_id, role_id, is_active, assigned_by, assigned_date) VALUES
('admin-assignment', 'admin-user', 'admin-role', true, 'system', NOW());

-- ============================================================================
-- ROLE PAGE PERMISSIONS - GRANT ALL PERMISSIONS TO ADMINISTRATOR
-- ============================================================================

-- Grant READ permissions for all pages
INSERT INTO user_management.role_page_permissions (id, role_name, page_id, permission_type_id, is_granted, created_by, created_date) VALUES
('perm-admin-user-mgmt-read', 'Administrator', 'page-user-mgmt', 'perm-read', true, 'system', NOW()),
('perm-admin-users-read', 'Administrator', 'page-users', 'perm-read', true, 'system', NOW()),
('perm-admin-roles-read', 'Administrator', 'page-roles', 'perm-read', true, 'system', NOW()),
('perm-admin-pages-read', 'Administrator', 'page-pages', 'perm-read', true, 'system', NOW()),
('perm-admin-permission-types-read', 'Administrator', 'page-permission-types', 'perm-read', true, 'system', NOW()),
('perm-admin-role-page-permissions-read', 'Administrator', 'page-role-page-permissions', 'perm-read', true, 'system', NOW()),
('perm-admin-user-domain-roles-read', 'Administrator', 'page-user-domain-roles', 'perm-read', true, 'system', NOW()),
('perm-admin-domains-read', 'Administrator', 'page-domains', 'perm-read', true, 'system', NOW());

-- Grant CREATE permissions
INSERT INTO user_management.role_page_permissions (id, role_name, page_id, permission_type_id, is_granted, created_by, created_date) VALUES
('perm-admin-user-mgmt-create', 'Administrator', 'page-user-mgmt', 'perm-create', true, 'system', NOW()),
('perm-admin-users-create', 'Administrator', 'page-users', 'perm-create', true, 'system', NOW()),
('perm-admin-roles-create', 'Administrator', 'page-roles', 'perm-create', true, 'system', NOW()),
('perm-admin-pages-create', 'Administrator', 'page-pages', 'perm-create', true, 'system', NOW()),
('perm-admin-permission-types-create', 'Administrator', 'page-permission-types', 'perm-create', true, 'system', NOW()),
('perm-admin-user-domain-roles-create', 'Administrator', 'page-user-domain-roles', 'perm-create', true, 'system', NOW()),
('perm-admin-domains-create', 'Administrator', 'page-domains', 'perm-create', true, 'system', NOW());

-- Grant UPDATE permissions
INSERT INTO user_management.role_page_permissions (id, role_name, page_id, permission_type_id, is_granted, created_by, created_date) VALUES
('perm-admin-user-mgmt-update', 'Administrator', 'page-user-mgmt', 'perm-update', true, 'system', NOW()),
('perm-admin-users-update', 'Administrator', 'page-users', 'perm-update', true, 'system', NOW()),
('perm-admin-roles-update', 'Administrator', 'page-roles', 'perm-update', true, 'system', NOW()),
('perm-admin-pages-update', 'Administrator', 'page-pages', 'perm-update', true, 'system', NOW()),
('perm-admin-permission-types-update', 'Administrator', 'page-permission-types', 'perm-update', true, 'system', NOW()),
('perm-admin-user-domain-roles-update', 'Administrator', 'page-user-domain-roles', 'perm-update', true, 'system', NOW()),
('perm-admin-domains-update', 'Administrator', 'page-domains', 'perm-update', true, 'system', NOW());

-- Grant DELETE permissions
INSERT INTO user_management.role_page_permissions (id, role_name, page_id, permission_type_id, is_granted, created_by, created_date) VALUES
('perm-admin-user-mgmt-delete', 'Administrator', 'page-user-mgmt', 'perm-delete', true, 'system', NOW()),
('perm-admin-users-delete', 'Administrator', 'page-users', 'perm-delete', true, 'system', NOW()),
('perm-admin-roles-delete', 'Administrator', 'page-roles', 'perm-delete', true, 'system', NOW()),
('perm-admin-pages-delete', 'Administrator', 'page-pages', 'perm-delete', true, 'system', NOW()),
('perm-admin-permission-types-delete', 'Administrator', 'page-permission-types', 'perm-delete', true, 'system', NOW()),
('perm-admin-role-page-permissions-delete', 'Administrator', 'page-role-page-permissions', 'perm-delete', true, 'system', NOW()),
('perm-admin-user-domain-roles-delete', 'Administrator', 'page-user-domain-roles', 'perm-delete', true, 'system', NOW()),
('perm-admin-domains-delete', 'Administrator', 'page-domains', 'perm-delete', true, 'system', NOW());

-- Grant WRITE permissions (for role-page-permissions controller)
INSERT INTO user_management.role_page_permissions (id, role_name, page_id, permission_type_id, is_granted, created_by, created_date) VALUES
('perm-admin-role-page-permissions-write', 'Administrator', 'page-role-page-permissions', 'perm-write', true, 'system', NOW());

-- ============================================================================
-- VERIFICATION
-- ============================================================================

SELECT 'VERIFICATION: Admin User' as check_type, email, is_active FROM user_management.users WHERE email = 'novaflowhub@gmail.com';

SELECT 'VERIFICATION: Admin Role Assignment' as check_type, r.name as role_name 
FROM user_management.users u 
JOIN user_management.user_domain_roles udr ON u.id = udr.user_id 
JOIN user_management.roles r ON udr.role_id = r.id 
WHERE u.email = 'novaflowhub@gmail.com';

SELECT 'VERIFICATION: Pages Count' as check_type, COUNT(*) as page_count 
FROM user_management.pages;

SELECT 'VERIFICATION: Permission Types Count' as check_type, COUNT(*) as permission_count 
FROM user_management.permission_types;

SELECT 'VERIFICATION: Admin Permissions Count' as check_type, COUNT(*) as granted_permissions 
FROM user_management.role_page_permissions 
WHERE role_name = 'Administrator' AND is_granted = true;

SELECT 'VERIFICATION: All Admin Permissions' as check_type, p.path, pt.name as permission_type
FROM user_management.role_page_permissions rpp
JOIN user_management.pages p ON rpp.page_id = p.id
JOIN user_management.permission_types pt ON rpp.permission_type_id = pt.id
WHERE rpp.role_name = 'Administrator' AND rpp.is_granted = true
ORDER BY p.path, pt.name;
