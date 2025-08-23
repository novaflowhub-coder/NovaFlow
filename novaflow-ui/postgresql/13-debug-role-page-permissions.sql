-- Debug role-page-permissions authorization issue
SET search_path TO user_management, public;

-- Check if role-page-permissions page exists
SELECT '1. Role Page Permissions Page' as check_type, 
       p.id, p.name, p.path, p.description
FROM pages p 
WHERE p.path = '/user-management/role-page-permissions';

-- Check if Administrator has permissions for role-page-permissions
SELECT '2. Administrator Permissions' as check_type,
       p.name as page_name, p.path, pt.name as permission_type, rpp.is_granted
FROM role_page_permissions rpp
JOIN pages p ON p.id = rpp.page_id
JOIN permission_types pt ON pt.id = rpp.permission_type_id
WHERE rpp.role_name = 'Administrator' 
  AND p.path = '/user-management/role-page-permissions'
ORDER BY pt.name;

-- Check if admin user exists and is active
SELECT '3. Admin User Status' as check_type,
       u.email, u.is_active, u.status
FROM users u 
WHERE u.email = 'novaflowhub@gmail.com';

-- Check admin user role assignments
SELECT '4. Admin Role Assignment' as check_type,
       u.email, r.name as role_name, udr.is_active as assignment_active
FROM users u
JOIN user_domain_roles udr ON u.id = udr.user_id
JOIN roles r ON udr.role_id = r.id
WHERE u.email = 'novaflowhub@gmail.com';

-- Test specific authorization query that backend would use
SELECT '5. Backend Authorization Test' as check_type,
       EXISTS (
         SELECT 1 FROM role_page_permissions rpp
         JOIN pages p ON p.id = rpp.page_id
         JOIN permission_types pt ON pt.id = rpp.permission_type_id
         WHERE p.path = '/user-management/role-page-permissions' 
           AND pt.name = 'READ'
           AND rpp.is_granted = TRUE 
           AND rpp.role_name = 'Administrator'
       ) as has_read_access;

-- Show all role-page-permissions related permissions
SELECT '6. All Role Page Permissions' as check_type,
       p.name as page_name, pt.name as permission_type, 
       rpp.role_name, rpp.is_granted
FROM role_page_permissions rpp
JOIN pages p ON p.id = rpp.page_id  
JOIN permission_types pt ON pt.id = rpp.permission_type_id
WHERE p.path = '/user-management/role-page-permissions'
ORDER BY rpp.role_name, pt.name;
