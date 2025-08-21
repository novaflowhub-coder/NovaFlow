"use client"

import { useState, useEffect } from "react"
import { PlusCircle, Trash2, Copy, Download, Check, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DatePicker } from "@/components/ui/date-picker"
import { PageHeader } from "@/components/page-header"
import type { Rule, RuleCondition, RuleAction, Status, ObjectSchemaAttribute, ApprovalStatus } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"
import { mockObjects, conditionOperators, actionOperators, logicalOperators, mockRules } from "@/lib/mock-data"
import { useSearchParams } from "next/navigation"
import { ApprovalSection } from "@/components/approval-section"

export default function RuleDefinitionPage() {
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const ruleId = searchParams.get("id")

  const [rule, setRule] = useState<Partial<Rule>>({
    conditions: [],
    actions: [],
    status: "I",
    approvalStatus: "Draft",
  })
  const [sourceObjectAttributes, setSourceObjectAttributes] = useState<ObjectSchemaAttribute[]>([])
  const [isEditingDisabled, setIsEditingDisabled] = useState(false)

  const createNewRule = () => {
    setRule({
      conditions: [],
      actions: [],
      status: "I",
      approvalStatus: "Draft",
    })
    setIsEditingDisabled(false)
    // In a real app, you'd also clear the URL query param
  }

  useEffect(() => {
    if (ruleId) {
      const existingRule = mockRules.find((r) => r.id === ruleId)
      if (existingRule) {
        setRule(existingRule)
      }
    } else {
      createNewRule()
    }
  }, [ruleId])

  useEffect(() => {
    const editingDisabledStatuses: ApprovalStatus[] = ["Pending Peer Review", "Pending Final Approval", "Approved"]
    setIsEditingDisabled(editingDisabledStatuses.includes(rule.approvalStatus as ApprovalStatus))
  }, [rule.approvalStatus])

  useEffect(() => {
    if (rule.sourceObjectId) {
      const selectedObj = mockObjects.find((obj) => obj.id === rule.sourceObjectId)
      setSourceObjectAttributes(selectedObj?.schema || [])
    } else {
      setSourceObjectAttributes([])
    }
  }, [rule.sourceObjectId])

  const handleInputChange = (field: keyof Rule, value: any) => {
    setRule((prev) => ({ ...prev, [field]: value }))
  }

  const addCondition = () => {
    const newCondition: RuleCondition = {
      id: `C${Date.now()}`,
      sourceAttribute: "",
      operator: "=",
      value: "",
      conditionOperator: undefined,
      parenthesis: "",
    }
    setRule((prev) => ({ ...prev, conditions: [...(prev.conditions || []), newCondition] }))
  }
  const updateCondition = (index: number, field: keyof RuleCondition, value: any) => {
    setRule((prev) => ({
      ...prev,
      conditions: (prev.conditions || []).map((c, i) => (i === index ? { ...c, [field]: value } : c)),
    }))
  }
  const removeCondition = (index: number) => {
    setRule((prev) => ({ ...prev, conditions: (prev.conditions || []).filter((_, i) => i !== index) }))
  }

  const addAction = () => {
    const newAction: RuleAction = {
      id: `A${Date.now()}`,
      targetAttribute: "",
      operator: "=",
      expression: "",
    }
    setRule((prev) => ({ ...prev, actions: [...(prev.actions || []), newAction] }))
  }
  const updateAction = (index: number, field: keyof RuleAction, value: any) => {
    setRule((prev) => ({
      ...prev,
      actions: (prev.actions || []).map((a, i) => (i === index ? { ...a, [field]: value } : a)),
    }))
  }
  const removeAction = (index: number) => {
    setRule((prev) => ({ ...prev, actions: (prev.actions || []).filter((_, i) => i !== index) }))
  }

  const handleSaveRule = () => {
    const isNew = !rule.id
    const ruleToSave = { ...rule, id: rule.id || `RULE${Date.now()}` }
    if (isNew || rule.approvalStatus === "Draft" || rule.approvalStatus === "Rejected") {
      ruleToSave.approvalStatus = "Draft"
    }
    ruleToSave.ruleJson = JSON.stringify({
      conditions: ruleToSave.conditions,
      actions: ruleToSave.actions,
      sourceObjectId: ruleToSave.sourceObjectId,
    })
    console.log("Saving rule:", ruleToSave)
    toast({ title: "Rule Saved", description: `Rule ${ruleToSave.name} has been saved as Draft.` })
    setRule(ruleToSave)
    setIsEditingDisabled(false)
  }

  const handleApprovalAction = (newStatus: ApprovalStatus) => {
    const now = new Date().toISOString()
    const currentUser = "John Doe"
    const updates: Partial<Rule> = { approvalStatus: newStatus }

    if (newStatus === "Pending Final Approval") {
      updates.peerReviewedBy = currentUser
      updates.peerReviewedDate = now
    } else if (newStatus === "Approved") {
      updates.approvedBy = currentUser
      updates.approvedDate = now
      updates.status = "A"
    } else if (newStatus === "Rejected") {
      if (rule.approvalStatus === "Pending Peer Review") {
        updates.peerReviewedBy = currentUser
        updates.peerReviewedDate = now
      } else {
        updates.approvedBy = currentUser
        updates.approvedDate = now
      }
    }

    setRule((prev) => ({ ...prev, ...updates }))
    toast({
      title: "Status Updated",
      description: `Rule status changed to ${newStatus}.`,
    })
  }

  const canEdit = rule.approvalStatus === "Draft" || rule.approvalStatus === "Rejected" || !rule.approvalStatus
  const canSubmitForPeerReview = rule.id && rule.approvalStatus === "Draft"
  const canPeerReview = rule.approvalStatus === "Pending Peer Review"
  const canFinalApprove = rule.approvalStatus === "Pending Final Approval"

  return (
    <>
      <PageHeader
        title="Rule Definition"
        description="Define standalone transformation rules that can be grouped into rule sets."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button onClick={createNewRule} variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" /> New Rule
            </Button>
            {rule.id && (
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
            <Button onClick={handleSaveRule} disabled={!canEdit}>
              Save Draft
            </Button>
          </div>
        }
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Rule Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input placeholder="Rule ID (Auto-generated)" value={rule.id || "System Generated"} readOnly disabled />
          <Input
            placeholder="Rule Name"
            value={rule.name || ""}
            onChange={(e) => handleInputChange("name", e.target.value)}
            disabled={!canEdit}
          />
          <Input
            placeholder="Description"
            value={rule.description || ""}
            onChange={(e) => handleInputChange("description", e.target.value)}
            className="md:col-span-2"
            disabled={!canEdit}
          />

          <Select
            value={rule.sourceObjectId}
            onValueChange={(value) => handleInputChange("sourceObjectId", value)}
            disabled={!canEdit}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Source Object" />
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
            date={rule.effectiveDate ? new Date(rule.effectiveDate) : undefined}
            setDate={(date) => handleInputChange("effectiveDate", date?.toISOString().split("T")[0])}
            disabled={!canEdit}
          />
          <Select
            value={rule.status}
            onValueChange={(value) => handleInputChange("status", value as Status)}
            disabled={!canEdit || rule.approvalStatus !== "Approved"}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A" disabled={rule.approvalStatus !== "Approved"}>
                Active
              </SelectItem>
              <SelectItem value="I">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <div />

          <ApprovalSection
            approvalStatus={rule.approvalStatus}
            peerReviewedBy={rule.peerReviewedBy}
            peerReviewedDate={rule.peerReviewedDate}
            approvedBy={rule.approvedBy}
            approvedDate={rule.approvedDate}
          />
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Conditions (WHEN)</CardTitle>
          <div className="pt-2">
            <Button onClick={addCondition} disabled={!canEdit}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Condition
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Source Attribute</TableHead>
                <TableHead>Operator</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Cond. Operator</TableHead>
                <TableHead>Parenthesis</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(rule.conditions || []).map((cond, index) => (
                <TableRow key={cond.id}>
                  <TableCell>
                    <Select
                      value={cond.sourceAttribute}
                      onValueChange={(val) => updateCondition(index, "sourceAttribute", val)}
                      disabled={!rule.sourceObjectId || !canEdit}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Attribute" />
                      </SelectTrigger>
                      <SelectContent>
                        {sourceObjectAttributes.map((attr) => (
                          <SelectItem key={attr.id} value={attr.attributeName}>
                            {attr.attributeName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={cond.operator}
                      onValueChange={(val) => updateCondition(index, "operator", val)}
                      disabled={!canEdit}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Op" />
                      </SelectTrigger>
                      <SelectContent>
                        {conditionOperators.map((op) => (
                          <SelectItem key={op.value} value={op.value}>
                            {op.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input
                      value={cond.value}
                      onChange={(e) => updateCondition(index, "value", e.target.value)}
                      placeholder="Value"
                      disabled={!canEdit}
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={cond.conditionOperator || "none"}
                      onValueChange={(val) =>
                        updateCondition(index, "conditionOperator", val === "none" ? undefined : val)
                      }
                      disabled={!canEdit}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Logic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {logicalOperators.map((op) => (
                          <SelectItem key={op.value} value={op.value}>
                            {op.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={cond.parenthesis || "none"}
                      onValueChange={(val) => updateCondition(index, "parenthesis", val === "none" ? "" : val)}
                      disabled={!canEdit}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="( )" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="(">(</SelectItem>
                        <SelectItem value=")">)</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => removeCondition(index)} disabled={!canEdit}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {(rule.conditions || []).length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">
                    No conditions defined.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Actions (THEN)</CardTitle>
          <div className="pt-2">
            <Button onClick={addAction} disabled={!canEdit}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Action
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Target Attribute</TableHead>
                <TableHead>Operator</TableHead>
                <TableHead>Expression</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(rule.actions || []).map((act, index) => (
                <TableRow key={act.id}>
                  <TableCell>
                    <Select
                      value={act.targetAttribute}
                      onValueChange={(val) => updateAction(index, "targetAttribute", val)}
                      disabled={!rule.sourceObjectId || !canEdit}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Attribute" />
                      </SelectTrigger>
                      <SelectContent>
                        {sourceObjectAttributes.map((attr) => (
                          <SelectItem key={attr.id} value={attr.attributeName}>
                            {attr.attributeName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={act.operator}
                      onValueChange={(val) => updateAction(index, "operator", val)}
                      disabled={!canEdit}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Op" />
                      </SelectTrigger>
                      <SelectContent>
                        {actionOperators.map((op) => (
                          <SelectItem key={op.value} value={op.value}>
                            {op.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input
                      value={act.expression}
                      onChange={(e) => updateAction(index, "expression", e.target.value)}
                      placeholder="Value / Expression"
                      disabled={!canEdit}
                    />
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => removeAction(index)} disabled={!canEdit}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {(rule.actions || []).length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24">
                    No actions defined.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}
