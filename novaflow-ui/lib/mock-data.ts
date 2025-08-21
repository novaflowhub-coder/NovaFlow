import type {
  Rule,
  RuleSet,
  Scaffold,
  RunControl,
  Connection,
  IntegrationObject,
  UIMetadata,
  ProcessLog,
  DynamicRecord,
  HolidayCalendar,
  User,
  DataType,
  FieldDisplayType,
  LayoutType,
  SectionType,
  ConnectionType,
  ObjectType,
  RunControlStepType,
  VersionHistoryEntry,
  EntityType,
} from "./types"

// User data with the specified names
export const mockUsers: User[] = [
  {
    id: "USER001",
    username: "ntiwari",
    fullName: "Nitin Tiwari",
    email: "nitin.tiwari@bank.com",
    role: "Treasury Manager",
    department: "Treasury Operations",
    isActive: true,
    lastLogin: "2024-01-15T09:30:00Z",
    createdDate: "2023-06-01T00:00:00Z",
  },
  {
    id: "USER002",
    username: "urawat",
    fullName: "Umesh Rawat",
    email: "umesh.rawat@bank.com",
    role: "Regulatory Analyst",
    department: "Risk & Compliance",
    isActive: true,
    lastLogin: "2024-01-15T08:45:00Z",
    createdDate: "2023-07-15T00:00:00Z",
  },
  {
    id: "USER003",
    username: "pthakkar",
    fullName: "Pratik Thakkar",
    email: "pratik.thakkar@bank.com",
    role: "Senior Developer",
    department: "IT Operations",
    isActive: true,
    lastLogin: "2024-01-15T10:15:00Z",
    createdDate: "2023-05-20T00:00:00Z",
  },
  {
    id: "USER004",
    username: "ypatil",
    fullName: "Yayati Patil",
    email: "yayati.patil@bank.com",
    role: "Data Analyst",
    department: "Treasury Operations",
    isActive: true,
    lastLogin: "2024-01-15T07:20:00Z",
    createdDate: "2023-08-10T00:00:00Z",
  },
  {
    id: "USER005",
    username: "skorni",
    fullName: "Satya Korni",
    email: "satya.korni@bank.com",
    role: "Compliance Officer",
    department: "Risk & Compliance",
    isActive: true,
    lastLogin: "2024-01-15T11:00:00Z",
    createdDate: "2023-04-12T00:00:00Z",
  },
]

// Connection types
export const connectionTypes: { value: ConnectionType; label: string }[] = [
  { value: "Database", label: "Database" },
  { value: "API", label: "REST API" },
  { value: "File", label: "File System" },
  { value: "FTP", label: "FTP/SFTP" },
  { value: "Message Queue", label: "Message Queue" },
  { value: "Web Service", label: "Web Service" },
]

// Mock connections for banking/treasury systems
export const mockConnections: Connection[] = [
  {
    id: "CONN001",
    name: "Treasury Management System",
    type: "Database",
    host: "tms-prod.bank.internal",
    port: 1521,
    database: "TREASURY",
    username: "tms_user",
    description: "Primary treasury management system database",
    isActive: true,
    createdBy: "ntiwari",
    createdDate: "2023-06-01T00:00:00Z",
    lastModifiedBy: "pthakkar",
    lastModifiedDate: "2024-01-10T00:00:00Z",
  },
  {
    id: "CONN002",
    name: "Regulatory Reporting API",
    type: "API",
    host: "reg-api.bank.internal",
    port: 443,
    baseUrl: "https://reg-api.bank.internal/v1",
    description: "API for regulatory reporting submissions",
    isActive: true,
    createdBy: "urawat",
    createdDate: "2023-07-15T00:00:00Z",
    lastModifiedBy: "skorni",
    lastModifiedDate: "2024-01-12T00:00:00Z",
  },
  {
    id: "CONN003",
    name: "Trade Settlement SFTP",
    type: "FTP",
    host: "sftp.settlement.bank.com",
    port: 22,
    username: "settlement_user",
    description: "SFTP server for trade settlement files",
    isActive: true,
    createdBy: "ypatil",
    createdDate: "2023-08-01T00:00:00Z",
    lastModifiedBy: "ntiwari",
    lastModifiedDate: "2024-01-08T00:00:00Z",
  },
]

// Object types
export const objectTypes: { value: ObjectType; label: string }[] = [
  { value: "Table", label: "Database Table" },
  { value: "View", label: "Database View" },
  { value: "API", label: "REST API Endpoint" },
  { value: "File", label: "File Format" },
  { value: "Queue", label: "Message Queue" },
]

// Data types
export const dataTypes: { value: DataType; label: string }[] = [
  { value: "String", label: "String" },
  { value: "Integer", label: "Integer" },
  { value: "Decimal", label: "Decimal" },
  { value: "Date", label: "Date" },
  { value: "DateTime", label: "Date Time" },
  { value: "Boolean", label: "Boolean" },
  { value: "JSON", label: "JSON" },
  { value: "XML", label: "XML" },
]

