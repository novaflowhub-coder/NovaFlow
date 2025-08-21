"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { Search, CheckCircle, XCircle, Eye, CheckSquare, AlertCircle, Database } from "lucide-react"
import { mockDynamicRecords, mockUIMetadata } from "@/lib/mock-data"
import type { ApprovalStatus, DynamicDataRecord } from "@/lib/types"

export default function DataWorkflowPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMetadataId, setSelectedMetadataId] = useState<string>("all")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("pending-peer-review")

  // Filter records based on approval status and search/filter criteria
  const getFilteredRecords = (status: ApprovalStatus) => {
    return mockDynamicRecords.filter((record) => {
      const matchesStatus = record.approvalStatus === status
      const matchesSearch = Object.values(record.data).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase()),
      )
      const matchesMetadata = selectedMetadataId === "all" || record.uiMetadataId === selectedMetadataId

      return matchesStatus && matchesSearch && matchesMetadata
    })
  }

  const pendingPeerReview = getFilteredRecords("Pending Peer Review")
  const pendingFinalApproval = getFilteredRecords("Pending Final Approval")
  const approved = getFilteredRecords("Approved")
  const rejected = getFilteredRecords("Rejected")
  const draft = getFilteredRecords("Draft")

  const handleSelectAll = (records: DynamicDataRecord[], checked: boolean) => {
    if (checked) {
      setSelectedItems((prev) => [...new Set([...prev, ...records.map((r) => r.id)])])
    } else {
      const recordIds = records.map((r) => r.id)
      setSelectedItems((prev) => prev.filter((id) => !recordIds.includes(id)))
    }
  }

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, id])
    } else {
      setSelectedItems((prev) => prev.filter((item) => item !== id))
    }
  }

  const handleBulkAction = (action: "approve" | "reject") => {
    console.log(`Bulk ${action} for data records:`, selectedItems)
    setSelectedItems([])
    // Show success message
  }

  const handleIndividualAction = (recordId: string, action: "approve" | "reject") => {
    console.log(`${action} data record:`, recordId)
    // Show success message
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

  const getUIMetadataName = (metadataId: string) => {
    const metadata = mockUIMetadata.find((m) => m.id === metadataId)
    return metadata?.name || metadataId
  }

  const DataWorkflowTable = ({
    records,
    showBulkActions = false,
  }: { records: DynamicDataRecord[]; showBulkActions?: boolean }) => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {showBulkActions && (
              <TableHead className="w-12">
                <Checkbox
                  checked={records.length > 0 && records.every((r) => selectedItems.includes(r.id))}
                  onCheckedChange={(checked) => handleSelectAll(records, checked as boolean)}
                />
              </TableHead>
            )}
            <TableHead>Record ID</TableHead>
            <TableHead>UI Metadata</TableHead>
            <TableHead>Data Preview</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead>Created Date</TableHead>
            <TableHead>Peer Reviewer</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.length > 0 ? (
            records.map((record) => (
              <TableRow key={record.id}>
                {showBulkActions && (
                  <TableCell>
                    <Checkbox
                      checked={selectedItems.includes(record.id)}
                      onCheckedChange={(checked) => handleSelectItem(record.id, checked as boolean)}
                    />
                  </TableCell>
                )}
                <TableCell className="font-mono text-sm">{record.id}</TableCell>
                <TableCell className="font-medium">{getUIMetadataName(record.uiMetadataId)}</TableCell>
                <TableCell className="max-w-xs">
                  <div className="text-sm">
                    {Object.entries(record.data)
                      .slice(0, 2)
                      .map(([key, value]) => (
                        <div key={key} className="truncate">
                          <span className="font-medium">{key}:</span> {String(value)}
                        </div>
                      ))}
                    {Object.keys(record.data).length > 2 && (
                      <div className="text-muted-foreground">+{Object.keys(record.data).length - 2} more fields</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getApprovalBadgeColor(record.approvalStatus)}>{record.approvalStatus}</Badge>
                </TableCell>
                <TableCell>{record.createdBy}</TableCell>
                <TableCell>{record.createdDate}</TableCell>
                <TableCell>
                  {record.peerReviewedBy ? (
                    <div className="text-sm">
                      <div className="font-medium">{record.peerReviewedBy}</div>
                      <div className="text-muted-foreground">{record.peerReviewedDate}</div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dynamic-ui?metadataId=${record.uiMetadataId}&recordId=${record.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    {showBulkActions && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleIndividualAction(record.id, "approve")}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleIndividualAction(record.id, "reject")}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={showBulkActions ? 9 : 8} className="text-center h-24">
                No data records found for this approval stage.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )

  return (
    <>
      <PageHeader
        title="Data Workflow Dashboard"
        description="Manage approval workflow for dynamic data records"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/ui-metadata-list">UI Metadata</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        }
      />

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-5 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft Records</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{draft.length}</div>
            <p className="text-xs text-muted-foreground">Work in progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Peer Review</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingPeerReview.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting peer review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Final Approval</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{pendingFinalApproval.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting final approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approved.length}</div>
            <p className="text-xs text-muted-foreground">Recently approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{rejected.length}</div>
            <p className="text-xs text-muted-foreground">Recently rejected</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search data records..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedMetadataId} onValueChange={setSelectedMetadataId}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Filter by UI Metadata" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All UI Metadata</SelectItem>
                {mockUIMetadata.map((metadata) => (
                  <SelectItem key={metadata.id} value={metadata.id}>
                    {metadata.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Data Workflow Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Data Approval Queue</CardTitle>
          <CardDescription>Manage data record approvals across all UI metadata types</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="draft" className="relative">
                Draft
                {draft.length > 0 && (
                  <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs bg-gray-500">{draft.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="pending-peer-review" className="relative">
                Pending Peer Review
                {pendingPeerReview.length > 0 && (
                  <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs bg-yellow-500">
                    {pendingPeerReview.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="pending-final-approval" className="relative">
                Pending Final Approval
                {pendingFinalApproval.length > 0 && (
                  <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs bg-blue-500">
                    {pendingFinalApproval.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>

            {/* Bulk Actions for Pending Tabs */}
            {(activeTab === "pending-peer-review" || activeTab === "pending-final-approval") && (
              <div className="mb-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {selectedItems.length} record{selectedItems.length !== 1 ? "s" : ""} selected
                    </span>
                  </div>
                  {selectedItems.length > 0 && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleBulkAction("approve")}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Bulk Approve
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleBulkAction("reject")}>
                        <XCircle className="h-4 w-4 mr-2" />
                        Bulk Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            <TabsContent value="draft">
              <DataWorkflowTable records={draft} />
            </TabsContent>

            <TabsContent value="pending-peer-review">
              <DataWorkflowTable records={pendingPeerReview} showBulkActions={true} />
            </TabsContent>

            <TabsContent value="pending-final-approval">
              <DataWorkflowTable records={pendingFinalApproval} showBulkActions={true} />
            </TabsContent>

            <TabsContent value="approved">
              <DataWorkflowTable records={approved} />
            </TabsContent>

            <TabsContent value="rejected">
              <DataWorkflowTable records={rejected} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>
  )
}
