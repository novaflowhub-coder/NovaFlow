-- NovaFlow Starter Data Insert Scripts
-- This file contains sample data for all tables to help with initial setup and testing

-- ============================================================================
-- USER MANAGEMENT SCHEMA DATA
-- ============================================================================

-- Insert default permission types
INSERT INTO user_management.permission_types (id, name, description, created_by) VALUES
('view', 'View', 'Can view the page and its content', 'system'),
('create', 'Create', 'Can create new items', 'system'),
('edit', 'Edit', 'Can edit existing items', 'system'),
('delete', 'Delete', 'Can delete items', 'system'),
('approve', 'Approve', 'Can approve changes', 'system');

-- Insert default pages
INSERT INTO user_management.pages (id, name, path, description, created_by) VALUES
('page1', 'Dashboard', '/dashboard', 'Main dashboard and analytics', 'system'),
('page2', 'Object Manager', '/object-manager', 'Manage integration objects and schemas', 'system'),
('page3', 'Rule Definition', '/rule-definition', 'Create and edit individual rules', 'system'),
('page4', 'Rule Set Definition', '/rule-set-definition', 'Create and manage rule sets', 'system'),
('page5', 'Run Control Definition', '/run-control-definition', 'Define execution controls', 'system'),
('page6', 'Process Monitor', '/process-monitor', 'Monitor rule execution', 'system'),
('page7', 'Approvals', '/approvals', 'Review and approve changes', 'system'),
('page8', 'UI Metadata', '/ui-metadata-list', 'Manage dynamic UI definitions', 'system'),
('page9', 'Connections', '/connections', 'Manage system connections', 'system'),
('page10', 'User Management', '/user-management', 'Manage users, roles, and permissions', 'system'),
('page11', 'Holiday Calendars', '/holiday-calendars', 'Manage holiday calendars', 'system'),
('page12', 'Version History', '/version-history', 'View entity change history', 'system'),
('page13', 'Domain Management', '/domain-management', 'Manage domains and domain settings', 'system');

-- Insert default domains
INSERT INTO user_management.domains (id, name, description, code, created_by) VALUES
('DOM001', 'Finance', 'Financial data and processes', 'FINANCE', 'system'),
('DOM002', 'Human Resources', 'HR data and employee information', 'HR', 'system'),
('DOM003', 'Sales', 'Sales data and customer information', 'SALES', 'system'),
('DOM004', 'Operations', 'Operational data and processes', 'OPS', 'system');

-- Insert default roles
INSERT INTO user_management.roles (id, name, description, domain_id, created_by) VALUES
('ROLE001', 'System Administrator', 'Full system access and administration', 'DOM001', 'system'),
('ROLE002', 'Domain Administrator', 'Administrative access within assigned domains', 'DOM001', 'system'),
('ROLE003', 'Business Analyst', 'Can create and modify rules and configurations', 'DOM001', 'system'),
('ROLE004', 'Data Steward', 'Can manage data objects and quality rules', 'DOM002', 'system'),
('ROLE005', 'Process Monitor', 'Can view and monitor process execution', 'DOM003', 'system'),
('ROLE006', 'Approver', 'Can approve changes and configurations', 'DOM004', 'system'),
('ROLE007', 'Viewer', 'Read-only access to system', 'DOM001', 'system');

-- Insert sample users
INSERT INTO user_management.users (id, name, username, email, full_name, status, created_by) VALUES
('USER001', 'System Administrator', 'admin', 'admin@novaflow.com', 'System Administrator', 'Active', 'system'),
('USER002', 'John Smith', 'jsmith', 'john.smith@company.com', 'John Smith', 'Active', 'system'),
('USER003', 'Mary Johnson', 'mjohnson', 'mary.johnson@company.com', 'Mary Johnson', 'Active', 'system'),
('USER004', 'Bob Wilson', 'bwilson', 'bob.wilson@company.com', 'Bob Wilson', 'Active', 'system'),
('USER005', 'Sarah Lee', 'slee', 'sarah.lee@company.com', 'Sarah Lee', 'Active', 'system');

