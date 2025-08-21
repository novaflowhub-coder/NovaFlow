-- SQL Server Schema Definition

-- User Management
CREATE TABLE Roles (
    Id NVARCHAR(50) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(255),
    Permissions NVARCHAR(MAX),
    CONSTRAINT CHK_Roles_Permissions_Is_JSON CHECK (ISJSON(Permissions) > 0)
);

CREATE TABLE Users (
    Id NVARCHAR(50) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    RoleId NVARCHAR(50),
    Status CHAR(1) NOT NULL, -- A: Active, I: Inactive
    LastLogin DATETIME2,
    FOREIGN KEY (RoleId) REFERENCES Roles(Id)
);

-- Core Engine Objects
CREATE TABLE IntegrationObjects (
    Id NVARCHAR(50) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Type NVARCHAR(50) NOT NULL,
    Description NVARCHAR(MAX),
    Status CHAR(1) NOT NULL -- A: Active, I: Inactive
);

CREATE TABLE ObjectSchemaAttributes (
    Id NVARCHAR(50) PRIMARY KEY,
    IntegrationObjectId NVARCHAR(50) NOT NULL,
    AttributeName NVARCHAR(100) NOT NULL,
    DataType NVARCHAR(50) NOT NULL,
    IsNullable BIT NOT NULL,
    SourceField NVARCHAR(100),
    SampleValue NVARCHAR(MAX),
    FOREIGN KEY (IntegrationObjectId) REFERENCES IntegrationObjects(Id) ON DELETE CASCADE
);

CREATE TABLE RuleSets (
    Id NVARCHAR(50) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(MAX),
    EffectiveDate DATETIME2 NOT NULL,
    Status CHAR(1) NOT NULL,
    ApprovalStatus NVARCHAR(50),
    PeerReviewedBy NVARCHAR(100),
    PeerReviewedDate DATETIME2,
    ApprovedBy NVARCHAR(100),
    ApprovedDate DATETIME2,
    RulesJson NVARCHAR(MAX), -- Contains array of rule references
    CONSTRAINT CHK_RuleSets_RulesJson_Is_JSON CHECK (ISJSON(RulesJson) > 0)
);

CREATE TABLE Rules (
    Id NVARCHAR(50) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(MAX),
    RuleSetId NVARCHAR(50) NOT NULL,
    SourceObjectId NVARCHAR(50) NOT NULL,
    EffectiveDate DATETIME2 NOT NULL,
    Status CHAR(1) NOT NULL,
    ApprovalStatus NVARCHAR(50),
    PeerReviewedBy NVARCHAR(100),
    PeerReviewedDate DATETIME2,
    ApprovedBy NVARCHAR(100),
    ApprovedDate DATETIME2,
    RuleJson NVARCHAR(MAX), -- Contains conditions and actions
    FOREIGN KEY (RuleSetId) REFERENCES RuleSets(Id),
    FOREIGN KEY (SourceObjectId) REFERENCES IntegrationObjects(Id),
    CONSTRAINT CHK_Rules_RuleJson_Is_JSON CHECK (ISJSON(RuleJson) > 0)
);

CREATE TABLE Scaffolds (
    Id NVARCHAR(50) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(MAX),
    Type NVARCHAR(50) NOT NULL,
    EffectiveDate DATETIME2 NOT NULL,
    Status CHAR(1) NOT NULL,
    ApprovalStatus NVARCHAR(50),
    PeerReviewedBy NVARCHAR(100),
    PeerReviewedDate DATETIME2,
    ApprovedBy NVARCHAR(100),
    ApprovedDate DATETIME2,
    SourceObjectId NVARCHAR(50),
    TargetObjectId NVARCHAR(50),
    ColumnsJson NVARCHAR(MAX), -- Contains column definitions
    ConnectionString NVARCHAR(MAX),
    ConfigurationJson NVARCHAR(MAX),
    FOREIGN KEY (SourceObjectId) REFERENCES IntegrationObjects(Id),
    FOREIGN KEY (TargetObjectId) REFERENCES IntegrationObjects(Id),
    CONSTRAINT CHK_Scaffolds_ColumnsJson_Is_JSON CHECK (ISJSON(ColumnsJson) > 0),
    CONSTRAINT CHK_Scaffolds_ConfigurationJson_Is_JSON CHECK (ISJSON(ConfigurationJson) > 0)
);

