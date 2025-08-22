"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Search, Building, Plus, Edit, Trash, Users, Power, PowerOff } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea"

// Mock data for domains
const mockDomains = [
  {
    id: "DOM001",
    name: "Finance",
    description: "Financial data and processes",
    code: "FINANCE",
    isActive: true,
    userCount: 12,
    createdBy: "admin",
    createdDate: "2024-01-01T00:00:00Z",
  },
  {
    id: "DOM002", 
    name: "Human Resources",
    description: "HR data and employee information",
    code: "HR",
    isActive: true,
    userCount: 8,
    createdBy: "admin",
    createdDate: "2024-01-01T00:00:00Z",
  },
  {
    id: "DOM003",
    name: "Sales",
    description: "Sales data and customer information", 
    code: "SALES",
    isActive: true,
    userCount: 15,
    createdBy: "admin",
    createdDate: "2024-01-01T00:00:00Z",
  },
  {
    id: "DOM004",
    name: "Operations",
    description: "Operational data and processes",
    code: "OPS",
    isActive: false,
    userCount: 5,
    createdBy: "admin",
    createdDate: "2024-01-01T00:00:00Z",
  },
]

export default function DomainManagementPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("domains")
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDomainDialogOpen, setIsAddDomainDialogOpen] = useState(false)
  const [isEditDomainDialogOpen, setIsEditDomainDialogOpen] = useState(false)
  const [editingDomain, setEditingDomain] = useState<any>(null)
  const [domains, setDomains] = useState(mockDomains)

  // Filter domains based on search query
  const filteredDomains = domains.filter((domain) => {
    const matchesSearch =
      domain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      domain.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      domain.code.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSearch
  })

  // Handle adding a new domain
  const handleAddDomain = (formData: any) => {
    const newDomain = {
      id: `DOM${String(domains.length + 1).padStart(3, "0")}`,
      name: formData.name,
      description: formData.description,
      code: formData.code.toUpperCase(),
      isActive: formData.isActive,
      userCount: 0,
      createdBy: "current-user",
      createdDate: new Date().toISOString(),
    }
    
    setDomains([...domains, newDomain])
    toast({
      title: "Domain Added",
      description: `Domain "${formData.name}" has been added successfully.`,
    })
    setIsAddDomainDialogOpen(false)
  }

  // Handle editing a domain
  const handleEditDomain = (domain: any) => {
    setEditingDomain(domain)
    setIsEditDomainDialogOpen(true)
  }

  // Handle saving domain edits
  const handleSaveDomainEdit = (formData: any) => {
    setDomains(domains.map(d => 
      d.id === editingDomain.id 
        ? { ...d, ...formData, code: formData.code.toUpperCase() }
        : d
    ))
    toast({
      title: "Domain Updated",
      description: `Domain "${formData.name}" has been updated successfully.`,
    })
    setIsEditDomainDialogOpen(false)
    setEditingDomain(null)
  }

  // Handle activating/deactivating a domain
  const handleToggleDomainStatus = (domainId: string) => {
    const domain = domains.find(d => d.id === domainId)
    if (!domain) return
    
    const newStatus = !domain.isActive
    const statusText = newStatus ? "activated" : "deactivated"
    
    setDomains(domains.map(d => 
      d.id === domainId ? { ...d, isActive: newStatus } : d
    ))
    
    toast({
      title: `Domain ${statusText}`,
      description: `Domain "${domain.name}" has been ${statusText} successfully.`,
    })
  }

  // Handle deleting a domain
  const handleDeleteDomain = (domainId: string) => {
    const domain = domains.find(d => d.id === domainId)
    if (domain && domain.userCount > 0) {
      toast({
        title: "Cannot Delete Domain",
        description: "Domain has active users. Please reassign users before deleting.",
        variant: "destructive",
      })
      return
    }
    
    setDomains(domains.filter(d => d.id !== domainId))
    toast({
      title: "Domain Deleted",
      description: "Domain has been deleted successfully.",
    })
  }

  return (
    <>
      <PageHeader
        title="Domain Management"
        description="Manage domains and domain-specific access controls"
        actions={
          <Button onClick={() => setIsAddDomainDialogOpen(true)}>
            <Building className="mr-2 h-4 w-4" /> Add Domain
          </Button>
        }
      />

      <Tabs defaultValue="domains" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="domains" className="flex items-center">
            <Building className="mr-2 h-4 w-4" /> Domains
          </TabsTrigger>
        </TabsList>

        {/* Domains Tab */}
        <TabsContent value="domains" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Domain Management</CardTitle>
              <CardDescription>Create and manage business domains for data segregation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search domains..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Domain Name</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Users</TableHead>
                      <TableHead>Created Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDomains.map((domain) => (
                      <TableRow key={domain.id}>
                        <TableCell className="font-medium">{domain.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{domain.code}</Badge>
                        </TableCell>
                        <TableCell>{domain.description}</TableCell>
                        <TableCell>
                          <Badge
                            variant={domain.isActive ? "default" : "secondary"}
                            className={domain.isActive ? "bg-green-100 text-green-800" : ""}
                          >
                            {domain.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Users className="mr-1 h-4 w-4" />
                            {domain.userCount}
                          </div>
                        </TableCell>
                        <TableCell>{new Date(domain.createdDate).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleToggleDomainStatus(domain.id)}
                              title={domain.isActive ? "Deactivate Domain" : "Activate Domain"}
                            >
                              {domain.isActive ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEditDomain(domain)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDeleteDomain(domain.id)}
                              disabled={domain.userCount > 0}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredDomains.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No domains found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Domain Dialog */}
      <DomainDialog
        open={isAddDomainDialogOpen}
        onOpenChange={setIsAddDomainDialogOpen}
        onSave={handleAddDomain}
        title="Add New Domain"
        description="Create a new business domain for data segregation."
      />

      {/* Edit Domain Dialog */}
      <DomainDialog
        open={isEditDomainDialogOpen}
        onOpenChange={setIsEditDomainDialogOpen}
        onSave={handleSaveDomainEdit}
        title="Edit Domain"
        description="Update domain information and settings."
        initialData={editingDomain}
      />
    </>
  )
}

// Reusable Domain Dialog Component
function DomainDialog({ 
  open, 
  onOpenChange, 
  onSave, 
  title, 
  description, 
  initialData = null 
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: any) => void
  title: string
  description: string
  initialData?: any
}) {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    isActive: true,
  })

  // Reset form when dialog opens/closes or initialData changes
  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({
          name: initialData.name || "",
          code: initialData.code || "",
          description: initialData.description || "",
          isActive: initialData.isActive ?? true,
        })
      } else {
        setFormData({
          name: "",
          code: "",
          description: "",
          isActive: true,
        })
      }
    }
  }, [open, initialData])

  const handleSave = () => {
    if (!formData.name || !formData.code) {
      return // Basic validation
    }
    onSave(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="domain-name" className="text-right">
              Name
            </Label>
            <Input
              id="domain-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="col-span-3"
              placeholder="e.g., Finance"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="domain-code" className="text-right">
              Code
            </Label>
            <Input
              id="domain-code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              className="col-span-3"
              placeholder="e.g., FINANCE"
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="domain-description" className="text-right pt-2">
              Description
            </Label>
            <Textarea
              id="domain-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="col-span-3"
              placeholder="Describe the domain's purpose and scope"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="domain-status" className="text-right">
              Status
            </Label>
            <div className="flex items-center space-x-2 col-span-3">
              <Switch 
                id="domain-status" 
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="domain-status">Active</Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!formData.name || !formData.code}>
            {initialData ? "Save Changes" : "Add Domain"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
