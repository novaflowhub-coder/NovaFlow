-- Run all diagnostics in one script
SET search_path TO user_management, public;

-- 1. User status
SELECT '1. User Status' as check_type, 
       id, email, username, status, is_active, created_date
FROM users WHERE email = 'novaflowhub@gmail.com';

-- 2. Role assignments (exact backend query)
SELECT '2. Backend Role Query' as check_type,
       r.name as role_name
FROM users u
JOIN user_domain_roles udr ON udr.user_id = u.id AND udr.is_active = TRUE
JOIN roles r ON r.id = udr.role_id
WHERE u.email = 'novaflowhub@gmail.com';

-- 3. Permission count
SELECT '3. Permission Summary' as check_type,
       COUNT(*) as total_permissions,
       COUNT(CASE WHEN is_granted = true THEN 1 END) as granted_permissions
FROM role_page_permissions 
WHERE role_name = 'Super Administrator';

-- 4. Test dashboard permission specifically
SELECT '4. Dashboard Permission Test' as check_type,
       EXISTS (
           SELECT 1
           FROM role_page_permissions rpp
           JOIN pages p ON p.id = rpp.page_id
           JOIN permission_types pt ON pt.id = rpp.permission_type_id
           WHERE p.path = '/dashboard'
           AND pt.name = 'view'
           AND rpp.is_granted = TRUE
           AND rpp.role_name = 'Super Administrator'
       ) as has_dashboard_view;

-- 5. Show actual role names in permissions table
SELECT '5. Actual Role Names' as check_type,
       DISTINCT role_name
FROM role_page_permissions
LIMIT 5;
