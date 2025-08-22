-- Performance indexes for RBAC system
-- These indexes optimize the most common queries in the authorization system

-- Set search path to user_management schema
SET search_path TO user_management, public;

-- Index for user_domain_roles table - optimizes role resolution queries
CREATE INDEX IF NOT EXISTS idx_user_domain_roles_user_domain_role 
ON user_domain_roles(user_id, domain_id, role_id);

CREATE INDEX IF NOT EXISTS idx_user_domain_roles_user_active 
ON user_domain_roles(user_id, is_active);

CREATE INDEX IF NOT EXISTS idx_user_domain_roles_domain_active 
ON user_domain_roles(domain_id, is_active);

-- Index for role_page_permissions table - optimizes permission checking queries
CREATE INDEX IF NOT EXISTS idx_role_page_permissions_role_page_permission 
ON role_page_permissions(role_name, page_id, permission_type_id);

CREATE INDEX IF NOT EXISTS idx_role_page_permissions_role_granted 
ON role_page_permissions(role_name, is_granted);

CREATE INDEX IF NOT EXISTS idx_role_page_permissions_page_permission_granted 
ON role_page_permissions(page_id, permission_type_id, is_granted);

-- Index for pages table - optimizes page path lookups
CREATE INDEX IF NOT EXISTS idx_pages_path 
ON pages(path);

-- Index for permission_types table - optimizes permission name lookups
CREATE INDEX IF NOT EXISTS idx_permission_types_name 
ON permission_types(name);

-- Index for users table - optimizes user lookups by email
CREATE INDEX IF NOT EXISTS idx_users_email 
ON users(email);

CREATE INDEX IF NOT EXISTS idx_users_active 
ON users(is_active);

-- Index for roles table - optimizes role lookups by name
CREATE INDEX IF NOT EXISTS idx_roles_name 
ON roles(name);

CREATE INDEX IF NOT EXISTS idx_roles_domain 
ON roles(domain_id);

-- Composite index for the most common authorization query pattern
CREATE INDEX IF NOT EXISTS idx_role_page_permissions_auth_query 
ON role_page_permissions(role_name, page_id, permission_type_id, is_granted) 
WHERE is_granted = true;
