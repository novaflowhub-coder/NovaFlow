"use client"

import { useState, useEffect } from "react"
import { PlusCircle, Trash2, Copy, Download, Send, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DatePicker } from "@/components/ui/date-picker"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useSearchParams } from "next/navigation"
import { format } from "date-fns"
import Link from "next/link"
import type {
  UIMetadata,
  UIFieldDefinition,
  UILayoutSection,
  Status,
  ApprovalStatus,
  FieldDisplayType,
  LayoutType,
  SectionType,
} from "@/lib/types"
import {
  mockObjects,
  mockUIMetadata,
  layoutTypes,
  fieldDisplayTypes,
  sectionTypes,
  fieldWidths,
  dataTypes,
} from "@/lib/mock-data"

export default function UIMetadataPage() {
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const metadataId = searchParams.get("id")

  const [uiMetadata, setUIMetadata] = useState<Partial<UIMetadata>>({
    fields: [],
    sections: [],
    status: "I",
    layoutType: "form",
    approvalStatus: "Draft",
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
  })
  const [isEditingDisabled, setIsEditingDisabled] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")

  useEffect(() => {
    if (metadataId) {
      const existingMetadata = mockUIMetadata.find((m) => m.id === metadataId)
      if (existingMetadata) {
        setUIMetadata(existingMetadata)
        if (
          existingMetadata.approvalStatus === "Pending Peer Review" ||
          existingMetadata.approvalStatus === "Pending Final Approval" ||
          existingMetadata.approvalStatus === "Approved"
        ) {
          setIsEditingDisabled(true)
        }
      }
    }
  }, [metadataId])

  const handleInputChange = (field: keyof UIMetadata, value: any) => {
    setUIMetadata((prev) => ({ ...prev, [field]: value }))
  }

  const handleConfigurationChange = (key: string, value: any) => {
    setUIMetadata((prev) => ({
      ...prev,
      configuration: { ...prev.configuration, [key]: value },
    }))
  }

  const addField = () => {
    const newField: UIFieldDefinition = {
      id: `FIELD${Date.now()}`,
      fieldName: "",
      label: "",
      dataType: "String",
      displayType: "input",
      section: "body",
      order: (uiMetadata.fields?.length || 0) + 1,
      isRequired: false,
      isReadonly: false,
      isVisible: true,
      width: "full",
    }
    setUIMetadata((prev) => ({
      ...prev,
      fields: [...(prev.fields || []), newField],
    }))
  }

  const updateField = (index: number, field: keyof UIFieldDefinition, value: any) => {
    setUIMetadata((prev) => ({
      ...prev,
      fields: (prev.fields || []).map((f, i) => (i === index ? { ...f, [field]: value } : f)),
    }))
  }

  const removeField = (index: number) => {
    setUIMetadata((prev) => ({
      ...prev,
      fields: (prev.fields || []).filter((_, i) => i !== index),
    }))
  }

  const addSection = () => {
    const newSection: UILayoutSection = {
      id: `SEC${Date.now()}`,
      name: "",
      type: "body",
      order: (uiMetadata.sections?.length || 0) + 1,
      columns: 2,
      fields: [],
    }
    setUIMetadata((prev) => ({
      ...prev,
      sections: [...(prev.sections || []), newSection],
    }))
  }

  const updateSection = (index: number, field: keyof UILayoutSection, value: any) => {
    setUIMetadata((prev) => ({
      ...prev,
      sections: (prev.sections || []).map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    }))
  }

  const removeSection = (index: number) => {
    setUIMetadata((prev) => ({
      ...prev,
      sections: (prev.sections || []).filter((_, i) => i !== index),
    }))
  }

  const handleSave = () => {
    const metadataToSave = {
      ...uiMetadata,
      id: uiMetadata.id || `UI${Date.now()}`,
    }
    console.log("Saving UI metadata:", metadataToSave)
    toast({
      title: "UI Metadata Saved",
      description: `UI Metadata ${metadataToSave.name} has been saved as Draft.`,
    })
    setUIMetadata(metadataToSave)
  }

  const handleSubmitForPeerReview = () => {
    if (!uiMetadata.name || !uiMetadata.sourceObjectId || !uiMetadata.effectiveDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in Name, Source Object, and Effective Date before submitting.",
        variant: "destructive",
      })
      return
    }
    setUIMetadata((prev) => ({ ...prev, approvalStatus: "Pending Peer Review" }))
    setIsEditingDisabled(true)
    toast({
      title: "Submitted for Peer Review",
      description: `UI Metadata ${uiMetadata.name} is now pending peer review.`,
    })
  }

  const handleCreateNew = () => {
    setUIMetadata({
      fields: [],
      sections: [],
      status: "I",
      layoutType: "form",
      approvalStatus: "Draft",
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
    })
    setIsEditingDisabled(false)
    setActiveTab("basic")
    toast({
      title: "New UI Metadata",
      description: "Ready to create a new UI metadata definition.",
    })
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

  const canEdit = uiMetadata.approvalStatus === "Draft" || uiMetadata.approvalStatus === "Rejected"
  const canSubmitForPeerReview = uiMetadata.id && uiMetadata.approvalStatus === "Draft"

  return (
    <>
      <PageHeader
        title="UI Metadata Definition"
        description="Define dynamic user interface layouts and field configurations"
        actions={
          <>
            <Button onClick={handleCreateNew} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <PlusCircle className="mr-2 h-4 w-4" /> Create New
            </Button>
            {uiMetadata.id && (
              <>
                {canSubmitForPeerReview && (
                  <Button variant="outline" onClick={handleSubmitForPeerReview}>
                    <Send className="mr-2 h-4 w-4" /> Submit for Peer Review
                  </Button>
                )}
                <Button variant="outline" asChild>
                  <Link href={`/dynamic-ui?metadataId=${uiMetadata.id}`}>
                    <Eye className="mr-2 h-4 w-4" /> Preview UI
                  </Link>
                </Button>
                <Button variant="outline">
                  <Copy className="mr-2 h-4 w-4" /> Copy
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" /> Export
                </Button>
              </>
            )}
            <Button onClick={handleSave} disabled={!canEdit}>
              Save Draft
            </Button>
            <Button variant="outline" asChild>
              <Link href="/ui-metadata-list">Cancel</Link>
            </Button>
          </>
        }
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="fields">Field Definitions</TabsTrigger>
          <TabsTrigger value="sections">Layout Sections</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Define the basic properties of your UI metadata</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="UI Metadata ID (Auto-generated)"
                value={uiMetadata.id || "System Generated"}
                readOnly
                disabled
              />
              <Input
                placeholder="UI Metadata Name"
                value={uiMetadata.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
                disabled={!canEdit}
              />
              <Textarea
                placeholder="Description"
                value={uiMetadata.description || ""}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="md:col-span-2"
                disabled={!canEdit}
              />

              <Select
                value={uiMetadata.sourceObjectId}
                onValueChange={(value) => handleInputChange("sourceObjectId", value)}
                disabled={!canEdit}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Source Object" />
                </SelectTrigger>
                <SelectContent>
                  {mockObjects.map((obj) => (
                    <SelectItem key={obj.id} value={obj.id}>
                      {obj.name} ({obj.id}) - {obj.type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={uiMetadata.layoutType}
                onValueChange={(value) => handleInputChange("layoutType", value as LayoutType)}
                disabled={!canEdit}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Layout Type" />
                </SelectTrigger>
                <SelectContent>
                  {layoutTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <DatePicker
                date={uiMetadata.effectiveDate ? new Date(uiMetadata.effectiveDate) : undefined}
                setDate={(date) => handleInputChange("effectiveDate", date?.toISOString().split("T")[0])}
                disabled={!canEdit}
              />

              <Select
                value={uiMetadata.status}
                onValueChange={(value) => handleInputChange("status", value as Status)}
                disabled={!canEdit || uiMetadata.approvalStatus !== "Approved"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A" disabled={uiMetadata.approvalStatus !== "Approved"}>
                    Active
                  </SelectItem>
                  <SelectItem value="I">Inactive</SelectItem>
                </SelectContent>
              </Select>

              {/* Approval Status */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Approval Status:</span>
                <Badge className={getApprovalBadgeColor(uiMetadata.approvalStatus)}>
                  {uiMetadata.approvalStatus || "N/A"}
                </Badge>
              </div>
              {uiMetadata.approvedBy && uiMetadata.approvedDate && (
                <div className="text-sm text-muted-foreground">
                  Approved By: {uiMetadata.approvedBy} on {format(new Date(uiMetadata.approvedDate), "PPP")}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fields">
          <Card>
            <CardHeader>
              <CardTitle>Field Definitions</CardTitle>
              <CardDescription>Define the fields that will appear in your dynamic UI</CardDescription>
              <div className="pt-2">
                <Button onClick={addField} disabled={!canEdit}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Field
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Field Name</TableHead>
                    <TableHead>Label</TableHead>
                    <TableHead>Data Type</TableHead>
                    <TableHead>Display Type</TableHead>
                    <TableHead>Section</TableHead>
                    <TableHead>Width</TableHead>
                    <TableHead>Required</TableHead>
                    <TableHead>Readonly</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(uiMetadata.fields || []).map((field, index) => (
                    <TableRow key={field.id}>
                      <TableCell>
                        <Input
                          value={field.fieldName}
                          onChange={(e) => updateField(index, "fieldName", e.target.value)}
                          placeholder="Field name"
                          disabled={!canEdit}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={field.label}
                          onChange={(e) => updateField(index, "label", e.target.value)}
                          placeholder="Display label"
                          disabled={!canEdit}
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={field.dataType}
                          onValueChange={(val) => updateField(index, "dataType", val)}
                          disabled={!canEdit}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {dataTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={field.displayType}
                          onValueChange={(val) => updateField(index, "displayType", val as FieldDisplayType)}
                          disabled={!canEdit}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {fieldDisplayTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={field.section}
                          onValueChange={(val) => updateField(index, "section", val as SectionType)}
                          disabled={!canEdit}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {sectionTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={field.width}
                          onValueChange={(val) => updateField(index, "width", val)}
                          disabled={!canEdit}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {fieldWidths.map((width) => (
                              <SelectItem key={width.value} value={width.value}>
                                {width.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          checked={field.isRequired}
                          onCheckedChange={(checked) => updateField(index, "isRequired", !!checked)}
                          disabled={!canEdit}
                        />
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          checked={field.isReadonly}
                          onCheckedChange={(checked) => updateField(index, "isReadonly", !!checked)}
                          disabled={!canEdit}
                        />
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => removeField(index)} disabled={!canEdit}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(uiMetadata.fields || []).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center h-24">
                        No fields defined. Click "Add Field" to start building your UI.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sections">
          <Card>
            <CardHeader>
              <CardTitle>Layout Sections</CardTitle>
              <CardDescription>Organize your fields into logical sections</CardDescription>
              <div className="pt-2">
                <Button onClick={addSection} disabled={!canEdit}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Section
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Section Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Columns</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(uiMetadata.sections || []).map((section, index) => (
                    <TableRow key={section.id}>
                      <TableCell>
                        <Input
                          value={section.name}
                          onChange={(e) => updateSection(index, "name", e.target.value)}
                          placeholder="Section name"
                          disabled={!canEdit}
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={section.type}
                          onValueChange={(val) => updateSection(index, "type", val as SectionType)}
                          disabled={!canEdit}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {sectionTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={section.order}
                          onChange={(e) => updateSection(index, "order", Number.parseInt(e.target.value))}
                          disabled={!canEdit}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={section.columns}
                          onChange={(e) => updateSection(index, "columns", Number.parseInt(e.target.value))}
                          disabled={!canEdit}
                        />
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => removeSection(index)} disabled={!canEdit}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(uiMetadata.sections || []).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center h-24">
                        No sections defined. Click "Add Section" to organize your fields.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuration">
          <Card>
            <CardHeader>
              <CardTitle>UI Configuration</CardTitle>
              <CardDescription>Configure behavior and features for your dynamic UI</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allowCreate"
                  checked={uiMetadata.configuration?.allowCreate}
                  onCheckedChange={(checked) => handleConfigurationChange("allowCreate", !!checked)}
                  disabled={!canEdit}
                />
                <Label htmlFor="allowCreate">Allow Create</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allowEdit"
                  checked={uiMetadata.configuration?.allowEdit}
                  onCheckedChange={(checked) => handleConfigurationChange("allowEdit", !!checked)}
                  disabled={!canEdit}
                />
                <Label htmlFor="allowEdit">Allow Edit</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allowDelete"
                  checked={uiMetadata.configuration?.allowDelete}
                  onCheckedChange={(checked) => handleConfigurationChange("allowDelete", !!checked)}
                  disabled={!canEdit}
                />
                <Label htmlFor="allowDelete">Allow Delete</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enableSearch"
                  checked={uiMetadata.configuration?.enableSearch}
                  onCheckedChange={(checked) => handleConfigurationChange("enableSearch", !!checked)}
                  disabled={!canEdit}
                />
                <Label htmlFor="enableSearch">Enable Search</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enableFilter"
                  checked={uiMetadata.configuration?.enableFilter}
                  onCheckedChange={(checked) => handleConfigurationChange("enableFilter", !!checked)}
                  disabled={!canEdit}
                />
                <Label htmlFor="enableFilter">Enable Filter</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enableSort"
                  checked={uiMetadata.configuration?.enableSort}
                  onCheckedChange={(checked) => handleConfigurationChange("enableSort", !!checked)}
                  disabled={!canEdit}
                />
                <Label htmlFor="enableSort">Enable Sort</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enableExport"
                  checked={uiMetadata.configuration?.enableExport}
                  onCheckedChange={(checked) => handleConfigurationChange("enableExport", !!checked)}
                  disabled={!canEdit}
                />
                <Label htmlFor="enableExport">Enable Export</Label>
              </div>
              <div>
                <Label htmlFor="pageSize">Page Size</Label>
                <Input
                  id="pageSize"
                  type="number"
                  value={uiMetadata.configuration?.pageSize || 20}
                  onChange={(e) => handleConfigurationChange("pageSize", Number.parseInt(e.target.value))}
                  disabled={!canEdit}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}
