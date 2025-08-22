-- Add user to NovaFlow database
-- Replace 'your-email@gmail.com' with your actual Google account email

SET search_path TO user_management, public;

-- Insert user (replace email with your Google account email)
INSERT INTO users (id, name, email, status, is_active, created_date, created_by)
VALUES (
    gen_random_uuid(),
    'Your Name',  -- Replace with your name
    'your-email@gmail.com',  -- Replace with your Google account email
    'ACTIVE',
    TRUE,
    NOW(),
    'system'
) ON CONFLICT (email) DO NOTHING;

-- Get the default domain ID
DO $$
DECLARE
    user_id UUID;
    domain_id UUID;
    admin_role_id UUID;
BEGIN
    -- Get user ID
    SELECT id INTO user_id FROM users WHERE email = 'your-email@gmail.com';
    
    -- Get default domain ID (assuming there's at least one domain)
    SELECT id INTO domain_id FROM domains WHERE is_active = TRUE LIMIT 1;
    
    -- Get Administrator role ID
    SELECT id INTO admin_role_id FROM roles WHERE name = 'Administrator' LIMIT 1;
    
    -- Insert user domain role
    IF user_id IS NOT NULL AND domain_id IS NOT NULL AND admin_role_id IS NOT NULL THEN
        INSERT INTO user_domain_roles (id, user_id, domain_id, role_id, is_active, created_date, created_by)
        VALUES (
            gen_random_uuid(),
            user_id,
            domain_id,
            admin_role_id,
            TRUE,
            NOW(),
            'system'
        ) ON CONFLICT DO NOTHING;
        
        RAISE NOTICE 'User added successfully with Administrator role';
    ELSE
        RAISE NOTICE 'Failed to add user - missing user_id: %, domain_id: %, admin_role_id: %', user_id, domain_id, admin_role_id;
    END IF;
END $$;

-- Verify the user was added
SELECT 'User Verification' as check_type, u.name, u.email, u.status, u.is_active
FROM users u WHERE u.email = 'your-email@gmail.com';

-- Verify user roles
SELECT 'User Roles' as check_type, u.email, r.name as role_name, d.name as domain_name
FROM users u
JOIN user_domain_roles udr ON udr.user_id = u.id
JOIN roles r ON r.id = udr.role_id
JOIN domains d ON d.id = udr.domain_id
WHERE u.email = 'your-email@gmail.com' AND udr.is_active = TRUE;