// Mock integration objects
export const mockObjects: IntegrationObject[] = [
  {
    id: "OBJ001",
    name: "Daily Cash Position",
    type: "Table",
    connectionId: "CONN001",
    tableName: "DAILY_CASH_POSITION",
    description: "Daily cash position data from treasury system",
    schema: [
      {
        id: "S001_01",
        attributeName: "position_date",
        dataType: "Date",
        isNullable: false,
        sourceField: "position_date",
        sampleValue: "2024-01-15",
      },
      {
        id: "S001_02",
        attributeName: "currency_code",
        dataType: "String",
        isNullable: false,
        sourceField: "currency_code",
        sampleValue: "USD",
      },
      {
        id: "S001_03",
        attributeName: "opening_balance",
        dataType: "Decimal",
        isNullable: false,
        sourceField: "opening_balance",
        sampleValue: "125000000",
      },
      {
        id: "S001_04",
        attributeName: "closing_balance",
        dataType: "Decimal",
        isNullable: false,
        sourceField: "closing_balance",
        sampleValue: "128500000",
      },
      {
        id: "S001_05",
        attributeName: "net_flow",
        dataType: "Decimal",
        isNullable: false,
        sourceField: "net_flow",
        sampleValue: "3500000",
      },
    ],
    status: "A",
    createdBy: "ntiwari",
    createdDate: "2023-06-15T00:00:00Z",
    lastModifiedBy: "ypatil",
    lastModifiedDate: "2024-01-10T00:00:00Z",
  },
  {
    id: "OBJ002",
    name: "Trade Confirmations",
    type: "API",
    connectionId: "CONN002",
    apiEndpoint: "/trades/confirmations",
    description: "Trade confirmation data for regulatory reporting",
    schema: [
      {
        id: "S002_01",
        attributeName: "trade_id",
        dataType: "String",
        isNullable: false,
        sourceField: "tradeId",
        sampleValue: "TRD123",
      },
      {
        id: "S002_02",
        attributeName: "trade_date",
        dataType: "Date",
        isNullable: false,
        sourceField: "tradeDate",
        sampleValue: "2024-01-15",
      },
      {
        id: "S002_03",
        attributeName: "counterparty",
        dataType: "String",
        isNullable: false,
        sourceField: "counterparty",
        sampleValue: "Goldman Sachs",
      },
      {
        id: "S002_04",
        attributeName: "notional_amount",
        dataType: "Decimal",
        isNullable: false,
        sourceField: "notional",
        sampleValue: "5000000",
      },
      {
        id: "S002_05",
        attributeName: "currency",
        dataType: "String",
        isNullable: false,
        sourceField: "ccy",
        sampleValue: "USD",
      },
      {
        id: "S002_06",
        attributeName: "product_type",
        dataType: "String",
        isNullable: false,
        sourceField: "productType",
        sampleValue: "IRS",
      },
    ],
    status: "A",
    createdBy: "urawat",
    createdDate: "2023-07-20T00:00:00Z",
    lastModifiedBy: "skorni",
    lastModifiedDate: "2024-01-12T00:00:00Z",
  },
  {
    id: "OBJ003",
    name: "Settlement Instructions",
    type: "File",
    connectionId: "CONN003",
    filePath: "/incoming/settlements/",
    filePattern: "SETTLE_*.csv",
    description: "Settlement instruction files from counterparties",
    schema: [
      {
        id: "S003_01",
        attributeName: "instruction_id",
        dataType: "String",
        isNullable: false,
        sourceField: "INSTRUCTION_ID",
        sampleValue: "SETTLE-987",
      },
      {
        id: "S003_02",
        attributeName: "trade_ref",
        dataType: "String",
        isNullable: false,
        sourceField: "TRADE_REF",
        sampleValue: "TRD123",
      },
      {
        id: "S003_03",
        attributeName: "settlement_date",
        dataType: "Date",
        isNullable: false,
        sourceField: "SETTLE_DATE",
        sampleValue: "2024-01-17",
      },
      {
        id: "S003_04",
        attributeName: "amount",
        dataType: "Decimal",
        isNullable: false,
        sourceField: "AMOUNT",
        sampleValue: "5000000",
      },
      {
        id: "S003_05",
        attributeName: "account_number",
        dataType: "String",
        isNullable: false,
        sourceField: "ACCOUNT_NO",
        sampleValue: "123456789",
      },
    ],
    status: "A",
    createdBy: "ypatil",
    createdDate: "2023-08-05T00:00:00Z",
    lastModifiedBy: "ntiwari",
    lastModifiedDate: "2024-01-08T00:00:00Z",
  },
]

// Mock rules for treasury and regulatory reporting
export const mockRules: Rule[] = [
  {
    id: "RULE001",
    name: "Cash Position Validation",
    description: "Validates daily cash position calculations and flags discrepancies",
    ruleType: "Validation",
    sourceObjectId: "OBJ001",
    targetObjectId: "OBJ001",
    expression: "ABS(opening_balance + net_flow - closing_balance) < 0.01",
    isActive: true,
    priority: 1,
    effectiveDate: "2024-01-01",
    status: "A",
    approvalStatus: "Approved",
    createdBy: "ntiwari",
    createdDate: "2023-12-15T00:00:00Z",
    approvedBy: "urawat",
    approvedDate: "2023-12-20T00:00:00Z",
  },
  {
    id: "RULE002",
    name: "Trade Limit Check",
    description: "Ensures trade amounts do not exceed counterparty limits",
    ruleType: "Business",
    sourceObjectId: "OBJ002",
    expression: "notional_amount <= counterparty_limit",
    isActive: true,
    priority: 2,
    effectiveDate: "2024-01-01",
    status: "A",
    approvalStatus: "Approved",
    createdBy: "urawat",
    createdDate: "2023-12-10T00:00:00Z",
    approvedBy: "skorni",
    approvedDate: "2023-12-18T00:00:00Z",
  },
  {
    id: "RULE003",
    name: "Settlement Date Validation",
    description: "Validates settlement dates are business days and within acceptable range",
    ruleType: "Validation",
    sourceObjectId: "OBJ003",
    expression: "settlement_date >= trade_date AND ISWORKDAY(settlement_date)",
    isActive: true,
    priority: 1,
    effectiveDate: "2024-01-01",
    status: "A",
    approvalStatus: "Pending Peer Review",
    createdBy: "ypatil",
    createdDate: "2024-01-10T00:00:00Z",
  },
]

// Mock rule sets
export const mockRuleSets: RuleSet[] = [
  {
    id: "RULESET001",
    name: "Daily Treasury Validation",
    description: "Complete validation suite for daily treasury operations",
    rules: [
      { ruleId: "RULE001", order: 1, isActive: true },
      { ruleId: "RULE002", order: 2, isActive: true },
    ],
    executionOrder: "Sequential",
    isActive: true,
    effectiveDate: "2024-01-01",
    status: "A",
    approvalStatus: "Approved",
    createdBy: "ntiwari",
    createdDate: "2023-12-20T00:00:00Z",
    approvedBy: "urawat",
    approvedDate: "2023-12-25T00:00:00Z",
  },
  {
    id: "RULESET002",
    name: "Regulatory Compliance Checks",
    description: "Regulatory compliance validation for trade reporting",
    rules: [
      { ruleId: "RULE002", order: 1, isActive: true },
      { ruleId: "RULE003", order: 2, isActive: true },
    ],
    executionOrder: "Parallel",
    isActive: true,
    effectiveDate: "2024-01-01",
    status: "A",
    approvalStatus: "Pending Final Approval",
    createdBy: "urawat",
    createdDate: "2024-01-05T00:00:00Z",
  },
]

