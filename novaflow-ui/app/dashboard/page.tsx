"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { PlusCircle, Search, Settings, ListChecks, PlayCircle, Calendar, ArrowRight, UserCheck } from "lucide-react"
import { mockRules, mockRuleSets, mockRunControls, mockScaffolds } from "@/lib/mock-data"
import type { ApprovalStatus } from "@/lib/types"

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("rules")

  // Filter entities based on search term
  const filteredRules = mockRules.filter(
    (rule) =>
      rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredRuleSets = mockRuleSets.filter(
    (ruleSet) =>
      ruleSet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ruleSet.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredRunControls = mockRunControls.filter(
    (runControl) =>
      runControl.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      runControl.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredScaffolds = mockScaffolds.filter(
    (scaffold) =>
      scaffold.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scaffold.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Overview of all integration entities and their status"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/approvals">
                <UserCheck className="mr-2 h-4 w-4" /> Approvals
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/process-monitor">
                <Calendar className="mr-2 h-4 w-4" /> Process Monitor
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/${activeTab.replace(/s$/, "-definition")}`}>
                <PlusCircle className="mr-2 h-4 w-4" /> New {activeTab.replace(/s$/, "")}
              </Link>
            </Button>
          </div>
        }
      />

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rules</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockRules.length}</div>
            <p className="text-xs text-muted-foreground">
              {mockRules.filter((r) => r.status === "A").length} active,{" "}
              {mockRules.filter((r) => r.status === "I").length} inactive
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rule Sets</CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockRuleSets.length}</div>
            <p className="text-xs text-muted-foreground">
              {mockRuleSets.filter((rs) => rs.status === "A").length} active,{" "}
              {mockRuleSets.filter((rs) => rs.status === "I").length} inactive
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scaffolds</CardTitle>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockScaffolds.length}</div>
            <p className="text-xs text-muted-foreground">
              {mockScaffolds.filter((s) => s.status === "A").length} active,{" "}
              {mockScaffolds.filter((s) => s.status === "I").length} inactive
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Run Controls</CardTitle>
            <PlayCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockRunControls.length}</div>
            <p className="text-xs text-muted-foreground">
              {mockRunControls.filter((rc) => rc.status === "A").length} active,{" "}
              {mockRunControls.filter((rc) => rc.status === "I").length} inactive
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Entity Listings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Integration Entities</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search entities..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <CardDescription>View and manage all your integration entities</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="rules" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="rules">Rules</TabsTrigger>
              <TabsTrigger value="ruleSets">Rule Sets</TabsTrigger>
              <TabsTrigger value="scaffolds">Scaffolds</TabsTrigger>
              <TabsTrigger value="runControls">Run Controls</TabsTrigger>
            </TabsList>

            {/* Rules Tab */}
            <TabsContent value="rules">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rule ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Source Object</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Approval Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRules.length > 0 ? (
                      filteredRules.map((rule) => (
                        <TableRow key={rule.id}>
                          <TableCell className="font-mono text-sm">{rule.id}</TableCell>
                          <TableCell className="font-medium">{rule.name}</TableCell>
                          <TableCell className="max-w-xs truncate">{rule.description}</TableCell>
                          <TableCell>{rule.sourceObjectId}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                rule.status === "A"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-gray-50 text-gray-700 border-gray-200"
                              }
                            >
                              {rule.status === "A" ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {" "}
                            <Badge className={getApprovalBadgeColor(rule.approvalStatus)}>
                              {rule.approvalStatus || "N/A"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/rule-definition?id=${rule.id}`}>
                                <ArrowRight className="h-4 w-4" />
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No rules found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Rule Sets Tab */}
            <TabsContent value="ruleSets">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rule Set ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Rules Count</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Approval Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRuleSets.length > 0 ? (
                      filteredRuleSets.map((ruleSet) => (
                        <TableRow key={ruleSet.id}>
                          <TableCell className="font-mono text-sm">{ruleSet.id}</TableCell>
                          <TableCell className="font-medium">{ruleSet.name}</TableCell>
                          <TableCell className="max-w-xs truncate">{ruleSet.description}</TableCell>
                          <TableCell>{ruleSet.rules.length}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                ruleSet.status === "A"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-gray-50 text-gray-700 border-gray-200"
                              }
                            >
                              {ruleSet.status === "A" ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {" "}
                            <Badge className={getApprovalBadgeColor(ruleSet.approvalStatus)}>
                              {ruleSet.approvalStatus || "N/A"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/rule-set-definition?id=${ruleSet.id}`}>
                                <ArrowRight className="h-4 w-4" />
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No rule sets found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Scaffolds Tab */}
            <TabsContent value="scaffolds">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Scaffold ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Object</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Approval Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredScaffolds.length > 0 ? (
                      filteredScaffolds.map((scaffold) => (
                        <TableRow key={scaffold.id}>
                          <TableCell className="font-mono text-sm">{scaffold.id}</TableCell>
                          <TableCell className="font-medium">{scaffold.name}</TableCell>
                          <TableCell className="max-w-xs truncate">{scaffold.description}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                scaffold.type === "Scaffold_In"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : "bg-purple-50 text-purple-700 border-purple-200"
                              }
                            >
                              {scaffold.type === "Scaffold_In" ? "In" : "Out"}
                            </Badge>
                          </TableCell>
                          <TableCell>{scaffold.sourceObjectId || scaffold.targetObjectId || "-"}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                scaffold.status === "A"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-gray-50 text-gray-700 border-gray-200"
                              }
                            >
                              {scaffold.status === "A" ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {" "}
                            <Badge className={getApprovalBadgeColor(scaffold.approvalStatus)}>
                              {scaffold.approvalStatus || "N/A"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/scaffold-definition?id=${scaffold.id}`}>
                                <ArrowRight className="h-4 w-4" />
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          No scaffolds found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Run Controls Tab */}
            <TabsContent value="runControls">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Run Control ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Execution Mode</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Approval Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRunControls.length > 0 ? (
                      filteredRunControls.map((runControl) => (
                        <TableRow key={runControl.id}>
                          <TableCell className="font-mono text-sm">{runControl.id}</TableCell>
                          <TableCell className="font-medium">{runControl.name}</TableCell>
                          <TableCell className="max-w-xs truncate">{runControl.description}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                runControl.executionMode === "Scheduled"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : "bg-purple-50 text-purple-700 border-purple-200"
                              }
                            >
                              {runControl.executionMode}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                runControl.status === "A"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-gray-50 text-gray-700 border-gray-200"
                              }
                            >
                              {runControl.status === "A" ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {" "}
                            <Badge className={getApprovalBadgeColor(runControl.approvalStatus)}>
                              {runControl.approvalStatus || "N/A"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/run-control-definition?id=${runControl.id}`}>
                                <ArrowRight className="h-4 w-4" />
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No run controls found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            {activeTab === "rules"
              ? filteredRules.length
              : activeTab === "ruleSets"
                ? filteredRuleSets.length
                : activeTab === "scaffolds"
                  ? filteredScaffolds.length
                  : filteredRunControls.length}{" "}
            results
          </p>
          <Button variant="outline" asChild>
            <Link
              href={`/${activeTab.replace(/s$/, "").replace("ruleSet", "rule-set").replace("runControl", "run-control").replace("scaffold", "scaffold")}-definition`}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add New
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </>
  )
}
