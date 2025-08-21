export type Status = "A" | "I" // Active | Inactive
export type ApprovalStatus = "Draft" | "Pending Peer Review" | "Pending Final Approval" | "Approved" | "Rejected"

export type User = {
  id: string
  username: string
  fullName: string
  email: string
  role: string
  department: string
  isActive: boolean
  lastLogin: string
  createdDate: string
}

export type ConnectionType = "Database" | "API" | "File" | "FTP" | "Message Queue" | "Web Service"
export type Connection = {
  id: string
  name: string
  type: ConnectionType
  host: string
  port: number
  database?: string
  username: string
  description: string
  isActive: boolean
  baseUrl?: string
  createdBy: string
  createdDate: string
  lastModifiedBy?: string
  lastModifiedDate?: string
}

export type DataType = "String" | "Integer" | "Decimal" | "Date" | "DateTime" | "Boolean" | "JSON" | "XML"
export type ObjectType = "Table" | "View" | "API" | "File" | "Queue"

export type ObjectSchemaAttribute = {
  id: string
  attributeName: string
  dataType: DataType
  isNullable: boolean
  sourceField?: string
  sampleValue?: string
}

export interface IntegrationObject {
  id: string
  name: string
  type: string
}

export type Rule = {
  id: string
  name: string
  description: string
  ruleType: "Validation" | "Business" | "Transformation"
  sourceObjectId: string
  targetObjectId?: string
  expression: string
  isActive: boolean
  priority: number
  effectiveDate: string
  status: Status
  approvalStatus: ApprovalStatus
  createdBy: string
  createdDate: string
  approvedBy?: string
  approvedDate?: string
}

export type RuleSet = {
  id: string
  name: string
  description: string
  rules: { ruleId: string; order: number; isActive: boolean }[]
  executionOrder: "Sequential" | "Parallel"
  isActive: boolean
  effectiveDate: string
  status: Status
  approvalStatus: ApprovalStatus
  createdBy: string
  createdDate: string
  approvedBy?: string
  approvedDate?: string
}

export interface TransformationStep {
  id: string
  type: "Direct Copy" | "Concatenate" | "Expression"
  sourceColumns: string[]
  delimiter?: string
  expression?: string
}

export interface Transformation {
  sourceColumn: string
  targetColumn: string
  transformation: string
  expression?: string
  sourceColumns?: string[]
  steps?: TransformationStep[]
}

export interface ScaffoldColumn {
  id: string
  name: string
  dataType: string
  transformation: Transformation
}

export interface ApprovalDetails {
  status: "Pending" | "Approved" | "Rejected"
  approver?: string
  approvalDate?: string
  rejectionReason?: string
}

// New Types for Scaffold
export type AggregationFunction = "SUM" | "COUNT" | "AVG" | "MIN" | "MAX"

export interface AggregationRule {
  id: string
  column: string
  aggregationFunction: AggregationFunction
}

export interface Aggregation {
  id: string
  groupByColumns: string[]
  aggregations: AggregationRule[]
}

export type FilterOperator =
  | "equals"
  | "not_equals"
  | "greater_than"
  | "less_than"
  | "contains"
  | "starts_with"
  | "ends_with"

export interface FilterCondition {
  id: string
  column: string
  operator: FilterOperator
  value: string
}

export type OrderDirection = "asc" | "desc"

export interface OrderRule {
  id: string
  column: string
  direction: OrderDirection
}

export interface Scaffold {
  id: string
  name: string
  description: string
  sourceObjectName: string
  targetObjectName: string
  columns: ScaffoldColumn[]
  approvalDetails: ApprovalDetails
  // Added from component state for consistency
  type: "Scaffold_In" | "Scaffold_Out"
  sourceObjectId: string
  targetObjectId: string
  // New fields
  aggregations?: Aggregation[]
  filters?: FilterCondition[]
  ordering?: OrderRule[]
}

export type RunControlStepType = "RuleSet" | "Scaffold" | "CustomScript"
export type RunControlStep = {
  id: string
  name: string
  order: number
  runType: RunControlStepType
  runTargetId: string
  isActive: boolean
}

export type RunControlTriggerType = "OnDemand" | "Scheduled" | "RealtimeStream" | "FileWatch" | "DatabaseChange"
export type RunControl = {
  id: string
  name: string
  description: string
  triggerType: RunControlTriggerType
  scheduleExpression?: string
  holidayCalendarId?: string
  steps: RunControlStep[]
  isActive: boolean
  effectiveDate: string
  status: Status
  approvalStatus: ApprovalStatus
  createdBy: string
  createdDate: string
  approvedBy?: string
  approvedDate?: string
}

export type HolidayCalendar = {
  id: string
  name: string
  description: string
  country: string
  holidays: { date: string; name: string }[]
  isActive: boolean
  createdBy: string
  createdDate: string
}

export type ProcessLog = {
  id: string
  runControlId: string
  executionId: string
  startTime: string
  endTime: string
  status: "Running" | "Completed" | "Failed"
  totalRecords: number
  successRecords: number
  errorRecords: number
  logs: { timestamp: string; level: "INFO" | "WARN" | "ERROR"; message: string; component: string }[]
  triggeredBy: string
  createdDate: string
}

export type LayoutType = "form" | "table" | "card" | "wizard"
export type FieldDisplayType =
  | "input"
  | "textarea"
  | "select"
  | "multiselect"
  | "checkbox"
  | "radio"
  | "date"
  | "datetime"
  | "number"
  | "currency"
  | "file"
export type SectionType = "header" | "body" | "footer" | "sidebar"

export type UIField = {
  id: string
  fieldName: string
  label: string
  dataType: DataType
  displayType: FieldDisplayType
  section: string
  order: number
  isRequired: boolean
  isReadonly: boolean
  isVisible: boolean
  width: string
  defaultValue?: any
  options?: { value: string; label: string }[]
}

export type UISection = {
  id: string
  name: string
  type: SectionType
  order: number
  columns: number
  fields: string[]
}

export type UIMetadata = {
  id: string
  name: string
  description: string
  sourceObjectId: string
  layoutType: LayoutType
  effectiveDate: string
  status: Status
  approvalStatus: ApprovalStatus
  fields: UIField[]
  sections: UISection[]
  configuration: {
    allowCreate: boolean
    allowEdit: boolean
    allowDelete: boolean
    pageSize: number
    enableSearch: boolean
    enableFilter: boolean
    enableSort: boolean
    enableExport: boolean
  }
  createdBy: string
  createdDate: string
  approvedBy?: string
  approvedDate?: string
}

export type DynamicRecord = {
  id: string
  uiMetadataId: string
  data: Record<string, any>
  status: Status
  approvalStatus: ApprovalStatus
  createdBy: string
  createdDate: string
  lastModifiedBy?: string
  lastModifiedDate?: string
  approvedBy?: string
  approvedDate?: string
}

export type EntityType = "Connection" | "Object" | "Rule" | "Rule Set" | "Run Control" | "UI Metadata"

export interface VersionHistoryItem {
  id: string
  objectId: string
  objectType: string
  version: number
  modifiedBy: string
  modifiedDate: string
  changeDescription: string
  data: any // The snapshot of the object at this version
}

export type VersionHistoryEntry = {
  id: string
  entityId: string
  entityType: EntityType
  entityName: string
  version: number
  changeType: "Create" | "Update" | "Delete"
  changedBy: string
  changedDate: string
  changeDescription: string
  previousState: any
  newState: any
}
