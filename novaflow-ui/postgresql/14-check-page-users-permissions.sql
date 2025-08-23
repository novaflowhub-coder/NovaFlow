-- Check specific permissions for page-users that's causing 403 error
SET search_path TO user_management, public;

-- Check if page-users exists
SELECT '1. Page Users Exists' as check_type, 
       p.id, p.name, p.path, p.description
FROM pages p 
WHERE p.id = 'page-users';

-- Check Administrator permissions for page-users specifically
SELECT '2. Administrator Permissions for page-users' as check_type,
       p.name as page_name, p.path, pt.name as permission_type, rpp.is_granted
FROM role_page_permissions rpp
JOIN pages p ON p.id = rpp.page_id
JOIN permission_types pt ON pt.id = rpp.permission_type_id
WHERE rpp.role_name = 'Administrator' 
  AND p.id = 'page-users'
ORDER BY pt.name;

-- Check what the backend authorization query would look like
SELECT '3. Backend Auth Query for page-users' as check_type,
       EXISTS (
         SELECT 1 FROM role_page_permissions rpp
         JOIN pages p ON p.id = rpp.page_id
         JOIN permission_types pt ON pt.id = rpp.permission_type_id
         WHERE p.id = 'page-users'
           AND pt.name = 'READ'
           AND rpp.is_granted = TRUE 
           AND rpp.role_name = 'Administrator'
       ) as has_read_access;

-- Show all permissions for page-users
SELECT '4. All Permissions for page-users' as check_type,
       rpp.role_name, pt.name as permission_type, rpp.is_granted
FROM role_page_permissions rpp
JOIN pages p ON p.id = rpp.page_id  
JOIN permission_types pt ON pt.id = rpp.permission_type_id
WHERE p.id = 'page-users'
ORDER BY rpp.role_name, pt.name;
