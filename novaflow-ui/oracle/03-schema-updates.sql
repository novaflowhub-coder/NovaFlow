-- Add Holiday Calendar tables
CREATE TABLE holiday_calendar (
    id VARCHAR2(36) PRIMARY KEY,
    name VARCHAR2(100) NOT NULL,
    description VARCHAR2(500),
    status VARCHAR2(20) DEFAULT 'Active' NOT NULL,
    created_by VARCHAR2(100) NOT NULL,
    created_date TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
    modified_by VARCHAR2(100),
    modified_date TIMESTAMP
);

CREATE TABLE holiday (
    id VARCHAR2(36) PRIMARY KEY,
    calendar_id VARCHAR2(36) NOT NULL,
    date_value DATE NOT NULL,
    name VARCHAR2(100) NOT NULL,
    description VARCHAR2(500),
    recurring NUMBER(1) DEFAULT 0 NOT NULL,
    created_by VARCHAR2(100) NOT NULL,
    created_date TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
    modified_by VARCHAR2(100),
    modified_date TIMESTAMP,
    CONSTRAINT fk_holiday_calendar FOREIGN KEY (calendar_id) REFERENCES holiday_calendar(id) ON DELETE CASCADE
);

-- Update Run Control table to include new trigger types and configurations
ALTER TABLE run_control ADD (
    trigger_type VARCHAR2(50) DEFAULT 'OnDemand' NOT NULL,
    execution_mode VARCHAR2(50) DEFAULT 'Sequential' NOT NULL
);

-- Add tables for different trigger configurations
CREATE TABLE run_control_schedule (
    run_control_id VARCHAR2(36) PRIMARY KEY,
    cron_expression VARCHAR2(100) NOT NULL,
    timezone VARCHAR2(50) DEFAULT 'UTC' NOT NULL,
    holiday_calendar_id VARCHAR2(36),
    skip_on_holiday NUMBER(1) DEFAULT 0 NOT NULL,
    run_on_next_business_day NUMBER(1) DEFAULT 0 NOT NULL,
    CONSTRAINT fk_rcs_run_control FOREIGN KEY (run_control_id) REFERENCES run_control(id) ON DELETE CASCADE,
    CONSTRAINT fk_rcs_holiday_calendar FOREIGN KEY (holiday_calendar_id) REFERENCES holiday_calendar(id)
);

CREATE TABLE run_control_stream (
    run_control_id VARCHAR2(36) PRIMARY KEY,
    source_id VARCHAR2(36) NOT NULL,
    topic VARCHAR2(100) NOT NULL,
    parameters CLOB,
    CONSTRAINT fk_rcst_run_control FOREIGN KEY (run_control_id) REFERENCES run_control(id) ON DELETE CASCADE
);

CREATE TABLE run_control_file_watch (
    run_control_id VARCHAR2(36) PRIMARY KEY,
    directory VARCHAR2(500) NOT NULL,
    file_pattern VARCHAR2(100) NOT NULL,
    event_type VARCHAR2(20) DEFAULT 'All' NOT NULL,
    CONSTRAINT fk_rcfw_run_control FOREIGN KEY (run_control_id) REFERENCES run_control(id) ON DELETE CASCADE
);