// Mock scaffolds
export const mockScaffolds: Scaffold[] = [
  {
    id: "SCAFFOLD001",
    name: "Treasury Data Ingestion",
    description: "Ingests and aggregates daily treasury data from the TMS",
    type: "Scaffold_In",
    sourceObjectId: "OBJ001",
    targetObjectId: "OBJ001",
    sourceObjectName: "Daily Cash Position",
    targetObjectName: "Daily Cash Position",
    columns: [
      {
        id: "col-1-1",
        name: "position_date",
        dataType: "Date",
        transformation: {
          sourceColumn: "position_date",
          targetColumn: "business_date",
          transformation: "Direct",
          expression: "position_date",
          sourceColumns: ["position_date"],
          steps: [],
        },
      },
      {
        id: "col-1-2",
        name: "currency_code",
        dataType: "String",
        transformation: {
          sourceColumn: "currency_code",
          targetColumn: "ccy",
          transformation: "Expression",
          expression: "UPPER(currency_code)",
          sourceColumns: ["currency_code"],
          steps: [],
        },
      },
      {
        id: "col-1-3",
        name: "closing_balance",
        dataType: "Decimal",
        transformation: {
          sourceColumn: "closing_balance",
          targetColumn: "end_of_day_balance",
          transformation: "Direct",
          expression: "closing_balance",
          sourceColumns: ["closing_balance"],
          steps: [],
        },
      },
    ],
    approvalDetails: {
      status: "Approved",
      approver: "pthakkar",
      approvalDate: "2023-12-10T00:00:00Z",
    },
    aggregations: [
      {
        id: "agg-grp-1",
        groupByColumns: ["currency_code"],
        aggregations: [
          { id: "agg-rule-1", column: "net_flow", aggregationFunction: "SUM" },
          { id: "agg-rule-2", column: "closing_balance", aggregationFunction: "AVG" },
        ],
      },
    ],
    filters: [
      { id: "flt-1", column: "net_flow", operator: "greater_than", value: "10000" },
      { id: "flt-2", column: "currency_code", operator: "not_equals", value: "JPY" },
    ],
    ordering: [
      { id: "ord-1", column: "position_date", direction: "desc" },
      { id: "ord-2", column: "currency_code", direction: "asc" },
    ],
    isActive: true,
    effectiveDate: "2024-01-01",
    status: "A",
    approvalStatus: "Approved",
    createdBy: "ntiwari",
    createdDate: "2023-12-01T00:00:00Z",
    approvedBy: "pthakkar",
    approvedDate: "2023-12-10T00:00:00Z",
  },
  {
    id: "SCAFFOLD002",
    name: "Regulatory Report Output",
    description: "Formats and outputs regulatory reports for trade confirmations",
    type: "Scaffold_Out",
    sourceObjectId: "OBJ002",
    targetObjectId: "OBJ002",
    sourceObjectName: "Trade Confirmations",
    targetObjectName: "Trade Confirmations",
    columns: [
      {
        id: "col-2-1",
        name: "trade_id",
        dataType: "String",
        transformation: {
          sourceColumn: "trade_id",
          targetColumn: "transaction_id",
          transformation: "Direct",
          expression: "trade_id",
          sourceColumns: ["trade_id"],
          steps: [],
        },
      },
      {
        id: "col-2-2",
        name: "trade_date",
        dataType: "Date",
        transformation: {
          sourceColumn: "trade_date",
          targetColumn: "reporting_date",
          transformation: "Direct",
          expression: "trade_date",
          sourceColumns: ["trade_date"],
          steps: [],
        },
      },
      {
        id: "col-2-3",
        name: "counterparty",
        dataType: "String",
        transformation: {
          sourceColumn: "counterparty",
          targetColumn: "counterparty_name",
          transformation: "Expression",
          expression: "UPPER(counterparty)",
          sourceColumns: ["counterparty"],
          steps: [],
        },
      },
      {
        id: "col-2-4",
        name: "notional_amount",
        dataType: "Decimal",
        transformation: {
          sourceColumn: "notional_amount",
          targetColumn: "amount_usd",
          transformation: "Expression",
          expression: "CONVERT_TO_USD(notional_amount, currency)",
          sourceColumns: ["notional_amount", "currency"],
          steps: [],
        },
      },
    ],
    approvalDetails: {
      status: "Pending Peer Review",
    },
    aggregations: [
      {
        id: "agg-grp-2",
        groupByColumns: ["counterparty", "product_type"],
        aggregations: [
          { id: "agg-rule-3", column: "notional_amount", aggregationFunction: "SUM" },
          { id: "agg-rule-4", column: "trade_id", aggregationFunction: "COUNT" },
        ],
      },
    ],
    filters: [
      { id: "flt-3", column: "notional_amount", operator: "greater_than", value: "1000000" },
      { id: "flt-4", column: "product_type", operator: "in", value: "IRS,FX_SWAP" },
    ],
    ordering: [
      { id: "ord-3", column: "counterparty", direction: "asc" },
      { id: "ord-4", column: "trade_date", direction: "desc" },
    ],
    isActive: true,
    effectiveDate: "2024-01-01",
    status: "A",
    approvalStatus: "Pending Peer Review",
    createdBy: "urawat",
    createdDate: "2024-01-12T00:00:00Z",
  },
  {
    id: "SCAFFOLD003",
    name: "Settlement Data Preparation",
    description: "Prepares settlement instruction data for payment processing.",
    type: "Scaffold_Out",
    sourceObjectId: "OBJ003",
    targetObjectId: "OBJ003",
    sourceObjectName: "Settlement Instructions",
    targetObjectName: "Settlement Instructions",
    columns: [
      {
        id: "col-3-1",
        name: "instruction_id",
        dataType: "String",
        transformation: {
          sourceColumn: "instruction_id",
          targetColumn: "payment_ref",
          transformation: "Direct",
          expression: "instruction_id",
          sourceColumns: ["instruction_id"],
          steps: [],
        },
      },
      {
        id: "col-3-2",
        name: "settlement_date",
        dataType: "Date",
        transformation: {
          sourceColumn: "settlement_date",
          targetColumn: "value_date",
          transformation: "Direct",
          expression: "settlement_date",
          sourceColumns: ["settlement_date"],
          steps: [],
        },
      },
      {
        id: "col-3-3",
        name: "amount",
        dataType: "Decimal",
        transformation: {
          sourceColumn: "amount",
          targetColumn: "payment_amount",
          transformation: "Direct",
          expression: "amount",
          sourceColumns: ["amount"],
          steps: [],
        },
      },
    ],
    approvalDetails: {
      status: "Draft",
    },
    aggregations: [],
    filters: [{ id: "flt-5", column: "settlement_date", operator: "equals", value: "TODAY()" }],
    ordering: [{ id: "ord-5", column: "amount", direction: "desc" }],
    isActive: true,
    effectiveDate: "2024-02-01",
    status: "A",
    approvalStatus: "Draft",
    createdBy: "ypatil",
    createdDate: "2024-01-25T00:00:00Z",
  },
]

