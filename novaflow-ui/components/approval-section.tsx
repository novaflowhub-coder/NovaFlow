"use client"

import { Badge } from "@/components/ui/badge"
import { Calendar, User } from "lucide-react"
import { format } from "date-fns"

/**
 * NOTE:
 * - `approvalStatus` is what existing pages pass (e.g. Rule Definition).
 * - `status` is kept for backward-compat after the recent refactor.
 *   Either prop may be provided; `approvalStatus` wins when both exist.
 */
export interface ApprovalSectionProps {
  approvalStatus?: "Approved" | "Pending Final Approval" | "Pending Peer Review" | "Rejected" | "Draft"
  status?: string
  /* audit fields (all optional) */
  peerReviewedBy?: string
  peerReviewedDate?: string
  approvedBy?: string
  approvedDate?: string
  createdBy?: string
  createdDate?: string
}

const badgeClass = (s: string) => {
  switch (s) {
    case "Approved":
      return "bg-green-100 text-green-800 border-green-200"
    case "Pending Final Approval":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "Pending Peer Review":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "Rejected":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export function ApprovalSection(props: ApprovalSectionProps) {
  const { approvalStatus, status, peerReviewedBy, peerReviewedDate, approvedBy, approvedDate, createdBy, createdDate } =
    props

  // Resolve the status to display; fall back to Draft
  const displayStatus = approvalStatus ?? status ?? "Draft"

  const fmt = (d?: string) => (d ? format(new Date(d), "MMM dd, yyyy 'at' h:mm a") : "—")

  return (
    <section className="space-y-4 md:col-span-2">
      {/* Current status */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-muted-foreground">Approval Status:</span>
        <Badge className={badgeClass(displayStatus)}>{displayStatus}</Badge>
      </div>

      {/* History */}
      {(createdBy || peerReviewedBy || approvedBy) && (
        <div className="border-t pt-4 space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground">Approval History</h4>

          {createdBy && createdDate && (
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <User className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <div className="text-sm font-medium">Created</div>
                <div className="text-sm text-muted-foreground">by {createdBy}</div>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {fmt(createdDate)}
              </div>
            </div>
          )}

          {peerReviewedBy && peerReviewedDate && (
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <User className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <div className="text-sm font-medium">Peer Review</div>
                <div className="text-sm text-muted-foreground">by {peerReviewedBy}</div>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {fmt(peerReviewedDate)}
              </div>
            </div>
          )}

          {approvedBy && approvedDate && (
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <User className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <div className="text-sm font-medium">Final Approval</div>
                <div className="text-sm text-muted-foreground">by {approvedBy}</div>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {fmt(approvedDate)}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
