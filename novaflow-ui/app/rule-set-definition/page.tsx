"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { useState, useEffect } from "react"
import {
  PlusCircle,
  Trash2,
  Copy,
  Download,
  ArrowUpDown,
  Check,
  X,
  Send,
  Filter,
  ArrowDownUp,
  Group,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DatePicker } from "@/components/ui/date-picker"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { PageHeader } from "@/components/page-header"
import type {
  RuleSet,
  Rule,
  Status,
  ApprovalStatus,
  ProcessingConfig,
  FilterRule,
  GroupingRule,
  SortingRule,
  ObjectSchemaAttribute,
} from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"
import { mockRules, mockRuleSets, mockObjects } from "@/lib/mock-data"
import { useSearchParams } from "next/navigation"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ApprovalSection } from "@/components/approval-section"

const mockAvailableRules: Pick<Rule, "id" | "name" | "description" | "status">[] = mockRules.map((rule) => ({
  id: rule.id,
  name: rule.name,
  description: rule.description,
  status: rule.status,
}))

export default function RuleSetDefinitionPage() {
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const ruleSetId = searchParams.get("id")

  const [ruleSet, setRuleSet] = useState<Partial<RuleSet>>({
    rules: [],
    status: "I",
    approvalStatus: "Draft",
    processingConfig: { filters: [], groupings: [], sortings: [] },
    persistOutput: false,
  })
  const [isRuleSelectionDialogOpen, setIsRuleSelectionDialogOpen] = useState(false)
  const [selectedRulesForDialog, setSelectedRulesForDialog] = useState<string[]>([])
  const [isEditingDisabled, setIsEditingDisabled] = useState(false)
  const [sourceObjectAttributes, setSourceObjectAttributes] = useState<ObjectSchemaAttribute[]>([])

  const createNewRuleSet = () => {
    setRuleSet({
      rules: [],
      status: "I",
      approvalStatus: "Draft",
      processingConfig: { filters: [], groupings: [], sortings: [] },
      persistOutput: false,
    })
    setIsEditingDisabled(false)
  }

  useEffect(() => {
    if (ruleSetId) {
      const existingRuleSet = mockRuleSets.find((rs) => rs.id === ruleSetId)
      if (existingRuleSet) {
        setRuleSet(existingRuleSet)
      }
    } else {
      createNewRuleSet()
    }
  }, [ruleSetId])

  useEffect(() => {
    const editingDisabledStatuses: ApprovalStatus[] = ["Pending Peer Review", "Pending Final Approval", "Approved"]
    setIsEditingDisabled(editingDisabledStatuses.includes(ruleSet.approvalStatus as ApprovalStatus))
  }, [ruleSet.approvalStatus])

  useEffect(() => {
    if (ruleSet.sourceObjectId) {
      const selectedObj = mockObjects.find((obj) => obj.id === ruleSet.sourceObjectId)
      setSourceObjectAttributes(selectedObj?.schema || [])
    } else {
      setSourceObjectAttributes([])
    }
  }, [ruleSet.sourceObjectId])

  const handleInputChange = (field: keyof RuleSet, value: any) => {
    setRuleSet((prev) => ({ ...prev, [field]: value }))
  }

  const handleProcessingConfigChange = (field: keyof ProcessingConfig, value: any) => {
    setRuleSet((prev) => ({
      ...prev,
      processingConfig: { ...(prev.processingConfig || { filters: [], groupings: [], sortings: [] }), [field]: value },
    }))
  }

  const addFilter = () => {
    const newFilter: FilterRule = { id: `F${Date.now()}`, expression: "" }
    handleProcessingConfigChange("filters", [...(ruleSet.processingConfig?.filters || []), newFilter])
  }
  const updateFilter = (index: number, value: string) => {
    const updatedFilters = [...(ruleSet.processingConfig?.filters || [])]
    updatedFilters[index].expression = value
    handleProcessingConfigChange("filters", updatedFilters)
  }
  const removeFilter = (index: number) => {
    handleProcessingConfigChange(
      "filters",
      (ruleSet.processingConfig?.filters || []).filter((_, i) => i !== index),
    )
  }

  const addGrouping = () => {
    const newGrouping: GroupingRule = { id: `G${Date.now()}`, column: "" }
    handleProcessingConfigChange("groupings", [...(ruleSet.processingConfig?.groupings || []), newGrouping])
  }
  const updateGrouping = (index: number, value: string) => {
    const updatedGroupings = [...(ruleSet.processingConfig?.groupings || [])]
    updatedGroupings[index].column = value
    handleProcessingConfigChange("groupings", updatedGroupings)
  }
  const removeGrouping = (index: number) => {
    handleProcessingConfigChange(
      "groupings",
      (ruleSet.processingConfig?.groupings || []).filter((_, i) => i !== index),
    )
  }

  const addSorting = () => {
    const newSorting: SortingRule = { id: `S${Date.now()}`, column: "", direction: "ASC" }
    handleProcessingConfigChange("sortings", [...(ruleSet.processingConfig?.sortings || []), newSorting])
  }
  const updateSorting = (index: number, field: keyof SortingRule, value: string) => {
    const updatedSortings = [...(ruleSet.processingConfig?.sortings || [])]
    // @ts-ignore
    updatedSortings[index][field] = value
    handleProcessingConfigChange("sortings", updatedSortings)
  }
  const removeSorting = (index: number) => {
    handleProcessingConfigChange(
      "sortings",
      (ruleSet.processingConfig?.sortings || []).filter((_, i) => i !== index),
    )
  }

  const handleSaveRuleSet = () => {
    const ruleSetToSave = { ...ruleSet, id: ruleSet.id || `RS${Date.now()}` }
    if (!ruleSet.id || ruleSet.approvalStatus === "Draft" || ruleSet.approvalStatus === "Rejected") {
      ruleSetToSave.approvalStatus = "Draft"
    }
    console.log("Saving rule set:", ruleSetToSave)
    toast({ title: "Rule Set Saved", description: `Rule Set ${ruleSet.name} has been saved as Draft.` })
    setRuleSet(ruleSetToSave)
    setIsEditingDisabled(false)
  }

  const handleApprovalAction = (newStatus: ApprovalStatus) => {
    const now = new Date().toISOString()
    const currentUser = "John Doe"
    const updates: Partial<RuleSet> = { approvalStatus: newStatus }

    if (newStatus === "Pending Final Approval") {
      updates.peerReviewedBy = currentUser
      updates.peerReviewedDate = now
    } else if (newStatus === "Approved") {
      updates.approvedBy = currentUser
      updates.approvedDate = now
      updates.status = "A"
    } else if (newStatus === "Rejected") {
      if (ruleSet.approvalStatus === "Pending Peer Review") {
        updates.peerReviewedBy = currentUser
        updates.peerReviewedDate = now
      } else {
        updates.approvedBy = currentUser
        updates.approvedDate = now
      }
    }

    setRuleSet((prev) => ({ ...prev, ...updates }))
    toast({
      title: "Status Updated",
      description: `Rule Set status changed to ${newStatus}.`,
    })
  }

  const handleAddSelectedRules = () => {
    const newRules = mockAvailableRules.filter((rule) => selectedRulesForDialog.includes(rule.id))
    setRuleSet((prev) => ({
      ...prev,
      rules: [...(prev.rules || []), ...newRules],
    }))
    setIsRuleSelectionDialogOpen(false)
    setSelectedRulesForDialog([])
    toast({ title: "Rules Added", description: `${newRules.length} rules have been added to the rule set.` })
  }

  const removeRuleFromSet = (ruleId: string) => {
    setRuleSet((prev) => ({ ...prev, rules: (prev.rules || []).filter((r) => r.id !== ruleId) }))
  }

  const moveRule = (index: number, direction: "up" | "down") => {
    const newRules = [...(ruleSet.rules || [])]
    const targetIndex = direction === "up" ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newRules.length) return
    ;[newRules[index], newRules[targetIndex]] = [newRules[targetIndex], newRules[index]]
    setRuleSet((prev) => ({ ...prev, rules: newRules }))
  }

  const canEdit = ruleSet.approvalStatus === "Draft" || ruleSet.approvalStatus === "Rejected" || !ruleSet.approvalStatus
  const canSubmitForPeerReview = ruleSet.id && ruleSet.approvalStatus === "Draft"
  const canPeerReview = ruleSet.approvalStatus === "Pending Peer Review"
  const canFinalApprove = ruleSet.approvalStatus === "Pending Final Approval"

  return (
    <>
      <PageHeader
        title="Rule Set Definition"
        description="Manage logical groupings of rules and define high-level data processing logic."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button onClick={createNewRuleSet} variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" /> New Rule Set
            </Button>
            {ruleSet.id && (
              <>
                {canSubmitForPeerReview && (
                  <Button variant="outline" onClick={() => handleApprovalAction("Pending Peer Review")}>
                    <Send className="mr-2 h-4 w-4" /> Submit for Peer Review
                  </Button>
                )}
                {canPeerReview && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => handleApprovalAction("Pending Final Approval")}
                      className="bg-green-500 text-white hover:bg-green-600"
                    >
                      <Check className="mr-2 h-4 w-4" /> Approve Peer Review
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleApprovalAction("Rejected")}
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
                      onClick={() => handleApprovalAction("Approved")}
                      className="bg-green-500 text-white hover:bg-green-600"
                    >
                      <Check className="mr-2 h-4 w-4" /> Final Approve
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleApprovalAction("Rejected")}
                      className="bg-red-500 text-white hover:bg-red-600"
                    >
                      <X className="mr-2 h-4 w-4" /> Final Reject
                    </Button>
                  </>
                )}
                <Button variant="outline" onClick={() => {}}>
                  <Copy className="mr-2 h-4 w-4" /> Copy
                </Button>
                <Button variant="outline" onClick={() => {}}>
                  <Download className="mr-2 h-4 w-4" /> Export
                </Button>
              </>
            )}
            <Button onClick={handleSaveRuleSet} disabled={!canEdit}>
              Save Draft
            </Button>
          </div>
        }
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Rule Set Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input placeholder="Rule Set ID" value={ruleSet.id || "System Generated"} readOnly disabled />
          <Input
            placeholder="Rule Set Name"
            value={ruleSet.name || ""}
            onChange={(e) => handleInputChange("name", e.target.value)}
            disabled={!canEdit}
          />
          <Input
            placeholder="Description"
            value={ruleSet.description || ""}
            onChange={(e) => handleInputChange("description", e.target.value)}
            className="md:col-span-2"
            disabled={!canEdit}
          />
          <Select
            value={ruleSet.sourceObjectId}
            onValueChange={(value) => handleInputChange("sourceObjectId", value)}
            disabled={!canEdit}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Source Object (for schema)" />
            </SelectTrigger>
            <SelectContent>
              {mockObjects.map((obj) => (
                <SelectItem key={obj.id} value={obj.id}>
                  {obj.name} ({obj.id})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DatePicker
            date={ruleSet.effectiveDate ? new Date(ruleSet.effectiveDate) : undefined}
            setDate={(date) => handleInputChange("effectiveDate", date?.toISOString().split("T")[0])}
            disabled={!canEdit}
          />
          <Select
            value={ruleSet.status}
            onValueChange={(value) => handleInputChange("status", value as Status)}
            disabled={!canEdit || ruleSet.approvalStatus !== "Approved"}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A" disabled={ruleSet.approvalStatus !== "Approved"}>
                Active
              </SelectItem>
              <SelectItem value="I">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <div />

          <ApprovalSection
            approvalStatus={ruleSet.approvalStatus}
            peerReviewedBy={ruleSet.peerReviewedBy}
            peerReviewedDate={ruleSet.peerReviewedDate}
            approvedBy={ruleSet.approvedBy}
            approvedDate={ruleSet.approvedDate}
          />
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Processing & Persistence</CardTitle>
          <CardDescription>Define set-based operations and configure intermediate data persistence.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Filter className="h-5 w-5" /> Filtering (WHERE clauses)
            </h3>
            <div className="space-y-2">
              {(ruleSet.processingConfig?.filters || []).map((filter, index) => (
                <div key={filter.id} className="flex items-center gap-2">
                  <Input
                    placeholder="e.g., status = 'Active' AND amount > 100"
                    value={filter.expression}
                    onChange={(e) => updateFilter(index, e.target.value)}
                    disabled={!canEdit}
                  />
                  <Button variant="ghost" size="icon" onClick={() => removeFilter(index)} disabled={!canEdit}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="mt-2 bg-transparent" onClick={addFilter} disabled={!canEdit}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Filter
            </Button>
          </div>

          <div>
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Group className="h-5 w-5" /> Grouping (GROUP BY clauses)
            </h3>
            <div className="space-y-2">
              {(ruleSet.processingConfig?.groupings || []).map((group, index) => (
                <div key={group.id} className="flex items-center gap-2">
                  <Select
                    value={group.column}
                    onValueChange={(val) => updateGrouping(index, val)}
                    disabled={!canEdit || !ruleSet.sourceObjectId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select column to group by" />
                    </SelectTrigger>
                    <SelectContent>
                      {sourceObjectAttributes.map((attr) => (
                        <SelectItem key={attr.id} value={attr.attributeName}>
                          {attr.attributeName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="icon" onClick={() => removeGrouping(index)} disabled={!canEdit}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 bg-transparent"
              onClick={addGrouping}
              disabled={!canEdit}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add Grouping
            </Button>
          </div>

          <div>
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <ArrowDownUp className="h-5 w-5" /> Sorting (ORDER BY clauses)
            </h3>
            <div className="space-y-2">
              {(ruleSet.processingConfig?.sortings || []).map((sort, index) => (
                <div key={sort.id} className="flex items-center gap-2">
                  <Select
                    value={sort.column}
                    onValueChange={(val) => updateSorting(index, "column", val)}
                    disabled={!canEdit || !ruleSet.sourceObjectId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select column to sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      {sourceObjectAttributes.map((attr) => (
                        <SelectItem key={attr.id} value={attr.attributeName}>
                          {attr.attributeName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={sort.direction}
                    onValueChange={(val) => updateSorting(index, "direction", val)}
                    disabled={!canEdit}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ASC">Ascending</SelectItem>
                      <SelectItem value="DESC">Descending</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="icon" onClick={() => removeSorting(index)} disabled={!canEdit}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 bg-transparent"
              onClick={addSorting}
              disabled={!canEdit}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add Sorting
            </Button>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-medium mb-2">Persistence</h3>
            <div className="flex items-center space-x-2">
              <Switch
                id="persist-output"
                checked={ruleSet.persistOutput}
                onCheckedChange={(checked) => handleInputChange("persistOutput", checked)}
                disabled={!canEdit}
              />
              <Label htmlFor="persist-output">Persist RuleSet Output</Label>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Save the result of this RuleSet to an intermediate data object for auditing or reuse.
            </p>
            {ruleSet.persistOutput && (
              <div className="mt-4">
                <Label htmlFor="persist-target">Persistence Target Object</Label>
                <Select
                  value={ruleSet.persistTargetObjectId}
                  onValueChange={(value) => handleInputChange("persistTargetObjectId", value)}
                  disabled={!canEdit}
                >
                  <SelectTrigger id="persist-target">
                    <SelectValue placeholder="Select a target object to store results" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockObjects
                      .filter((obj) => obj.type === "Database")
                      .map((obj) => (
                        <SelectItem key={obj.id} value={obj.id}>
                          {obj.name} ({obj.id})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rules in Set (Column Transformations)</CardTitle>
          <CardDescription>
            Define column-level transformations. These are applied after filtering, grouping, and sorting.
          </CardDescription>
          <div className="pt-2">
            <Button onClick={() => setIsRuleSelectionDialogOpen(true)} disabled={!canEdit}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Rules
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Order</TableHead>
                <TableHead>Rule ID</TableHead>
                <TableHead>Rule Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(ruleSet.rules || []).map((rule, index) => (
                <TableRow key={rule.id}>
                  <TableCell className="flex items-center gap-1">
                    {index + 1}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveRule(index, "up")}
                      disabled={index === 0 || !canEdit}
                    >
                      <ArrowUpDown className="h-4 w-4 transform rotate-180" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveRule(index, "down")}
                      disabled={index === (ruleSet.rules?.length || 0) - 1 || !canEdit}
                    >
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </TableCell>
                  <TableCell>{rule.id}</TableCell>
                  <TableCell className="font-medium">{rule.name}</TableCell>
                  <TableCell>{rule.description}</TableCell>
                  <TableCell>{rule.status === "A" ? "Active" : "Inactive"}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => removeRuleFromSet(rule.id)} disabled={!canEdit}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {(ruleSet.rules || []).length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">
                    No rules added to this set.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isRuleSelectionDialogOpen} onOpenChange={setIsRuleSelectionDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Select Rules to Add</DialogTitle>
          </DialogHeader>
          <div className="py-4 max-h-[60vh] overflow-y-auto">
            {mockAvailableRules.map((rule) => (
              <div key={rule.id} className="flex items-center space-x-2 p-2 hover:bg-muted rounded-md">
                <Checkbox
                  id={`rule-${rule.id}`}
                  checked={selectedRulesForDialog.includes(rule.id)}
                  onCheckedChange={(checked) => {
                    setSelectedRulesForDialog((prev) =>
                      checked ? [...prev, rule.id] : prev.filter((id) => id !== rule.id),
                    )
                  }}
                />
                <label
                  htmlFor={`rule-${rule.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {rule.name} ({rule.id}) - {rule.status === "A" ? "Active" : "Inactive"}
                  <p className="text-xs text-muted-foreground">{rule.description}</p>
                </label>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRuleSelectionDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSelectedRules}>Add Selected ({selectedRulesForDialog.length})</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