// ─────────────────────────────────────────────────────────────────────────────
//  Trigger-type, Step-type & File-watch dropdown helpers
// ─────────────────────────────────────────────────────────────────────────────

// 1️⃣  Run-Control trigger types
export const triggerTypeOptions = [
  { value: "OnDemand", label: "On Demand" },
  { value: "Scheduled", label: "Scheduled" },
  { value: "RealtimeStream", label: "Real-time Stream" },
  { value: "FileWatch", label: "File Watch" },
  { value: "DatabaseChange", label: "Database Change" },
] as const

// 2️⃣  File-system events for the File-Watch trigger
export const fileWatchEventOptions = [
  { value: "Create", label: "File Created" },
  { value: "Modify", label: "File Modified" },
  { value: "Delete", label: "File Deleted" },
] as const

// 3️⃣  (optional) alias retained for older imports
export { fileWatchEventOptions as fileEventOptions }

// 4️⃣  Run-type helper already consumed by /run-control-definition
export const runTypes: { value: RunControlStepType; label: string }[] = [
  { value: "RuleSet", label: "Rule Set" },
  { value: "Scaffold", label: "Scaffold" },
  { value: "CustomScript", label: "Custom Script" },
]

// ─────────────────────────────────────────────────────────────────────────────
//  Database-Change (CDC) event types  ⟶ used by /run-control-definition
// ─────────────────────────────────────────────────────────────────────────────
export const databaseChangeTypeOptions: { value: "INSERT" | "UPDATE" | "DELETE"; label: string }[] = [
  { value: "INSERT", label: "Insert" },
  { value: "UPDATE", label: "Update" },
  { value: "DELETE", label: "Delete" },
]

// Holiday calendars
export const mockHolidayCalendars: HolidayCalendar[] = [
  {
    id: "CAL001",
    name: "US Banking Holidays",
    description: "Standard US banking holiday calendar",
    country: "US",
    holidays: [
      { date: "2024-01-01", name: "New Year's Day" },
      { date: "2024-01-15", name: "Martin Luther King Jr. Day" },
      { date: "2024-02-19", name: "Presidents Day" },
      { date: "2024-05-27", name: "Memorial Day" },
      { date: "2024-07-04", name: "Independence Day" },
      { date: "2024-09-02", name: "Labor Day" },
      { date: "2024-10-14", name: "Columbus Day" },
      { date: "2024-11-11", name: "Veterans Day" },
      { date: "2024-11-28", name: "Thanksgiving Day" },
      { date: "2024-12-25", name: "Christmas Day" },
    ],
    isActive: true,
    createdBy: "pthakkar",
    createdDate: "2023-11-01T00:00:00Z",
  },
  {
    id: "CAL002",
    name: "UK Banking Holidays",
    description: "UK banking holiday calendar",
    country: "UK",
    holidays: [
      { date: "2024-01-01", name: "New Year's Day" },
      { date: "2024-03-29", name: "Good Friday" },
      { date: "2024-04-01", name: "Easter Monday" },
      { date: "2024-05-06", name: "Early May Bank Holiday" },
      { date: "2024-05-27", name: "Spring Bank Holiday" },
      { date: "2024-08-26", name: "Summer Bank Holiday" },
      { date: "2024-12-25", name: "Christmas Day" },
      { date: "2024-12-26", name: "Boxing Day" },
    ],
    isActive: true,
    createdBy: "pthakkar",
    createdDate: "2023-11-01T00:00:00Z",
  },
]

export const mockHolidayCalendarOptions = mockHolidayCalendars.map((cal) => ({
  value: cal.id,
  label: cal.name,
}))

// Mock run controls
export const mockRunControls: RunControl[] = [
  {
    id: "RC001",
    name: "End of Day Processing",
    description: "Daily end-of-day treasury processing workflow",
    triggerType: "Schedule",
    scheduleExpression: "0 18 * * MON-FRI",
    holidayCalendarId: "CAL001",
    steps: [
      {
        id: "STEP001",
        name: "Ingest Cash Positions",
        order: 1,
        runType: "Scaffold",
        runTargetId: "SCAFFOLD001",
        isActive: true,
      },
      {
        id: "STEP002",
        name: "Validate Treasury Data",
        order: 2,
        runType: "RuleSet",
        runTargetId: "RULESET001",
        isActive: true,
      },
    ],
    isActive: true,
    effectiveDate: "2024-01-01",
    status: "A",
    approvalStatus: "Approved",
    createdBy: "ntiwari",
    createdDate: "2023-12-01T00:00:00Z",
    approvedBy: "urawat",
    approvedDate: "2023-12-15T00:00:00Z",
  },
  {
    id: "RC002",
    name: "Regulatory Report Generation",
    description: "Weekly regulatory report generation",
    triggerType: "Schedule",
    scheduleExpression: "0 9 * * FRI",
    holidayCalendarId: "CAL001",
    steps: [
      {
        id: "STEP003",
        name: "Generate Trade Reports",
        order: 1,
        runType: "Scaffold",
        runTargetId: "SCAFFOLD002",
        isActive: true,
      },
    ],
    isActive: true,
    effectiveDate: "2024-01-01",
    status: "A",
    approvalStatus: "Pending Peer Review",
    createdBy: "urawat",
    createdDate: "2024-01-08T00:00:00Z",
  },
]

