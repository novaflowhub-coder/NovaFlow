-- Create metadata schema
CREATE SCHEMA IF NOT EXISTS metadata;

-- Set search path to use the schema
SET search_path TO metadata, user_management, public;

-- Connections
CREATE TABLE connections (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- Database Server, API Gateway, File System, etc.
    description TEXT,
    domain_id TEXT NOT NULL,
    host TEXT,
    port INTEGER,
    database TEXT,
    username TEXT,
    base_url TEXT,
    connection_parameters JSONB,
    status CHAR(1) NOT NULL DEFAULT 'A', -- A: Active, I: Inactive
    version INTEGER NOT NULL DEFAULT 1,
    created_by TEXT NOT NULL,
    created_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_modified_by TEXT,
    last_modified_date TIMESTAMPTZ,
    FOREIGN KEY (domain_id) REFERENCES user_management.domains(id)
);

-- Core Engine Objects
CREATE TABLE integration_objects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- Table, View, API, File, Queue
    description TEXT,
    domain_id TEXT NOT NULL,
    connection_id TEXT,
    status CHAR(1) NOT NULL DEFAULT 'A', -- A: Active, I: Inactive
    version INTEGER NOT NULL DEFAULT 1,
    created_by TEXT NOT NULL,
    created_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_modified_by TEXT,
    last_modified_date TIMESTAMPTZ,
    FOREIGN KEY (domain_id) REFERENCES user_management.domains(id),
    FOREIGN KEY (connection_id) REFERENCES connections(id)
);

CREATE TABLE object_schema_attributes (
    id TEXT PRIMARY KEY,
    integration_object_id TEXT NOT NULL,
    attribute_name TEXT NOT NULL,
    data_type TEXT NOT NULL,
    is_nullable BOOLEAN NOT NULL,
    source_field TEXT,
    sample_value TEXT,
    FOREIGN KEY (integration_object_id) REFERENCES integration_objects(id) ON DELETE CASCADE
);

CREATE TABLE rules (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    rule_type TEXT NOT NULL, -- Validation, Business, Transformation
    domain_id TEXT NOT NULL,
    source_object_id TEXT NOT NULL,
    target_object_id TEXT,
    expression TEXT,
    priority INTEGER DEFAULT 1,
    effective_date TIMESTAMPTZ NOT NULL,
    status CHAR(1) NOT NULL DEFAULT 'I', -- A: Active, I: Inactive
    version INTEGER NOT NULL DEFAULT 1,
    conditions JSONB, -- Array of rule conditions
    actions JSONB, -- Array of rule actions
    created_by TEXT NOT NULL,
    created_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_modified_by TEXT,
    last_modified_date TIMESTAMPTZ,
    FOREIGN KEY (domain_id) REFERENCES user_management.domains(id),
    FOREIGN KEY (source_object_id) REFERENCES integration_objects(id),
    FOREIGN KEY (target_object_id) REFERENCES integration_objects(id)
);

CREATE TABLE rule_sets (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    domain_id TEXT NOT NULL,
    execution_order TEXT NOT NULL DEFAULT 'Sequential', -- Sequential, Parallel
    effective_date TIMESTAMPTZ NOT NULL,
    status CHAR(1) NOT NULL DEFAULT 'I',
    version INTEGER NOT NULL DEFAULT 1,
    rules JSONB, -- Array of {ruleId, order, isActive}
    created_by TEXT NOT NULL,
    created_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_modified_by TEXT,
    last_modified_date TIMESTAMPTZ,
    FOREIGN KEY (domain_id) REFERENCES user_management.domains(id)
);

CREATE TABLE scaffolds (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL, -- Scaffold_In, Scaffold_Out
    domain_id TEXT NOT NULL,
    source_object_name TEXT,
    target_object_name TEXT,
    source_object_id TEXT,
    target_object_id TEXT,
    effective_date TIMESTAMPTZ NOT NULL,
    status CHAR(1) NOT NULL DEFAULT 'I',
    version INTEGER NOT NULL DEFAULT 1,
    columns JSONB, -- Array of scaffold columns with transformations
    aggregations JSONB, -- Array of aggregation rules
    filters JSONB, -- Array of filter conditions
    ordering JSONB, -- Array of order rules
    connection_string TEXT,
    configuration JSONB,
    created_by TEXT NOT NULL,
    created_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_modified_by TEXT,
    last_modified_date TIMESTAMPTZ,
    FOREIGN KEY (domain_id) REFERENCES user_management.domains(id),
    FOREIGN KEY (source_object_id) REFERENCES integration_objects(id),
    FOREIGN KEY (target_object_id) REFERENCES integration_objects(id)
);

-- Holiday Calendars
CREATE TABLE holiday_calendars (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    domain_id TEXT NOT NULL,
    country TEXT NOT NULL,
    holidays JSONB, -- Array of {date, name}
    status CHAR(1) NOT NULL DEFAULT 'A',
    created_by TEXT NOT NULL,
    created_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_modified_by TEXT,
    last_modified_date TIMESTAMPTZ,
    FOREIGN KEY (domain_id) REFERENCES user_management.domains(id)
);

CREATE TABLE run_controls (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    domain_id TEXT NOT NULL,
    trigger_type TEXT NOT NULL, -- OnDemand, Scheduled, RealtimeStream, FileWatch, DatabaseChange
    schedule_expression TEXT,
    holiday_calendar_id TEXT,
    effective_date TIMESTAMPTZ NOT NULL,
    status CHAR(1) NOT NULL DEFAULT 'I',
    version INTEGER NOT NULL DEFAULT 1,
    steps JSONB, -- Array of run control steps
    created_by TEXT NOT NULL,
    created_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_modified_by TEXT,
    last_modified_date TIMESTAMPTZ,
    FOREIGN KEY (domain_id) REFERENCES user_management.domains(id),
    FOREIGN KEY (holiday_calendar_id) REFERENCES holiday_calendars(id)
);

