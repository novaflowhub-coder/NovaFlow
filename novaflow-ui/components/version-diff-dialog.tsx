"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface VersionDiffDialogProps {
  open: boolean
  onClose: () => void
  oldVersion: string
  newVersion: string
  diff: string
}

export function VersionDiffDialog({ open, onClose, oldVersion, newVersion, diff }: VersionDiffDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Version Difference</DialogTitle>
          <DialogDescription>
            Comparing version {oldVersion} to {newVersion}.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-auto bg-muted/50 p-4 rounded-md">
          <pre className="text-sm whitespace-pre-wrap font-mono">{diff}</pre>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
