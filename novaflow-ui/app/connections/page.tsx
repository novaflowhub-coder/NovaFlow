"use client"

import { useState, useTransition } from "react"
import { PlusCircle, Edit, Trash2, Zap, Loader2, Power, PowerOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PageHeader } from "@/components/page-header"
import type { Connection, Status } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"
import { mockConnections, connectionTypes } from "@/lib/mock-data"
import { testConnectionAction } from "./actions" // Import the server action

// Helper to validate JSON
const isValidJson = (str: string) => {
  try {
    JSON.parse(str)
    return true
  } catch (e) {
    return false
  }
}

export default function ConnectionsPage() {
  const { toast } = useToast()
  const [connections, setConnections] = useState<Connection[]>(mockConnections)
  const [searchTerm, setSearchTerm] = useState("")
  const [isConnectionDialogOpen, setIsConnectionDialogOpen] = useState(false)
  const [currentConnectionFormData, setCurrentConnectionFormData] = useState<Partial<Connection>>({})
  const [editingConnectionId, setEditingConnectionId] = useState<string | null>(null)
  const [isTestingConnection, startTestTransition] = useTransition()

  const filteredConnections = connections.filter(
    (conn) =>
      conn.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conn.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conn.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddConnection = () => {
    setEditingConnectionId(null)
    setCurrentConnectionFormData({
      status: "A",
      type: "Database Server",
      connectionParameters: JSON.stringify({}, null, 2),
    })
    setIsConnectionDialogOpen(true)
  }

  const handleEditConnection = (conn: Connection) => {
    setEditingConnectionId(conn.id)
    setCurrentConnectionFormData({
      ...conn,
      connectionParameters: conn.connectionParameters || JSON.stringify({}, null, 2),
    })
    setIsConnectionDialogOpen(true)
  }

  const handleDeleteConnection = (id: string) => {
    // Add check if connection is used by any object
    setConnections((prev) => prev.filter((conn) => conn.id !== id))
    toast({ title: "Connection Deleted", description: `Connection with ID ${id} has been deleted.` })
  }

  const handleSaveConnection = () => {
    if (!currentConnectionFormData.name || !currentConnectionFormData.type || !currentConnectionFormData.description) {
      toast({
        title: "Validation Error",
        description: "Name, Type and Description are required.",
        variant: "destructive",
      })
      return
    }

    if (
      currentConnectionFormData.connectionParameters &&
      !isValidJson(currentConnectionFormData.connectionParameters)
    ) {
      toast({
        title: "Validation Error",
        description: "Connection Parameters must be valid JSON or empty.",
        variant: "destructive",
      })
      return
    }

    if (editingConnectionId) {
      setConnections((prev) =>
        prev.map((conn) =>
          conn.id === editingConnectionId ? ({ ...conn, ...currentConnectionFormData } as Connection) : conn,
        ),
      )
      toast({
        title: "Connection Updated",
        description: `Connection ${currentConnectionFormData.name} has been updated.`,
      })
    } else {
      const newId = `CONN${String(connections.length + 1 + Math.floor(Math.random() * 1000)).padStart(3, "0")}`
      setConnections((prev) => [...prev, { ...currentConnectionFormData, id: newId } as Connection])
      toast({ title: "Connection Added", description: `Connection ${currentConnectionFormData.name} has been added.` })
    }
    setIsConnectionDialogOpen(false)
    setCurrentConnectionFormData({})
    setEditingConnectionId(null)
  }

  const handleTestConnection = async () => {
    if (!currentConnectionFormData.name || !currentConnectionFormData.type) {
      toast({
        title: "Missing Information",
        description: "Connection Name and Type are required to test.",
        variant: "destructive",
      })
      return
    }
    if (
      currentConnectionFormData.connectionParameters &&
      !isValidJson(currentConnectionFormData.connectionParameters)
    ) {
      toast({
        title: "Invalid JSON",
        description: "Connection Parameters must be valid JSON to test.",
        variant: "destructive",
      })
      return
    }

    startTestTransition(async () => {
      try {
        const result = await testConnectionAction({
          name: currentConnectionFormData.name!,
          type: currentConnectionFormData.type!,
          connectionParameters: currentConnectionFormData.connectionParameters,
        })
        toast({
          title: result.success ? "Connection Test Succeeded" : "Connection Test Failed",
          description: result.message,
          variant: result.success ? "default" : "destructive",
        })
        if (result.details) {
          console.log("Connection Test Details:", result.details)
        }
      } catch (error) {
        toast({
          title: "Error Testing Connection",
          description: "An unexpected error occurred.",
          variant: "destructive",
        })
        console.error("Test Connection Error:", error)
      }
    })
  }

  return (
    <>
      <PageHeader
        title="Connection Manager"
        description="Manage system connections like database servers, API gateways, etc."
        actions={
          <Button onClick={handleAddConnection}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Connection
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Connections</CardTitle>
          <CardDescription>View and manage all defined connections.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center py-4">
            <Input
              placeholder="Filter connections by name, description, or type..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredConnections.length > 0 ? (
                  filteredConnections.map((conn) => (
                    <TableRow key={conn.id}>
                      <TableCell className="font-mono text-sm">{conn.id}</TableCell>
                      <TableCell className="font-medium">{conn.name}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
                          {conn.type}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{conn.description}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                            conn.status === "A"
                              ? "bg-green-50 text-green-700 ring-green-600/20"
                              : "bg-gray-50 text-gray-600 ring-gray-500/10"
                          }`}
                        >
                          {conn.status === "A" ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleEditConnection(conn)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteConnection(conn.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No connections found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isConnectionDialogOpen} onOpenChange={setIsConnectionDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          {" "}
          {/* Increased width for textarea */}
          <DialogHeader>
            <DialogTitle>{editingConnectionId ? "Edit Connection" : "Add New Connection"}</DialogTitle>
            <DialogDescription>
              {editingConnectionId
                ? "Modify the details of the existing connection."
                : "Define a new system connection."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            {" "}
            {/* Increased gap */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="conn-name" className="text-right">
                Name
              </Label>
              <Input
                id="conn-name"
                value={currentConnectionFormData.name || ""}
                onChange={(e) => setCurrentConnectionFormData((p) => ({ ...p, name: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="conn-type" className="text-right">
                Type
              </Label>
              <Select
                value={currentConnectionFormData.type}
                onValueChange={(value) =>
                  setCurrentConnectionFormData((p) => ({ ...p, type: value as Connection["type"] }))
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select connection type" />
                </SelectTrigger>
                <SelectContent>
                  {connectionTypes.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="conn-desc" className="text-right">
                Description
              </Label>
              <Input
                id="conn-desc"
                value={currentConnectionFormData.description || ""}
                onChange={(e) => setCurrentConnectionFormData((p) => ({ ...p, description: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              {" "}
              {/* Changed items-center to items-start for textarea */}
              <Label htmlFor="conn-params" className="text-right pt-2">
                {" "}
                {/* Added padding-top */}
                Parameters (JSON)
              </Label>
              <Textarea
                id="conn-params"
                placeholder='Enter connection parameters as JSON, e.g.,\n{\n  "host": "localhost",\n  "port": 5432\n}'
                value={currentConnectionFormData.connectionParameters || ""}
                onChange={(e) => setCurrentConnectionFormData((p) => ({ ...p, connectionParameters: e.target.value }))}
                className="col-span-3 min-h-[120px] font-mono text-sm" // Increased min-height
                rows={6}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="conn-status" className="text-right">
                Status
              </Label>
              <Select
                value={currentConnectionFormData.status}
                onValueChange={(value) => setCurrentConnectionFormData((p) => ({ ...p, status: value as Status }))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">Active</SelectItem>
                  <SelectItem value="I">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            {" "}
            {/* Aligned Test button to left, Save/Cancel to right */}
            <Button
              type="button"
              variant="outline"
              onClick={handleTestConnection}
              disabled={isTestingConnection || !currentConnectionFormData.name || !currentConnectionFormData.type}
            >
              {isTestingConnection ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Zap className="mr-2 h-4 w-4" />
              )}
              Test Connection
            </Button>
            <div>
              <Button type="button" variant="outline" onClick={() => setIsConnectionDialogOpen(false)} className="mr-2">
                Cancel
              </Button>
              <Button type="submit" onClick={handleSaveConnection}>
                Save Connection
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
