-- Fix existing Super Administrator permissions
SET search_path TO user_management, public;

-- Update all Super Administrator permissions to granted
UPDATE role_page_permissions 
SET is_granted = true, 
    last_modified_by = 'system',
    last_modified_date = NOW()
WHERE role_name = 'Super Administrator';

-- Verify the fix
SELECT 'Permission Update Results' as status,
       COUNT(CASE WHEN is_granted = true THEN 1 END) as granted_count,
       COUNT(CASE WHEN is_granted = false THEN 1 END) as denied_count,
       COUNT(*) as total_count
FROM role_page_permissions 
WHERE role_name = 'Super Administrator';
