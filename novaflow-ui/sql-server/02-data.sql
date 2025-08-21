-- SQL Server Sample Data

-- Roles
INSERT INTO Roles (Id, Name, Description, Permissions) VALUES
('admin', 'Administrator', 'Full access to all features', N'{"dashboard":{"view":true},"approvals":{"view":true},"userManagement":{"view":true,"edit":true},"processMonitor":{"view":true},"ruleDefinition":{"view":true,"edit":true},"ruleSetDefinition":{"view":true,"edit":true},"scaffoldDefinition":{"view":true,"edit":true},"runControlDefinition":{"view":true,"edit":true},"objectManager":{"view":true,"edit":true},"uiMetadata":{"view":true,"edit":true},"dynamicUI":{"view":true,"edit":true}}'),
('developer', 'Developer', 'Access to development and configuration tools', N'{"dashboard":{"view":true},"approvals":{"view":false},"userManagement":{"view":false,"edit":false},"processMonitor":{"view":true},"ruleDefinition":{"view":true,"edit":true},"ruleSetDefinition":{"view":true,"edit":true},"scaffoldDefinition":{"view":true,"edit":true},"runControlDefinition":{"view":true,"edit":true},"objectManager":{"view":true,"edit":true},"uiMetadata":{"view":true,"edit":true},"dynamicUI":{"view":true,"edit":true}}'),
('business_analyst', 'Business Analyst', 'Access to business rule and process definitions', N'{"dashboard":{"view":true},"approvals":{"view":true},"userManagement":{"view":false,"edit":false},"processMonitor":{"view":true},"ruleDefinition":{"view":true,"edit":false},"ruleSetDefinition":{"view":true,"edit":false},"scaffoldDefinition":{"view":false,"edit":false},"runControlDefinition":{"view":true,"edit":false},"objectManager":{"view":true,"edit":false},"uiMetadata":{"view":true,"edit":false},"dynamicUI":{"view":true,"edit":false}}'),
('viewer', 'Viewer', 'Read-only access to dashboards and reports', N'{"dashboard":{"view":true},"approvals":{"view":false},"userManagement":{"view":false,"edit":false},"processMonitor":{"view":true},"ruleDefinition":{"view":false,"edit":false},"ruleSetDefinition":{"view":false,"edit":false},"scaffoldDefinition":{"view":false,"edit":false},"runControlDefinition":{"view":false,"edit":false},"objectManager":{"view":false,"edit":false},"uiMetadata":{"view":false,"edit":false},"dynamicUI":{"view":false,"edit":false}}');

-- Users
INSERT INTO Users (Id, Name, Email, RoleId, Status, LastLogin) VALUES
('USR001', 'Alice Johnson', 'alice.johnson@example.com', 'admin', 'A', '2024-06-10T10:00:00Z'),
('USR002', 'Bob Williams', 'bob.williams@example.com', 'developer', 'A', '2024-06-10T09:00:00Z'),
('USR003', 'Charlie Brown', 'charlie.brown@example.com', 'business_analyst', 'A', '2024-06-09T15:30:00Z'),
('USR004', 'Diana Miller', 'diana.miller@example.com', 'viewer', 'I', '2024-05-20T11:00:00Z');

-- IntegrationObjects
INSERT INTO IntegrationObjects (Id, Name, Type, Description, Status) VALUES
('OBJ001', 'Customer Database', 'Database', 'Customer information from CRM system', 'A'),
('OBJ002', 'Product Catalog API', 'API', 'Product information from e-commerce platform', 'A'),
('OBJ003', 'Order Management', 'Database', 'Order processing system', 'A'),
('OBJ004', 'Financial Transactions', 'Queue', 'Transaction data from payment system', 'A');

