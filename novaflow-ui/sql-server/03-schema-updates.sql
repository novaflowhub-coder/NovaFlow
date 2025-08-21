-- Add Holiday Calendar tables
CREATE TABLE holiday_calendar (
    id NVARCHAR(36) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    description NVARCHAR(500),
    status NVARCHAR(20) NOT NULL DEFAULT 'Active',
    created_by NVARCHAR(100) NOT NULL,
    created_date DATETIME NOT NULL DEFAULT GETDATE(),
    modified_by NVARCHAR(100),
    modified_date DATETIME
);

CREATE TABLE holiday (
    id NVARCHAR(36) PRIMARY KEY,
    calendar_id NVARCHAR(36) NOT NULL,
    date DATE NOT NULL,
    name NVARCHAR(100) NOT NULL,
    description NVARCHAR(500),
    recurring BIT NOT NULL DEFAULT 0,
    created_by NVARCHAR(100) NOT NULL,
    created_date DATETIME NOT NULL DEFAULT GETDATE(),
    modified_by NVARCHAR(100),
    modified_date DATETIME,
    FOREIGN KEY (calendar_id) REFERENCES holiday_calendar(id) ON DELETE CASCADE
);

-- Update Run Control table to include new trigger types and configurations
ALTER TABLE run_control ADD trigger_type NVARCHAR(50) NOT NULL DEFAULT 'OnDemand';
ALTER TABLE run_control ADD execution_mode NVARCHAR(50) NOT NULL DEFAULT 'Sequential';

-- Add tables for different trigger configurations
CREATE TABLE run_control_schedule (
    run_control_id NVARCHAR(36) PRIMARY KEY,
    cron_expression NVARCHAR(100) NOT NULL,
    timezone NVARCHAR(50) NOT NULL DEFAULT 'UTC',
    holiday_calendar_id NVARCHAR(36),
    skip_on_holiday BIT NOT NULL DEFAULT 0,
    run_on_next_business_day BIT NOT NULL DEFAULT 0,
    FOREIGN KEY (run_control_id) REFERENCES run_control(id) ON DELETE CASCADE,
    FOREIGN KEY (holiday_calendar_id) REFERENCES holiday_calendar(id)
);

CREATE TABLE run_control_stream (
    run_control_id NVARCHAR(36) PRIMARY KEY,
    source_id NVARCHAR(36) NOT NULL,
    topic NVARCHAR(100) NOT NULL,
    parameters NVARCHAR(MAX),
    FOREIGN KEY (run_control_id) REFERENCES run_control(id) ON DELETE CASCADE
);

CREATE TABLE run_control_file_watch (
    run_control_id NVARCHAR(36) PRIMARY KEY,
    directory NVARCHAR(500) NOT NULL,
    file_pattern NVARCHAR(100) NOT NULL,
    event_type NVARCHAR(20) NOT NULL DEFAULT 'All',
    FOREIGN KEY (run_control_id) REFERENCES run_control(id) ON DELETE CASCADE
);
