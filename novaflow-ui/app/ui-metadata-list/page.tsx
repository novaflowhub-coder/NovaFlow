"use client"

import Link from "next/link"
import { Plus } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { mockUIMetadata } from "@/lib/mock-data"

export default function UIMetadataListPage() {
  return (
    <>
      <PageHeader
        title="UI Metadata"
        description="Define and manage dynamic UI layouts."
        actions={
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/ui-metadata?id=new">
              <Plus className="mr-2 h-4 w-4" />
              Create New UI Metadata
            </Link>
          </Button>
        }
      />

      <Card>
        <CardHeader>Existing Definitions</CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Layout</TableHead>
                <TableHead>Source Object</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUIMetadata.map((ui) => (
                <TableRow key={ui.id}>
                  <TableCell>
                    <Link href={`/ui-metadata?id=${ui.id}`} className="font-medium underline underline-offset-4">
                      {ui.name}
                    </Link>
                  </TableCell>
                  <TableCell className="capitalize">{ui.layoutType}</TableCell>
                  <TableCell>{ui.sourceObjectId}</TableCell>
                  <TableCell>{ui.approvalStatus}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}
