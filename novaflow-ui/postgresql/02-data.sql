-- PostgreSQL Sample Data

-- Roles
INSERT INTO Roles (Id, Name, Description, Permissions) VALUES
('admin', 'Administrator', 'Full access to all features', '{"dashboard":{"view":true},"approvals":{"view":true},"userManagement":{"view":true,"edit":true},"processMonitor":{"view":true},"ruleDefinition":{"view":true,"edit":true},"ruleSetDefinition":{"view":true,"edit":true},"scaffoldDefinition":{"view":true,"edit":true},"runControlDefinition":{"view":true,"edit":true},"objectManager":{"view":true,"edit":true},"uiMetadata":{"view":true,"edit":true},"dynamicUI":{"view":true,"edit":true}}'::jsonb),
('developer', 'Developer', 'Access to development and configuration tools', '{"dashboard":{"view":true},"approvals":{"view":false},"userManagement":{"view":false,"edit":false},"processMonitor":{"view":true},"ruleDefinition":{"view":true,"edit":true},"ruleSetDefinition":{"view":true,"edit":true},"scaffoldDefinition":{"view":true,"edit":true},"runControlDefinition":{"view":true,"edit":true},"objectManager":{"view":true,"edit":true},"uiMetadata":{"view":true,"edit":true},"dynamicUI":{"view":true,"edit":true}}'::jsonb),
('business_analyst', 'Business Analyst', 'Access to business rule and process definitions', '{"dashboard":{"view":true},"approvals":{"view":true},"userManagement":{"view":false,"edit":false},"processMonitor":{"view":true},"ruleDefinition":{"view":true,"edit":false},"ruleSetDefinition":{"view":true,"edit":false},"scaffoldDefinition":{"view":false,"edit":false},"runControlDefinition":{"view":true,"edit":false},"objectManager":{"view":true,"edit":false},"uiMetadata":{"view":true,"edit":false},"dynamicUI":{"view":true,"edit":false}}'::jsonb),
('viewer', 'Viewer', 'Read-only access to dashboards and reports', '{"dashboard":{"view":true},"approvals":{"view":false},"userManagement":{"view":false,"edit":false},"processMonitor":{"view":true},"ruleDefinition":{"view":false,"edit":false},"ruleSetDefinition":{"view":false,"edit":false},"scaffoldDefinition":{"view":false,"edit":false},"runControlDefinition":{"view":false,"edit":false},"objectManager":{"view":false,"edit":false},"uiMetadata":{"view":false,"edit":false},"dynamicUI":{"view":false,"edit":false}}'::jsonb);

-- Users
INSERT INTO Users (Id, Name, Email, RoleId, Status, LastLogin) VALUES
('USR001', 'Alice Johnson', 'alice.johnson@example.com', 'admin', 'A', '2024-06-10T10:00:00Z'),
('USR002', 'Bob Williams', 'bob.williams@example.com', 'developer', 'A', '2024-06-10T09:00:00Z'),
('USR003', 'Charlie Brown', 'charlie.brown@example.com', 'business_analyst', 'A', '2024-06-09T15:30:00Z'),
('USR004', 'Diana Miller', 'diana.miller@example.com', 'viewer', 'I', '2024-05-20T11:00:00Z');

-- ... (other inserts would follow, using '::jsonb' for JSON data)
