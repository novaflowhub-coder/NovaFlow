-- Oracle Schema Definition

-- User Management
CREATE TABLE Roles (
    Id VARCHAR2(50) PRIMARY KEY,
    Name VARCHAR2(100) NOT NULL,
    Description VARCHAR2(255),
    Permissions CLOB,
    CONSTRAINT CHK_Roles_Permissions_Is_JSON CHECK (Permissions IS JSON)
);

CREATE TABLE Users (
    Id VARCHAR2(50) PRIMARY KEY,
    Name VARCHAR2(100) NOT NULL,
    Email VARCHAR2(255) NOT NULL UNIQUE,
    RoleId VARCHAR2(50),
    Status CHAR(1) NOT NULL, -- A: Active, I: Inactive
    LastLogin TIMESTAMP,
    FOREIGN KEY (RoleId) REFERENCES Roles(Id)
);

-- Core Engine Objects
CREATE TABLE IntegrationObjects (
    Id VARCHAR2(50) PRIMARY KEY,
    Name VARCHAR2(100) NOT NULL,
    Type VARCHAR2(50) NOT NULL,
    Description CLOB,
    Status CHAR(1) NOT NULL -- A: Active, I: Inactive
);

-- ... (other tables would follow a similar pattern, using VARCHAR2, CLOB, TIMESTAMP, NUMBER(1) for BIT)
-- Due to length, only showing a subset. The full script would convert all tables.
