"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/ui/date-picker"
import { PageHeader } from "@/components/page-header"
import { useToast } from "@/components/ui/use-toast"
import { Search, Plus, Edit, Trash2, Eye, Send } from "lucide-react"
import Link from "next/link"
import { mockUIMetadata, mockDynamicRecords } from "@/lib/mock-data"
import type { UIMetadata, DynamicDataRecord, UIFieldDefinition, ApprovalStatus } from "@/lib/types"

export default function DynamicUIPage() {
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const metadataId = searchParams.get("metadataId")
  const recordId = searchParams.get("recordId")

  const [uiMetadata, setUIMetadata] = useState<UIMetadata | null>(null)
  const [records, setRecords] = useState<DynamicDataRecord[]>([])
  const [selectedRecord, setSelectedRecord] = useState<DynamicDataRecord | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentView, setCurrentView] = useState<"grid" | "form">("grid")

  useEffect(() => {
    if (metadataId) {
      const metadata = mockUIMetadata.find((m) => m.id === metadataId)
      if (metadata) {
        setUIMetadata(metadata)
        const metadataRecords = mockDynamicRecords.filter((r) => r.uiMetadataId === metadataId)
        setRecords(metadataRecords)

        if (recordId) {
          const record = metadataRecords.find((r) => r.id === recordId)
          if (record) {
            setSelectedRecord(record)
            setCurrentView("form")
          }
        }
      }
    }
  }, [metadataId, recordId])

  const filteredRecords = records.filter((record) => {
    if (!searchTerm) return true
    return Object.values(record.data).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase()))
  })

  const handleCreateNew = () => {
    if (!uiMetadata) return

    const newRecord: Partial<DynamicDataRecord> = {
      id: `REC${Date.now()}`,
      uiMetadataId: uiMetadata.id,
      data: {},
      status: "I",
      approvalStatus: "Draft",
      createdBy: "Current User",
      createdDate: new Date().toISOString(),
      version: 1,
    }

    // Initialize data with default values
    uiMetadata.fields.forEach((field) => {
      if (field.defaultValue) {
        newRecord.data![field.fieldName] = field.defaultValue
      }
    })

    setSelectedRecord(newRecord as DynamicDataRecord)
    setIsCreating(true)
    setIsEditing(true)
    setCurrentView("form")
  }

  const handleEdit = (record: DynamicDataRecord) => {
    setSelectedRecord(record)
    setIsEditing(true)
    setCurrentView("form")
  }

  const handleSave = () => {
    if (!selectedRecord) return

    if (isCreating) {
      setRecords((prev) => [...prev, selectedRecord])
      toast({ title: "Record Created", description: "New record has been created successfully." })
    } else {
      setRecords((prev) => prev.map((r) => (r.id === selectedRecord.id ? selectedRecord : r)))
      toast({ title: "Record Updated", description: "Record has been updated successfully." })
    }

    setIsEditing(false)
    setIsCreating(false)
    setCurrentView("grid")
  }

  const handleCancel = () => {
    setSelectedRecord(null)
    setIsEditing(false)
    setIsCreating(false)
    setCurrentView("grid")
  }

  const handleFieldChange = (fieldName: string, value: any) => {
    if (!selectedRecord) return

    setSelectedRecord((prev) => ({
      ...prev!,
      data: { ...prev!.data, [fieldName]: value },
    }))
  }

  const handleSubmitForApproval = (record: DynamicDataRecord) => {
    const updatedRecord = {
      ...record,
      approvalStatus: "Pending Peer Review" as ApprovalStatus,
    }
    setRecords((prev) => prev.map((r) => (r.id === record.id ? updatedRecord : r)))
    toast({ title: "Submitted for Approval", description: "Record has been submitted for peer review." })
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

  const renderField = (field: UIFieldDefinition, value: any, isReadonly = false) => {
    const fieldProps = {
      value: value || "",
      onChange: (e: any) => handleFieldChange(field.fieldName, e.target?.value || e),
      disabled: isReadonly || field.isReadonly,
      placeholder: field.placeholder,
      required: field.isRequired,
    }

    switch (field.displayType) {
      case "input":
        return <Input {...fieldProps} />
      case "textarea":
        return <Textarea {...fieldProps} />
      case "number":
        return <Input type="number" {...fieldProps} />
      case "email":
        return <Input type="email" {...fieldProps} />
      case "date":
        return (
          <DatePicker
            date={value ? new Date(value) : undefined}
            setDate={(date) => handleFieldChange(field.fieldName, date?.toISOString().split("T")[0])}
            disabled={isReadonly || field.isReadonly}
          />
        )
      case "select":
        return (
          <Select
            value={value}
            onValueChange={(val) => handleFieldChange(field.fieldName, val)}
            disabled={isReadonly || field.isReadonly}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case "checkbox":
        return (
          <Checkbox
            checked={!!value}
            onCheckedChange={(checked) => handleFieldChange(field.fieldName, checked)}
            disabled={isReadonly || field.isReadonly}
          />
        )
      case "readonly":
        return <Input {...fieldProps} readOnly />
      default:
        return <Input {...fieldProps} />
    }
  }

  const getFieldWidth = (width?: string) => {
    switch (width) {
      case "half":
        return "md:col-span-1"
      case "third":
        return "md:col-span-1"
      case "quarter":
        return "md:col-span-1"
      case "full":
      default:
        return "md:col-span-2"
    }
  }

  if (!uiMetadata) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">UI Metadata not found</p>
      </div>
    )
  }

  return (
    <>
      <PageHeader
        title={`${uiMetadata.name} - Dynamic UI`}
        description={uiMetadata.description}
        actions={
          <div className="flex gap-2">
            {currentView === "form" && (
              <>
                {isEditing ? (
                  <>
                    <Button onClick={handleSave}>Save</Button>
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    {selectedRecord?.approvalStatus === "Draft" && (
                      <>
                        <Button onClick={() => setIsEditing(true)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </Button>
                        <Button variant="outline" onClick={() => handleSubmitForApproval(selectedRecord)}>
                          <Send className="mr-2 h-4 w-4" /> Submit for Approval
                        </Button>
                      </>
                    )}
                    <Button variant="outline" onClick={() => setCurrentView("grid")}>
                      Back to Grid
                    </Button>
                  </>
                )}
              </>
            )}
            {currentView === "grid" && uiMetadata.configuration?.allowCreate && (
              <Button onClick={handleCreateNew}>
                <Plus className="mr-2 h-4 w-4" /> Create New
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link href="/ui-metadata-list">Back to UI Metadata</Link>
            </Button>
          </div>
        }
      />

      {currentView === "grid" ? (
        <Card>
          <CardHeader>
            <CardTitle>Data Records</CardTitle>
            <CardDescription>Manage data records using the {uiMetadata.name} layout</CardDescription>
            {uiMetadata.configuration?.enableSearch && (
              <div className="flex gap-4 items-center pt-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search records..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  {uiMetadata.fields
                    .filter((f) => f.isVisible)
                    .slice(0, 5)
                    .map((field) => (
                      <TableHead key={field.id}>{field.label}</TableHead>
                    ))}
                  <TableHead>Status</TableHead>
                  <TableHead>Approval Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-mono text-sm">{record.id}</TableCell>
                      {uiMetadata.fields
                        .filter((f) => f.isVisible)
                        .slice(0, 5)
                        .map((field) => (
                          <TableCell key={field.id}>{String(record.data[field.fieldName] || "-")}</TableCell>
                        ))}
                      <TableCell>
                        <Badge variant={record.status === "A" ? "default" : "secondary"}>
                          {record.status === "A" ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getApprovalBadgeColor(record.approvalStatus)}>{record.approvalStatus}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedRecord(record)
                              setCurrentView("form")
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {uiMetadata.configuration?.allowEdit && record.approvalStatus === "Draft" && (
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(record)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          {uiMetadata.configuration?.allowDelete && record.approvalStatus === "Draft" && (
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center h-24">
                      No records found. Create your first record to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{isCreating ? "Create New Record" : `Record: ${selectedRecord?.id}`}</CardTitle>
            <CardDescription>{isEditing ? "Edit record details" : "View record details"}</CardDescription>
            {selectedRecord && !isEditing && (
              <div className="flex gap-2 pt-2">
                <Badge className={getApprovalBadgeColor(selectedRecord.approvalStatus)}>
                  {selectedRecord.approvalStatus}
                </Badge>
                <Badge variant={selectedRecord.status === "A" ? "default" : "secondary"}>
                  {selectedRecord.status === "A" ? "Active" : "Inactive"}
                </Badge>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {uiMetadata.fields
                .filter((f) => f.isVisible)
                .sort((a, b) => a.order - b.order)
                .map((field) => (
                  <div key={field.id} className={getFieldWidth(field.width)}>
                    <label className="text-sm font-medium mb-2 block">
                      {field.label}
                      {field.isRequired && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {renderField(field, selectedRecord?.data[field.fieldName], !isEditing)}
                    {field.helpText && <p className="text-xs text-muted-foreground mt-1">{field.helpText}</p>}
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}
