"use client"

import { Label } from "@/components/ui/label"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Plus, Trash2 } from "lucide-react"
import type { Transformation } from "@/lib/types"

/* step definition */
interface TransformationStep {
  id: string
  type: "Direct" | "Concatenate" | "Expression"
  sourceColumns: string[]
  delimiter?: string
  expression?: string
}

interface Props {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  transformation: Transformation
  onSave: (t: Transformation) => void
  sourceColumnsOptions: string[]
  sourceObjectName: string
  targetObjectName: string
}

export function TransformationDialog({
  isOpen,
  onOpenChange,
  transformation,
  onSave,
  sourceColumnsOptions,
  sourceObjectName,
  targetObjectName,
}: Props) {
  /* bridge simple → complex */
  const [sourceColumns, setSourceColumns] = useState<string[]>(
    transformation.sourceColumns?.length
      ? transformation.sourceColumns
      : transformation.sourceColumn
        ? [transformation.sourceColumn]
        : [],
  )
  const [steps, setSteps] = useState<TransformationStep[]>((transformation as any).steps ?? [])

  /* sync when dialog opens */
  useEffect(() => {
    if (isOpen) {
      setSourceColumns(
        transformation.sourceColumns?.length
          ? transformation.sourceColumns
          : transformation.sourceColumn
            ? [transformation.sourceColumn]
            : [],
      )
      setSteps((transformation as any).steps ?? [])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  /* add / remove steps */
  const addStep = () =>
    setSteps((prev) => [
      ...prev,
      {
        id: `step-${Date.now()}`,
        type: "Direct",
        sourceColumns: [],
      },
    ])

  const removeStep = (id: string) => setSteps((prev) => prev.filter((s) => s.id !== id))

  const updateStep = (id: string, patch: Partial<TransformationStep>) =>
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)))

  /* save */
  const handleSave = () => {
    onSave({
      ...transformation,
      sourceColumns,
      steps,
    } as any)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Configure Transformations</DialogTitle>
          <DialogDescription>Build a step-by-step pipeline for the selected target column.</DialogDescription>
        </DialogHeader>

        {/* DATA FLOW */}
        <div className="border rounded-lg p-4 space-y-4">
          <h3 className="text-lg font-semibold">Data Flow</h3>

          {/* source / middle / target */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* SOURCE */}
            <div className="flex-1 border rounded-lg p-4 space-y-2">
              <p className="text-xs text-muted-foreground uppercase">Source</p>
              {sourceColumns.map((c) => (
                <div key={c} className="bg-muted text-xs rounded-full inline-flex items-center px-2 py-1 mr-1 mt-1">
                  {c}
                  <Trash2
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={() => setSourceColumns((prev) => prev.filter((x) => x !== c))}
                  />
                </div>
              ))}

              {/* add column */}
              <Select onValueChange={(v) => setSourceColumns((prev) => (prev.includes(v) ? prev : [...prev, v]))}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Add source column" />
                </SelectTrigger>
                <SelectContent>
                  {sourceColumnsOptions
                    .filter((c) => !sourceColumns.includes(c))
                    .map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* arrows / count */}
            <div className="flex flex-col items-center justify-center">
              <span className="text-2xl">→</span>
              <span className="text-sm text-muted-foreground">{steps.length} transformations</span>
              <span className="text-2xl">→</span>
            </div>

            {/* TARGET */}
            <div className="flex-1 border rounded-lg p-4 space-y-2 text-right">
              <p className="text-xs text-muted-foreground uppercase">Target</p>
              <div className="bg-muted text-xs rounded-full inline-flex items-center px-2 py-1 mr-1 mt-1">
                {transformation.targetColumn || "—"}
              </div>
            </div>
          </div>
        </div>

        {/* TRANSFORMATION STEPS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Transformation Steps</h3>
            <Button onClick={addStep} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Step
            </Button>
          </div>

          {steps.length === 0 && (
            <div className="border rounded-lg p-6 text-sm text-muted-foreground text-center">
              No transformation steps defined. Click &ldquo;Add Step&rdquo; to begin.
            </div>
          )}

          {steps.map((step) => (
            <div key={step.id} className="border rounded-lg p-4 space-y-3 relative">
              {/* delete */}
              <Trash2
                className="absolute top-3 right-3 h-4 w-4 cursor-pointer text-red-500"
                onClick={() => removeStep(step.id)}
              />

              {/* type */}
              <div className="space-y-1">
                <Label>Type</Label>
                <Select value={step.type} onValueChange={(v) => updateStep(step.id, { type: v as any })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Direct", "Concatenate", "Expression"].map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* conditional fields */}
              {step.type === "Concatenate" && (
                <div className="space-y-1">
                  <Label>Delimiter</Label>
                  <Input
                    value={step.delimiter ?? ""}
                    onChange={(e) => updateStep(step.id, { delimiter: e.target.value })}
                  />
                </div>
              )}

              {step.type === "Expression" && (
                <div className="space-y-1">
                  <Label>Expression</Label>
                  <Input
                    value={step.expression ?? ""}
                    onChange={(e) => updateStep(step.id, { expression: e.target.value })}
                  />
                </div>
              )}

              {/* step source columns */}
              <div className="space-y-1">
                <Label>Step Source Columns</Label>
                <Select
                  onValueChange={(v) =>
                    updateStep(step.id, {
                      sourceColumns: step.sourceColumns.includes(v) ? step.sourceColumns : [...step.sourceColumns, v],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Add column" />
                  </SelectTrigger>
                  <SelectContent>
                    {sourceColumnsOptions
                      .filter((c) => !step.sourceColumns.includes(c))
                      .map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                {/* chips */}
                <div className="mt-2">
                  {step.sourceColumns.map((c) => (
                    <div key={c} className="bg-muted text-xs inline-flex items-center px-2 py-1 rounded-full mr-1 mt-1">
                      {c}
                      <Trash2
                        className="ml-1 h-3 w-3 cursor-pointer"
                        onClick={() =>
                          updateStep(step.id, {
                            sourceColumns: step.sourceColumns.filter((x) => x !== c),
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter className="pt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Transformations</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
