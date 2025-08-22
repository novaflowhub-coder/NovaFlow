-- Update admin user email to match your Google account
SET search_path TO user_management, public;

-- Update the admin user email (replace with your actual Google account email)
UPDATE users 
SET email = 'mastermindcoderscamp@gmail.com',  -- Replace with your actual email
    updated_by = 'system',
    updated_date = NOW()
WHERE id = 'NovaFlowAdmin';

-- Verify the update
SELECT 'Updated Admin User' as status, id, name, email, status, is_active 
FROM users WHERE id = 'NovaFlowAdmin';

-- Verify user still has admin role
SELECT 'Admin Role Check' as status, u.email, r.name as role_name, d.name as domain_name
FROM users u
JOIN user_domain_roles udr ON udr.user_id = u.id
JOIN roles r ON r.id = udr.role_id
JOIN domains d ON d.id = udr.domain_id
WHERE u.id = 'NovaFlowAdmin' AND udr.is_active = TRUE;
