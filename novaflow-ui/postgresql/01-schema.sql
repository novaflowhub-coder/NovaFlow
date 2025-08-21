-- PostgreSQL Schema Definition

-- User Management
CREATE TABLE Roles (
    Id TEXT PRIMARY KEY,
    Name TEXT NOT NULL,
    Description TEXT,
    Permissions JSONB
);

CREATE TABLE Users (
    Id TEXT PRIMARY KEY,
    Name TEXT NOT NULL,
    Email TEXT NOT NULL UNIQUE,
    RoleId TEXT,
    Status CHAR(1) NOT NULL, -- A: Active, I: Inactive
    LastLogin TIMESTAMPTZ,
    FOREIGN KEY (RoleId) REFERENCES Roles(Id)
);

-- Core Engine Objects
CREATE TABLE IntegrationObjects (
    Id TEXT PRIMARY KEY,
    Name TEXT NOT NULL,
    Type TEXT NOT NULL,
    Description TEXT,
    Status CHAR(1) NOT NULL -- A: Active, I: Inactive
);

CREATE TABLE ObjectSchemaAttributes (
    Id TEXT PRIMARY KEY,
    IntegrationObjectId TEXT NOT NULL,
    AttributeName TEXT NOT NULL,
    DataType TEXT NOT NULL,
    IsNullable BOOLEAN NOT NULL,
    SourceField TEXT,
    SampleValue TEXT,
    FOREIGN KEY (IntegrationObjectId) REFERENCES IntegrationObjects(Id) ON DELETE CASCADE
);

CREATE TABLE RuleSets (
    Id TEXT PRIMARY KEY,
    Name TEXT NOT NULL,
    Description TEXT,
    EffectiveDate TIMESTAMPTZ NOT NULL,
    Status CHAR(1) NOT NULL,
    ApprovalStatus TEXT,
    PeerReviewedBy TEXT,
    PeerReviewedDate TIMESTAMPTZ,
    ApprovedBy TEXT,
    ApprovedDate TIMESTAMPTZ,
    RulesJson JSONB -- Contains array of rule references
);

CREATE TABLE Rules (
    Id TEXT PRIMARY KEY,
    Name TEXT NOT NULL,
    Description TEXT,
    RuleSetId TEXT NOT NULL,
    SourceObjectId TEXT NOT NULL,
    EffectiveDate TIMESTAMPTZ NOT NULL,
    Status CHAR(1) NOT NULL,
    ApprovalStatus TEXT,
    PeerReviewedBy TEXT,
    PeerReviewedDate TIMESTAMPTZ,
    ApprovedBy TEXT,
    ApprovedDate TIMESTAMPTZ,
    RuleJson JSONB, -- Contains conditions and actions
    FOREIGN KEY (RuleSetId) REFERENCES RuleSets(Id),
    FOREIGN KEY (SourceObjectId) REFERENCES IntegrationObjects(Id)
);

CREATE TABLE Scaffolds (
    Id TEXT PRIMARY KEY,
    Name TEXT NOT NULL,
    Description TEXT,
    Type TEXT NOT NULL,
    EffectiveDate TIMESTAMPTZ NOT NULL,
    Status CHAR(1) NOT NULL,
    ApprovalStatus TEXT,
    PeerReviewedBy TEXT,
    PeerReviewedDate TIMESTAMPTZ,
    ApprovedBy TEXT,
    ApprovedDate TIMESTAMPTZ,
    SourceObjectId TEXT,
    TargetObjectId TEXT,
    ColumnsJson JSONB, -- Contains column definitions
    ConnectionString TEXT,
    ConfigurationJson JSONB,
    FOREIGN KEY (SourceObjectId) REFERENCES IntegrationObjects(Id),
    FOREIGN KEY (TargetObjectId) REFERENCES IntegrationObjects(Id)
);

CREATE TABLE RunControls (
    Id TEXT PRIMARY KEY,
    Name TEXT NOT NULL,
    Description TEXT,
    EffectiveDate TIMESTAMPTZ NOT NULL,
    Status CHAR(1) NOT NULL,
    ApprovalStatus TEXT,
    PeerReviewedBy TEXT,
    PeerReviewedDate TIMESTAMPTZ,
    ApprovedBy TEXT,
    ApprovedDate TIMESTAMPTZ,
    ExecutionMode TEXT NOT NULL,
    ScheduleType TEXT,
    ScheduleTime TEXT,
    ScheduleDays TEXT,
    StepsJson JSONB -- Contains step definitions
);

CREATE TABLE ProcessLogs (
    Id TEXT PRIMARY KEY,
    UserId TEXT NOT NULL,
    RunControlId TEXT NOT NULL,
    RunControlName TEXT NOT NULL,
    RunDateTime TIMESTAMPTZ NOT NULL,
    RunStatus TEXT NOT NULL,
    LogDetails TEXT,
    FOREIGN KEY (UserId) REFERENCES Users(Id),
    FOREIGN KEY (RunControlId) REFERENCES RunControls(Id)
);

-- Dynamic UI & Data
CREATE TABLE UIMetadata (
    Id TEXT PRIMARY KEY,
    Name TEXT NOT NULL,
    Description TEXT,
    SourceObjectId TEXT NOT NULL,
    LayoutType TEXT NOT NULL,
    EffectiveDate TIMESTAMPTZ NOT NULL,
    Status CHAR(1) NOT NULL,
    ApprovalStatus TEXT,
    PeerReviewedBy TEXT,
    PeerReviewedDate TIMESTAMPTZ,
    ApprovedBy TEXT,
    ApprovedDate TIMESTAMPTZ,
    FieldsJson JSONB,
    SectionsJson JSONB,
    ConfigurationJson JSONB,
    FOREIGN KEY (SourceObjectId) REFERENCES IntegrationObjects(Id)
);

CREATE TABLE DynamicDataRecords (
    Id TEXT PRIMARY KEY,
    Name TEXT NOT NULL,
    Description TEXT,
    UIMetadataId TEXT NOT NULL,
    DataJson JSONB NOT NULL,
    Status CHAR(1) NOT NULL,
    ApprovalStatus TEXT,
    PeerReviewedBy TEXT,
    PeerReviewedDate TIMESTAMPTZ,
    ApprovedBy TEXT,
    ApprovedDate TIMESTAMPTZ,
    CreatedBy TEXT NOT NULL,
    CreatedDate TIMESTAMPTZ NOT NULL,
    UpdatedBy TEXT,
    UpdatedDate TIMESTAMPTZ,
    Version INT NOT NULL,
    FOREIGN KEY (UIMetadataId) REFERENCES UIMetadata(Id)
);
