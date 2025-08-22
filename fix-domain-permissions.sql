-- Fix domain management permissions for novaflowhub@gmail.com
SET search_path TO user_management, public;

-- First, let's check what we have
SELECT 'Current User Roles' as info, 
       u.email, r.name as role_name, udr.is_active
FROM users u
JOIN user_domain_roles udr ON u.id = udr.user_id
JOIN roles r ON udr.role_id = r.id
WHERE u.email = 'novaflowhub@gmail.com';

-- Check current permissions for PAGE_DOMAINS
SELECT 'Current PAGE_DOMAINS Permissions' as info,
       rpp.role_name, p.name as page_name, pt.name as permission_type, rpp.is_granted
FROM role_page_permissions rpp
JOIN pages p ON rpp.page_id = p.id
JOIN permission_types pt ON rpp.permission_type_id = pt.id
WHERE p.id = 'PAGE_DOMAINS';

-- Grant EDIT permission to Administrator role for PAGE_DOMAINS if not exists
INSERT INTO role_page_permissions (id, role_name, page_id, permission_type_id, is_granted, created_by, created_date)
SELECT 
    'RPP_ADMIN_PAGE_DOMAINS_PERM_EDIT',
    'Administrator',
    'PAGE_DOMAINS',
    'PERM_EDIT',
    true,
    'system',
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM role_page_permissions 
    WHERE role_name = 'Administrator' 
    AND page_id = 'PAGE_DOMAINS' 
    AND permission_type_id = 'PERM_EDIT'
);

-- Grant VIEW permission to Administrator role for PAGE_DOMAINS if not exists
INSERT INTO role_page_permissions (id, role_name, page_id, permission_type_id, is_granted, created_by, created_date)
SELECT 
    'RPP_ADMIN_PAGE_DOMAINS_PERM_VIEW',
    'Administrator',
    'PAGE_DOMAINS',
    'PERM_VIEW',
    true,
    'system',
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM role_page_permissions 
    WHERE role_name = 'Administrator' 
    AND page_id = 'PAGE_DOMAINS' 
    AND permission_type_id = 'PERM_VIEW'
);

-- Grant CREATE permission to Administrator role for PAGE_DOMAINS if not exists
INSERT INTO role_page_permissions (id, role_name, page_id, permission_type_id, is_granted, created_by, created_date)
SELECT 
    'RPP_ADMIN_PAGE_DOMAINS_PERM_CREATE',
    'Administrator',
    'PAGE_DOMAINS',
    'PERM_CREATE',
    true,
    'system',
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM role_page_permissions 
    WHERE role_name = 'Administrator' 
    AND page_id = 'PAGE_DOMAINS' 
    AND permission_type_id = 'PERM_CREATE'
);

-- Grant DELETE permission to Administrator role for PAGE_DOMAINS if not exists
INSERT INTO role_page_permissions (id, role_name, page_id, permission_type_id, is_granted, created_by, created_date)
SELECT 
    'RPP_ADMIN_PAGE_DOMAINS_PERM_DELETE',
    'Administrator',
    'PAGE_DOMAINS',
    'PERM_DELETE',
    true,
    'system',
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM role_page_permissions 
    WHERE role_name = 'Administrator' 
    AND page_id = 'PAGE_DOMAINS' 
    AND permission_type_id = 'PERM_DELETE'
);

-- Grant ADMIN permission to Administrator role for PAGE_DOMAINS if not exists
INSERT INTO role_page_permissions (id, role_name, page_id, permission_type_id, is_granted, created_by, created_date)
SELECT 
    'RPP_ADMIN_PAGE_DOMAINS_PERM_ADMIN',
    'Administrator',
    'PAGE_DOMAINS',
    'PERM_ADMIN',
    true,
    'system',
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM role_page_permissions 
    WHERE role_name = 'Administrator' 
    AND page_id = 'PAGE_DOMAINS' 
    AND permission_type_id = 'PERM_ADMIN'
);

-- Verify the fix
SELECT 'Updated PAGE_DOMAINS Permissions' as info,
       rpp.role_name, p.name as page_name, pt.name as permission_type, rpp.is_granted
FROM role_page_permissions rpp
JOIN pages p ON rpp.page_id = p.id
JOIN permission_types pt ON rpp.permission_type_id = pt.id
WHERE p.id = 'PAGE_DOMAINS'
AND rpp.role_name = 'Administrator'
ORDER BY pt.name;