-- Insert user domain roles
INSERT INTO user_management.user_domain_roles (id, user_id, domain_id, role_id, assigned_by) VALUES
('UDR001', 'USER001', 'DOM001', 'ROLE001', 'system'),
('UDR002', 'USER001', 'DOM002', 'ROLE001', 'system'),
('UDR003', 'USER001', 'DOM003', 'ROLE001', 'system'),
('UDR004', 'USER001', 'DOM004', 'ROLE001', 'system'),
('UDR005', 'USER002', 'DOM001', 'ROLE002', 'system'),
('UDR006', 'USER003', 'DOM002', 'ROLE003', 'system'),
('UDR007', 'USER004', 'DOM003', 'ROLE004', 'system'),
('UDR008', 'USER005', 'DOM004', 'ROLE005', 'system');

-- Insert role page permissions
INSERT INTO user_management.role_page_permissions (id, role_name, page_id, permission_type_id, created_by) VALUES
-- System Administrator - Full access to all pages
('RPP001', 'System Administrator', 'page1', 'view', 'system'),
('RPP002', 'System Administrator', 'page1', 'create', 'system'),
('RPP003', 'System Administrator', 'page1', 'edit', 'system'),
('RPP004', 'System Administrator', 'page1', 'delete', 'system'),
('RPP005', 'System Administrator', 'page2', 'view', 'system'),
('RPP006', 'System Administrator', 'page2', 'create', 'system'),
('RPP007', 'System Administrator', 'page2', 'edit', 'system'),
('RPP008', 'System Administrator', 'page2', 'delete', 'system'),
-- Business Analyst - Rule management access
('RPP009', 'Business Analyst', 'page1', 'view', 'system'),
('RPP010', 'Business Analyst', 'page3', 'view', 'system'),
('RPP011', 'Business Analyst', 'page3', 'create', 'system'),
('RPP012', 'Business Analyst', 'page3', 'edit', 'system'),
('RPP013', 'Business Analyst', 'page4', 'view', 'system'),
('RPP014', 'Business Analyst', 'page4', 'create', 'system'),
('RPP015', 'Business Analyst', 'page4', 'edit', 'system'),
-- Viewer - Read-only access
('RPP016', 'Viewer', 'page1', 'view', 'system'),
('RPP017', 'Viewer', 'page6', 'view', 'system'),
('RPP018', 'Viewer', 'page12', 'view', 'system');

-- ============================================================================
-- APPLICATION SCHEMA DATA
-- ============================================================================

-- Insert sample connections
INSERT INTO connections (id, name, description, type, host, port, database, username, 
                        base_url, status, domain_id, created_by, created_date) VALUES
('CONN001', 'Finance Database', 'Main finance system database', 'PostgreSQL', 'finance-db.company.com', 5432, 
 'finance_db', 'finance_user', NULL, 
 'A', 'DOM001', 'system', NOW()),
('CONN002', 'HR System API', 'Human resources REST API', 'REST_API', 'hr-api.company.com', 443, 
 NULL, 'hr_service', 'https://hr-api.company.com/api/v1', 
 'A', 'DOM002', 'system', NOW()),
('CONN003', 'Sales CRM', 'Salesforce CRM connection', 'Salesforce', 'company.salesforce.com', 443, 
 NULL, 'sf_integration', 'https://company.salesforce.com', 
 'A', 'DOM003', 'system', NOW()),
('CONN004', 'Data Warehouse', 'Main data warehouse', 'Snowflake', 'company.snowflakecomputing.com', 443, 
 'DW_PROD', 'dw_user', 'https://company.snowflakecomputing.com', 
 'A', 'DOM004', 'system', NOW());

-- Insert sample integration objects
INSERT INTO integration_objects (id, name, description, type, connection_id, status, domain_id, created_by, created_date) VALUES
('OBJ001', 'Customer', 'Customer master data', 'Table', 'CONN001', 'A', 'DOM001', 'system', NOW()),
('OBJ002', 'Invoice', 'Invoice transactions', 'Table', 'CONN001', 'A', 'DOM001', 'system', NOW()),
('OBJ003', 'Employee', 'Employee information', 'API', 'CONN002', 'A', 'DOM002', 'system', NOW()),
('OBJ004', 'Opportunity', 'Sales opportunities', 'API', 'CONN003', 'A', 'DOM003', 'system', NOW()),
('OBJ005', 'Product', 'Product catalog', 'Table', 'CONN004', 'A', 'DOM004', 'system', NOW());

