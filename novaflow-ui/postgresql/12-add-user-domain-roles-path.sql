-- Add missing user-domain-roles authorization path
SET search_path TO user_management, public;

-- Insert the missing page for user-domain-roles (assignments)
INSERT INTO user_management.pages (id, name, path, description, created_by) VALUES
('page-user-domain-roles', 'User Role Assignments', '/user-management/user-domain-roles', 'UserDomainRoleController path', 'system')
ON CONFLICT (id) DO NOTHING;

-- Grant ALL permissions to Administrator role for the new page
INSERT INTO user_management.role_page_permissions (id, role_name, page_id, permission_type_id, is_granted, created_by) 
SELECT 
    CONCAT('perm-page-user-domain-roles-', pt.id) as id,
    'Administrator' as role_name,
    'page-user-domain-roles' as page_id,
    pt.id as permission_type_id,
    true as is_granted,
    'system' as created_by
FROM user_management.permission_types pt
ON CONFLICT (id) DO NOTHING;

-- Verification
SELECT 'User Domain Roles Page Added' as check_type, 
       p.name, p.path, COUNT(rpp.id) as permission_count
FROM pages p
LEFT JOIN role_page_permissions rpp ON p.id = rpp.page_id 
WHERE p.id = 'page-user-domain-roles'
GROUP BY p.id, p.name, p.path;
