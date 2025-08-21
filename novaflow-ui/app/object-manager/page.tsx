"use client"

import { useState } from "react"
import { PlusCircle, Edit, Trash2, Network } from "lucide-react"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { PageHeader } from "@/components/page-header"
import type { IntegrationObject, ObjectSchemaAttribute, Status, Connection } from "@/lib/types" // Added Connection type
import { useToast } from "@/components/ui/use-toast"
import { mockObjects, objectTypes, dataTypes, mockConnections, mockConnectionOptions } from "@/lib/mock-data"

export default function ObjectManagerPage() {
  const { toast } = useToast()
  const [objects, setObjects] = useState<IntegrationObject[]>(mockObjects)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedObject, setSelectedObject] = useState<IntegrationObject | null>(null)
  const [isObjectDialogOpen, setIsObjectDialogOpen] = useState(false)
  const [isSchemaDialogOpen, setIsSchemaDialogOpen] = useState(false)
  const [currentObjectFormData, setCurrentObjectFormData] = useState<Partial<IntegrationObject>>({})
  const [currentSchemaFormData, setCurrentSchemaFormData] = useState<Partial<ObjectSchemaAttribute>>({})

  const filteredObjects = objects.filter(
    (obj) =>
      obj.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      obj.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddObject = () => {
    setCurrentObjectFormData({ status: "A", type: "API", schema: [], connectionId: "" })
    setIsObjectDialogOpen(true)
  }

  const handleEditObject = (obj: IntegrationObject) => {
    setSelectedObject(obj)
    setCurrentObjectFormData({ ...obj })
    setIsObjectDialogOpen(true)
  }

  const handleDeleteObject = (id: string) => {
    setObjects((prev) => prev.filter((obj) => obj.id !== id))
    toast({ title: "Object Deleted", description: `Object with ID ${id} has been deleted.` })
  }

  const handleSaveObject = () => {
    if (
      !currentObjectFormData.name ||
      !currentObjectFormData.type ||
      !currentObjectFormData.description ||
      !currentObjectFormData.connectionId
    ) {
      toast({
        title: "Validation Error",
        description: "Name, Type, Description, and Connection are required.",
        variant: "destructive",
      })
      return
    }

    if (currentObjectFormData.id) {
      setObjects((prev) =>
        prev.map((obj) =>
          obj.id === currentObjectFormData.id ? ({ ...obj, ...currentObjectFormData } as IntegrationObject) : obj,
        ),
      )
      toast({ title: "Object Updated", description: `Object ${currentObjectFormData.name} has been updated.` })
    } else {
      const newId = `OBJ${String(objects.length + 1 + Math.floor(Math.random() * 1000)).padStart(3, "0")}`
      const newObject: IntegrationObject = {
        id: newId,
        name: currentObjectFormData.name,
        type: currentObjectFormData.type,
        description: currentObjectFormData.description,
        connectionId: currentObjectFormData.connectionId,
        status: currentObjectFormData.status || "A",
        schema: [], // Ensure schema is initialized
        createdBy: "system", // Placeholder
        createdDate: new Date().toISOString(),
      }
      setObjects((prev) => [...prev, newObject])
      toast({ title: "Object Added", description: `Object ${newObject.name} has been added.` })
    }
    setIsObjectDialogOpen(false)
    setCurrentObjectFormData({})
    setSelectedObject(null)
  }

  const handleAddSchemaAttribute = (obj: IntegrationObject) => {
    setSelectedObject(obj)
    setCurrentSchemaFormData({})
    setIsSchemaDialogOpen(true)
  }

  const handleEditSchemaAttribute = (obj: IntegrationObject, attr: ObjectSchemaAttribute) => {
    setSelectedObject(obj)
    setCurrentSchemaFormData({ ...attr })
    setIsSchemaDialogOpen(true)
  }

  const handleDeleteSchemaAttribute = (objectId: string, attributeId: string) => {
    setObjects((prev) =>
      prev.map((obj) => {
        if (obj.id === objectId) {
          return { ...obj, schema: obj.schema.filter((attr) => attr.id !== attributeId) }
        }
        return obj
      }),
    )
    toast({ title: "Schema Attribute Deleted" })
  }

  const handleSaveSchemaAttribute = () => {
    if (!selectedObject) return
    if (currentSchemaFormData.id) {
      const updatedSchema = selectedObject.schema.map((attr) =>
        attr.id === currentSchemaFormData.id ? ({ ...attr, ...currentSchemaFormData } as ObjectSchemaAttribute) : attr,
      )
      setObjects((prev) => prev.map((obj) => (obj.id === selectedObject.id ? { ...obj, schema: updatedSchema } : obj)))
    } else {
      const newAttrId = `S${String(selectedObject.schema.length + 1).padStart(3, "0")}`
      const newAttribute = { ...currentSchemaFormData, id: newAttrId } as ObjectSchemaAttribute
      setObjects((prev) =>
        prev.map((obj) => (obj.id === selectedObject.id ? { ...obj, schema: [...obj.schema, newAttribute] } : obj)),
      )
    }
    setIsSchemaDialogOpen(false)
    setCurrentSchemaFormData({})
    toast({ title: "Schema Attribute Saved" })
  }

  const getConnectionName = (connectionId: string | undefined): string => {
    if (!connectionId) return "N/A"
    const conn = mockConnections.find((c: Connection) => c.id === connectionId)
    return conn ? conn.name : "Unknown Connection"
  }

  return (
    <>
      <PageHeader
        title="Object Manager"
        description="Manage integration objects like APIs, files, topics, queues, and databases."
        actions={
          <Button onClick={handleAddObject}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Object
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Integration Objects</CardTitle>
            <CardDescription>View and manage all defined integration objects.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center py-4">
              <Input
                placeholder="Filter objects by name or description..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Object ID</TableHead>
                    <TableHead>Object Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Connection</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredObjects.length > 0 ? (
                    filteredObjects.map((obj) => (
                      <TableRow
                        key={obj.id}
                        onClick={() => setSelectedObject(obj)}
                        className={`cursor-pointer hover:bg-muted/50 ${selectedObject?.id === obj.id ? "bg-muted" : ""}`}
                      >
                        <TableCell className="font-mono text-sm">{obj.id}</TableCell>
                        <TableCell className="font-medium">{obj.name}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                            {obj.type}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {getConnectionName(obj.connectionId)}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                              obj.status === "A"
                                ? "bg-green-50 text-green-700 ring-green-600/20"
                                : "bg-gray-50 text-gray-600 ring-gray-500/10"
                            }`}
                          >
                            {obj.status === "A" ? "Active" : "Inactive"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEditObject(obj)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteObject(obj.id)
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No objects found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              {selectedObject ? `Selected: ${selectedObject.name}` : "Click on an object to view its schema"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Information Schema</CardTitle>
            <CardDescription>
              {selectedObject
                ? `Schema definition for ${selectedObject.name} (${selectedObject.type})`
                : "Select an object to view and edit its schema"}
            </CardDescription>
            {selectedObject && (
              <div className="flex items-center gap-2 pt-2">
                <Button onClick={() => handleAddSchemaAttribute(selectedObject)}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Attribute
                </Button>
                <Button variant="outline" onClick={() => handleEditObject(selectedObject)}>
                  <Edit className="mr-2 h-4 w-4" /> Edit Object
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {selectedObject ? (
              <>
                <div className="mb-4 p-4 bg-muted/50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Object ID:</span> {selectedObject.id}
                    </div>
                    <div>
                      <span className="font-medium">Type:</span> {selectedObject.type}
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium">Connection:</span> {getConnectionName(selectedObject.connectionId)}
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium">Description:</span> {selectedObject.description}
                    </div>
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Attribute Name</TableHead>
                        <TableHead>Data Type</TableHead>
                        <TableHead>Nullable</TableHead>
                        <TableHead>Source Field</TableHead>
                        <TableHead>Sample Value</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedObject.schema.length > 0 ? (
                        selectedObject.schema.map((attr) => (
                          <TableRow key={attr.id}>
                            <TableCell className="font-medium">{attr.attributeName}</TableCell>
                            <TableCell>
                              <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                {attr.dataType}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span
                                className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                                  attr.isNullable
                                    ? "bg-yellow-50 text-yellow-800 ring-yellow-600/20"
                                    : "bg-red-50 text-red-700 ring-red-600/10"
                                }`}
                              >
                                {attr.isNullable ? "Y" : "N"}
                              </span>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">{attr.sourceField || "-"}</TableCell>
                            <TableCell className="text-sm font-mono">{attr.sampleValue || "-"}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditSchemaAttribute(selectedObject, attr)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteSchemaAttribute(selectedObject.id, attr.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-muted-foreground">No schema attributes defined.</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAddSchemaAttribute(selectedObject)}
                              >
                                <PlusCircle className="mr-2 h-4 w-4" /> Add First Attribute
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    {selectedObject.schema.length} attribute{selectedObject.schema.length !== 1 ? "s" : ""} defined
                  </span>
                  <span>
                    {selectedObject.schema.filter((attr) => !attr.isNullable).length} required,{" "}
                    {selectedObject.schema.filter((attr) => attr.isNullable).length} optional
                  </span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Network className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No Object Selected</h3>
                <p className="text-muted-foreground mb-4">
                  Select an integration object from the list to view and edit its schema definition.
                </p>
                <Button onClick={handleAddObject}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Create New Object
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isObjectDialogOpen} onOpenChange={setIsObjectDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{currentObjectFormData.id ? "Edit Object" : "Add New Object"}</DialogTitle>
            <DialogDescription>
              {currentObjectFormData.id
                ? "Modify the details of the existing object."
                : "Define a new integration object."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="obj-name" className="text-right">
                Name
              </Label>
              <Input
                id="obj-name"
                value={currentObjectFormData.name || ""}
                onChange={(e) => setCurrentObjectFormData((p) => ({ ...p, name: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="obj-connection" className="text-right">
                Connection
              </Label>
              <Select
                value={currentObjectFormData.connectionId}
                onValueChange={(value) => setCurrentObjectFormData((p) => ({ ...p, connectionId: value }))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select connection" />
                </SelectTrigger>
                <SelectContent>
                  {mockConnectionOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="obj-type" className="text-right">
                Type
              </Label>
              <Select
                value={currentObjectFormData.type}
                onValueChange={(value) =>
                  setCurrentObjectFormData((p) => ({ ...p, type: value as IntegrationObject["type"] }))
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select object type" />
                </SelectTrigger>
                <SelectContent>
                  {objectTypes.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="obj-desc" className="text-right">
                Description
              </Label>
              <Input
                id="obj-desc"
                value={currentObjectFormData.description || ""}
                onChange={(e) => setCurrentObjectFormData((p) => ({ ...p, description: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="obj-status" className="text-right">
                Status
              </Label>
              <Select
                value={currentObjectFormData.status}
                onValueChange={(value) => setCurrentObjectFormData((p) => ({ ...p, status: value as Status }))}
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
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsObjectDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleSaveObject}>
              Save Object
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isSchemaDialogOpen} onOpenChange={setIsSchemaDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{currentSchemaFormData.id ? "Edit Schema Attribute" : "Add New Schema Attribute"}</DialogTitle>
            <DialogDescription>{selectedObject && `Define attribute for ${selectedObject.name}`}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="attr-name" className="text-right">
                Attribute Name
              </Label>
              <Input
                id="attr-name"
                value={currentSchemaFormData.attributeName || ""}
                onChange={(e) => setCurrentSchemaFormData((p) => ({ ...p, attributeName: e.target.value }))}
                className="col-span-3"
                placeholder="e.g., customerId, firstName"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="attr-type" className="text-right">
                Data Type
              </Label>
              <Select
                value={currentSchemaFormData.dataType}
                onValueChange={(value) => setCurrentSchemaFormData((p) => ({ ...p, dataType: value }))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select data type" />
                </SelectTrigger>
                <SelectContent>
                  {dataTypes.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="attr-nullable" className="text-right">
                Nullable
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Checkbox
                  id="attr-nullable"
                  checked={currentSchemaFormData.isNullable}
                  onCheckedChange={(checked) => setCurrentSchemaFormData((p) => ({ ...p, isNullable: !!checked }))}
                />
                <Label htmlFor="attr-nullable" className="text-sm text-muted-foreground">
                  Allow null values
                </Label>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="attr-source" className="text-right">
                Source Field
              </Label>
              <Input
                id="attr-source"
                value={currentSchemaFormData.sourceField || ""}
                onChange={(e) => setCurrentSchemaFormData((p) => ({ ...p, sourceField: e.target.value }))}
                className="col-span-3"
                placeholder="e.g., customer_id, first_name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="attr-sample" className="text-right">
                Sample Value
              </Label>
              <Input
                id="attr-sample"
                value={currentSchemaFormData.sampleValue || ""}
                onChange={(e) => setCurrentSchemaFormData((p) => ({ ...p, sampleValue: e.target.value }))}
                className="col-span-3"
                placeholder="e.g., CUST123456, John"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsSchemaDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleSaveSchemaAttribute}>
              Save Attribute
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
