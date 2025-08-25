// Connection type parameter schemas for form validation and hints
export interface ParameterSchema {
  [key: string]: {
    type: 'string' | 'number' | 'boolean' | 'object' | 'array';
    required?: boolean;
    description?: string;
    placeholder?: string;
    options?: string[];
  };
}

export const CONNECTION_TYPE_SCHEMAS: Record<string, ParameterSchema> = {
  POSTGRES: {
    host: {
      type: 'string',
      required: true,
      description: 'Database server hostname or IP address',
      placeholder: 'localhost'
    },
    port: {
      type: 'number',
      required: true,
      description: 'Database server port',
      placeholder: '5432'
    },
    database: {
      type: 'string',
      required: true,
      description: 'Database name',
      placeholder: 'mydb'
    },
    user: {
      type: 'string',
      required: true,
      description: 'Database username',
      placeholder: 'postgres'
    },
    password: {
      type: 'string',
      required: true,
      description: 'Database password or secret reference',
      placeholder: '${SECRET_REF:db_password}'
    },
    ssl: {
      type: 'boolean',
      required: false,
      description: 'Enable SSL connection'
    }
  },
  SQLSERVER: {
    host: {
      type: 'string',
      required: true,
      description: 'SQL Server hostname or IP address',
      placeholder: 'localhost'
    },
    port: {
      type: 'number',
      required: true,
      description: 'SQL Server port',
      placeholder: '1433'
    },
    database: {
      type: 'string',
      required: true,
      description: 'Database name',
      placeholder: 'master'
    },
    user: {
      type: 'string',
      required: true,
      description: 'SQL Server username',
      placeholder: 'sa'
    },
    password: {
      type: 'string',
      required: true,
      description: 'SQL Server password or secret reference',
      placeholder: '${SECRET_REF:sql_password}'
    },
    encrypt: {
      type: 'boolean',
      required: false,
      description: 'Enable connection encryption'
    }
  },
  ORACLE: {
    host: {
      type: 'string',
      required: true,
      description: 'Oracle server hostname or IP address',
      placeholder: 'localhost'
    },
    port: {
      type: 'number',
      required: true,
      description: 'Oracle listener port',
      placeholder: '1521'
    },
    service_name: {
      type: 'string',
      required: true,
      description: 'Oracle service name or SID',
      placeholder: 'ORCL'
    },
    user: {
      type: 'string',
      required: true,
      description: 'Oracle username',
      placeholder: 'system'
    },
    password: {
      type: 'string',
      required: true,
      description: 'Oracle password or secret reference',
      placeholder: '${SECRET_REF:oracle_password}'
    },
    wallet_ref: {
      type: 'string',
      required: false,
      description: 'Oracle wallet reference for secure connections',
      placeholder: '${WALLET_REF:oracle_wallet}'
    }
  },
  REST: {
    base_url: {
      type: 'string',
      required: true,
      description: 'Base URL for REST API',
      placeholder: 'https://api.example.com'
    },
    auth_type: {
      type: 'string',
      required: false,
      description: 'Authentication type',
      options: ['none', 'basic', 'bearer', 'oauth2', 'api_key']
    },
    token_url: {
      type: 'string',
      required: false,
      description: 'OAuth2 token endpoint URL',
      placeholder: 'https://auth.example.com/oauth/token'
    },
    client_id_ref: {
      type: 'string',
      required: false,
      description: 'OAuth2 client ID reference',
      placeholder: '${SECRET_REF:oauth_client_id}'
    },
    client_secret_ref: {
      type: 'string',
      required: false,
      description: 'OAuth2 client secret reference',
      placeholder: '${SECRET_REF:oauth_client_secret}'
    },
    headers: {
      type: 'object',
      required: false,
      description: 'Default headers to include in requests'
    },
    timeout_ms: {
      type: 'number',
      required: false,
      description: 'Request timeout in milliseconds',
      placeholder: '30000'
    },
    retry: {
      type: 'number',
      required: false,
      description: 'Number of retry attempts',
      placeholder: '3'
    }
  },
  WEBHOOK: {
    url: {
      type: 'string',
      required: true,
      description: 'Webhook endpoint URL',
      placeholder: 'https://webhook.example.com/notify'
    },
    method: {
      type: 'string',
      required: false,
      description: 'HTTP method',
      options: ['POST', 'PUT', 'PATCH']
    },
    auth_type: {
      type: 'string',
      required: false,
      description: 'Authentication type',
      options: ['none', 'basic', 'bearer', 'api_key']
    },
    headers: {
      type: 'object',
      required: false,
      description: 'Headers to include in webhook requests'
    },
    timeout_ms: {
      type: 'number',
      required: false,
      description: 'Request timeout in milliseconds',
      placeholder: '10000'
    }
  },
  FILE: {
    protocol: {
      type: 'string',
      required: true,
      description: 'File access protocol',
      options: ['local', 'ftp', 'sftp', 's3', 'azure_blob', 'gcs']
    },
    base_path: {
      type: 'string',
      required: true,
      description: 'Base directory or bucket path',
      placeholder: '/data/files'
    },
    file_pattern: {
      type: 'string',
      required: false,
      description: 'File name pattern or regex',
      placeholder: '*.csv'
    },
    archive_path: {
      type: 'string',
      required: false,
      description: 'Path to move processed files',
      placeholder: '/data/archive'
    },
    post_process: {
      type: 'string',
      required: false,
      description: 'Post-processing action',
      options: ['none', 'delete', 'archive', 'rename']
    }
  },
  KAFKA: {
    bootstrap_servers: {
      type: 'string',
      required: true,
      description: 'Kafka bootstrap servers',
      placeholder: 'localhost:9092'
    },
    security_protocol: {
      type: 'string',
      required: false,
      description: 'Security protocol',
      options: ['PLAINTEXT', 'SSL', 'SASL_PLAINTEXT', 'SASL_SSL']
    },
    sasl_mechanism: {
      type: 'string',
      required: false,
      description: 'SASL mechanism',
      options: ['PLAIN', 'SCRAM-SHA-256', 'SCRAM-SHA-512']
    },
    username_ref: {
      type: 'string',
      required: false,
      description: 'SASL username reference',
      placeholder: '${SECRET_REF:kafka_username}'
    },
    password_ref: {
      type: 'string',
      required: false,
      description: 'SASL password reference',
      placeholder: '${SECRET_REF:kafka_password}'
    },
    producer_defaults: {
      type: 'object',
      required: false,
      description: 'Default producer configuration'
    },
    consumer_defaults: {
      type: 'object',
      required: false,
      description: 'Default consumer configuration'
    }
  },
  SFTP: {
    host: {
      type: 'string',
      required: true,
      description: 'SFTP server hostname or IP address',
      placeholder: 'sftp.example.com'
    },
    port: {
      type: 'number',
      required: true,
      description: 'SFTP server port',
      placeholder: '22'
    },
    username: {
      type: 'string',
      required: true,
      description: 'SFTP username',
      placeholder: 'user'
    },
    auth_method: {
      type: 'string',
      required: true,
      description: 'Authentication method',
      options: ['password', 'private_key']
    },
    private_key_ref: {
      type: 'string',
      required: false,
      description: 'Private key reference for key-based auth',
      placeholder: '${SECRET_REF:sftp_private_key}'
    },
    password_ref: {
      type: 'string',
      required: false,
      description: 'Password reference for password-based auth',
      placeholder: '${SECRET_REF:sftp_password}'
    },
    remote_path: {
      type: 'string',
      required: true,
      description: 'Remote directory path',
      placeholder: '/upload'
    }
  }
};

export const CONNECTION_TYPES = Object.keys(CONNECTION_TYPE_SCHEMAS);

export function getParameterSchema(typeCode: string): ParameterSchema {
  return CONNECTION_TYPE_SCHEMAS[typeCode] || {};
}

export function validateParameters(typeCode: string, parameters: Record<string, any>): string[] {
  const schema = getParameterSchema(typeCode);
  const errors: string[] = [];

  for (const [key, config] of Object.entries(schema)) {
    if (config.required && (!parameters[key] || parameters[key] === '')) {
      errors.push(`${key} is required for ${typeCode} connections`);
    }
  }

  return errors;
}