// Process logs
export const mockProcessLogs: ProcessLog[] = [
  {
    id: "LOG001",
    runControlId: "RC001",
    executionId: "EXEC_20240115_001",
    startTime: "2024-01-15T18:00:00Z",
    endTime: "2024-01-15T18:15:32Z",
    status: "Completed",
    totalRecords: 1250,
    successRecords: 1248,
    errorRecords: 2,
    logs: [
      {
        timestamp: "2024-01-15T18:00:05Z",
        level: "INFO",
        message: "Starting End of Day Processing",
        component: "RunControl",
      },
      {
        timestamp: "2024-01-15T18:02:15Z",
        level: "INFO",
        message: "Ingested 1250 cash position records",
        component: "SCAFFOLD001",
      },
      {
        timestamp: "2024-01-15T18:10:30Z",
        level: "WARN",
        message: "2 records failed validation - currency mismatch",
        component: "RULESET001",
      },
      {
        timestamp: "2024-01-15T18:15:32Z",
        level: "INFO",
        message: "End of Day Processing completed successfully",
        component: "RunControl",
      },
    ],
    triggeredBy: "System",
    createdDate: "2024-01-15T18:00:00Z",
  },
  {
    id: "LOG002",
    runControlId: "RC002",
    executionId: "EXEC_20240112_001",
    startTime: "2024-01-12T09:00:00Z",
    endTime: "2024-01-12T09:45:18Z",
    status: "Completed",
    totalRecords: 3420,
    successRecords: 3420,
    errorRecords: 0,
    logs: [
      {
        timestamp: "2024-01-12T09:00:05Z",
        level: "INFO",
        message: "Starting Regulatory Report Generation",
        component: "RunControl",
      },
      {
        timestamp: "2024-01-12T09:30:22Z",
        level: "INFO",
        message: "Generated 3420 trade confirmation records",
        component: "SCAFFOLD002",
      },
      {
        timestamp: "2024-01-12T09:45:18Z",
        level: "INFO",
        message: "Regulatory Report Generation completed successfully",
        component: "RunControl",
      },
    ],
    triggeredBy: "urawat",
    createdDate: "2024-01-12T09:00:00Z",
  },
]

// UI Metadata options
export const layoutTypes: { value: LayoutType; label: string }[] = [
  { value: "form", label: "Form Layout" },
  { value: "table", label: "Table Layout" },
  { value: "card", label: "Card Layout" },
  { value: "wizard", label: "Wizard Layout" },
]

export const fieldDisplayTypes: { value: FieldDisplayType; label: string }[] = [
  { value: "input", label: "Text Input" },
  { value: "textarea", label: "Text Area" },
  { value: "select", label: "Dropdown" },
  { value: "multiselect", label: "Multi-Select" },
  { value: "checkbox", label: "Checkbox" },
  { value: "radio", label: "Radio Button" },
  { value: "date", label: "Date Picker" },
  { value: "datetime", label: "Date Time Picker" },
  { value: "number", label: "Number Input" },
  { value: "currency", label: "Currency Input" },
  { value: "file", label: "File Upload" },
]

export const sectionTypes: { value: SectionType; label: string }[] = [
  { value: "header", label: "Header Section" },
  { value: "body", label: "Body Section" },
  { value: "footer", label: "Footer Section" },
  { value: "sidebar", label: "Sidebar Section" },
]

export const fieldWidths: { value: string; label: string }[] = [
  { value: "full", label: "Full Width" },
  { value: "half", label: "Half Width" },
  { value: "third", label: "One Third" },
  { value: "quarter", label: "One Quarter" },
  { value: "auto", label: "Auto Width" },
]

// Mock UI Metadata
export const mockUIMetadata: UIMetadata[] = [
  {
    id: "UI001",
    name: "Trade Entry Form",
    description: "Dynamic form for manual trade entry",
    sourceObjectId: "OBJ002",
    layoutType: "form",
    effectiveDate: "2024-01-01",
    status: "A",
    approvalStatus: "Approved",
    fields: [
      {
        id: "FIELD001",
        fieldName: "trade_id",
        label: "Trade ID",
        dataType: "String",
        displayType: "input",
        section: "body",
        order: 1,
        isRequired: true,
        isReadonly: false,
        isVisible: true,
        width: "half",
      },
      {
        id: "FIELD002",
        fieldName: "counterparty",
        label: "Counterparty",
        dataType: "String",
        displayType: "select",
        section: "body",
        order: 2,
        isRequired: true,
        isReadonly: false,
        isVisible: true,
        width: "half",
      },
      {
        id: "FIELD003",
        fieldName: "notional_amount",
        label: "Notional Amount",
        dataType: "Decimal",
        displayType: "currency",
        section: "body",
        order: 3,
        isRequired: true,
        isReadonly: false,
        isVisible: true,
        width: "third",
      },
    ],
    sections: [
      {
        id: "SEC001",
        name: "Trade Details",
        type: "body",
        order: 1,
        columns: 2,
        fields: ["FIELD001", "FIELD002", "FIELD003"],
      },
    ],
    configuration: {
      allowCreate: true,
      allowEdit: true,
      allowDelete: false,
      pageSize: 20,
      enableSearch: true,
      enableFilter: true,
      enableSort: true,
      enableExport: true,
    },
    createdBy: "urawat",
    createdDate: "2023-11-15T00:00:00Z",
    approvedBy: "skorni",
    approvedDate: "2023-11-20T00:00:00Z",
  },
  {
    id: "UI002",
    name: "Cash Position Dashboard",
    description: "Dashboard view for daily cash positions",
    sourceObjectId: "OBJ001",
    layoutType: "table",
    effectiveDate: "2024-01-01",
    status: "A",
    approvalStatus: "Approved",
    fields: [
      {
        id: "FIELD004",
        fieldName: "position_date",
        label: "Position Date",
        dataType: "Date",
        displayType: "date",
        section: "body",
        order: 1,
        isRequired: true,
        isReadonly: true,
        isVisible: true,
        width: "quarter",
      },
      {
        id: "FIELD005",
        fieldName: "currency_code",
        label: "Currency",
        dataType: "String",
        displayType: "input",
        section: "body",
        order: 2,
        isRequired: true,
        isReadonly: true,
        isVisible: true,
        width: "quarter",
      },
    ],
    sections: [],
    configuration: {
      allowCreate: false,
      allowEdit: false,
      allowDelete: false,
      pageSize: 50,
      enableSearch: true,
      enableFilter: true,
      enableSort: true,
      enableExport: true,
    },
    createdBy: "ntiwari",
    createdDate: "2023-12-01T00:00:00Z",
    approvedBy: "ypatil",
    approvedDate: "2024-01-05T00:00:00Z",
  },
]

