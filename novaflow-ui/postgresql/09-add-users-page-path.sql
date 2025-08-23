-- Add /user-management/users page path for UI access
SET search_path TO user_management, public;

-- Insert the specific UI page path
INSERT INTO user_management.pages (id, name, path, description, created_by) VALUES
('page-users-ui', 'Users UI', '/user-management/users', 'User management UI page path', 'system');

-- Grant all permissions to Administrator role for the UI page path
INSERT INTO user_management.role_page_permissions (id, role_name, page_id, permission_type_id, is_granted, created_by) 
SELECT 
    CONCAT('perm-ui-', p.id, '-', pt.id) as id,
    'Administrator' as role_name,
    p.id as page_id,
    pt.id as permission_type_id,
    true as is_granted,
    'system' as created_by
FROM user_management.pages p
CROSS JOIN user_management.permission_types pt
WHERE p.id = 'page-users-ui';

-- Verify both paths exist
SELECT 'All Pages' as check_type, id, name, path FROM pages ORDER BY path;

-- Verify permissions for both paths
SELECT 'All Permissions' as check_type, 
       p.path, pt.name as permission, rpp.is_granted
FROM role_page_permissions rpp
JOIN pages p ON p.id = rpp.page_id
JOIN permission_types pt ON pt.id = rpp.permission_type_id
WHERE rpp.role_name = 'Administrator'
ORDER BY p.path, pt.name;
