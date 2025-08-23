-- Debug user access for novaflowhub@gmail.com
SET search_path TO user_management, public;

-- 1. Check if user exists
SELECT 'User Check' as check_type, id, email, username, status, is_active 
FROM users WHERE email = 'novaflowhub@gmail.com';

-- 2. Check user's role assignments (fixed query)
SELECT 'User Role Assignments' as check_type, 
       u.email, r.name as role_name, r.domain_id, udr.is_active
FROM users u
JOIN user_domain_roles udr ON u.id = udr.user_id
JOIN roles r ON udr.role_id = r.id
WHERE u.email = 'novaflowhub@gmail.com';

-- 3. Check domain info
SELECT 'Domain Check' as check_type, id, name, code, is_active
FROM domains WHERE id = 'admin-domain';

-- 4. Check role info
SELECT 'Role Check' as check_type, id, name, domain_id
FROM roles WHERE name = 'Super Administrator';

-- 5. Check total permissions granted to Super Administrator
SELECT 'Permission Count' as check_type, COUNT(*) as total_permissions
FROM role_page_permissions 
WHERE role_name = 'Super Administrator' AND is_granted = true;

-- 6. Check specific page permissions
SELECT 'Page Permissions Sample' as check_type,
       p.name as page_name, p.path, pt.name as permission_type, rpp.is_granted
FROM role_page_permissions rpp
JOIN pages p ON rpp.page_id = p.id
JOIN permission_types pt ON rpp.permission_type_id = pt.id
WHERE rpp.role_name = 'Super Administrator'
AND p.path IN ('/dashboard', '/user-management', '/domains')
ORDER BY p.path, pt.name;

-- 7. Check if permissions are actually granted (not just created)
SELECT 'Granted Permissions Check' as check_type,
       COUNT(CASE WHEN is_granted = true THEN 1 END) as granted_count,
       COUNT(CASE WHEN is_granted = false THEN 1 END) as denied_count,
       COUNT(*) as total_count
FROM role_page_permissions 
WHERE role_name = 'Super Administrator';
