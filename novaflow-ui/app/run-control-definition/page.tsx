"use client"

import { useState, useEffect } from "react"
import {
  PlusCircle,
  Trash2,
  Play,
  CalendarDays,
  ArrowUpDown,
  Check,
  X,
  Send,
  DatabaseZap,
  FileDigit,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DatePicker } from "@/components/ui/date-picker"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { PageHeader } from "@/components/page-header"
import type { RunControl, RunControlStep, Status, ApprovalStatus, TriggerType, RunControlStepType } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import {
  runTypes, // Now correctly { value: RunControlStepType; label: string }[]
  mockRunControls,
  mockHolidayCalendarOptions,
  triggerTypeOptions,
  fileWatchEventOptions,
  mockStreamSourceOptions,
  mockObjectOptions, // For DatabaseChange trigger source object
  databaseChangeTypeOptions,
  mockObjects, // For filtering DB objects
  allRunnableEntitiesOptionsForSteps, // Updated helper function
} from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { format, parseISO } from "date-fns"
import { useSearchParams } from "next/navigation"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const initialRunControlState: Partial<RunControl> = {
  name: "",
  description: "",
  effectiveDate: format(new Date(), "yyyy-MM-dd"),
  status: "I",
  approvalStatus: "Draft",
  triggerType: "OnDemand",
  steps: [],
  scheduleConfig: { type: "Daily", time: "00:00", days: [] },
  streamConfig: { sourceIntegrationObjectId: "", streamParameters: "{}" },
  fileWatchConfig: { watchPath: "", filePattern: "*.*", event: "Create", recursive: false },
  databaseChangeConfig: {
    sourceIntegrationObjectId: "",
    changeType: ["INSERT", "UPDATE", "DELETE"],
    filterCondition: "",
  },
}