CREATE TABLE RunControls (
    Id NVARCHAR(50) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(MAX),
    EffectiveDate DATETIME2 NOT NULL,
    Status CHAR(1) NOT NULL,
    ApprovalStatus NVARCHAR(50),
    PeerReviewedBy NVARCHAR(100),
    PeerReviewedDate DATETIME2,
    ApprovedBy NVARCHAR(100),
    ApprovedDate DATETIME2,
    ExecutionMode NVARCHAR(50) NOT NULL,
    ScheduleType NVARCHAR(50),
    ScheduleTime NVARCHAR(10),
    ScheduleDays NVARCHAR(100),
    StepsJson NVARCHAR(MAX), -- Contains step definitions
    CONSTRAINT CHK_RunControls_StepsJson_Is_JSON CHECK (ISJSON(StepsJson) > 0)
);

CREATE TABLE ProcessLogs (
    Id NVARCHAR(50) PRIMARY KEY,
    UserId NVARCHAR(50) NOT NULL,
    RunControlId NVARCHAR(50) NOT NULL,
    RunControlName NVARCHAR(100) NOT NULL,
    RunDateTime DATETIME2 NOT NULL,
    RunStatus NVARCHAR(50) NOT NULL,
    LogDetails NVARCHAR(MAX),
    FOREIGN KEY (UserId) REFERENCES Users(Id),
    FOREIGN KEY (RunControlId) REFERENCES RunControls(Id)
);

-- Dynamic UI & Data
CREATE TABLE UIMetadata (
    Id NVARCHAR(50) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(MAX),
    SourceObjectId NVARCHAR(50) NOT NULL,
    LayoutType NVARCHAR(50) NOT NULL,
    EffectiveDate DATETIME2 NOT NULL,
    Status CHAR(1) NOT NULL,
    ApprovalStatus NVARCHAR(50),
    PeerReviewedBy NVARCHAR(100),
    PeerReviewedDate DATETIME2,
    ApprovedBy NVARCHAR(100),
    ApprovedDate DATETIME2,
    FieldsJson NVARCHAR(MAX),
    SectionsJson NVARCHAR(MAX),
    ConfigurationJson NVARCHAR(MAX),
    FOREIGN KEY (SourceObjectId) REFERENCES IntegrationObjects(Id),
    CONSTRAINT CHK_UIMetadata_FieldsJson_Is_JSON CHECK (ISJSON(FieldsJson) > 0),
    CONSTRAINT CHK_UIMetadata_SectionsJson_Is_JSON CHECK (ISJSON(SectionsJson) > 0),
    CONSTRAINT CHK_UIMetadata_ConfigurationJson_Is_JSON CHECK (ISJSON(ConfigurationJson) > 0)
);

CREATE TABLE DynamicDataRecords (
    Id NVARCHAR(50) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(MAX),
    UIMetadataId NVARCHAR(50) NOT NULL,
    DataJson NVARCHAR(MAX) NOT NULL,
    Status CHAR(1) NOT NULL,
    ApprovalStatus NVARCHAR(50),
    PeerReviewedBy NVARCHAR(100),
    PeerReviewedDate DATETIME2,
    ApprovedBy NVARCHAR(100),
    ApprovedDate DATETIME2,
    CreatedBy NVARCHAR(100) NOT NULL,
    CreatedDate DATETIME2 NOT NULL,
    UpdatedBy NVARCHAR(100),
    UpdatedDate DATETIME2,
    Version INT NOT NULL,
    FOREIGN KEY (UIMetadataId) REFERENCES UIMetadata(Id),
    CONSTRAINT CHK_DynamicDataRecords_DataJson_Is_JSON CHECK (ISJSON(DataJson) > 0)
);