-- Insert sample object attributes
INSERT INTO object_schema_attributes (id, integration_object_id, attribute_name, data_type, is_nullable, source_field, sample_value) VALUES
-- Customer attributes
('ATTR001', 'OBJ001', 'customer_id', 'INTEGER', false, 'id', '12345'),
('ATTR002', 'OBJ001', 'customer_name', 'VARCHAR', false, 'name', 'Acme Corporation'),
('ATTR003', 'OBJ001', 'email', 'VARCHAR', true, 'email_address', 'contact@acme.com'),
('ATTR004', 'OBJ001', 'phone', 'VARCHAR', true, 'phone_number', '+1-555-0123'),
('ATTR005', 'OBJ001', 'created_date', 'TIMESTAMP', false, 'created_at', '2024-01-15 10:30:00'),
-- Invoice attributes
('ATTR006', 'OBJ002', 'invoice_id', 'INTEGER', false, 'id', '67890'),
('ATTR007', 'OBJ002', 'customer_id', 'INTEGER', false, 'customer_id', '12345'),
('ATTR008', 'OBJ002', 'amount', 'DECIMAL', false, 'total_amount', '1250.75'),
('ATTR009', 'OBJ002', 'invoice_date', 'DATE', false, 'invoice_date', '2024-01-20'),
('ATTR010', 'OBJ002', 'status', 'VARCHAR', false, 'status', 'PAID'),
-- Employee attributes
('ATTR011', 'OBJ003', 'employee_id', 'INTEGER', false, 'id', '54321'),
('ATTR012', 'OBJ003', 'first_name', 'VARCHAR', false, 'firstName', 'John'),
('ATTR013', 'OBJ003', 'last_name', 'VARCHAR', false, 'lastName', 'Doe'),
('ATTR014', 'OBJ003', 'department', 'VARCHAR', true, 'department', 'Engineering'),
('ATTR015', 'OBJ003', 'hire_date', 'DATE', false, 'hireDate', '2023-03-15');

-- Insert sample holiday calendars
INSERT INTO holiday_calendars (id, name, description, domain_id, country, holidays, status, created_by, created_date) VALUES
('CAL001', 'US Federal Holidays', 'United States federal holiday calendar', 'DOM001', 'US', 
 '[{"date": "2024-01-01", "name": "New Year''s Day"}, {"date": "2024-07-04", "name": "Independence Day"}, {"date": "2024-12-25", "name": "Christmas Day"}]', 
 'A', 'system', NOW()),
('CAL002', 'UK Bank Holidays', 'United Kingdom bank holiday calendar', 'DOM002', 'UK', 
 '[{"date": "2024-01-01", "name": "New Year''s Day"}, {"date": "2024-12-25", "name": "Christmas Day"}, {"date": "2024-12-26", "name": "Boxing Day"}]', 
 'A', 'system', NOW());

-- Insert sample holidays
INSERT INTO holidays (id, calendar_id, date, name, description, recurring, created_by, created_date) VALUES
('HOL001', 'CAL001', '2024-01-01', 'New Year''s Day', 'Federal holiday', true, 'system', NOW()),
('HOL002', 'CAL001', '2024-07-04', 'Independence Day', 'Federal holiday', true, 'system', NOW()),
('HOL003', 'CAL001', '2024-12-25', 'Christmas Day', 'Federal holiday', true, 'system', NOW()),
('HOL004', 'CAL002', '2024-01-01', 'New Year''s Day', 'Bank holiday', true, 'system', NOW()),
('HOL005', 'CAL002', '2024-12-25', 'Christmas Day', 'Bank holiday', true, 'system', NOW()),
('HOL006', 'CAL002', '2024-12-26', 'Boxing Day', 'Bank holiday', true, 'system', NOW());

-- Insert sample rules
INSERT INTO rules (id, name, description, rule_type, domain_id, source_object_id, target_object_id, 
                  expression, priority, effective_date, status, version, conditions, actions, created_by, created_date) VALUES
('RULE001', 'Customer Email Validation', 'Validate customer email format', 'Validation', 'DOM001', 'OBJ001', NULL,
 'REGEXP_LIKE(email, ''^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'')', 1, NOW(), 'A', 1,
 '[{"field": "email", "operator": "is_not_null"}]',
 '[{"type": "reject", "message": "Invalid email format"}]',
 'system', NOW()),
