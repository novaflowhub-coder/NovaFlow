-- Check what permission types exist in the database
SET search_path TO user_management, public;

-- 1. Check all available permission types
SELECT 'Available Permission Types' as info, * FROM permission_types ORDER BY id;

-- 2. Check existing role_page_permissions to see what's being used
SELECT DISTINCT 'Used Permission Types' as info, permission_type_id 
FROM role_page_permissions 
ORDER BY permission_type_id;

-- 3. Check what permissions exist for Administrator role
SELECT 'Administrator Permissions' as info,
       rpp.role_name, p.name as page_name, p.path, pt.id as permission_type_id, pt.name as permission_name, rpp.is_granted
FROM role_page_permissions rpp
JOIN pages p ON rpp.page_id = p.id
JOIN permission_types pt ON rpp.permission_type_id = pt.id
WHERE rpp.role_name = 'Administrator'
ORDER BY p.name, pt.id;
