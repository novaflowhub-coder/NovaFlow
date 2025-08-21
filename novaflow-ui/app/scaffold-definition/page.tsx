"use client"

import type React from "react"

import { useMemo, useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircle, Trash2, ArrowDown, ArrowUp } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

import { mockScaffolds, mockObjects, dataTypes } from "@/lib/mock-data"
import type {
  Scaffold,
  ScaffoldColumn,
  Transformation,
  Aggregation,
  AggregationRule,
  FilterCondition,
  OrderRule,
  FilterOperator,
  AggregationFunction,
  OrderDirection,
} from "@/lib/types"

import { TransformationEditor } from "@/components/transformation-editor"
import { TransformationDialog } from "@/components/transformation-dialog"

export default function ScaffoldDefinitionPage() {
  /* ─────────── basic state ─────────── */
  const [selectedScaffold, setSelectedScaffold] = useState<Scaffold | null>(mockScaffolds[0] ?? null)
  const [scaffoldName, setScaffoldName] = useState(selectedScaffold?.name ?? "")
  const [scaffoldType, setScaffoldType] = useState<"Scaffold_In" | "Scaffold_Out">(
    selectedScaffold?.type ?? "Scaffold_In",
  )
  const [sourceObjectId, setSourceObjectId] = useState(selectedScaffold?.sourceObjectId ?? "")
  const [targetObjectId, setTargetObjectId] = useState(selectedScaffold?.targetObjectId ?? "")
  const [columns, setColumns] = useState<ScaffoldColumn[]>(selectedScaffold?.columns ?? [])
  const [aggregations, setAggregations] = useState<Aggregation[]>(selectedScaffold?.aggregations ?? [])
  const [filters, setFilters] = useState<FilterCondition[]>(selectedScaffold?.filters ?? [])
  const [ordering, setOrdering] = useState<OrderRule[]>(selectedScaffold?.ordering ?? [])

  /* ─────────── dialog state ─────────── */
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null)

  /* ─────────── helpers ─────────── */
  const sourceObject = useMemo(() => mockObjects.find((o) => o.id === sourceObjectId), [sourceObjectId])
  const targetObject = useMemo(() => mockObjects.find((o) => o.id === targetObjectId), [targetObjectId])
  const sourceCols = useMemo(() => sourceObject?.schema.map((a) => a.attributeName) ?? [], [sourceObject])
  const targetCols = useMemo(() => targetObject?.schema.map((a) => a.attributeName) ?? [], [targetObject])
  const editingColumn = columns.find((c) => c.id === editingColumnId) ?? null
  const allAvailableColumns = useMemo(() => [...sourceCols, ...columns.map((c) => c.name)], [sourceCols, columns])

  /* ─────────── scaffold selectors ─────────── */
  const handleScaffoldSelect = (id: string) => {
    const s = mockScaffolds.find((x) => x.id === id)
    if (!s) return
    setSelectedScaffold(s)
    setScaffoldName(s.name)
    setScaffoldType(s.type)
    setSourceObjectId(s.sourceObjectId)
    setTargetObjectId(s.targetObjectId)
    setColumns(s.columns)
    setAggregations(s.aggregations ?? [])
    setFilters(s.filters ?? [])
    setOrdering(s.ordering ?? [])
  }

  const handleNewScaffold = () => {
    setSelectedScaffold(null)
    setScaffoldName("")
    setScaffoldType("Scaffold_In")
    setSourceObjectId("")
    setTargetObjectId("")
    setColumns([])
    setAggregations([])
    setFilters([])
    setOrdering([])
  }

  /* ─────────── column utilities ─────────── */
  const handleColumnChange = (id: string, field: keyof ScaffoldColumn, value: any) =>
    setColumns((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)))

  const handleTransformationChange = (id: string, t: Transformation) =>
    setColumns((prev) => prev.map((c) => (c.id === id ? { ...c, transformation: t } : c)))

  const addColumn = () =>
    setColumns((prev) => [
      ...prev,
      {
        id: `col-${Date.now()}`,
        name: "",
        dataType: "String",
        transformation: {
          sourceColumn: "",
          targetColumn: "",
          transformation: "Direct",
          expression: "",
          sourceColumns: [],
          steps: [],
        },
      },
    ])

  const removeColumn = (id: string) => setColumns((prev) => prev.filter((c) => c.id !== id))

  /* ─────────── dialog open / save ─────────── */
  const openDialog = (id: string) => {
    setEditingColumnId(id)
    setIsDialogOpen(true)
  }

  const saveDialog = (newT: Transformation) => {
    if (editingColumnId) handleTransformationChange(editingColumnId, newT)
    setIsDialogOpen(false)
    setEditingColumnId(null)
  }

  /* ─────────── render ─────────── */
  return (
    <>
      <div className="space-y-6">
        {/* PAGE HEADER */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Scaffold Definition</h1>
            <p className="text-muted-foreground">Define data ingestion, staging, and outbound mapping structures.</p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleNewScaffold}>
              <PlusCircle className="h-4 w-4 mr-2" />
              New Scaffold
            </Button>

            <Select value={selectedScaffold?.id ?? ""} onValueChange={handleScaffoldSelect}>
              <SelectTrigger className="w-72">
                <SelectValue placeholder="Select a scaffold to edit..." />
              </SelectTrigger>
              <SelectContent>
                {mockScaffolds.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </header>

        {/* DETAILS CARD */}
        <Card>
          <CardHeader>
            <CardTitle>Scaffold Details</CardTitle>
            <CardDescription>
              {selectedScaffold
                ? "Edit properties of the selected scaffold."
                : "Configure basic properties for the new scaffold."}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={scaffoldName} onChange={(e) => setScaffoldName(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={scaffoldType}
                  onValueChange={(v) => setScaffoldType(v as "Scaffold_In" | "Scaffold_Out")}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Scaffold_In", "Scaffold_Out"].map((t) => (
                      <SelectItem key={t} value={t}>
                        {t.replace("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Source Object</Label>
                <Select value={sourceObjectId} onValueChange={setSourceObjectId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Source" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockObjects.map((o) => (
                      <SelectItem key={o.id} value={o.id}>
                        {o.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Target Object</Label>
                <Select value={targetObjectId} onValueChange={setTargetObjectId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Target" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockObjects.map((o) => (
                      <SelectItem key={o.id} value={o.id}>
                        {o.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* LOGIC CARD */}
        <Card>
          <Tabs defaultValue="mapping">
            <CardHeader>
              <CardTitle>Scaffold Logic</CardTitle>
              <CardDescription>
                Define column mappings, transformations, aggregations, filters, and ordering.
              </CardDescription>
              <TabsList className="grid w-full grid-cols-4 mt-4">
                <TabsTrigger value="mapping">Mapping & Transformation</TabsTrigger>
                <TabsTrigger value="aggregation">Aggregation</TabsTrigger>
                <TabsTrigger value="filter">Filter</TabsTrigger>
                <TabsTrigger value="order">Order</TabsTrigger>
              </TabsList>
            </CardHeader>

            <CardContent>
              <TabsContent value="mapping" className="space-y-4">
                {columns.map((col, idx) => (
                  <div
                    key={col.id}
                    className="grid grid-cols-1 md:grid-cols-[1fr_1fr_3fr_auto] gap-4 items-end p-4 border rounded-lg"
                  >
                    <div className="space-y-2">
                      {idx === 0 && <Label>Name</Label>}
                      <Input
                        value={col.name}
                        placeholder="transaction_id"
                        onChange={(e) => handleColumnChange(col.id, "name", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      {idx === 0 && <Label>Type</Label>}
                      <Select value={col.dataType} onValueChange={(v) => handleColumnChange(col.id, "dataType", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {dataTypes.map((d) => (
                            <SelectItem key={d.value} value={d.value}>
                              {d.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      {idx === 0 && <Label>Transformation</Label>}
                      <TransformationEditor
                        transformation={col.transformation}
                        onTransformationChange={(t) => handleTransformationChange(col.id, t)}
                        sourceColumns={sourceCols}
                        targetColumns={targetCols}
                        onEdit={() => openDialog(col.id)}
                      />
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeColumn(col.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" className="mt-4 bg-transparent" onClick={addColumn}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Column
                </Button>
              </TabsContent>

              <TabsContent value="aggregation">
                <AggregationTab
                  aggregations={aggregations}
                  setAggregations={setAggregations}
                  availableColumns={allAvailableColumns}
                />
              </TabsContent>

              <TabsContent value="filter">
                <FilterTab filters={filters} setFilters={setFilters} availableColumns={allAvailableColumns} />
              </TabsContent>

              <TabsContent value="order">
                <OrderTab ordering={ordering} setOrdering={setOrdering} availableColumns={allAvailableColumns} />
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>

        {/* FOOTER */}
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline">Cancel</Button>
          <Button>Save Changes</Button>
          <Button variant="destructive">Request Approval</Button>
        </CardFooter>
      </div>

      {/* DIALOG */}
      {editingColumn && (
        <TransformationDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          transformation={editingColumn.transformation}
          onSave={saveDialog}
          sourceColumnsOptions={sourceCols}
          sourceObjectName={sourceObject?.name ?? "Source"}
          targetObjectName={targetObject?.name ?? "Target"}
        />
      )}
    </>
  )
}

// Sub-components for Tabs

const AggregationTab = ({
  aggregations,
  setAggregations,
  availableColumns,
}: {
  aggregations: Aggregation[]
  setAggregations: React.Dispatch<React.SetStateAction<Aggregation[]>>
  availableColumns: string[]
}) => {
  const addGroup = () => {
    setAggregations((prev) => [...prev, { id: `agg-group-${Date.now()}`, groupByColumns: [], aggregations: [] }])
  }

  const removeGroup = (id: string) => {
    setAggregations((prev) => prev.filter((g) => g.id !== id))
  }

  const updateGroup = (id: string, newGroup: Partial<Aggregation>) => {
    setAggregations((prev) => prev.map((g) => (g.id === id ? { ...g, ...newGroup } : g)))
  }

  const addRule = (groupId: string) => {
    const newRule: AggregationRule = {
      id: `agg-rule-${Date.now()}`,
      column: "",
      aggregationFunction: "SUM",
    }
    updateGroup(groupId, {
      aggregations: [...(aggregations.find((g) => g.id === groupId)?.aggregations ?? []), newRule],
    })
  }

  const removeRule = (groupId: string, ruleId: string) => {
    const group = aggregations.find((g) => g.id === groupId)
    if (group) {
      updateGroup(groupId, { aggregations: group.aggregations.filter((r) => r.id !== ruleId) })
    }
  }

  const updateRule = (groupId: string, ruleId: string, newRule: Partial<AggregationRule>) => {
    const group = aggregations.find((g) => g.id === groupId)
    if (group) {
      updateGroup(groupId, {
        aggregations: group.aggregations.map((r) => (r.id === ruleId ? { ...r, ...newRule } : r)),
      })
    }
  }

  return (
    <div className="space-y-4">
      {aggregations.map((group) => (
        <div key={group.id} className="p-4 border rounded-lg space-y-4 relative">
          <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeGroup(group.id)}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>

          <div>
            <Label>Group By Columns</Label>
            <Select onValueChange={(v) => updateGroup(group.id, { groupByColumns: [...group.groupByColumns, v] })}>
              <SelectTrigger>
                <SelectValue placeholder="Add group by column..." />
              </SelectTrigger>
              <SelectContent>
                {availableColumns
                  .filter((c) => !group.groupByColumns.includes(c))
                  .map((col) => (
                    <SelectItem key={col} value={col}>
                      {col}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2 mt-2">
              {group.groupByColumns.map((col) => (
                <Badge key={col} variant="secondary" className="flex items-center gap-1">
                  {col}
                  <Trash2
                    className="h-3 w-3 cursor-pointer"
                    onClick={() =>
                      updateGroup(group.id, { groupByColumns: group.groupByColumns.filter((c) => c !== col) })
                    }
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Aggregations</Label>
            {group.aggregations.map((rule) => (
              <div key={rule.id} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
                <Select value={rule.column} onValueChange={(v) => updateRule(group.id, rule.id, { column: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Column..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableColumns.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={rule.aggregationFunction}
                  onValueChange={(v) =>
                    updateRule(group.id, rule.id, { aggregationFunction: v as AggregationFunction })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Function..." />
                  </SelectTrigger>
                  <SelectContent>
                    {["SUM", "COUNT", "AVG", "MIN", "MAX"].map((f) => (
                      <SelectItem key={f} value={f}>
                        {f}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="icon" onClick={() => removeRule(group.id, rule.id)}>
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => addRule(group.id)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Rule
            </Button>
          </div>
        </div>
      ))}
      <Button variant="outline" onClick={addGroup}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Add Aggregation Group
      </Button>
    </div>
  )
}

const FilterTab = ({
  filters,
  setFilters,
  availableColumns,
}: {
  filters: FilterCondition[]
  setFilters: React.Dispatch<React.SetStateAction<FilterCondition[]>>
  availableColumns: string[]
}) => {
  const addFilter = () => {
    setFilters((prev) => [...prev, { id: `filter-${Date.now()}`, column: "", operator: "equals", value: "" }])
  }

  const removeFilter = (id: string) => {
    setFilters((prev) => prev.filter((f) => f.id !== id))
  }

  const updateFilter = (id: string, newFilter: Partial<FilterCondition>) => {
    setFilters((prev) => prev.map((f) => (f.id === id ? { ...f, ...newFilter } : f)))
  }

  const operators: { value: FilterOperator; label: string }[] = [
    { value: "equals", label: "Equals" },
    { value: "not_equals", label: "Not Equals" },
    { value: "greater_than", label: "Greater Than" },
    { value: "less_than", label: "Less Than" },
    { value: "contains", label: "Contains" },
    { value: "starts_with", label: "Starts With" },
    { value: "ends_with", label: "Ends With" },
  ]

  return (
    <div className="space-y-2">
      {filters.map((filter) => (
        <div key={filter.id} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center p-2 border rounded-lg">
          <Select value={filter.column} onValueChange={(v) => updateFilter(filter.id, { column: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Column..." />
            </SelectTrigger>
            <SelectContent>
              {availableColumns.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filter.operator}
            onValueChange={(v) => updateFilter(filter.id, { operator: v as FilterOperator })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Operator..." />
            </SelectTrigger>
            <SelectContent>
              {operators.map((op) => (
                <SelectItem key={op.value} value={op.value}>
                  {op.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            value={filter.value}
            onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
            placeholder="Value..."
          />
          <Button variant="ghost" size="icon" onClick={() => removeFilter(filter.id)}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ))}
      <Button variant="outline" onClick={addFilter} className="mt-4 bg-transparent">
        <PlusCircle className="h-4 w-4 mr-2" />
        Add Filter
      </Button>
    </div>
  )
}

const OrderTab = ({
  ordering,
  setOrdering,
  availableColumns,
}: {
  ordering: OrderRule[]
  setOrdering: React.Dispatch<React.SetStateAction<OrderRule[]>>
  availableColumns: string[]
}) => {
  const addRule = () => {
    setOrdering((prev) => [...prev, { id: `order-${Date.now()}`, column: "", direction: "asc" }])
  }

  const removeRule = (id: string) => {
    setOrdering((prev) => prev.filter((r) => r.id !== id))
  }

  const updateRule = (id: string, newRule: Partial<OrderRule>) => {
    setOrdering((prev) => prev.map((r) => (r.id === id ? { ...r, ...newRule } : r)))
  }

  return (
    <div className="space-y-2">
      {ordering.map((rule) => (
        <div key={rule.id} className="grid grid-cols-[2fr_1fr_auto] gap-2 items-center p-2 border rounded-lg">
          <Select value={rule.column} onValueChange={(v) => updateRule(rule.id, { column: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Column..." />
            </SelectTrigger>
            <SelectContent>
              {availableColumns.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={rule.direction} onValueChange={(v) => updateRule(rule.id, { direction: v as OrderDirection })}>
            <SelectTrigger>
              <SelectValue placeholder="Direction..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">
                <div className="flex items-center">
                  <ArrowUp className="h-4 w-4 mr-2" /> Ascending
                </div>
              </SelectItem>
              <SelectItem value="desc">
                <div className="flex items-center">
                  <ArrowDown className="h-4 w-4 mr-2" /> Descending
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon" onClick={() => removeRule(rule.id)}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ))}
      <Button variant="outline" onClick={addRule} className="mt-4 bg-transparent">
        <PlusCircle className="h-4 w-4 mr-2" />
        Add Order Rule
      </Button>
    </div>
  )
}
