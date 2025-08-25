-- =============================================================================
-- SCHEMAS & EXTENSIONS
-- =============================================================================
CREATE SCHEMA IF NOT EXISTS metadata;
CREATE EXTENSION IF NOT EXISTS pgcrypto;  -- gen_random_uuid()

-- =============================================================================
-- ENUMS (modern PG enums under your schema)
-- =============================================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'connection_status') THEN
    CREATE TYPE metadata.connection_status AS ENUM ('ACTIVE','INACTIVE');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'test_result_status') THEN
    CREATE TYPE metadata.test_result_status AS ENUM ('UNKNOWN','PASS','FAIL');
  END IF;
END$$;

-- =============================================================================
-- TABLE: metadata.connections  (single-table, versioned, domain-scoped)
-- =============================================================================
CREATE TABLE IF NOT EXISTS metadata.connections (
  -- Version row identity
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Stable identity across versions
  connection_key       UUID NOT NULL,

  -- Domain scope
  domain_id            TEXT NOT NULL
                         REFERENCES user_management.domains(id)
                         ON UPDATE CASCADE ON DELETE RESTRICT,

  -- Form fields
  name                 TEXT NOT NULL,
  type_code            TEXT NOT NULL,              -- e.g., POSTGRES, SQLSERVER, ORACLE, REST, FILE, KAFKA, WEBHOOK, SFTP
  description          TEXT,
  parameters           JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- Status (activate/deactivate only; no deletes)
  status               metadata.connection_status NOT NULL DEFAULT 'ACTIVE',

  -- Versioning
  version_no           INTEGER NOT NULL,           -- 1..N per connection_key
  is_current           BOOLEAN NOT NULL DEFAULT TRUE,

  -- Test connection
  last_tested_date     TIMESTAMPTZ,
  last_test_status     metadata.test_result_status NOT NULL DEFAULT 'UNKNOWN',
  last_test_error      TEXT,

  -- Audit
  created_by           TEXT NOT NULL,
  created_date         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_modified_by     TEXT,
  last_modified_date   TIMESTAMPTZ
);

-- =============================================================================
-- INDEXES & CONSTRAINTS
-- =============================================================================
-- Exactly one current row per logical connection
CREATE UNIQUE INDEX IF NOT EXISTS ux_connections_current_one
  ON metadata.connections (connection_key)
  WHERE is_current = TRUE;

-- Human-friendly unique name within (domain_id, type_code) for current rows
CREATE UNIQUE INDEX IF NOT EXISTS ux_connections_domain_type_name_current
  ON metadata.connections (domain_id, type_code, lower(name))
  WHERE is_current = TRUE;

-- JSONB index for parameters
CREATE INDEX IF NOT EXISTS ix_connections_parameters_gin
  ON metadata.connections USING GIN (parameters);

-- Helpful filter
CREATE INDEX IF NOT EXISTS ix_connections_domain_current
  ON metadata.connections (domain_id)
  WHERE is_current = TRUE;

-- =============================================================================
-- NO DELETES (trigger)
-- =============================================================================
CREATE OR REPLACE FUNCTION metadata.fn_connections_nodelete()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'Deletes are not allowed on metadata.connections';
END$$;

DROP TRIGGER IF EXISTS trg_connections_nodelete ON metadata.connections;
CREATE TRIGGER trg_connections_nodelete
BEFORE DELETE ON metadata.connections
FOR EACH ROW EXECUTE FUNCTION metadata.fn_connections_nodelete();

-- =============================================================================
-- HELPER: create a new version (new or edit)
--  - NEW: p_connection_key = NULL  -> creates version_no=1 and a fresh key
--  - EDIT: pass existing key       -> increments version, flips old current
-- =============================================================================
CREATE OR REPLACE FUNCTION metadata.create_connection_version(
  p_connection_key     UUID,                            -- NULL for new connection
  p_domain_id          TEXT,
  p_name               TEXT,
  p_type_code          TEXT,
  p_description        TEXT,
  p_parameters         JSONB,
  p_created_by         TEXT,                            -- required non-defaults above
  p_status             metadata.connection_status DEFAULT 'ACTIVE',
  p_last_test_status   metadata.test_result_status DEFAULT 'UNKNOWN',
  p_last_test_error    TEXT DEFAULT NULL,
  p_last_tested_date   TIMESTAMPTZ DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql AS $$
DECLARE
  v_key   UUID;
  v_next  INTEGER;
  v_id    UUID;
BEGIN
  IF p_connection_key IS NULL THEN
    v_key  := gen_random_uuid();
    v_next := 1;
  ELSE
    v_key := p_connection_key;
    SELECT COALESCE(MAX(version_no), 0) + 1
      INTO v_next
      FROM metadata.connections
     WHERE connection_key = v_key;

    UPDATE metadata.connections
       SET is_current = FALSE,
           last_modified_by = p_created_by,
           last_modified_date = NOW()
     WHERE connection_key = v_key
       AND is_current = TRUE;
  END IF;

  INSERT INTO metadata.connections(
    id, connection_key, domain_id, name, type_code, description,
    parameters, status, version_no, is_current,
    last_tested_date, last_test_status, last_test_error,
    created_by, created_date
  )
  VALUES(
    gen_random_uuid(),
    v_key,
    p_domain_id,
    p_name,
    p_type_code,
    p_description,
    COALESCE(p_parameters, '{}'::jsonb),
    COALESCE(p_status, 'ACTIVE'),
    v_next,
    TRUE,
    p_last_tested_date,
    COALESCE(p_last_test_status, 'UNKNOWN'),
    p_last_test_error,
    p_created_by,
    NOW()
  )
  RETURNING id INTO v_id;

  RETURN v_id;
END$$;



-- =============================================================================
-- SAMPLE DATA (one "current" version per connection), using FINANCE domain
-- =============================================================================

-- SQL Server
SELECT metadata.create_connection_version(
  NULL,
  'admin-domain',
  'MSSQL-Core',
  'SQLSERVER',
  'Core SQL Server (OLTP)',
  '{
     "host":"mssql.finance.internal",
     "port":1433,
     "database":"fin_core",
     "user":"svc_fin",
     "auth":"password",
     "secret_ref":"vault://kv/finance/mssql-core"
   }'::jsonb,
  'seed_user',
  'ACTIVE',
  'PASS',
  NULL,
  NOW()
);

