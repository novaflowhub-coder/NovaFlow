-- PostgreSQL Schema Definition

-- Create user_management schema
CREATE SCHEMA IF NOT EXISTS user_management;

-- Set search path to use the schema
SET search_path TO user_management, public;

-- Domain Management
CREATE TABLE domains (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    code TEXT NOT NULL UNIQUE, -- Short code for domain (e.g., 'FINANCE', 'HR', 'SALES')
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_by TEXT NOT NULL,
    created_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_modified_by TEXT,
    last_modified_date TIMESTAMPTZ
);

-- User Management
CREATE TABLE roles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    domain_id TEXT NOT NULL,
    user_count INTEGER DEFAULT 0,
    permissions JSONB,
    created_by TEXT NOT NULL,
    created_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by TEXT,
    updated_date TIMESTAMPTZ,
    FOREIGN KEY (domain_id) REFERENCES Domains(id)
);

CREATE TABLE users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    username TEXT UNIQUE,
    full_name TEXT,
    department TEXT,
    status TEXT NOT NULL DEFAULT 'Active', -- Active | Inactive
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_login TIMESTAMPTZ,
    created_by TEXT NOT NULL,
    created_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by TEXT,
    updated_date TIMESTAMPTZ
);

-- User Domain Memberships (Many-to-Many relationship)
CREATE TABLE user_domain_roles (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    domain_id TEXT NOT NULL,
    role_id TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    assigned_by TEXT NOT NULL,
    assigned_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (domain_id) REFERENCES domains(id),
    FOREIGN KEY (role_id) REFERENCES roles(id),
    UNIQUE(user_id, domain_id, role_id)
);

-- Page Permissions
CREATE TABLE pages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    path TEXT NOT NULL UNIQUE,
    description TEXT,
    created_by TEXT NOT NULL,
    created_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_modified_by TEXT,
    last_modified_date TIMESTAMPTZ
);

CREATE TABLE permission_types (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_by TEXT NOT NULL,
    created_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_modified_by TEXT,
    last_modified_date TIMESTAMPTZ
);

CREATE TABLE role_page_permissions (
    id TEXT PRIMARY KEY,
    role_name TEXT NOT NULL,
    page_id TEXT NOT NULL,
    permission_type_id TEXT NOT NULL,
    is_granted BOOLEAN NOT NULL DEFAULT false,
    created_by TEXT NOT NULL,
    created_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_modified_by TEXT,
    last_modified_date TIMESTAMPTZ,
    FOREIGN KEY (page_id) REFERENCES pages(id),
    FOREIGN KEY (permission_type_id) REFERENCES permission_types(id),
    UNIQUE(role_name, page_id, permission_type_id)
);