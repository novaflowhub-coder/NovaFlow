-- Add Holiday Calendar tables
CREATE TABLE holiday_calendar (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    status VARCHAR(20) NOT NULL DEFAULT 'Active',
    created_by VARCHAR(100) NOT NULL,
    created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by VARCHAR(100),
    modified_date TIMESTAMP
);

CREATE TABLE holiday (
    id VARCHAR(36) PRIMARY KEY,
    calendar_id VARCHAR(36) NOT NULL,
    date DATE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    recurring BOOLEAN NOT NULL DEFAULT FALSE,
    created_by VARCHAR(100) NOT NULL,
    created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by VARCHAR(100),
    modified_date TIMESTAMP,
    FOREIGN KEY (calendar_id) REFERENCES holiday_calendar(id) ON DELETE CASCADE
);

-- Update Run Control table to include new trigger types and configurations
ALTER TABLE run_control ADD COLUMN trigger_type VARCHAR(50) NOT NULL DEFAULT 'OnDemand';
ALTER TABLE run_control ADD COLUMN execution_mode VARCHAR(50) NOT NULL DEFAULT 'Sequential';

-- Add tables for different trigger configurations
CREATE TABLE run_control_schedule (
    run_control_id VARCHAR(36) PRIMARY KEY,
    cron_expression VARCHAR(100) NOT NULL,
    timezone VARCHAR(50) NOT NULL DEFAULT 'UTC',
    holiday_calendar_id VARCHAR(36),
    skip_on_holiday BOOLEAN NOT NULL DEFAULT FALSE,
    run_on_next_business_day BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (run_control_id) REFERENCES run_control(id) ON DELETE CASCADE,
    FOREIGN KEY (holiday_calendar_id) REFERENCES holiday_calendar(id)
);

CREATE TABLE run_control_stream (
    run_control_id VARCHAR(36) PRIMARY KEY,
    source_id VARCHAR(36) NOT NULL,
    topic VARCHAR(100) NOT NULL,
    parameters JSONB,
    FOREIGN KEY (run_control_id) REFERENCES run_control(id) ON DELETE CASCADE
);

CREATE TABLE run_control_file_watch (
    run_control_id VARCHAR(36) PRIMARY KEY,
    directory VARCHAR(500) NOT NULL,
    file_pattern VARCHAR(100) NOT NULL,
    event_type VARCHAR(20) NOT NULL DEFAULT 'All',
    FOREIGN KEY (run_control_id) REFERENCES run_control(id) ON DELETE CASCADE
);