-- ObjectSchemaAttributes
-- For OBJ001
INSERT INTO ObjectSchemaAttributes (Id, IntegrationObjectId, AttributeName, DataType, IsNullable, SourceField, SampleValue) VALUES
('ATTR001', 'OBJ001', 'customerId', 'String', 0, 'customer_id', 'CUST001'),
('ATTR002', 'OBJ001', 'customerName', 'String', 0, 'customer_name', 'Acme Corporation'),
('ATTR003', 'OBJ001', 'email', 'String', 1, 'email_address', 'contact@acme.com'),
('ATTR004', 'OBJ001', 'phone', 'String', 1, 'phone_number', '555-123-4567'),
('ATTR005', 'OBJ001', 'address', 'String', 1, 'mailing_address', '123 Main St, Anytown, USA'),
('ATTR006', 'OBJ001', 'customerType', 'String', 0, 'customer_type', 'business'),
('ATTR007', 'OBJ001', 'isActive', 'Boolean', 0, 'is_active', 'true'),
('ATTR008', 'OBJ001', 'registrationDate', 'Date', 0, 'registration_date', '2023-01-15');
-- Add other attributes for other objects similarly...

-- RuleSets
INSERT INTO RuleSets (Id, Name, Description, EffectiveDate, Status, ApprovalStatus, ApprovedBy, ApprovedDate, RulesJson) VALUES
('RS001', 'Customer Data Validation', 'Complete validation rules for customer data', '2024-01-01', 'A', 'Approved', 'Rule Manager', '2024-01-05T10:00:00Z', N'[{"id":"RULE001","name":"Customer Validation Rule","description":"Validates customer data","status":"A"}]');

-- Rules
INSERT INTO Rules (Id, Name, Description, RuleSetId, SourceObjectId, EffectiveDate, Status, ApprovalStatus, ApprovedBy, ApprovedDate, RuleJson) VALUES
('RULE001', 'Customer Validation Rule', 'Validates customer data before processing', 'RS001', 'OBJ001', '2024-01-01', 'A', 'Approved', 'Rule Manager', '2024-01-05T10:00:00Z', N'{"conditions":[{"id":"COND001","sourceAttribute":"customerType","operator":"=","value":"Premium","conditionOperator":"AND"}],"actions":[{"id":"ACT001","targetAttribute":"creditLimit","operator":":=","expression":"50000"}]}');

-- RunControls
INSERT INTO RunControls (Id, Name, Description, EffectiveDate, Status, ApprovalStatus, ApprovedBy, ApprovedDate, ExecutionMode, ScheduleType, ScheduleTime, StepsJson) VALUES
('RC001', 'Daily Customer KYC Processing', 'End-to-end customer KYC processing workflow', '2024-01-01', 'A', 'Approved', 'Workflow Manager', '2024-01-05T10:00:00Z', 'Scheduled', 'Daily', '02:00', N'{"steps":[{"id":"STEP001","stepOrder":1,"runType":"Scaffold_In","runTypeName":"Customer Data Input","description":"Load customer data from source systems","status":"A"},{"id":"STEP002","stepOrder":2,"runType":"RuleSet","runTypeName":"KYC Validation Rules","description":"Execute KYC validation and screening rules","status":"A"},{"id":"STEP003","stepOrder":3,"runType":"Scaffold_Out","runTypeName":"KYC Results Output","description":"Export KYC results to compliance system","status":"A"}]}');

-- ProcessLogs
INSERT INTO ProcessLogs (Id, UserId, RunControlId, RunControlName, RunDateTime, RunStatus, LogDetails) VALUES
('LOG001', 'USR001', 'RC001', 'Daily Customer KYC Processing', '2024-06-10T02:00:00Z', 'Success', 'Processed 10,542 records successfully.');

-- UIMetadata
INSERT INTO UIMetadata (Id, Name, Description, SourceObjectId, LayoutType, EffectiveDate, Status, ApprovalStatus, ApprovedBy, ApprovedDate, FieldsJson, SectionsJson, ConfigurationJson) VALUES
('UI001', 'Customer Information', 'Customer details and contact information', 'OBJ001', 'form', '2023-02-01', 'A', 'Approved', 'approver1', '2023-01-20', N'{"fields":[]}', N'{"sections":[]}', N'{"allowCreate":true,"allowEdit":true,"allowDelete":false}');

-- DynamicDataRecords
INSERT INTO DynamicDataRecords (Id, Name, Description, UIMetadataId, DataJson, Status, ApprovalStatus, CreatedBy, CreatedDate, Version) VALUES
('REC001', 'Customer Record 1', 'First customer record', 'UI001', N'{"customerName":"Acme Corporation","email":"contact@acme.com","phone":"555-123-4567","address":"123 Main St, Anytown, USA","customerType":"business","isActive":true}', 'A', 'Approved', 'user1', '2023-02-05', 1);
