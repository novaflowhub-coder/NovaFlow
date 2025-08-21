"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "@/components/page-header"
import { mockRules, mockRuleSets, mockScaffolds, mockRunControls } from "@/lib/mock-data"
import { CheckCircle, XCircle, Clock, Search } from "lucide-react"

type EntityType = "rule" | "ruleSet" | "scaffold" | "runControl"

interface ApprovalItem {
  id: string
  name: string
  type: EntityType
  approvalStatus: string
  submittedBy?: string
  submittedDate?: string
  peerReviewedBy?: string
  peerReviewedDate?: string
  description?: string
}

export default function ApprovalsPage() {
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")

  // Combine all entities into approval items
  const allApprovalItems: ApprovalItem[] = [
    ...mockRules.map((rule) => ({
      id: rule.id,
      name: rule.name,
      type: "rule" as EntityType,
      approvalStatus: rule.approvalStatus,
      submittedBy: rule.createdBy,
      submittedDate: rule.createdDate,
      peerReviewedBy: rule.peerReviewedBy,
      peerReviewedDate: rule.peerReviewedDate,
      description: rule.description,
    })),
    ...mockRuleSets.map((ruleSet) => ({
      id: ruleSet.id,
      name: ruleSet.name,
      type: "ruleSet" as EntityType,
      approvalStatus: ruleSet.approvalStatus,
      submittedBy: ruleSet.createdBy,
      submittedDate: ruleSet.createdDate,
      peerReviewedBy: ruleSet.peerReviewedBy,
      peerReviewedDate: ruleSet.peerReviewedDate,
      description: ruleSet.description,
    })),
    ...mockScaffolds.map((scaffold) => ({
      id: scaffold.id,
      name: scaffold.name,
      type: "scaffold" as EntityType,
      approvalStatus: scaffold.approvalStatus,
      submittedBy: scaffold.createdBy,
      submittedDate: scaffold.createdDate,
      peerReviewedBy: scaffold.peerReviewedBy,
      peerReviewedDate: scaffold.peerReviewedDate,
      description: scaffold.description,
    })),
    ...mockRunControls.map((runControl) => ({
      id: runControl.id,
      name: runControl.name,
      type: "runControl" as EntityType,
      approvalStatus: runControl.approvalStatus,
      submittedBy: runControl.createdBy,
      submittedDate: runControl.createdDate,
      peerReviewedBy: runControl.peerReviewedBy,
      peerReviewedDate: runControl.peerReviewedDate,
      description: runControl.description,
    })),
  ]

  // Filter items based on search and type
  const filteredItems = allApprovalItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || item.type === filterType
    return matchesSearch && matchesType
  })

  // Group items by approval status
  const pendingPeerReview = filteredItems.filter((item) => item.approvalStatus === "Pending Peer Review")
  const pendingFinalApproval = filteredItems.filter((item) => item.approvalStatus === "Pending Final Approval")
  const approved = filteredItems.filter((item) => item.approvalStatus === "Approved")
  const rejected = filteredItems.filter((item) => item.approvalStatus === "Rejected")

  const handleSelectItem = (itemId: string) => {
    setSelectedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  const handleSelectAll = (items: ApprovalItem[]) => {
    const itemIds = items.map((item) => item.id)
    const allSelected = itemIds.every((id) => selectedItems.includes(id))

    if (allSelected) {
      setSelectedItems((prev) => prev.filter((id) => !itemIds.includes(id)))
    } else {
      setSelectedItems((prev) => [...new Set([...prev, ...itemIds])])
    }
  }

  const handleBulkAction = (action: "approve" | "reject", stage: "peer" | "final") => {
    console.log(`Bulk ${action} for ${stage} approval:`, selectedItems)
    // Here you would implement the actual bulk approval logic
    setSelectedItems([])
  }

  const getApprovalBadge = (status: string) => {
    switch (status) {
      case "Draft":
        return <Badge variant="secondary">Draft</Badge>
      case "Pending Peer Review":
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-700">
            Pending Peer Review
          </Badge>
        )
      case "Pending Final Approval":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-700">
            Pending Final Approval
          </Badge>
        )
      case "Approved":
        return (
          <Badge variant="default" className="bg-green-500">
            Approved
          </Badge>
        )
      case "Rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getEntityTypeBadge = (type: EntityType) => {
    const colors = {
      rule: "bg-blue-100 text-blue-800",
      ruleSet: "bg-green-100 text-green-800",
      scaffold: "bg-purple-100 text-purple-800",
      runControl: "bg-orange-100 text-orange-800",
    }

    const labels = {
      rule: "Rule",
      ruleSet: "Rule Set",
      scaffold: "Scaffold",
      runControl: "Run Control",
    }

    return (
      <Badge variant="secondary" className={colors[type]}>
        {labels[type]}
      </Badge>
    )
  }

  const ApprovalTable = ({
    items,
    showPeerActions = false,
    showFinalActions = false,
  }: {
    items: ApprovalItem[]
    showPeerActions?: boolean
    showFinalActions?: boolean
  }) => (
    <div className="space-y-4">
      {items.length > 0 && (
        <div className="flex items-center gap-2">
          <Checkbox
            checked={items.every((item) => selectedItems.includes(item.id))}
            onCheckedChange={() => handleSelectAll(items)}
          />
          <Label className="text-sm font-medium">Select All ({items.length})</Label>
          {selectedItems.length > 0 && (
            <div className="flex gap-2 ml-4">
              {showPeerActions && (
                <>
                  <Button
                    size="sm"
                    onClick={() => handleBulkAction("approve", "peer")}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve Peer Review ({selectedItems.length})
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleBulkAction("reject", "peer")}>
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject ({selectedItems.length})
                  </Button>
                </>
              )}
              {showFinalActions && (
                <>
                  <Button
                    size="sm"
                    onClick={() => handleBulkAction("approve", "final")}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Final Approve ({selectedItems.length})
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleBulkAction("reject", "final")}>
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject ({selectedItems.length})
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <span className="sr-only">Select</span>
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Submitted By</TableHead>
            <TableHead>Submitted Date</TableHead>
            {showFinalActions && <TableHead>Peer Reviewed By</TableHead>}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={showFinalActions ? 8 : 7} className="text-center text-muted-foreground">
                No items found
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedItems.includes(item.id)}
                    onCheckedChange={() => handleSelectItem(item.id)}
                  />
                </TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{getEntityTypeBadge(item.type)}</TableCell>
                <TableCell>{getApprovalBadge(item.approvalStatus)}</TableCell>
                <TableCell>{item.submittedBy}</TableCell>
                <TableCell>{item.submittedDate}</TableCell>
                {showFinalActions && <TableCell>{item.peerReviewedBy || "-"}</TableCell>}
                <TableCell>
                  <div className="flex gap-2">
                    {showPeerActions && (
                      <>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive">
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    {showFinalActions && (
                      <>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive">
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )

  return (
    <div className="space-y-6">
      <PageHeader title="Approval Dashboard" description="Manage all pending approvals across the system" />

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Peer Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPeerReview.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Final Approval</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingFinalApproval.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approved.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejected.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="type-filter">Entity Type</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="rule">Rules</SelectItem>
                  <SelectItem value="ruleSet">Rule Sets</SelectItem>
                  <SelectItem value="scaffold">Scaffolds</SelectItem>
                  <SelectItem value="runControl">Run Controls</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Approval Tabs */}
      <Tabs defaultValue="peer-review" className="space-y-4">
        <TabsList>
          <TabsTrigger value="peer-review">Pending Peer Review ({pendingPeerReview.length})</TabsTrigger>
          <TabsTrigger value="final-approval">Pending Final Approval ({pendingFinalApproval.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approved.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejected.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="peer-review">
          <Card>
            <CardHeader>
              <CardTitle>Pending Peer Review</CardTitle>
              <CardDescription>Items waiting for peer review approval</CardDescription>
            </CardHeader>
            <CardContent>
              <ApprovalTable items={pendingPeerReview} showPeerActions={true} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="final-approval">
          <Card>
            <CardHeader>
              <CardTitle>Pending Final Approval</CardTitle>
              <CardDescription>Items waiting for final approval after peer review</CardDescription>
            </CardHeader>
            <CardContent>
              <ApprovalTable items={pendingFinalApproval} showFinalActions={true} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved">
          <Card>
            <CardHeader>
              <CardTitle>Approved Items</CardTitle>
              <CardDescription>Items that have been fully approved and are active</CardDescription>
            </CardHeader>
            <CardContent>
              <ApprovalTable items={approved} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected">
          <Card>
            <CardHeader>
              <CardTitle>Rejected Items</CardTitle>
              <CardDescription>Items that have been rejected and need revision</CardDescription>
            </CardHeader>
            <CardContent>
              <ApprovalTable items={rejected} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
