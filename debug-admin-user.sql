-- Debug script to check admin user setup
SET search_path TO user_management, public;

-- Check if admin user exists
SELECT 'Admin User Check' as check_type, 
       CASE WHEN EXISTS (SELECT 1 FROM users WHERE email = 'novaflowhub@gmail.com') 
            THEN 'EXISTS' ELSE 'MISSING' END as status;

-- Check user details
SELECT 'User Details' as check_type, id, name, email, status, is_active 
FROM users WHERE email = 'novaflowhub@gmail.com';

-- Check domains
SELECT 'Domains' as check_type, id, name, code, is_active FROM domains;

-- Check roles
SELECT 'Roles' as check_type, id, name, domain_id FROM roles;

-- Check user domain roles
SELECT 'User Domain Roles' as check_type, 
       udr.id, udr.user_id, udr.domain_id, udr.role_id, udr.is_active,
       u.email, r.name as role_name
FROM user_domain_roles udr
JOIN users u ON u.id = udr.user_id
JOIN roles r ON r.id = udr.role_id
WHERE u.email = 'novaflowhub@gmail.com';

-- Test the exact query from AuthorizationService
SELECT 'Role Query Test' as check_type, DISTINCT r.name
FROM user_management.users u
JOIN user_management.user_domain_roles udr ON udr.user_id = u.id AND udr.is_active = TRUE
JOIN user_management.roles r ON r.id = udr.role_id
WHERE u.email = 'novaflowhub@gmail.com'
AND (NULL IS NULL OR udr.domain_id = NULL);

-- Check pages and permissions
SELECT 'Pages' as check_type, COUNT(*) as count FROM pages;
SELECT 'Permission Types' as check_type, COUNT(*) as count FROM permission_types;
SELECT 'Role Page Permissions' as check_type, COUNT(*) as count FROM role_page_permissions WHERE role_name = 'Administrator';
