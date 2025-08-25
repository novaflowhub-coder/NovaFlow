-- =============================================================================
-- METADATA CONNECTIONS AUTHORIZATION SETUP
-- Add authorization page and permissions for metadata connections endpoints
-- =============================================================================

-- Add the metadata connections page
INSERT INTO user_management.pages (id, name, path, description, created_by, created_date)
VALUES (
    gen_random_uuid(),
    'Metadata Connections',
    '/connections',
    'Metadata connections management with versioning support',
    'system',
    NOW()
) ON CONFLICT (path) DO NOTHING;

-- Grant all permissions to Administrator role for metadata connections
INSERT INTO user_management.role_page_permissions (
    id, role_name, page_id, permission_type_id, is_granted, created_by, created_date
)
SELECT 
    gen_random_uuid(),
    'Administrator',
    p.id,
    pt.id,
    TRUE,
    'system',
    NOW()
FROM user_management.pages p
CROSS JOIN user_management.permission_types pt
WHERE p.path = '/connections'
ON CONFLICT (role_name, page_id, permission_type_id) DO UPDATE SET
    is_granted = TRUE,
    last_modified_by = 'system',
    last_modified_date = NOW();

-- Verification query
SELECT 
    p.name as page_name,
    p.path,
    pt.name as permission_type,
    rpp.is_granted
FROM user_management.role_page_permissions rpp
JOIN user_management.pages p ON p.id = rpp.page_id
JOIN user_management.permission_types pt ON pt.id = rpp.permission_type_id
WHERE rpp.role_name = 'Administrator' 
  AND p.path = '/connections'
ORDER BY p.path, pt.name;