-- Oracle
SELECT metadata.create_connection_version(
  NULL,
  'admin-domain',
  'Oracle-ERP',
  'ORACLE',
  'Oracle ERP (CDB/PDB)',
  '{
     "host":"oracle-erp.internal",
     "port":1521,
     "service_name":"ERPPDB1",
     "user":"svc_oracle",
     "auth":"wallet",
     "wallet_ref":"vault://kv/finance/oracle/wallet",
     "connection_type":"SERVICE_NAME"
   }'::jsonb,
  'seed_user',
  'ACTIVE',
  'PASS',
  NULL,
  NOW()
);

-- PostgreSQL
SELECT metadata.create_connection_version(
  NULL,
  'admin-domain',
  'Postgres-ODS',
  'POSTGRES',
  'Operational Data Store (ODS)',
  '{
     "host":"postgres.ods.internal",
     "port":5432,
     "database":"ods_fin",
     "user":"svc_ods",
     "sslmode":"require",
     "auth":"password",
     "secret_ref":"vault://kv/finance/postgres-ods"
   }'::jsonb,
  'seed_user',
  'ACTIVE',
  'PASS',
  NULL,
  NOW()
);

-- REST API
SELECT metadata.create_connection_version(
  NULL,
  'admin-domain',
  'Payments-API',
  'REST',
  'External Payments REST API',
  '{
     "base_url":"https://api.payments.example.com/v1",
     "auth_type":"oauth2_client_credentials",
     "token_url":"https://auth.example.com/oauth2/token",
     "client_id_ref":"vault://kv/finance/payments/client_id",
     "client_secret_ref":"vault://kv/finance/payments/client_secret",
     "default_headers":{"accept":"application/json"},
     "timeout_ms":20000,
     "retry":{"max_attempts":3,"backoff_ms":500}
   }'::jsonb,
  'seed_user',
  'ACTIVE',
  'UNKNOWN',
  NULL,
  NULL
);

-- File (local/NFS/S3-compatible path descriptor)
SELECT metadata.create_connection_version(
  NULL,
  'admin-domain',
  'File-Share-Inbound',
  'FILE',
  'Inbound share for daily settlements',
  '{
     "protocol":"NFS",
     "base_path":"/mnt/fin/inbound/settlements",
     "file_pattern":"*.csv",
     "archive_path":"/mnt/fin/archive/settlements",
     "post_process":{"move_to_archive":true,"fail_on_missing":true}
   }'::jsonb,
  'seed_user',
  'ACTIVE',
  'UNKNOWN',
  NULL,
  NULL
);

-- Kafka
SELECT metadata.create_connection_version(
  NULL,
  'admin-domain',
  'Kafka-Cluster-A',
  'KAFKA',
  'Primary Kafka cluster (prod)',
  '{
     "bootstrap_servers":"kafka-a1:9093,kafka-a2:9093,kafka-a3:9093",
     "security_protocol":"SASL_SSL",
     "sasl_mechanism":"PLAIN",
     "username_ref":"vault://kv/finance/kafka/user",
     "password_ref":"vault://kv/finance/kafka/password",
     "ssl_truststore_ref":"vault://kv/common/truststore",
     "producer_defaults":{"acks":"all","linger_ms":5},
     "consumer_defaults":{"group_id_prefix":"genesis-","auto_offset_reset":"earliest"}
   }'::jsonb,
  'seed_user',
  'ACTIVE',
  'UNKNOWN',
  NULL,
  NULL
);

-- Webhook (webservice/hook)
SELECT metadata.create_connection_version(
  NULL,
  'admin-domain',
  'Treasury-Webhook',
  'WEBHOOK',
  'Internal webhook for Treasury events',
  '{
     "url":"https://treasury.internal/hooks/events",
     "method":"POST",
     "auth_type":"hmac",
     "hmac_key_ref":"vault://kv/finance/treasury/hmac",
     "headers":{"content-type":"application/json"},
     "retry":{"max_attempts":5,"backoff_ms":1000}
   }'::jsonb,
  'seed_user',
  'ACTIVE',
  'UNKNOWN',
  NULL,
  NULL
);

-- SFTP
SELECT metadata.create_connection_version(
  NULL,
  'admin-domain',
  'Bank-SFTP',
  'SFTP',
  'Bank SFTP for statement downloads',
  '{
     "host":"sftp.bank.com",
     "port":22,
     "username":"fin_svc",
     "auth_method":"key",
     "private_key_ref":"vault://kv/finance/sftp/private_key",
     "known_hosts_ref":"vault://kv/common/known_hosts",
     "remote_path":"/outbound/statements",
     "compression":true
   }'::jsonb,
  'seed_user',
  'ACTIVE',
  'PASS',
  NULL,
  NOW()
);
