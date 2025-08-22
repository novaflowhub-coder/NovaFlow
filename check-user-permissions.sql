-- Check user permissions for novaflowhub@gmail.com
SET search_path TO user_management, public;

-- 1. Check if user exists
SELECT 'User Check' as check_type, * FROM users WHERE email = 'novaflowhub@gmail.com';

-- 2. Check user's domain roles
SELECT 'User Domain Roles' as check_type, 
       u.email, d.name as domain_name, r.name as role_name, udr.is_active
FROM users u
JOIN user_domain_roles udr ON u.id = udr.user_id
JOIN domains d ON udr.domain_id = d.id
JOIN roles r ON udr.role_id = r.id
WHERE u.email = 'novaflowhub@gmail.com';

-- 3. Check role permissions for PAGE_DOMAINS
SELECT 'Role Permissions' as check_type,
       r.name as role_name, p.name as page_name, p.path as page_path, 
       pt.name as permission_type, rpp.is_granted
FROM role_page_permissions rpp
JOIN roles r ON rpp.role_name = r.name
JOIN pages p ON rpp.page_id = p.id
JOIN permission_types pt ON rpp.permission_type_id = pt.id
WHERE p.id = 'PAGE_DOMAINS'
AND r.name IN (
    SELECT r.name 
    FROM users u
    JOIN user_domain_roles udr ON u.id = udr.user_id
    JOIN roles r ON udr.role_id = r.id
    WHERE u.email = 'novaflowhub@gmail.com'
);

-- 4. Check all available permission types
SELECT 'Available Permission Types' as check_type, * FROM permission_types;

-- 5. Check PAGE_DOMAINS specifically
SELECT 'PAGE_DOMAINS Info' as check_type, * FROM pages WHERE id = 'PAGE_DOMAINS';