// Mock dynamic records for data workflow
export const mockDynamicRecords: DynamicRecord[] = [
  {
    id: "REC001",
    uiMetadataId: "UI001",
    data: {
      trade_id: "TRD20240115001",
      counterparty: "Goldman Sachs",
      notional_amount: 5000000,
      currency: "USD",
      product_type: "Interest Rate Swap",
    },
    status: "A",
    approvalStatus: "Pending Peer Review",
    createdBy: "ntiwari",
    createdDate: "2024-01-15T10:30:00Z",
    lastModifiedBy: "ntiwari",
    lastModifiedDate: "2024-01-15T10:30:00Z",
  },
  {
    id: "REC002",
    uiMetadataId: "UI001",
    data: {
      trade_id: "TRD20240115002",
      counterparty: "JP Morgan",
      notional_amount: 2500000,
      currency: "EUR",
      product_type: "FX Forward",
    },
    status: "A",
    approvalStatus: "Approved",
    createdBy: "urawat",
    createdDate: "2024-01-15T11:15:00Z",
    approvedBy: "skorni",
    approvedDate: "2024-01-15T14:20:00Z",
  },
  {
    id: "REC003",
    uiMetadataId: "UI002",
    data: {
      position_date: "2024-01-15",
      currency_code: "USD",
      opening_balance: 125000000,
      closing_balance: 128500000,
      net_flow: 3500000,
    },
    status: "A",
    approvalStatus: "Draft",
    createdBy: "ypatil",
    createdDate: "2024-01-15T16:45:00Z",
    lastModifiedBy: "ypatil",
    lastModifiedDate: "2024-01-15T16:45:00Z",
  },
]

// Connection options for dropdowns
export const mockConnectionOptions = mockConnections.map((conn) => ({
  value: conn.id,
  label: `${conn.name} (${conn.type})`,
}))

// Object options for dropdowns
export const mockObjectOptions = mockObjects.map((obj) => ({
  value: obj.id,
  label: `${obj.name} (${obj.type})`,
}))

// Helper function to get user by ID
export const getUserById = (userId: string): User | undefined => {
  return mockUsers.find((user) => user.id === userId)
}

// Helper function to get connection by ID
export const getConnectionById = (connectionId: string): Connection | undefined => {
  return mockConnections.find((conn) => conn.id === connectionId)
}

// Helper function to get object by ID
export const getObjectById = (objectId: string): IntegrationObject | undefined => {
  return mockObjects.find((obj) => obj.id === objectId)
}

// ─────────────────────────────────────────────────────────────────────────────
//  Generic operator/logic dropdowns – used by /rule-definition and others
// ─────────────────────────────────────────────────────────────────────────────
export const ruleOperators = [
  { value: "=", label: "Equals" },
  { value: "!=", label: "Not Equal" },
  { value: ">", label: "Greater Than" },
  { value: "<", label: "Less Than" },
  { value: ">=", label: "Greater Or Equal" },
  { value: "<=", label: "Less Or Equal" },
  { value: "LIKE", label: "Like (Pattern Match)" },
]

export const actionOperators = [
  { value: ":=", label: "Assign (=)" },
  { value: "+=", label: "Increment by (+)" },
  { value: "-=", label: "Decrement by (−)" },
  { value: "*=", label: "Multiply by (×)" },
  { value: "/=", label: "Divide by (÷)" },
]

export const conditionOperators = [
  { value: "AND", label: "AND" },
  { value: "OR", label: "OR" },
]

export const logicalOperators = [
  { value: "AND", label: "AND" },
  { value: "OR", label: "OR" },
  { value: "NOT", label: "NOT" },
]

export const parenthesisOptions = [
  { value: "", label: "None" },
  { value: "(", label: "(" },
  { value: ")", label: ")" },
]

// ─────────────────────────────────────────────────────────────────────────────
//  Helper lists used by /run-control-definition  & friends
// ─────────────────────────────────────────────────────────────────────────────

// 1. Run-type options for Run-Control steps

// 3. Stream (queue/topic) source options – simple label/value list
export const mockStreamSourceOptions = mockObjects
  .filter((obj) => obj.type === "Queue")
  .map((q) => ({ value: q.id, label: q.name }))

