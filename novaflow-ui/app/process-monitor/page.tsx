"use client"

import { useState, useEffect } from "react"
import { RefreshCw, FileText, Play, Square, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import type { ProcessLog } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { mockProcessLogs } from "@/lib/mock-data"

interface RuleSetExecution {
  id: string
  runControlId: string
  runControlName: string
  currentStep: number
  totalSteps: number
  status: "Running" | "Success" | "Failed" | "Cancelled" | "Queued" | "Scheduled"
  startTime: string
  endTime?: string
  duration?: string
  progress: number
  currentStepName: string
  logs: ProcessLog[]
  nextScheduled?: string
}

// Banking-focused mock execution data
const mockExecutions: RuleSetExecution[] = [
  {
    id: "EXE001",
    runControlId: "RC001",
    runControlName: "Daily Customer KYC Processing",
    currentStep: 2,
    totalSteps: 4,
    status: "Running",
    startTime: "2024-01-15T02:30:00Z",
    progress: 50,
    currentStepName: "Customer Risk Assessment Rules",
    logs: mockProcessLogs.filter((log) => log.runControlId === "RC001"),
  },
  {
    id: "EXE002",
    runControlId: "RC002",
    runControlName: "Transaction Fraud Detection",
    currentStep: 3,
    totalSteps: 3,
    status: "Success",
    startTime: "2024-01-15T01:45:00Z",
    endTime: "2024-01-15T01:47:23Z",
    duration: "2m 23s",
    progress: 100,
    currentStepName: "Fraud Alert Generation",
    logs: mockProcessLogs.filter((log) => log.runControlId === "RC002"),
  },
  {
    id: "EXE003",
    runControlId: "RC003",
    runControlName: "Credit Risk Assessment",
    currentStep: 2,
    totalSteps: 5,
    status: "Failed",
    startTime: "2024-01-14T23:30:00Z",
    endTime: "2024-01-14T23:32:45Z",
    duration: "2m 45s",
    progress: 40,
    currentStepName: "Credit Score Validation",
    logs: mockProcessLogs.filter((log) => log.runControlId === "RC003"),
  },
  {
    id: "EXE004",
    runControlId: "RC004",
    runControlName: "Regulatory Compliance Check",
    currentStep: 0,
    totalSteps: 6,
    status: "Scheduled",
    startTime: "2024-01-16T03:00:00Z",
    progress: 0,
    currentStepName: "Waiting to start",
    logs: [],
    nextScheduled: "2024-01-16T03:00:00Z",
  },
  {
    id: "EXE005",
    runControlId: "RC005",
    runControlName: "Anti-Money Laundering Scan",
    currentStep: 0,
    totalSteps: 4,
    status: "Queued",
    startTime: "2024-01-15T04:00:00Z",
    progress: 0,
    currentStepName: "Waiting in queue",
    logs: [],
  },
  {
    id: "EXE006",
    runControlId: "RC006",
    runControlName: "Loan Application Processing",
    currentStep: 3,
    totalSteps: 5,
    status: "Running",
    startTime: "2024-01-15T08:15:00Z",
    progress: 60,
    currentStepName: "Income Verification Rules",
    logs: [],
  },
  {
    id: "EXE007",
    runControlId: "RC007",
    runControlName: "Account Closure Validation",
    currentStep: 2,
    totalSteps: 3,
    status: "Success",
    startTime: "2024-01-15T07:30:00Z",
    endTime: "2024-01-15T07:31:15Z",
    duration: "1m 15s",
    progress: 100,
    currentStepName: "Final Balance Verification",
    logs: [],
  },
  {
    id: "EXE008",
    runControlId: "RC008",
    runControlName: "Wire Transfer Compliance",
    currentStep: 1,
    totalSteps: 4,
    status: "Running",
    startTime: "2024-01-15T09:45:00Z",
    progress: 25,
    currentStepName: "SWIFT Message Validation",
    logs: [],
  },
]

const statusIcons = {
  Running: <Play className="h-4 w-4 text-blue-500" />,
  Success: <CheckCircle className="h-4 w-4 text-green-500" />,
  Failed: <XCircle className="h-4 w-4 text-red-500" />,
  Cancelled: <Square className="h-4 w-4 text-yellow-500" />,
  Queued: <Clock className="h-4 w-4 text-gray-500" />,
  Scheduled: <AlertCircle className="h-4 w-4 text-purple-500" />,
}

const statusColors = {
  Running: "bg-blue-100 text-blue-800 border-blue-200",
  Success: "bg-green-100 text-green-800 border-green-200",
  Failed: "bg-red-100 text-red-800 border-red-200",
  Cancelled: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Queued: "bg-gray-100 text-gray-800 border-gray-200",
  Scheduled: "bg-purple-100 text-purple-800 border-purple-200",
}

export default function ProcessMonitorPage() {
  const { toast } = useToast()
  const [executions, setExecutions] = useState<RuleSetExecution[]>(mockExecutions)
  const [selectedExecution, setSelectedExecution] = useState<RuleSetExecution | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [filters, setFilters] = useState({
    status: "all",
    runControl: "all",
  })

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setExecutions((prev) =>
        prev.map((exec) => {
          if (exec.status === "Running") {
            const newProgress = Math.min(exec.progress + Math.random() * 3, 95)
            return { ...exec, progress: newProgress }
          }
          return exec
        }),
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const filteredExecutions = executions.filter((exec) => {
    if (filters.status !== "all" && exec.status !== filters.status) return false
    if (filters.runControl !== "all" && exec.runControlName !== filters.runControl) return false
    return true
  })

  const handleRefresh = () => {
    // Simulate refresh
    toast({ title: "Dashboard Refreshed", description: "Latest execution status loaded." })
  }

  const viewExecutionDetails = (execution: RuleSetExecution) => {
    setSelectedExecution(execution)
    setIsDetailDialogOpen(true)
  }

  const getTimeDisplay = (execution: RuleSetExecution) => {
    if (execution.status === "Scheduled") {
      return `Scheduled: ${new Date(execution.nextScheduled!).toLocaleString()}`
    }
    if (execution.endTime) {
      return `Completed: ${new Date(execution.endTime).toLocaleString()}`
    }
    if (execution.status === "Running") {
      const elapsed = Math.floor((Date.now() - new Date(execution.startTime).getTime()) / 1000)
      const minutes = Math.floor(elapsed / 60)
      const seconds = elapsed % 60
      return `Running: ${minutes}m ${seconds}s`
    }
    return `Started: ${new Date(execution.startTime).toLocaleString()}`
  }

  const runningCount = executions.filter((e) => e.status === "Running").length
  const queuedCount = executions.filter((e) => e.status === "Queued").length
  const scheduledCount = executions.filter((e) => e.status === "Scheduled").length

  // Banking-specific step details for different run controls
  const getBankingSteps = (runControlId: string, runControlName: string) => {
    const stepMappings: { [key: string]: any[] } = {
      RC001: [
        {
          id: "STEP001",
          runTypeName: "Customer Data Input",
          description: "Load customer information from core banking",
          runType: "Scaffold_In",
        },
        {
          id: "STEP002",
          runTypeName: "KYC Validation Rules",
          description: "Validate customer identity and documentation",
          runType: "RuleSet",
        },
        {
          id: "STEP003",
          runTypeName: "Risk Assessment Rules",
          description: "Assess customer risk profile",
          runType: "RuleSet",
        },
        {
          id: "STEP004",
          runTypeName: "Compliance Output",
          description: "Generate compliance reports",
          runType: "Scaffold_Out",
        },
      ],
      RC002: [
        {
          id: "STEP001",
          runTypeName: "Transaction Data Input",
          description: "Load real-time transaction data",
          runType: "Scaffold_In",
        },
        {
          id: "STEP002",
          runTypeName: "Fraud Detection Rules",
          description: "Apply fraud detection algorithms",
          runType: "RuleSet",
        },
        {
          id: "STEP003",
          runTypeName: "Alert Generation",
          description: "Generate fraud alerts and notifications",
          runType: "Scaffold_Out",
        },
      ],
      RC003: [
        {
          id: "STEP001",
          runTypeName: "Credit Application Input",
          description: "Load credit application data",
          runType: "Scaffold_In",
        },
        {
          id: "STEP002",
          runTypeName: "Credit Score Validation",
          description: "Validate and calculate credit scores",
          runType: "RuleSet",
        },
        {
          id: "STEP003",
          runTypeName: "Risk Assessment",
          description: "Assess credit risk factors",
          runType: "RuleSet",
        },
        {
          id: "STEP004",
          runTypeName: "Underwriting Rules",
          description: "Apply underwriting criteria",
          runType: "RuleSet",
        },
        {
          id: "STEP005",
          runTypeName: "Decision Output",
          description: "Generate credit decision",
          runType: "Scaffold_Out",
        },
      ],
      RC004: [
        {
          id: "STEP001",
          runTypeName: "Regulatory Data Input",
          description: "Load regulatory reporting data",
          runType: "Scaffold_In",
        },
        {
          id: "STEP002",
          runTypeName: "Basel III Compliance",
          description: "Apply Basel III regulatory rules",
          runType: "RuleSet",
        },
        {
          id: "STEP003",
          runTypeName: "CCAR Stress Testing",
          description: "Perform stress testing scenarios",
          runType: "RuleSet",
        },
        {
          id: "STEP004",
          runTypeName: "Liquidity Coverage",
          description: "Calculate liquidity coverage ratios",
          runType: "RuleSet",
        },
        { id: "STEP005", runTypeName: "Risk Reporting", description: "Generate risk reports", runType: "RuleSet" },
        {
          id: "STEP006",
          runTypeName: "Regulatory Output",
          description: "Submit regulatory reports",
          runType: "Scaffold_Out",
        },
      ],
      RC005: [
        {
          id: "STEP001",
          runTypeName: "Transaction Monitoring",
          description: "Monitor suspicious transactions",
          runType: "Scaffold_In",
        },
        {
          id: "STEP002",
          runTypeName: "AML Pattern Detection",
          description: "Detect money laundering patterns",
          runType: "RuleSet",
        },
        {
          id: "STEP003",
          runTypeName: "Sanctions Screening",
          description: "Screen against sanctions lists",
          runType: "RuleSet",
        },
        {
          id: "STEP004",
          runTypeName: "SAR Generation",
          description: "Generate suspicious activity reports",
          runType: "Scaffold_Out",
        },
      ],
      RC006: [
        {
          id: "STEP001",
          runTypeName: "Loan Application Input",
          description: "Load loan application data",
          runType: "Scaffold_In",
        },
        {
          id: "STEP002",
          runTypeName: "Eligibility Rules",
          description: "Check loan eligibility criteria",
          runType: "RuleSet",
        },
        {
          id: "STEP003",
          runTypeName: "Income Verification",
          description: "Verify applicant income",
          runType: "RuleSet",
        },
        {
          id: "STEP004",
          runTypeName: "Collateral Assessment",
          description: "Assess collateral value",
          runType: "RuleSet",
        },
        {
          id: "STEP005",
          runTypeName: "Approval Decision",
          description: "Generate loan approval decision",
          runType: "Scaffold_Out",
        },
      ],
      RC007: [
        {
          id: "STEP001",
          runTypeName: "Account Data Input",
          description: "Load account closure request",
          runType: "Scaffold_In",
        },
        {
          id: "STEP002",
          runTypeName: "Balance Verification",
          description: "Verify final account balance",
          runType: "RuleSet",
        },
        {
          id: "STEP003",
          runTypeName: "Closure Confirmation",
          description: "Confirm account closure",
          runType: "Scaffold_Out",
        },
      ],
      RC008: [
        {
          id: "STEP001",
          runTypeName: "Wire Transfer Input",
          description: "Load wire transfer request",
          runType: "Scaffold_In",
        },
        {
          id: "STEP002",
          runTypeName: "SWIFT Validation",
          description: "Validate SWIFT message format",
          runType: "RuleSet",
        },
        {
          id: "STEP003",
          runTypeName: "Sanctions Check",
          description: "Check against sanctions lists",
          runType: "RuleSet",
        },
        {
          id: "STEP004",
          runTypeName: "Transfer Execution",
          description: "Execute wire transfer",
          runType: "Scaffold_Out",
        },
      ],
    }

    return (
      stepMappings[runControlId] || [
        { id: "STEP001", runTypeName: "Data Input", description: "Load input data", runType: "Scaffold_In" },
        { id: "STEP002", runTypeName: "Rule Processing", description: "Apply business rules", runType: "RuleSet" },
        { id: "STEP003", runTypeName: "Data Output", description: "Generate output", runType: "Scaffold_Out" },
      ]
    )
  }

  return (
    <>
      <PageHeader
        title="Process Monitor"
        description="Real-time execution dashboard for banking rule processing"
        actions={
          <Button onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh
          </Button>
        }
      />

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Running</p>
                <p className="text-2xl font-bold text-blue-600">{runningCount}</p>
              </div>
              <Play className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Queued</p>
                <p className="text-2xl font-bold text-gray-600">{queuedCount}</p>
              </div>
              <Clock className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Scheduled</p>
                <p className="text-2xl font-bold text-purple-600">{scheduledCount}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Active</p>
                <p className="text-2xl font-bold">{executions.length}</p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Select value={filters.status} onValueChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Running">Running</SelectItem>
              <SelectItem value="Success">Success</SelectItem>
              <SelectItem value="Failed">Failed</SelectItem>
              <SelectItem value="Queued">Queued</SelectItem>
              <SelectItem value="Scheduled">Scheduled</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filters.runControl}
            onValueChange={(value) => setFilters((prev) => ({ ...prev, runControl: value }))}
          >
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Filter by Process" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Processes</SelectItem>
              {Array.from(new Set(executions.map((e) => e.runControlName))).map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Banking Process Board */}
      <Card>
        <CardHeader>
          <CardTitle>Banking Process Execution Board</CardTitle>
          <CardDescription>Live status of banking rule set executions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredExecutions.map((execution) => (
              <div
                key={execution.id}
                className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => viewExecutionDetails(execution)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center gap-2">
                      {statusIcons[execution.status]}
                      <Badge className={statusColors[execution.status]}>{execution.status}</Badge>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{execution.runControlName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {execution.currentStepName} • Step {execution.currentStep} of {execution.totalSteps}
                      </p>
                    </div>

                    <div className="text-right min-w-48">
                      <p className="text-sm font-medium">{getTimeDisplay(execution)}</p>
                      {execution.duration && (
                        <p className="text-xs text-muted-foreground">Duration: {execution.duration}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                {execution.status === "Running" && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Progress</span>
                      <span>{Math.round(execution.progress)}%</span>
                    </div>
                    <Progress value={execution.progress} className="h-2" />
                  </div>
                )}

                {/* Step Indicators */}
                <div className="mt-3 flex items-center gap-2">
                  {Array.from({ length: execution.totalSteps }, (_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full ${
                        i < execution.currentStep
                          ? "bg-green-500"
                          : i === execution.currentStep && execution.status === "Running"
                            ? "bg-blue-500 animate-pulse"
                            : i === execution.currentStep && execution.status === "Failed"
                              ? "bg-red-500"
                              : "bg-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-xs text-muted-foreground ml-2">
                    {execution.currentStep} / {execution.totalSteps} steps
                  </span>
                </div>
              </div>
            ))}

            {filteredExecutions.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No executions found</h3>
                <p className="text-muted-foreground">No banking process executions match your current filters.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Execution Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedExecution && statusIcons[selectedExecution.status]}
              {selectedExecution?.runControlName} - Execution Details
            </DialogTitle>
            <DialogDescription>
              Execution ID: {selectedExecution?.id} • Process: {selectedExecution?.runControlId}
            </DialogDescription>
          </DialogHeader>

          {selectedExecution && (
            <div className="space-y-6">
              {/* Execution Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    {statusIcons[selectedExecution.status]}
                    <Badge className={statusColors[selectedExecution.status]}>{selectedExecution.status}</Badge>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Progress</p>
                  <p className="text-lg font-semibold">{Math.round(selectedExecution.progress)}%</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Current Step</p>
                  <p className="text-lg font-semibold">
                    {selectedExecution.currentStep} / {selectedExecution.totalSteps}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Duration</p>
                  <p className="text-lg font-semibold">{selectedExecution.duration || "In progress"}</p>
                </div>
              </div>

              {/* Step Details */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Banking Process Steps</h3>
                <div className="space-y-2">
                  {getBankingSteps(selectedExecution.runControlId, selectedExecution.runControlName).map(
                    (step, index) => (
                      <div
                        key={step.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border ${
                          index < selectedExecution.currentStep
                            ? "bg-green-50 border-green-200"
                            : index === selectedExecution.currentStep
                              ? selectedExecution.status === "Running"
                                ? "bg-blue-50 border-blue-200"
                                : selectedExecution.status === "Failed"
                                  ? "bg-red-50 border-red-200"
                                  : "bg-gray-50 border-gray-200"
                              : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            index < selectedExecution.currentStep
                              ? "bg-green-500 text-white"
                              : index === selectedExecution.currentStep && selectedExecution.status === "Running"
                                ? "bg-blue-500 text-white animate-pulse"
                                : index === selectedExecution.currentStep && selectedExecution.status === "Failed"
                                  ? "bg-red-500 text-white"
                                  : "bg-gray-300 text-gray-600"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{step.runTypeName}</p>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                        <div className="text-sm text-muted-foreground">{step.runType}</div>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* Execution Logs */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Execution Logs</h3>
                <div className="bg-muted p-4 rounded-lg max-h-64 overflow-y-auto">
                  {selectedExecution.logs.length > 0 ? (
                    <pre className="text-sm whitespace-pre-wrap">
                      {selectedExecution.logs.map((log) => log.logDetails).join("\n\n---\n\n")}
                    </pre>
                  ) : (
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>
                        [{new Date().toISOString()}] Process started: {selectedExecution.runControlName}
                      </p>
                      <p>[{new Date().toISOString()}] Loading banking data from core systems...</p>
                      <p>[{new Date().toISOString()}] Applying regulatory compliance rules...</p>
                      {selectedExecution.status === "Running" && (
                        <p>
                          [{new Date().toISOString()}] Currently executing: {selectedExecution.currentStepName}
                        </p>
                      )}
                      {selectedExecution.status === "Success" && (
                        <p>[{new Date().toISOString()}] Process completed successfully</p>
                      )}
                      {selectedExecution.status === "Failed" && (
                        <p>
                          [{new Date().toISOString()}] ERROR: Process failed during {selectedExecution.currentStepName}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setIsDetailDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
