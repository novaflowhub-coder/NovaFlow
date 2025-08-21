-- Oracle Sample Data

-- Roles
INSERT INTO Roles (Id, Name, Description, Permissions) VALUES
('admin', 'Administrator', 'Full access to all features', '{"dashboard":{"view":true},"approvals":{"view":true},"userManagement":{"view":true,"edit":true},"processMonitor":{"view":true},"ruleDefinition":{"view":true,"edit":true},"ruleSetDefinition":{"view":true,"edit":true},"scaffoldDefinition":{"view":true,"edit":true},"runControlDefinition":{"view":true,"edit":true},"objectManager":{"view":true,"edit":true},"uiMetadata":{"view":true,"edit":true},"dynamicUI":{"view":true,"edit":true}}');
-- ... (other inserts would follow, using TO_TIMESTAMP for dates)
