-- Performance indexes for DB-only RBAC system
-- Connect to novaflow database and user_management schema
\c novaflow;

-- Index for user_domain_roles lookups by user_id, domain_id, role_id
CREATE INDEX IF NOT EXISTS idx_udr_user_domain_role
  ON user_management.user_domain_roles (user_id, domain_id, role_id);

-- Index for user_domain_roles lookups by user_id and is_active
CREATE INDEX IF NOT EXISTS idx_udr_user_active
  ON user_management.user_domain_roles (user_id, is_active);

-- Index for role_page_permissions lookups by role_name, page_id, permission_type_id
CREATE INDEX IF NOT EXISTS idx_rpp_role_page_perm
  ON user_management.role_page_permissions (role_name, page_id, permission_type_id);

-- Index for role_page_permissions lookups by role_name and is_granted
CREATE INDEX IF NOT EXISTS idx_rpp_role_granted
  ON user_management.role_page_permissions (role_name, is_granted);

-- Index for pages lookups by path
CREATE INDEX IF NOT EXISTS idx_pages_path
  ON user_management.pages (path);

-- Index for permission_types lookups by name
CREATE INDEX IF NOT EXISTS idx_pt_name
  ON user_management.permission_types (name);

-- Index for users lookups by email (critical for DB-only RBAC)
CREATE INDEX IF NOT EXISTS idx_users_email
  ON user_management.users (email);

-- Composite index for efficient role-permission queries
CREATE INDEX IF NOT EXISTS idx_rpp_composite
  ON user_management.role_page_permissions (role_name, is_granted, page_id, permission_type_id);