('RULE002', 'Invoice Amount Check', 'Ensure invoice amount is positive', 'Business', 'DOM001', 'OBJ002', NULL,
 'amount > 0', 1, NOW(), 'A', 1,
 '[{"field": "amount", "operator": "is_not_null"}]',
 '[{"type": "flag", "severity": "error", "message": "Invoice amount must be positive"}]',
 'system', NOW()),
('RULE003', 'Customer Name Standardization', 'Standardize customer names to title case', 'Transformation', 'DOM001', 'OBJ001', 'OBJ001',
 'INITCAP(customer_name)', 2, NOW(), 'A', 1,
 '[{"field": "customer_name", "operator": "is_not_null"}]',
 '[{"type": "transform", "target_field": "customer_name", "function": "title_case"}]',
 'system', NOW());

-- Insert sample rule sets
INSERT INTO rule_sets (id, name, description, domain_id, execution_order, effective_date, status, version, 
                      rules, created_by, created_date) VALUES
('RSET001', 'Customer Data Quality', 'Complete customer data validation and transformation', 'DOM001', 'Sequential', NOW(), 'A', 1,
 '[{"ruleId": "RULE001", "order": 1, "isActive": true}, {"ruleId": "RULE003", "order": 2, "isActive": true}]',
 'system', NOW()),
('RSET002', 'Invoice Processing', 'Invoice validation and business rules', 'DOM001', 'Sequential', NOW(), 'A', 1,
 '[{"ruleId": "RULE002", "order": 1, "isActive": true}]',
 'system', NOW());

-- Insert sample run controls
INSERT INTO run_controls (id, name, description, domain_id, trigger_type, schedule_expression, holiday_calendar_id,
                         effective_date, status, version, steps, created_by, created_date) VALUES
('RC001', 'Daily Customer Sync', 'Daily synchronization of customer data', 'DOM001', 'Scheduled', '0 2 * * *', 'CAL001',
 NOW(), 'A', 1,
 '[{"order": 1, "type": "extract", "objectId": "OBJ001"}, {"order": 2, "type": "validate", "ruleSetId": "RSET001"}, {"order": 3, "type": "load", "targetObjectId": "OBJ001"}]',
 'system', NOW()),
('RC002', 'Invoice Processing Batch', 'Batch processing of invoices', 'DOM001', 'OnDemand', NULL, NULL,
 NOW(), 'A', 1,
 '[{"order": 1, "type": "extract", "objectId": "OBJ002"}, {"order": 2, "type": "validate", "ruleSetId": "RSET002"}, {"order": 3, "type": "load", "targetObjectId": "OBJ002"}]',
 'system', NOW()),
('RC003', 'Real-time Employee Updates', 'Real-time processing of employee changes', 'DOM002', 'RealtimeStream', NULL, NULL,
 NOW(), 'A', 1,
 '[{"order": 1, "type": "stream", "objectId": "OBJ003"}, {"order": 2, "type": "transform", "ruleSetId": "RSET001"}]',
 'system', NOW());

-- Insert sample run control schedules
INSERT INTO run_control_schedules (run_control_id, cron_expression, timezone, holiday_calendar_id, skip_on_holiday, run_on_next_business_day) VALUES
('RC001', '0 2 * * *', 'America/New_York', 'CAL001', true, true);

-- Insert sample run control streams
INSERT INTO run_control_streams (run_control_id, source_id, topic, parameters) VALUES
('RC003', 'CONN002', 'employee-updates', '{"batchSize": 100, "timeout": 30000}');

-- Insert sample scaffolds
INSERT INTO scaffolds (id, name, description, type, domain_id, source_object_name, target_object_name,
                      source_object_id, target_object_id, effective_date, status, version, columns,
                      aggregations, filters, ordering, connection_string, configuration, created_by, created_date) VALUES
('SCAF001', 'Customer Extract', 'Extract customer data for reporting', 'Scaffold_Out', 'DOM001', 'customers', 'customer_report',
 'OBJ001', NULL, NOW(), 'A', 1,
 '[{"name": "customer_id", "type": "INTEGER", "source": "id", "transformation": null}, {"name": "name", "type": "VARCHAR", "source": "customer_name", "transformation": "UPPER"}]',
 '[]', '[{"field": "status", "operator": "=", "value": "ACTIVE"}]', '[{"field": "customer_name", "direction": "ASC"}]',
 'postgresql://user:pass@localhost:5432/reports', '{"format": "CSV", "delimiter": ","}',
 'system', NOW());

