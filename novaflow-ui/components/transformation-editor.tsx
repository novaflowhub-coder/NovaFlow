"use client"

import { Settings } from "lucide-react"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import type { Transformation } from "@/lib/types"

interface Props {
  transformation: Transformation
  onTransformationChange: (t: Transformation) => void
  sourceColumns: string[]
  targetColumns: string[]
  onEdit: () => void
}

export function TransformationEditor({
  transformation,
  onTransformationChange,
  sourceColumns,
  targetColumns,
  onEdit,
}: Props) {
  return (
    <div className="flex items-center gap-2">
      {/* SOURCE */}
      <Select
        value={transformation.sourceColumn}
        onValueChange={(v) => onTransformationChange({ ...transformation, sourceColumn: v })}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Source column" />
        </SelectTrigger>
        <SelectContent>
          {sourceColumns.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <span className="text-muted-foreground">→</span>

      {/* TARGET */}
      <Select
        value={transformation.targetColumn}
        onValueChange={(v) => onTransformationChange({ ...transformation, targetColumn: v })}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Target column" />
        </SelectTrigger>
        <SelectContent>
          {targetColumns.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* POPUP TRIGGER */}
      <Button variant="outline" size="sm" onClick={onEdit}>
        <Settings className="h-4 w-4 mr-1" />
        Transform
      </Button>
    </div>
  )
}