export default function RunControlDefinitionPage() {
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const runControlId = searchParams.get("id")

  const [runControl, setRunControl] = useState<Partial<RunControl>>(initialRunControlState)
  const [isEditingDisabled, setIsEditingDisabled] = useState(false)

  useEffect(() => {
    if (runControlId) {
      const existingRunControl = mockRunControls.find((rc) => rc.id === runControlId)
      if (existingRunControl) {
        const populatedRunControl = {
          ...initialRunControlState,
          ...existingRunControl,
          scheduleConfig: existingRunControl.scheduleConfig || initialRunControlState.scheduleConfig,
          streamConfig: existingRunControl.streamConfig || initialRunControlState.streamConfig,
          fileWatchConfig: existingRunControl.fileWatchConfig || initialRunControlState.fileWatchConfig,
          databaseChangeConfig: existingRunControl.databaseChangeConfig || initialRunControlState.databaseChangeConfig,
        }
        setRunControl(populatedRunControl)
        setIsEditingDisabled(
          ["Pending Peer Review", "Pending Final Approval", "Approved"].includes(
            existingRunControl.approvalStatus || "",
          ),
        )
      } else {
        toast({ title: "Error", description: `Run Control ID ${runControlId} not found.`, variant: "destructive" })
        setRunControl(initialRunControlState)
      }
    } else {
      setRunControl(initialRunControlState)
    }
  }, [runControlId, toast])

  const handleInputChange = (field: keyof RunControl, value: any) => {
    setRunControl((prev) => ({ ...prev, [field]: value }))
  }

  const handleTriggerConfigChange = (
    configType: "scheduleConfig" | "streamConfig" | "fileWatchConfig" | "databaseChangeConfig",
    field: keyof any,
    value: any,
  ) => {
    setRunControl((prev: Partial<RunControl>) => ({
      ...prev,
      [configType]: {
        ...(prev[configType] as any),
        [field]: value,
      },
    }))
  }

  const handleDatabaseChangeTypeToggle = (changeType: "INSERT" | "UPDATE" | "DELETE") => {
    const currentTypes = runControl.databaseChangeConfig?.changeType || []
    const newTypes = currentTypes.includes(changeType)
      ? currentTypes.filter((ct) => ct !== changeType)
      : [...currentTypes, changeType]
    handleTriggerConfigChange("databaseChangeConfig", "changeType", newTypes)
  }

  const handleScheduleDayChange = (day: string, checked: boolean) => {
    const currentDays = runControl.scheduleConfig?.days || []
    const newDays = checked ? [...currentDays, day] : currentDays.filter((d) => d !== day)
    handleTriggerConfigChange(
      "scheduleConfig",
      "days",
      newDays.sort((a, b) => daysOfWeek.indexOf(a) - daysOfWeek.indexOf(b)),
    )
  }

  const addStep = () => {
    const newStep: RunControlStep = {
      id: `STEP${Date.now()}`,
      stepOrder: (runControl.steps?.length || 0) + 1,
      runType: "RuleSet", // Default to RuleSet
      runTypeName: "",
      description: "",
      status: "A",
    }
    setRunControl((prev) => ({ ...prev, steps: [...(prev.steps || []), newStep] }))
  }
  const updateStep = (index: number, field: keyof RunControlStep, value: any) => {
    setRunControl((prev) => ({
      ...prev,
      steps: (prev.steps || []).map((s, i) => {
        if (i === index) {
          const updatedStep = { ...s, [field]: value }
          if (field === "runType") {
            updatedStep.runTypeName = "" // Reset runTypeName when runType changes
          }
          return updatedStep
        }
        return s
      }),
    }))
  }
  const removeStep = (index: number) => {
    setRunControl((prev) => ({
      ...prev,
      steps: (prev.steps || []).filter((_, i) => i !== index).map((s, idx) => ({ ...s, stepOrder: idx + 1 })),
    }))
  }
  const moveStep = (index: number, direction: "up" | "down") => {
    const newSteps = [...(runControl.steps || [])]
    const targetIndex = direction === "up" ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newSteps.length) return
    ;[newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]]
    const reorderedSteps = newSteps.map((s, idx) => ({ ...s, stepOrder: idx + 1 }))
    setRunControl((prev) => ({ ...prev, steps: reorderedSteps }))
  }

  const handleSaveRunControl = () => {
    if (!runControl.name || !runControl.effectiveDate || !runControl.triggerType) {
      toast({
        title: "Validation Error",
        description: "Name, Effective Date, and Trigger Type are required.",
        variant: "destructive",
      })
      return
    }
    const rcToSave: RunControl = {
      ...(initialRunControlState as RunControl),
      ...runControl,
      id: runControl.id || `RC${Date.now()}`,
      steps: runControl.steps || [],
    } as RunControl
    if (!runControl.id || runControl.approvalStatus === "Draft" || runControl.approvalStatus === "Rejected") {
      rcToSave.approvalStatus = "Draft"
    }
    if (rcToSave.triggerType !== "Scheduled") delete rcToSave.scheduleConfig
    if (rcToSave.triggerType !== "RealtimeStream") delete rcToSave.streamConfig
    if (rcToSave.triggerType !== "FileWatch") delete rcToSave.fileWatchConfig
    if (rcToSave.triggerType !== "DatabaseChange") delete rcToSave.databaseChangeConfig

    console.log("Saving run control:", rcToSave)
    const index = mockRunControls.findIndex((rc) => rc.id === rcToSave.id)
    if (index > -1) mockRunControls[index] = rcToSave
    else mockRunControls.push(rcToSave)
    toast({ title: "Run Control Saved", description: `Run Control ${rcToSave.name} has been saved as Draft.` })
    setRunControl(rcToSave)
    setIsEditingDisabled(false)
  }

  // Approval workflow functions (handleSubmitForPeerReview, etc.) remain the same...
  const handleSubmitForPeerReview = () => {
    if (!runControl.name || !runControl.effectiveDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in Run Name and Effective Date.",
        variant: "destructive",
      })
      return
    }
    setRunControl((prev) => ({
      ...prev,
      approvalStatus: "Pending Peer Review",
      peerReviewedBy: undefined,
      peerReviewedDate: undefined,
      approvedBy: undefined,
      approvedDate: undefined,
    }))
    setIsEditingDisabled(true)
    toast({
      title: "Submitted for Peer Review",
      description: `Run Control ${runControl.name} is now pending peer review.`,
    })
    handleSaveRunControl()
  }
  const handlePeerReviewApprove = () => {
    setRunControl((prev) => ({
      ...prev,
      approvalStatus: "Pending Final Approval",
      peerReviewedBy: "Peer Reviewer User",
      peerReviewedDate: new Date().toISOString(),
    }))
    setIsEditingDisabled(true)
    toast({ title: "Peer Review Approved", description: `Run Control ${runControl.name} has passed peer review.` })
    handleSaveRunControl()
  }
  const handlePeerReviewReject = () => {
    setRunControl((prev) => ({
      ...prev,
      approvalStatus: "Rejected",
      peerReviewedBy: "Peer Reviewer User",
      peerReviewedDate: new Date().toISOString(),
    }))
    setIsEditingDisabled(false)
    toast({ title: "Peer Review Rejected", description: `Run Control ${runControl.name} has been rejected.` })
    handleSaveRunControl()
  }
  const handleFinalApprove = () => {
    setRunControl((prev) => ({
      ...prev,
      approvalStatus: "Approved",
      approvedBy: "Final Approver User",
      approvedDate: new Date().toISOString(),
      status: "A",
    }))
    setIsEditingDisabled(true)
    toast({
      title: "Run Control Approved",
      description: `Run Control ${runControl.name} has been approved and activated.`,
    })
    handleSaveRunControl()
  }
  const handleFinalReject = () => {
    setRunControl((prev) => ({
      ...prev,
      approvalStatus: "Rejected",
      approvedBy: "Final Approver User",
      approvedDate: new Date().toISOString(),
    }))
    setIsEditingDisabled(false)
    toast({ title: "Run Control Rejected", description: `Run Control ${runControl.name} has been rejected.` })
    handleSaveRunControl()
  }
  const handleRunNow = () => {
    if (runControl.triggerType !== "OnDemand" && runControl.approvalStatus !== "Approved") {
      toast({
        title: "Cannot Run",
        description: `This Run Control is not 'On Demand' or not 'Approved'.`,
        variant: "destructive",
      })
      return
    }
    toast({ title: "Run Now Triggered", description: `Run Control ${runControl.name} is being executed.` })
  }
  const getApprovalBadgeColor = (status?: ApprovalStatus) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800 border-green-200"
      case "Pending Peer Review":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Pending Final Approval":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-200"
      case "Draft":
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const canEdit =
    !isEditingDisabled && (runControl.approvalStatus === "Draft" || runControl.approvalStatus === "Rejected")
  const canSubmitForPeerReview = runControl.id && runControl.approvalStatus === "Draft"
  const canPeerReview = runControl.approvalStatus === "Pending Peer Review"
  const canFinalApprove = runControl.approvalStatus === "Pending Final Approval"
  const canRunNow = runControl.approvalStatus === "Approved" && runControl.triggerType === "OnDemand"

  return (
    <TooltipProvider>
      <PageHeader
        title="Run Control Definition"
        description="Define and manage how and when your automated processes run."
        actions={
          <>
            {runControl.id && (
              <>
                {canSubmitForPeerReview && (
                  <Button variant="outline" onClick={handleSubmitForPeerReview}>
                    <Send className="mr-2 h-4 w-4" /> Submit for Peer Review
                  </Button>
                )}
                {canPeerReview && (
                  <>
                    <Button
                      variant="outline"
                      onClick={handlePeerReviewApprove}
                      className="bg-green-500 text-white hover:bg-green-600"
                    >
                      <Check className="mr-2 h-4 w-4" /> Approve Peer Review
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handlePeerReviewReject}
                      className="bg-red-500 text-white hover:bg-red-600"
                    >
                      <X className="mr-2 h-4 w-4" /> Reject Peer Review
                    </Button>
                  </>
                )}
                {canFinalApprove && (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleFinalApprove}
                      className="bg-green-500 text-white hover:bg-green-600"
                    >
                      <Check className="mr-2 h-4 w-4" /> Final Approve
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleFinalReject}
                      className="bg-red-500 text-white hover:bg-red-600"
                    >
                      <X className="mr-2 h-4 w-4" /> Final Reject
                    </Button>
                  </>
                )}
              </>
            )}
            <Button variant="outline" asChild>
              <Link href="/process-monitor">
                <CalendarDays className="mr-2 h-4 w-4" /> Process Monitor
              </Link>
            </Button>
            <Button onClick={handleRunNow} disabled={!canRunNow}>
              <Play className="mr-2 h-4 w-4" /> Run Now
            </Button>
            <Button onClick={handleSaveRunControl} disabled={!canEdit}>
              Save Draft
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setRunControl(initialRunControlState)
                setIsEditingDisabled(false)
              }}
            >
              Cancel
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Basic Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Run Control ID (Auto-generated)"
              value={runControl.id || "System Generated"}
              readOnly
              disabled
              className="bg-muted"
            />
            <Input
              placeholder="Run Name"
              value={runControl.name || ""}
              onChange={(e) => handleInputChange("name", e.target.value)}
              disabled={!canEdit}
            />
            <Textarea
              placeholder="Description"
              value={runControl.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              disabled={!canEdit}
            />
            <DatePicker
              date={runControl.effectiveDate ? parseISO(runControl.effectiveDate) : undefined}
              setDate={(date) => handleInputChange("effectiveDate", date ? format(date, "yyyy-MM-dd") : "")}
              disabled={!canEdit}
              buttonClassName="w-full"
            />
            <Select
              value={runControl.status}
              onValueChange={(value) => handleInputChange("status", value as Status)}
              disabled={!canEdit || runControl.approvalStatus !== "Approved"}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A" disabled={runControl.approvalStatus !== "Approved"}>
                  Active
                </SelectItem>
                <SelectItem value="I">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <div className="space-y-2 pt-2">
              <Label>Approval Status</Label>
              <Badge className={getApprovalBadgeColor(runControl.approvalStatus) + " text-sm"}>
                {runControl.approvalStatus || "N/A"}
              </Badge>
              {runControl.peerReviewedBy && runControl.peerReviewedDate && (
                <p className="text-xs text-muted-foreground">
                  Peer Reviewed By: {runControl.peerReviewedBy} on{" "}
                  {format(parseISO(runControl.peerReviewedDate), "PPP")}
                </p>
              )}
              {runControl.approvedBy && runControl.approvedDate && (
                <p className="text-xs text-muted-foreground">
                  Final Approved By: {runControl.approvedBy} on {format(parseISO(runControl.approvedDate), "PPP")}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Trigger Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="triggerType">Trigger Type</Label>
              <Select
                value={runControl.triggerType}
                onValueChange={(value) => handleInputChange("triggerType", value as TriggerType)}
                disabled={!canEdit}
              >
                <SelectTrigger id="triggerType">
                  <SelectValue placeholder="Select Trigger Type" />
                </SelectTrigger>
                <SelectContent>
                  {triggerTypeOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {runControl.triggerType === "OnDemand" && (
              <div className="p-4 border rounded-md bg-muted/50">
                <p className="text-sm text-muted-foreground">
                  This Run Control is executed manually via "Run Now" button when Approved.
                </p>
              </div>
            )}
            {runControl.triggerType === "Scheduled" && (
              <div className="space-y-4 p-4 border rounded-md">
                <Label className="text-base font-medium">Schedule Details</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    value={runControl.scheduleConfig?.type}
                    onValueChange={(value) => handleTriggerConfigChange("scheduleConfig", "type", value)}
                    disabled={!canEdit}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Schedule Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Daily">Daily</SelectItem>
                      <SelectItem value="Weekly">Weekly</SelectItem>
                      <SelectItem value="Monthly" disabled>
                        Monthly (Not Implemented)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="time"
                    value={runControl.scheduleConfig?.time || ""}
                    onChange={(e) => handleTriggerConfigChange("scheduleConfig", "time", e.target.value)}
                    disabled={!canEdit}
                  />
                </div>
                {runControl.scheduleConfig?.type === "Weekly" && (
                  <div>
                    <Label>Select Days</Label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2 mt-1">
                      {daysOfWeek.map((day) => (
                        <div key={day} className="flex items-center space-x-2">
                          <Checkbox
                            id={`day-${day}`}
                            checked={(runControl.scheduleConfig?.days || []).includes(day)}
                            onCheckedChange={(checked) => handleScheduleDayChange(day, !!checked)}
                            disabled={!canEdit}
                          />
                          <Label htmlFor={`day-${day}`}>{day}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <Label htmlFor="holidayCalendar">Holiday Calendar (Optional)</Label>
                  <Select
                    value={runControl.scheduleConfig?.holidayCalendarId || ""}
                    onValueChange={(value) =>
                      handleTriggerConfigChange(
                        "scheduleConfig",
                        "holidayCalendarId",
                        value === "NONE_PLACEHOLDER_VALUE" ? undefined : value,
                      )
                    }
                    disabled={!canEdit}
                  >
                    <SelectTrigger id="holidayCalendar">
                      <SelectValue placeholder="Select Holiday Calendar" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockHolidayCalendarOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                      <SelectItem value="NONE_PLACEHOLDER_VALUE">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            {runControl.triggerType === "RealtimeStream" && (
              <div className="space-y-4 p-4 border rounded-md">
                <Label className="text-base font-medium">Real-time Stream Details</Label>
                <div>
                  <Label htmlFor="streamSource">Source Integration Object (Queue/Topic)</Label>
                  <Select
                    value={runControl.streamConfig?.sourceIntegrationObjectId}
                    onValueChange={(value) =>
                      handleTriggerConfigChange("streamConfig", "sourceIntegrationObjectId", value)
                    }
                    disabled={!canEdit}
                  >
                    <SelectTrigger id="streamSource">
                      <SelectValue placeholder="Select Stream Source" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockStreamSourceOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="streamParams">Stream Parameters (JSON)</Label>
                  <Textarea
                    id="streamParams"
                    placeholder={`{\n  "batchSize": 10,\n  "visibilityTimeout": 30\n}`}
                    value={runControl.streamConfig?.streamParameters || ""}
                    onChange={(e) => handleTriggerConfigChange("streamConfig", "streamParameters", e.target.value)}
                    disabled={!canEdit}
                    rows={3}
                  />
                </div>
              </div>
            )}
            {runControl.triggerType === "FileWatch" && (
              <div className="space-y-4 p-4 border rounded-md">
                <Label className="text-base font-medium flex items-center">
                  <FileDigit className="mr-2 h-5 w-5" />
                  File Watch Details
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="watchPath">Watch Path</Label>
                    <Input
                      id="watchPath"
                      placeholder="/mnt/data/incoming"
                      value={runControl.fileWatchConfig?.watchPath || ""}
                      onChange={(e) => handleTriggerConfigChange("fileWatchConfig", "watchPath", e.target.value)}
                      disabled={!canEdit}
                    />
                  </div>
                  <div>
                    <Label htmlFor="filePattern">File Pattern</Label>
                    <Input
                      id="filePattern"
                      placeholder="*.csv, data_*.txt"
                      value={runControl.fileWatchConfig?.filePattern || ""}
                      onChange={(e) => handleTriggerConfigChange("fileWatchConfig", "filePattern", e.target.value)}
                      disabled={!canEdit}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                  <div>
                    <Label htmlFor="fileEvent">Event to Watch</Label>
                    <Select
                      value={runControl.fileWatchConfig?.event}
                      onValueChange={(value) => handleTriggerConfigChange("fileWatchConfig", "event", value)}
                      disabled={!canEdit}
                    >
                      <SelectTrigger id="fileEvent">
                        <SelectValue placeholder="Select Event" />
                      </SelectTrigger>
                      <SelectContent>
                        {fileWatchEventOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                      id="recursiveWatch"
                      checked={runControl.fileWatchConfig?.recursive || false}
                      onCheckedChange={(checked) =>
                        handleTriggerConfigChange("fileWatchConfig", "recursive", !!checked)
                      }
                      disabled={!canEdit}
                    />
                    <Label htmlFor="recursiveWatch">Watch Subdirectories</Label>
                  </div>
                </div>
              </div>
            )}
            {runControl.triggerType === "DatabaseChange" && (
              <div className="space-y-4 p-4 border rounded-md">
                <Label className="text-base font-medium flex items-center">
                  <DatabaseZap className="mr-2 h-5 w-5" />
                  Database Change (CDC) Details
                </Label>
                <div>
                  <Label htmlFor="cdcSourceObjectId">Source Integration Object (Database Table)</Label>
                  <Select
                    value={runControl.databaseChangeConfig?.sourceIntegrationObjectId}
                    onValueChange={(value) =>
                      handleTriggerConfigChange("databaseChangeConfig", "sourceIntegrationObjectId", value)
                    }
                    disabled={!canEdit}
                  >
                    <SelectTrigger id="cdcSourceObjectId">
                      <SelectValue placeholder="Select Database Object" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockObjectOptions
                        .filter((obj) => mockObjects.find((mo) => mo.id === obj.value)?.type === "Database")
                        .map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Change Types to Monitor</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {databaseChangeTypeOptions.map((opt) => (
                      <Button
                        key={opt.value}
                        variant={
                          runControl.databaseChangeConfig?.changeType?.includes(opt.value) ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => handleDatabaseChangeTypeToggle(opt.value)}
                        disabled={!canEdit}
                      >
                        {opt.label}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="cdcFilterCondition">Filter Condition (Optional)</Label>
                  <Input
                    id="cdcFilterCondition"
                    placeholder="e.g., status = 'active' AND amount > 100"
                    value={runControl.databaseChangeConfig?.filterCondition || ""}
                    onChange={(e) =>
                      handleTriggerConfigChange("databaseChangeConfig", "filterCondition", e.target.value)
                    }
                    disabled={!canEdit}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    SQL-like condition. Syntax depends on CDC provider.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Execution Steps</CardTitle>
            <div className="pt-2">
              <Button onClick={addStep} disabled={!canEdit}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Step
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Order</TableHead>
                  <TableHead>Run Type</TableHead>
                  <TableHead>Run Target Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(runControl.steps || []).map((step, index) => {
                  const runTypeNameOptions = allRunnableEntitiesOptionsForSteps(step.runType)
                  return (
                    <TableRow key={step.id}>
                      <TableCell className="flex items-center gap-1">
                        {step.stepOrder}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => moveStep(index, "up")}
                              disabled={index === 0 || !canEdit}
                            >
                              <ArrowUpDown className="h-3 w-3 transform rotate-180" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Move Up</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => moveStep(index, "down")}
                              disabled={index === (runControl.steps?.length || 0) - 1 || !canEdit}
                            >
                              <ArrowUpDown className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Move Down</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={step.runType}
                          onValueChange={(val) => updateStep(index, "runType", val as RunControlStepType)}
                          disabled={!canEdit}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                          <SelectContent>
                            {runTypes.map((rt) => (
                              <SelectItem key={rt.value} value={rt.value}>
                                {rt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={step.runTypeName}
                          onValueChange={(val) => updateStep(index, "runTypeName", val)}
                          disabled={!canEdit || runTypeNameOptions.length === 0}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Target" />
                          </SelectTrigger>
                          <SelectContent>
                            {runTypeNameOptions.map((rtn) => (
                              <SelectItem key={rtn.value} value={rtn.value}>
                                {rtn.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          value={step.description}
                          onChange={(e) => updateStep(index, "description", e.target.value)}
                          placeholder="Description"
                          disabled={!canEdit}
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={step.status}
                          onValueChange={(val) => updateStep(index, "status", val as Status)}
                          disabled={!canEdit}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A">Active</SelectItem>
                            <SelectItem value="I">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => removeStep(index)} disabled={!canEdit}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {(runControl.steps || []).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                      No execution steps defined.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  )
}
