"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { PageHeader } from "@/components/page-header"
import { mockVersionHistory } from "@/lib/mock-data"
import type { VersionHistoryEntry } from "@/lib/types"
import { VersionDiffDialog } from "@/components/version-diff-dialog"
import { format } from "date-fns"

// A simple diffing function for demonstration
const generateDiff = (oldObj: any, newObj: any): string => {
  const oldStr = JSON.stringify(oldObj, null, 2)
  const newStr = JSON.stringify(newObj, null, 2)
  // In a real app, use a library like 'diff' for a better view
  return `--- Old\n+++ New\n${newStr}`
}

export default function VersionHistoryPage() {
  const [entityType, setEntityType] = useState<string>("")
  const [entityId, setEntityId] = useState<string>("")
  const [versions, setVersions] = useState<VersionHistoryEntry[]>([])
  const [selectedVersions, setSelectedVersions] = useState<VersionHistoryEntry[]>([])
  const [isDiffDialogOpen, setIsDiffDialogOpen] = useState(false)
  const [diffContent, setDiffContent] = useState({ oldVersion: "", newVersion: "", diff: "" })

  const entityTypes = useMemo(() => [...new Set(mockVersionHistory.map((item) => item.entityType))], [])

  const entitiesForType = useMemo(() => {
    if (!entityType) return []

    // Get all entities of the selected type from version history
    const entitiesFromHistory = mockVersionHistory
      .filter((vh) => vh.entityType === entityType)
      .map((vh) => ({ id: vh.entityId, name: vh.entityName }))

    // Remove duplicates based on ID
    const uniqueEntities = entitiesFromHistory.filter(
      (entity, index, self) => index === self.findIndex((e) => e.id === entity.id),
    )

    return uniqueEntities
  }, [entityType])

  const handleFilter = () => {
    if (!entityType || !entityId) {
      setVersions([])
      return
    }
    const filteredVersions = mockVersionHistory
      .filter((v) => v.entityType === entityType && v.entityId === entityId)
      .sort((a, b) => b.version - a.version)
    setVersions(filteredVersions)
    setSelectedVersions([])
  }

  const handleSelectVersion = (version: VersionHistoryEntry) => {
    setSelectedVersions((prev) => {
      if (prev.includes(version)) {
        return prev.filter((v) => v !== version)
      }
      if (prev.length < 2) {
        return [...prev, version]
      }
      // If 2 are already selected, replace the older one
      return [prev[1], version].sort((a, b) => b.version - a.version)
    })
  }

  const handleCompare = () => {
    if (selectedVersions.length !== 2) return
    const [newVersion, oldVersion] = selectedVersions.sort((a, b) => b.version - a.version)
    const diff = generateDiff(oldVersion.newState, newVersion.newState)
    setDiffContent({
      oldVersion: `v${oldVersion.version}`,
      newVersion: `v${newVersion.version}`,
      diff,
    })
    setIsDiffDialogOpen(true)
  }

  return (
    <>
      <div className="container mx-auto py-8">
        <PageHeader
          title="Version History"
          description="Track and review changes to all configuration items. Rollback to a previous version if needed."
        />

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filter History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-2">
                <label htmlFor="entity-type">Entity Type</label>
                <Select value={entityType} onValueChange={setEntityType}>
                  <SelectTrigger id="entity-type">
                    <SelectValue placeholder="Select an entity type" />
                  </SelectTrigger>
                  <SelectContent>
                    {entityTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="entity-name">Entity Name</label>
                <Select value={entityId} onValueChange={setEntityId} disabled={!entityType}>
                  <SelectTrigger id="entity-name">
                    <SelectValue placeholder="Select an entity" />
                  </SelectTrigger>
                  <SelectContent>
                    {entitiesForType.map((entity) => (
                      <SelectItem key={entity.id} value={entity.id}>
                        {entity.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleFilter} disabled={!entityType || !entityId}>
                Apply Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Results</CardTitle>
            <Button onClick={handleCompare} disabled={selectedVersions.length !== 2}>
              Compare Selected ({selectedVersions.length}/2)
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Modified By</TableHead>
                  <TableHead>Modified Date</TableHead>
                  <TableHead>Change Type</TableHead>
                  <TableHead>Change Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {versions.length > 0 ? (
                  versions.map((version) => (
                    <TableRow key={version.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedVersions.includes(version)}
                          onCheckedChange={() => handleSelectVersion(version)}
                          disabled={selectedVersions.length >= 2 && !selectedVersions.includes(version)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">v{version.version}</TableCell>
                      <TableCell>{version.changedBy}</TableCell>
                      <TableCell>{format(new Date(version.changedDate), "PPpp")}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            version.changeType === "Create"
                              ? "bg-green-100 text-green-800"
                              : version.changeType === "Update"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {version.changeType}
                        </span>
                      </TableCell>
                      <TableCell>{version.changeDescription}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-24">
                      Select an entity type and name to see its version history.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <VersionDiffDialog
        open={isDiffDialogOpen}
        onClose={() => setIsDiffDialogOpen(false)}
        oldVersion={diffContent.oldVersion}
        newVersion={diffContent.newVersion}
        diff={diffContent.diff}
      />
    </>
  )
}
