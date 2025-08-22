-- Admin User Setup for NovaFlow
-- Creates admin user with full access to all API endpoints

-- Set search path
SET search_path TO user_management, public;

-- 1. Create default domain if not exists
INSERT INTO domains (id, name, description, code, is_active, created_by, created_date)
VALUES ('DOM_GLOBAL', 'Global Domain', 'Global administrative domain', 'GLOBAL', true, 'system', NOW())
ON CONFLICT (id) DO NOTHING;

-- 2. Create admin role if not exists
INSERT INTO roles (id, name, description, domain_id, user_count, created_by, created_date)
VALUES ('ROLE_ADMIN', 'Administrator', 'Full system administrator with all permissions', 'DOM_GLOBAL', 0, 'system', NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. Create admin user
INSERT INTO users (id, name, username, email, full_name, status, is_active, created_by, created_date)
VALUES ('NovaFlowAdmin', 'Google User', 'guser', 'novaflowhub@gmail.com', 'NovaFlow Administrator', 'Active', true, 'system', NOW())
ON CONFLICT (email) DO UPDATE SET
    name = EXCLUDED.name,
    username = EXCLUDED.username,
    full_name = EXCLUDED.full_name,
    status = EXCLUDED.status,
    is_active = EXCLUDED.is_active,
    updated_by = 'system',
    updated_date = NOW();

-- 4. Assign admin role to user
INSERT INTO user_domain_roles (id, user_id, domain_id, role_id, is_active, assigned_by, assigned_date)
VALUES ('UDR_ADMIN_GLOBAL', 'NovaFlowAdmin', 'DOM_GLOBAL', 'ROLE_ADMIN', true, 'system', NOW())
ON CONFLICT (user_id, domain_id, role_id) DO UPDATE SET
    is_active = true,
    assigned_by = 'system',
    assigned_date = NOW();

-- 5. Create standard pages for API endpoints
INSERT INTO pages (id, name, path, description, created_by, created_date) VALUES
('PAGE_DASHBOARD', 'Dashboard', '/dashboard', 'Main dashboard page', 'system', NOW()),
('PAGE_USERS', 'User Management', '/users', 'User management interface', 'system', NOW()),
('PAGE_ROLES', 'Role Management', '/roles', 'Role and permission management', 'system', NOW()),
('PAGE_DOMAINS', 'Domain Management', '/domains', 'Domain management interface', 'system', NOW()),
('PAGE_METADATA', 'Metadata', '/metadata', 'System metadata and configuration', 'system', NOW()),
('PAGE_API_ME', 'User Profile API', '/api/me', 'User profile and identity API', 'system', NOW()),
('PAGE_API_AUTHORIZE', 'Authorization API', '/api/authorize', 'Permission checking API', 'system', NOW()),
('PAGE_API_ALL', 'All APIs', '/api/**', 'Full API access', 'system', NOW())
ON CONFLICT (path) DO NOTHING;

-- 6. Create standard permission types
INSERT INTO permission_types (id, name, description, created_by, created_date) VALUES
('PERM_VIEW', 'view', 'View/Read access', 'system', NOW()),
('PERM_EDIT', 'edit', 'Edit/Update access', 'system', NOW()),
('PERM_CREATE', 'create', 'Create/Add access', 'system', NOW()),
('PERM_DELETE', 'delete', 'Delete/Remove access', 'system', NOW()),
('PERM_ADMIN', 'admin', 'Full administrative access', 'system', NOW())
ON CONFLICT (id) DO NOTHING;

-- 7. Grant ALL permissions to admin role for ALL pages
INSERT INTO role_page_permissions (id, role_name, page_id, permission_type_id, is_granted, created_by, created_date)
SELECT 
    'RPP_ADMIN_' || p.id || '_' || pt.id,
    'Administrator',
    p.id,
    pt.id,
    true,
    'system',
    NOW()
FROM pages p
CROSS JOIN permission_types pt
ON CONFLICT (role_name, page_id, permission_type_id) DO UPDATE SET
    is_granted = true,
    last_modified_by = 'system',
    last_modified_date = NOW();

-- 8. Update role user count
UPDATE roles 
SET user_count = (
    SELECT COUNT(*) 
    FROM user_domain_roles udr 
    WHERE udr.role_id = roles.id AND udr.is_active = true
),
updated_by = 'system',
updated_date = NOW()
WHERE id = 'ROLE_ADMIN';

-- Verify the setup
DO $$
BEGIN
    -- Check if admin user exists and has roles
    IF EXISTS (
        SELECT 1 
        FROM users u
        JOIN user_domain_roles udr ON u.id = udr.user_id
        JOIN roles r ON udr.role_id = r.id
        WHERE u.email = 'novaflowhub@gmail.com' 
        AND r.name = 'Administrator'
        AND udr.is_active = true
    ) THEN
        RAISE NOTICE 'SUCCESS: Admin user novaflowhub@gmail.com created with Administrator role';
    ELSE
        RAISE WARNING 'FAILED: Admin user setup incomplete';
    END IF;
    
    -- Check permissions count
    RAISE NOTICE 'Admin permissions granted: % total permissions', 
        (SELECT COUNT(*) FROM role_page_permissions WHERE role_name = 'Administrator' AND is_granted = true);
END $$;
