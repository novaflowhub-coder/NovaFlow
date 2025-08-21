import { Skeleton } from "@/components/ui/skeleton"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function ConnectionsLoading() {
  return (
    <>
      <PageHeader
        title="Connection Manager"
        description="Manage system connections like database servers, API gateways, etc."
        actions={<Skeleton className="h-10 w-36" />}
      />
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center py-4">
            <Skeleton className="h-10 w-full max-w-sm" />
          </div>
          <div className="rounded-md border">
            <Skeleton className="h-12 w-full" /> {/* Table Header */}
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full mt-2" />
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  )
}