CREATE TABLE process_logs (
    id TEXT PRIMARY KEY,
    run_control_id TEXT NOT NULL,
    execution_id TEXT NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    status TEXT NOT NULL, -- Running, Completed, Failed
    total_records INTEGER DEFAULT 0,
    success_records INTEGER DEFAULT 0,
    error_records INTEGER DEFAULT 0,
    logs JSONB, -- Array of {timestamp, level, message, component}
    triggered_by TEXT NOT NULL,
    created_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (run_control_id) REFERENCES run_controls(id)
);

-- Dynamic UI & Data
CREATE TABLE ui_metadata (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    domain_id TEXT NOT NULL,
    source_object_id TEXT NOT NULL,
    layout_type TEXT NOT NULL, -- form, table, card, wizard
    effective_date TIMESTAMPTZ NOT NULL,
    status CHAR(1) NOT NULL DEFAULT 'I',
    approval_status TEXT NOT NULL DEFAULT 'Draft',
    version INTEGER NOT NULL DEFAULT 1,
    fields JSONB, -- Array of UI field definitions
    sections JSONB, -- Array of UI section definitions
    configuration JSONB, -- {allowCreate, allowEdit, allowDelete, pageSize, enableSearch, etc.}
    created_by TEXT NOT NULL,
    created_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    peer_reviewed_by TEXT,
    peer_reviewed_date TIMESTAMPTZ,
    approved_by TEXT,
    approved_date TIMESTAMPTZ,
    last_modified_by TEXT,
    last_modified_date TIMESTAMPTZ,
    FOREIGN KEY (domain_id) REFERENCES user_management.domains(id),
    FOREIGN KEY (source_object_id) REFERENCES integration_objects(id)
);

CREATE TABLE dynamic_data_records (
    id TEXT PRIMARY KEY,
    ui_metadata_id TEXT NOT NULL,
    data JSONB NOT NULL, -- Dynamic field data
    status CHAR(1) NOT NULL DEFAULT 'A',
    approval_status TEXT NOT NULL DEFAULT 'Draft',
    created_by TEXT NOT NULL,
    created_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    peer_reviewed_by TEXT,
    peer_reviewed_date TIMESTAMPTZ,
    approved_by TEXT,
    approved_date TIMESTAMPTZ,
    last_modified_by TEXT,
    last_modified_date TIMESTAMPTZ,
    FOREIGN KEY (ui_metadata_id) REFERENCES ui_metadata(id)
);

-- Version History
CREATE TABLE version_history (
    id TEXT PRIMARY KEY,
    entity_id TEXT NOT NULL,
    entity_type TEXT NOT NULL, -- Connection, Object, Rule, Rule Set, Run Control, UI Metadata
    entity_name TEXT NOT NULL,
    version INTEGER NOT NULL,
    change_type TEXT NOT NULL, -- Create, Update, Delete
    changed_by TEXT NOT NULL,
    changed_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    change_description TEXT,
    previous_state JSONB,
    new_state JSONB
);

-- Approvals tracking
CREATE TABLE approvals (
    id TEXT PRIMARY KEY,
    entity_id TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_name TEXT NOT NULL,
    requested_by TEXT NOT NULL,
    requested_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    approval_type TEXT NOT NULL, -- Peer Review, Final Approval
    status TEXT NOT NULL DEFAULT 'Pending', -- Pending, Approved, Rejected
    approved_by TEXT,
    approved_date TIMESTAMPTZ,
    rejection_reason TEXT,
    comments TEXT
);


-- Add Holiday table (holiday_calendars already exists above)
CREATE TABLE holidays (
    id TEXT PRIMARY KEY,
    calendar_id TEXT NOT NULL,
    date DATE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    recurring BOOLEAN NOT NULL DEFAULT FALSE,
    created_by TEXT NOT NULL,
    created_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_modified_by TEXT,
    last_modified_date TIMESTAMPTZ,
    FOREIGN KEY (calendar_id) REFERENCES holiday_calendars(id) ON DELETE CASCADE
);

-- Update Run Control table to include execution mode (trigger_type already exists in table definition)
ALTER TABLE run_controls ADD COLUMN execution_mode TEXT NOT NULL DEFAULT 'Sequential';

-- Add tables for different trigger configurations
CREATE TABLE run_control_schedules (
    run_control_id TEXT PRIMARY KEY,
    cron_expression TEXT NOT NULL,
    timezone TEXT NOT NULL DEFAULT 'UTC',
    holiday_calendar_id TEXT,
    skip_on_holiday BOOLEAN NOT NULL DEFAULT FALSE,
    run_on_next_business_day BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (run_control_id) REFERENCES run_controls(id) ON DELETE CASCADE,
    FOREIGN KEY (holiday_calendar_id) REFERENCES holiday_calendars(id)
);

CREATE TABLE run_control_streams (
    run_control_id TEXT PRIMARY KEY,
    source_id TEXT NOT NULL,
    topic TEXT NOT NULL,
    parameters JSONB,
    FOREIGN KEY (run_control_id) REFERENCES run_controls(id) ON DELETE CASCADE
);

CREATE TABLE run_control_file_watches (
    run_control_id TEXT PRIMARY KEY,
    directory TEXT NOT NULL,
    file_pattern TEXT NOT NULL,
    event_type TEXT NOT NULL DEFAULT 'All',
    FOREIGN KEY (run_control_id) REFERENCES run_controls(id) ON DELETE CASCADE
);

