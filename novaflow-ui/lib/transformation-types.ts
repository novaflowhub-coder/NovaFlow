export interface TransformationStep {
  id: string
  type: TransformationType
  description: string
  sourceColumns: string[]
  targetColumn: string
  parameters: Record<string, any>
  order: number
}

export type TransformationType =
  | "DIRECT_COPY"
  | "CONCAT"
  | "SUBSTRING"
  | "UPPER_CASE"
  | "LOWER_CASE"
  | "TRIM"
  | "REPLACE"
  | "DATE_FORMAT"
  | "NUMBER_FORMAT"
  | "CONDITIONAL"
  | "LOOKUP"
  | "CALCULATE"
  | "GENERATE_UUID"
  | "GENERATE_HASH"
  | "CURRENT_TIMESTAMP"
  | "DEFAULT_VALUE"

export interface TransformationTypeInfo {
  type: TransformationType
  label: string
  description: string
  requiresMultipleSource: boolean
  parameters: TransformationParameter[]
}

export interface TransformationParameter {
  name: string
  label: string
  type: "text" | "number" | "select" | "boolean"
  required: boolean
  options?: { value: string; label: string }[]
  defaultValue?: any
}

export const transformationTypes: TransformationTypeInfo[] = [
  {
    type: "DIRECT_COPY",
    label: "Direct Copy",
    description: "Copy source column value directly to target",
    requiresMultipleSource: false,
    parameters: [],
  },
  {
    type: "CONCAT",
    label: "Concatenate",
    description: "Combine multiple source columns with a separator",
    requiresMultipleSource: true,
    parameters: [
      {
        name: "separator",
        label: "Separator",
        type: "text",
        required: false,
        defaultValue: " ",
      },
    ],
  },
  {
    type: "SUBSTRING",
    label: "Substring",
    description: "Extract a portion of the source column",
    requiresMultipleSource: false,
    parameters: [
      {
        name: "startIndex",
        label: "Start Index",
        type: "number",
        required: true,
        defaultValue: 0,
      },
      {
        name: "length",
        label: "Length",
        type: "number",
        required: false,
      },
    ],
  },
  {
    type: "UPPER_CASE",
    label: "Upper Case",
    description: "Convert text to uppercase",
    requiresMultipleSource: false,
    parameters: [],
  },
  {
    type: "LOWER_CASE",
    label: "Lower Case",
    description: "Convert text to lowercase",
    requiresMultipleSource: false,
    parameters: [],
  },
  {
    type: "TRIM",
    label: "Trim",
    description: "Remove leading and trailing whitespace",
    requiresMultipleSource: false,
    parameters: [],
  },
  {
    type: "REPLACE",
    label: "Replace",
    description: "Replace text patterns in the source column",
    requiresMultipleSource: false,
    parameters: [
      {
        name: "searchValue",
        label: "Search Value",
        type: "text",
        required: true,
      },
      {
        name: "replaceValue",
        label: "Replace Value",
        type: "text",
        required: true,
      },
    ],
  },
  {
    type: "DATE_FORMAT",
    label: "Date Format",
    description: "Format date values",
    requiresMultipleSource: false,
    parameters: [
      {
        name: "inputFormat",
        label: "Input Format",
        type: "text",
        required: true,
        defaultValue: "yyyy-MM-dd",
      },
      {
        name: "outputFormat",
        label: "Output Format",
        type: "text",
        required: true,
        defaultValue: "MM/dd/yyyy",
      },
    ],
  },
  {
    type: "NUMBER_FORMAT",
    label: "Number Format",
    description: "Format numeric values",
    requiresMultipleSource: false,
    parameters: [
      {
        name: "decimalPlaces",
        label: "Decimal Places",
        type: "number",
        required: false,
        defaultValue: 2,
      },
      {
        name: "thousandsSeparator",
        label: "Thousands Separator",
        type: "boolean",
        required: false,
        defaultValue: true,
      },
    ],
  },
  {
    type: "CONDITIONAL",
    label: "Conditional",
    description: "Apply conditional logic based on source value",
    requiresMultipleSource: false,
    parameters: [
      {
        name: "condition",
        label: "Condition",
        type: "select",
        required: true,
        options: [
          { value: "equals", label: "Equals" },
          { value: "not_equals", label: "Not Equals" },
          { value: "contains", label: "Contains" },
          { value: "starts_with", label: "Starts With" },
          { value: "ends_with", label: "Ends With" },
          { value: "is_null", label: "Is Null" },
          { value: "is_not_null", label: "Is Not Null" },
        ],
      },
      {
        name: "conditionValue",
        label: "Condition Value",
        type: "text",
        required: false,
      },
      {
        name: "trueValue",
        label: "Value if True",
        type: "text",
        required: true,
      },
      {
        name: "falseValue",
        label: "Value if False",
        type: "text",
        required: true,
      },
    ],
  },
  {
    type: "LOOKUP",
    label: "Lookup",
    description: "Lookup value from another table or dataset",
    requiresMultipleSource: false,
    parameters: [
      {
        name: "lookupTable",
        label: "Lookup Table",
        type: "text",
        required: true,
      },
      {
        name: "lookupColumn",
        label: "Lookup Column",
        type: "text",
        required: true,
      },
      {
        name: "returnColumn",
        label: "Return Column",
        type: "text",
        required: true,
      },
    ],
  },
  {
    type: "CALCULATE",
    label: "Calculate",
    description: "Perform mathematical calculations",
    requiresMultipleSource: true,
    parameters: [
      {
        name: "expression",
        label: "Expression",
        type: "text",
        required: true,
        defaultValue: "A + B",
      },
    ],
  },
  {
    type: "GENERATE_UUID",
    label: "Generate UUID",
    description: "Generate a unique identifier",
    requiresMultipleSource: false,
    parameters: [],
  },
  {
    type: "GENERATE_HASH",
    label: "Generate Hash",
    description: "Generate hash from multiple columns",
    requiresMultipleSource: true,
    parameters: [
      {
        name: "algorithm",
        label: "Hash Algorithm",
        type: "select",
        required: true,
        options: [
          { value: "md5", label: "MD5" },
          { value: "sha1", label: "SHA1" },
          { value: "sha256", label: "SHA256" },
        ],
        defaultValue: "sha256",
      },
    ],
  },
  {
    type: "CURRENT_TIMESTAMP",
    label: "Current Timestamp",
    description: "Insert current date and time",
    requiresMultipleSource: false,
    parameters: [
      {
        name: "format",
        label: "Format",
        type: "select",
        required: true,
        options: [
          { value: "iso", label: "ISO 8601" },
          { value: "unix", label: "Unix Timestamp" },
          { value: "custom", label: "Custom Format" },
        ],
        defaultValue: "iso",
      },
    ],
  },
  {
    type: "DEFAULT_VALUE",
    label: "Default Value",
    description: "Use default value when source is null or empty",
    requiresMultipleSource: false,
    parameters: [
      {
        name: "defaultValue",
        label: "Default Value",
        type: "text",
        required: true,
      },
    ],
  },
]