// 4. Utility to populate the "Run Target Name" dropdown for each step type
export const allRunnableEntitiesOptionsForSteps = (stepType: RunControlStepType) => {
  switch (stepType) {
    case "RuleSet":
      return mockRuleSets.map((rs) => ({ value: rs.id, label: rs.name }))
    case "Scaffold":
      return mockScaffolds.map((sc) => ({ value: sc.id, label: sc.name }))
    case "CustomScript":
    default:
      return [] //  Custom scripts would be user-uploaded — none in mock data
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  Version History
// ─────────────────────────────────────────────────────────────────────────────
export const entityTypeOptions: { value: EntityType; label: string }[] = [
  { value: "Connection", label: "Connection" },
  { value: "Object", label: "Object" },
  { value: "Rule", label: "Rule" },
  { value: "Rule Set", label: "Rule Set" },
  { value: "Run Control", label: "Run Control" },
  { value: "UI Metadata", label: "UI Metadata" },
]

const originalRule = mockRules.find((rule) => rule.id === "RULE001")!
const updatedRule = {
  ...originalRule,
  priority: 2,
  description: "Updated: Validates daily cash position calculations and flags discrepancies over 1 cent.",
}

const originalConnection = mockConnections.find((conn) => conn.id === "CONN002")!
const updatedConnection = { ...originalConnection, host: "new-reg-api.bank.internal" }

const scaffold001_base = mockScaffolds.find((sc) => sc.id === "SCAFFOLD001")!
const scaffold002_base = mockScaffolds.find((sc) => sc.id === "SCAFFOLD002")!

export const mockVersionHistory: VersionHistoryEntry[] = [
  {
    id: "VH001",
    entityId: "RULE001",
    entityType: "Rule",
    entityName: "Cash Position Validation",
    version: 2,
    changeType: "Update",
    changedBy: "urawat",
    changedDate: "2024-01-18T14:00:00Z",
    changeDescription: "Increased rule priority and clarified description.",
    previousState: originalRule,
    newState: updatedRule,
  },
  {
    id: "VH002",
    entityId: "RULE001",
    entityType: "Rule",
    entityName: "Cash Position Validation",
    version: 1,
    changeType: "Create",
    changedBy: "ntiwari",
    changedDate: "2023-12-15T00:00:00Z",
    changeDescription: "Initial creation of the rule.",
    previousState: null,
    newState: originalRule,
  },
  {
    id: "VH003",
    entityId: "CONN002",
    entityType: "Connection",
    entityName: "Regulatory Reporting API",
    version: 2,
    changeType: "Update",
    changedBy: "pthakkar",
    changedDate: "2024-01-15T11:30:00Z",
    changeDescription: "Updated API host to new endpoint.",
    previousState: originalConnection,
    newState: updatedConnection,
  },
  {
    id: "VH004",
    entityId: "CONN002",
    entityType: "Connection",
    entityName: "Regulatory Reporting API",
    version: 1,
    changeType: "Create",
    changedBy: "urawat",
    changedDate: "2023-07-15T00:00:00Z",
    changeDescription: "Created new API connection for regulatory reporting.",
    previousState: null,
    newState: originalConnection,
  },
  {
    id: "VH005",
    entityId: "RULESET001",
    entityType: "Rule Set",
    entityName: "Daily Treasury Validation",
    version: 1,
    changeType: "Create",
    changedBy: "ntiwari",
    changedDate: "2023-12-20T00:00:00Z",
    changeDescription: "Initial creation of the rule set.",
    previousState: null,
    newState: mockRuleSets.find((rs) => rs.id === "RULESET001"),
  },
  {
    id: "VH006",
    entityId: "OBJ001",
    entityType: "Object",
    entityName: "Daily Cash Position",
    version: 3,
    changeType: "Update",
    changedBy: "ypatil",
    changedDate: "2024-01-20T09:15:00Z",
    changeDescription: "Added new schema field for risk_weight calculation.",
    previousState: mockObjects.find((obj) => obj.id === "OBJ001"),
    newState: {
      ...mockObjects.find((obj) => obj.id === "OBJ001")!,
      schema: [
        ...mockObjects.find((obj) => obj.id === "OBJ001")!.schema,
        {
          id: "S001_06",
          attributeName: "risk_weight",
          dataType: "Decimal",
          isNullable: true,
          sourceField: "risk_weight",
          sampleValue: "0.85",
        },
      ],
    },
  },
  {
    id: "VH007",
    entityId: "OBJ001",
    entityType: "Object",
    entityName: "Daily Cash Position",
    version: 2,
    changeType: "Update",
    changedBy: "ntiwari",
    changedDate: "2024-01-10T16:30:00Z",
    changeDescription: "Updated sample values and field descriptions.",
    previousState: mockObjects.find((obj) => obj.id === "OBJ001"),
    newState: mockObjects.find((obj) => obj.id === "OBJ001"),
  },
  {
    id: "VH008",
    entityId: "OBJ001",
    entityType: "Object",
    entityName: "Daily Cash Position",
    version: 1,
    changeType: "Create",
    changedBy: "ntiwari",
    changedDate: "2023-06-15T00:00:00Z",
    changeDescription: "Initial creation of Daily Cash Position object.",
    previousState: null,
    newState: mockObjects.find((obj) => obj.id === "OBJ001"),
  },
  {
    id: "VH009",
    entityId: "SCAFFOLD001",
    entityType: "Scaffold",
    entityName: "Treasury Data Ingestion",
    version: 2,
    changeType: "Update",
    changedBy: "pthakkar",
    changedDate: "2024-01-22T13:45:00Z",
    changeDescription: "Added new transformation for risk weight calculation.",
    previousState: scaffold001_base,
    newState: {
      ...scaffold001_base,
      columns: [
        ...scaffold001_base.columns,
        {
          id: "col-1-4",
          name: "calculated_risk_weight",
          dataType: "Decimal",
          transformation: {
            sourceColumn: "risk_weight",
            targetColumn: "calculated_risk_weight",
            transformation: "Expression",
            expression: "CASE WHEN risk_weight IS NULL THEN 1.0 ELSE risk_weight END",
            sourceColumns: ["risk_weight"],
            steps: [],
          },
        },
      ],
    },
  },
  {
    id: "VH011",
    entityId: "SCAFFOLD001",
    entityType: "Scaffold",
    entityName: "Treasury Data Ingestion",
    version: 1,
    changeType: "Create",
    changedBy: "ntiwari",
    changedDate: "2023-12-01T00:00:00Z",
    changeDescription: "Initial creation of Treasury Data Ingestion scaffold.",
    previousState: null,
    newState: scaffold001_base,
  },
  {
    id: "VH012",
    entityId: "RC001",
    entityType: "Run Control",
    entityName: "End of Day Processing",
    version: 2,
    changeType: "Update",
    changedBy: "urawat",
    changedDate: "2024-01-25T08:30:00Z",
    changeDescription: "Updated schedule to run at 6:30 PM instead of 6:00 PM.",
    previousState: mockRunControls.find((rc) => rc.id === "RC001"),
    newState: {
      ...mockRunControls.find((rc) => rc.id === "RC001")!,
      scheduleExpression: "30 18 * * MON-FRI",
    },
  },
  {
    id: "VH013",
    entityId: "RC001",
    entityType: "Run Control",
    entityName: "End of Day Processing",
    version: 1,
    changeType: "Create",
    changedBy: "ntiwari",
    changedDate: "2023-12-01T00:00:00Z",
    changeDescription: "Initial creation of End of Day Processing run control.",
    previousState: null,
    newState: mockRunControls.find((rc) => rc.id === "RC001"),
  },
  {
    id: "VH014",
    entityId: "UI001",
    entityType: "UI Metadata",
    entityName: "Trade Entry Form",
    version: 2,
    changeType: "Update",
    changedBy: "skorni",
    changedDate: "2024-01-28T15:10:00Z",
    changeDescription: "Added validation rules and updated field labels.",
    previousState: mockUIMetadata.find((ui) => ui.id === "UI001"),
    newState: {
      ...mockUIMetadata.find((ui) => ui.id === "UI001")!,
      fields: mockUIMetadata
        .find((ui) => ui.id === "UI001")!
        .fields.map((field) => ({
          ...field,
          label: field.fieldName === "trade_id" ? "Trade Reference ID" : field.label,
        })),
    },
  },
  {
    id: "VH015",
    entityId: "UI001",
    entityType: "UI Metadata",
    entityName: "Trade Entry Form",
    version: 1,
    changeType: "Create",
    changedBy: "urawat",
    changedDate: "2023-11-15T00:00:00Z",
    changeDescription: "Initial creation of Trade Entry Form UI metadata.",
    previousState: null,
    newState: mockUIMetadata.find((ui) => ui.id === "UI001"),
  },
  {
    id: "VH016",
    entityId: "RULE002",
    entityType: "Rule",
    entityName: "Trade Limit Check",
    version: 2,
    changeType: "Update",
    changedBy: "skorni",
    changedDate: "2024-01-30T11:25:00Z",
    changeDescription: "Updated expression to include currency conversion for multi-currency limits.",
    previousState: mockRules.find((rule) => rule.id === "RULE002"),
    newState: {
      ...mockRules.find((rule) => rule.id === "RULE002")!,
      expression: "CONVERT_TO_USD(notional_amount, currency) <= counterparty_limit",
    },
  },
  {
    id: "VH017",
    entityId: "RULE002",
    entityType: "Rule",
    entityName: "Trade Limit Check",
    version: 1,
    changeType: "Create",
    changedBy: "urawat",
    changedDate: "2023-12-10T00:00:00Z",
    changeDescription: "Initial creation of Trade Limit Check rule.",
    previousState: null,
    newState: mockRules.find((rule) => rule.id === "RULE002"),
  },
  {
    id: "VH018",
    entityId: "CONN001",
    entityType: "Connection",
    entityName: "Treasury Management System",
    version: 2,
    changeType: "Update",
    changedBy: "pthakkar",
    changedDate: "2024-02-01T14:00:00Z",
    changeDescription: "Updated connection timeout settings and added SSL configuration.",
    previousState: mockConnections.find((conn) => conn.id === "CONN001"),
    newState: {
      ...mockConnections.find((conn) => conn.id === "CONN001")!,
      port: 1522,
      description: "Primary treasury management system database with SSL encryption",
    },
  },
  {
    id: "VH019",
    entityId: "CONN001",
    entityType: "Connection",
    entityName: "Treasury Management System",
    version: 1,
    changeType: "Create",
    changedBy: "ntiwari",
    changedDate: "2023-06-01T00:00:00Z",
    changeDescription: "Initial creation of Treasury Management System connection.",
    previousState: null,
    newState: mockConnections.find((conn) => conn.id === "CONN001"),
  },
  {
    id: "VH020",
    entityId: "RULESET002",
    entityType: "Rule Set",
    entityName: "Regulatory Compliance Checks",
    version: 2,
    changeType: "Update",
    changedBy: "urawat",
    changedDate: "2024-02-05T09:45:00Z",
    changeDescription: "Added new rule RULE003 to the rule set and changed execution order to Sequential.",
    previousState: mockRuleSets.find((rs) => rs.id === "RULESET002"),
    newState: {
      ...mockRuleSets.find((rs) => rs.id === "RULESET002")!,
      executionOrder: "Sequential",
      rules: [
        { ruleId: "RULE002", order: 1, isActive: true },
        { ruleId: "RULE003", order: 2, isActive: true },
      ],
    },
  },
  {
    id: "VH021",
    entityId: "RULESET002",
    entityType: "Rule Set",
    entityName: "Regulatory Compliance Checks",
    version: 1,
    changeType: "Create",
    changedBy: "urawat",
    changedDate: "2024-01-05T00:00:00Z",
    changeDescription: "Initial creation of Regulatory Compliance Checks rule set.",
    previousState: null,
    newState: mockRuleSets.find((rs) => rs.id === "RULESET002"),
  },
  {
    id: "VH022",
    entityId: "OBJ003",
    entityType: "Object",
    entityName: "Settlement Instructions",
    version: 2,
    changeType: "Update",
    changedBy: "ypatil",
    changedDate: "2024-02-08T16:20:00Z",
    changeDescription: "Added new schema fields for enhanced settlement tracking.",
    previousState: mockObjects.find((obj) => obj.id === "OBJ003"),
    newState: {
      ...mockObjects.find((obj) => obj.id === "OBJ003")!,
      schema: [
        ...mockObjects.find((obj) => obj.id === "OBJ003")!.schema,
        {
          id: "S003_06",
          attributeName: "settlement_status",
          dataType: "String",
          isNullable: false,
          sourceField: "STATUS",
          sampleValue: "PENDING",
        },
        {
          id: "S003_07",
          attributeName: "created_timestamp",
          dataType: "DateTime",
          isNullable: false,
          sourceField: "CREATED_TS",
          sampleValue: "2024-01-17T10:30:00Z",
        },
      ],
    },
  },
  {
    id: "VH023",
    entityId: "OBJ003",
    entityType: "Object",
    entityName: "Settlement Instructions",
    version: 1,
    changeType: "Create",
    changedBy: "ypatil",
    changedDate: "2023-08-05T00:00:00Z",
    changeDescription: "Initial creation of Settlement Instructions object.",
    previousState: null,
    newState: mockObjects.find((obj) => obj.id === "OBJ003"),
  },
  {
    id: "VH024",
    entityId: "SCAFFOLD002",
    entityType: "Scaffold",
    entityName: "Regulatory Report Output",
    version: 2,
    changeType: "Update",
    changedBy: "skorni",
    changedDate: "2024-02-10T12:15:00Z",
    changeDescription: "Enhanced transformations for new regulatory requirements.",
    previousState: scaffold002_base,
    newState: {
      ...scaffold002_base,
      columns: [
        ...scaffold002_base.columns,
        {
          id: "col-2-5",
          name: "regulatory_product_code",
          dataType: "String",
          transformation: {
            sourceColumn: "product_type",
            targetColumn: "regulatory_product_code",
            transformation: "Lookup",
            expression: "LOOKUP_PRODUCT_CODE(product_type)",
            sourceColumns: ["product_type"],
            steps: [],
          },
        },
      ],
      approvalStatus: "Pending Peer Review",
    },
  },
  {
    id: "VH025",
    entityId: "SCAFFOLD002",
    entityType: "Scaffold",
    entityName: "Regulatory Report Output",
    version: 1,
    changeType: "Create",
    changedBy: "urawat",
    changedDate: "2024-01-12T00:00:00Z",
    changeDescription: "Initial creation of Regulatory Report Output scaffold.",
    previousState: null,
    newState: scaffold002_base,
  },
]