-- Insert sample UI metadata
INSERT INTO ui_metadata (id, name, description, domain_id, source_object_id, layout_type, effective_date,
                        status, approval_status, version, fields, sections, configuration, created_by, created_date) VALUES
('UI001', 'Customer Form', 'Customer data entry form', 'DOM001', 'OBJ001', 'form', NOW(),
 'A', 'Approved', 1,
 '[{"name": "customer_name", "type": "text", "required": true, "label": "Customer Name"}, {"name": "email", "type": "email", "required": false, "label": "Email Address"}]',
 '[{"name": "basic_info", "title": "Basic Information", "fields": ["customer_name", "email"]}]',
 '{"allowCreate": true, "allowEdit": true, "allowDelete": false, "enableValidation": true}',
 'system', NOW()),
('UI002', 'Invoice List', 'Invoice management table', 'DOM001', 'OBJ002', 'table', NOW(),
 'A', 'Approved', 1,
 '[{"name": "invoice_id", "type": "number", "sortable": true, "label": "Invoice ID"}, {"name": "amount", "type": "currency", "sortable": true, "label": "Amount"}]',
 '[]',
 '{"pageSize": 25, "enableSearch": true, "enableExport": true}',
 'system', NOW());

-- Insert sample dynamic data records
INSERT INTO dynamic_data_records (id, ui_metadata_id, data, status, approval_status, created_by, created_date) VALUES
('DDR001', 'UI001', '{"customer_name": "Sample Customer", "email": "sample@example.com", "phone": "+1-555-0199"}', 'A', 'Draft', 'system', NOW()),
('DDR002', 'UI001', '{"customer_name": "Test Corporation", "email": "info@testcorp.com", "phone": "+1-555-0188"}', 'A', 'Approved', 'system', NOW());

-- Insert sample process logs
INSERT INTO process_logs (id, run_control_id, execution_id, start_time, end_time, status, total_records,
                         success_records, error_records, logs, triggered_by, created_date) VALUES
('LOG001', 'RC001', 'EXEC001', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '30 minutes', 'Completed', 1000, 995, 5,
 '[{"timestamp": "2024-01-20T02:00:00Z", "level": "INFO", "message": "Process started", "component": "scheduler"}, {"timestamp": "2024-01-20T02:30:00Z", "level": "INFO", "message": "Process completed", "component": "scheduler"}]',
 'scheduler', NOW()),
('LOG002', 'RC002', 'EXEC002', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 hour', 'Failed', 500, 450, 50,
 '[{"timestamp": "2024-01-20T01:00:00Z", "level": "INFO", "message": "Process started", "component": "manual"}, {"timestamp": "2024-01-20T01:45:00Z", "level": "ERROR", "message": "Connection timeout", "component": "extractor"}]',
 'USER002', NOW());

-- Insert sample version history
INSERT INTO version_history (id, entity_id, entity_type, entity_name, version, change_type, changed_by,
                            changed_date, change_description, previous_state, new_state) VALUES
('VH001', 'RULE001', 'Rule', 'Customer Email Validation', 1, 'Create', 'system', NOW(),
 'Initial rule creation', NULL, '{"name": "Customer Email Validation", "status": "A"}'),
('VH002', 'OBJ001', 'Object', 'Customer', 1, 'Update', 'USER002', NOW(),
 'Updated object description', '{"description": "Customer data"}', '{"description": "Customer master data"}');

-- Insert sample approvals
INSERT INTO approvals (id, entity_id, entity_type, entity_name, requested_by, requested_date, approval_type,
                      status, approved_by, approved_date, rejection_reason, comments) VALUES
('APP001', 'RULE001', 'Rule', 'Customer Email Validation', 'USER003', NOW() - INTERVAL '1 day', 'Peer Review',
 'Approved', 'USER004', NOW() - INTERVAL '12 hours', NULL, 'Rule logic looks good'),
('APP002', 'UI001', 'UI Metadata', 'Customer Form', 'USER002', NOW() - INTERVAL '2 days', 'Final Approval',
 'Pending', NULL, NULL, NULL, 'Awaiting final approval for production deployment');
