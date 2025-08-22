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
import { Search, Building, Plus, Edit, Trash, Users, Power, PowerOff, Loader2 } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { domainApiService, Domain } from "@/lib/domain-api"
import { authService } from "@/lib/auth"

interface DomainWithUserCount extends Domain {
  userCount?: number;
}

export default function DomainManagementPage() {
  const { toast } = useToast()
  const auth = authService
  const [activeTab, setActiveTab] = useState("domains")
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDomainDialogOpen, setIsAddDomainDialogOpen] = useState(false)
  const [isEditDomainDialogOpen, setIsEditDomainDialogOpen] = useState(false)
  const [editingDomain, setEditingDomain] = useState<DomainWithUserCount | null>(null)
  const [domains, setDomains] = useState<DomainWithUserCount[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [hasPermissions, setHasPermissions] = useState<boolean | null>(null)

  // Load domains and check permissions on component mount
  useEffect(() => {
    checkPermissionsAndLoadDomains()
  }, [])

  // Check permissions and load domains
  const checkPermissionsAndLoadDomains = async () => {
    try {
      setLoading(true)
      
      // Check if user has domain management permissions
      const hasPerms = await domainApiService.checkDomainPermissions()
      setHasPermissions(hasPerms)
      
      if (hasPerms) {
        await loadDomains()
      } else {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You don't have permissions for domain management. Please contact your administrator to ensure you have the Administrator role assigned.",
        })
      }
    } catch (error) {
      console.error('Failed to check permissions:', error)
      toast({
        variant: "destructive",
        title: "Permission Check Failed",
        description: "Unable to verify your permissions. Please try refreshing the page.",
      })
    } finally {
      setLoading(false)
    }
  }

  // Load domains from API (only called if user has permissions)
  const loadDomains = async () => {
    try {
      const domainsData = await domainApiService.getAllDomains()
      
      // Fetch user counts for each domain
      const domainsWithUserCount = await Promise.all(
        domainsData.map(async (domain) => {
          try {
            const userCount = await domainApiService.getActiveUserCount(domain.id)
            return { ...domain, userCount }
          } catch (error) {
            console.warn(`Failed to fetch user count for domain ${domain.id}:`, error)
            return { ...domain, userCount: 0 }
          }
        })
      )
      
      setDomains(domainsWithUserCount)
    } catch (error) {
      console.error('Failed to load domains:', error)
      toast({
        variant: "destructive",
        title: "Error Loading Domains",
        description: "Failed to load domains. Please try again.",
      })
    }
  }

  // Filter domains based on search query
  const filteredDomains = domains.filter((domain) => {
    const matchesSearch =
      domain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      domain.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      domain.code.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSearch
  })

  // Handle adding a new domain
  const handleAddDomain = async (formData: any) => {
    try {
      setActionLoading('add')
      const currentUser = auth.getCurrentUser()
      
      const newDomainData = {
        name: formData.name,
        description: formData.description,
        code: formData.code.toUpperCase(),
        isActive: formData.isActive,
        createdBy: currentUser?.email || 'unknown',
      }
      
      await domainApiService.createDomain(newDomainData)
      
      toast({
        title: "Domain Added",
        description: `Domain "${formData.name}" has been added successfully.`,
      })
      
      setIsAddDomainDialogOpen(false)
      await loadDomains() // Reload domains
    } catch (error) {
      console.error('Failed to create domain:', error)
      toast({
        variant: "destructive",
        title: "Error Creating Domain",
        description: error instanceof Error ? error.message : "Failed to create domain. Please try again.",
      })
    } finally {
      setActionLoading(null)
    }
  }

  // Handle editing a domain
  const handleEditDomain = (domain: DomainWithUserCount) => {
    setEditingDomain(domain)
    setIsEditDomainDialogOpen(true)
  }

  // Handle saving domain edits
  const handleSaveDomainEdit = async (formData: any) => {
    if (!editingDomain) return
    
    try {
      setActionLoading('edit')
      
      const currentUser = auth.getCurrentUser()
      
      const updateData = {
        name: formData.name,
        description: formData.description,
        code: formData.code.toUpperCase(),
        isActive: formData.isActive,
        createdBy: editingDomain.createdBy, // Preserve original createdBy
        lastModifiedBy: currentUser?.email || 'unknown',
      }
      
      await domainApiService.updateDomain(editingDomain.id, updateData)
      
      toast({
        title: "Domain Updated",
        description: `Domain "${formData.name}" has been updated successfully.`,
      })
      
      setIsEditDomainDialogOpen(false)
      setEditingDomain(null)
      await loadDomains() // Reload domains
    } catch (error) {
      console.error('Failed to update domain:', error)
      toast({
        variant: "destructive",
        title: "Error Updating Domain",
        description: error instanceof Error ? error.message : "Failed to update domain. Please try again.",
      })
    } finally {
      setActionLoading(null)
    }
  }

  // Handle activating/deactivating a domain
  const handleToggleDomainStatus = async (domainId: string) => {
    const domain = domains.find(d => d.id === domainId)
    if (!domain) return
    
    try {
      setActionLoading(`toggle-${domainId}`)
      const currentUser = auth.getCurrentUser()
      const modifiedBy = currentUser?.email || 'unknown'
      
      const newStatus = !domain.isActive
      const statusText = newStatus ? "activated" : "deactivated"
      
      if (newStatus) {
        await domainApiService.activateDomain(domainId, modifiedBy)
      } else {
        await domainApiService.deactivateDomain(domainId, modifiedBy)
      }
      
      toast({
        title: `Domain ${statusText}`,
        description: `Domain "${domain.name}" has been ${statusText} successfully.`,
      })
      
      await loadDomains() // Reload domains
    } catch (error) {
      console.error('Failed to toggle domain status:', error)
      toast({
        variant: "destructive",
        title: "Error Updating Domain Status",
        description: error instanceof Error ? error.message : "Failed to update domain status. Please try again.",
      })
    } finally {
      setActionLoading(null)
    }
  }

  // Handle deleting a domain
  const handleDeleteDomain = async (domainId: string) => {
    const domain = domains.find(d => d.id === domainId)
    if (!domain) return
    
    if (domain.userCount && domain.userCount > 0) {
      toast({
        title: "Cannot Delete Domain",
        description: "Domain has active users. Please reassign users before deleting.",
        variant: "destructive",
      })
      return
    }
    
    try {
      setActionLoading(`delete-${domainId}`)
      
      await domainApiService.deleteDomain(domainId)
      
      toast({
        title: "Domain Deleted",
        description: "Domain has been deleted successfully.",
      })
      
      await loadDomains() // Reload domains
    } catch (error) {
      console.error('Failed to delete domain:', error)
      toast({
        variant: "destructive",
        title: "Error Deleting Domain",
        description: error instanceof Error ? error.message : "Failed to delete domain. Please try again.",
      })
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <>
      <PageHeader
        title="Domain Management"
        description="Manage domains and domain-specific access controls"
        actions={
          <Button 
            onClick={() => setIsAddDomainDialogOpen(true)}
            disabled={hasPermissions === false}
          >
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
                    {loading && (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          <div className="flex items-center justify-center">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Loading domains...
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
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
                              disabled={actionLoading === `toggle-${domain.id}`}
                            >
                              {actionLoading === `toggle-${domain.id}` ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : domain.isActive ? (
                                <PowerOff className="h-4 w-4" />
                              ) : (
                                <Power className="h-4 w-4" />
                              )}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleEditDomain(domain)}
                              disabled={!!actionLoading}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDeleteDomain(domain.id)}
                              disabled={(domain.userCount || 0) > 0 || actionLoading === `delete-${domain.id}`}
                            >
                              {actionLoading === `delete-${domain.id}` ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {!loading && filteredDomains.length === 0 && (
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
        loading={actionLoading === 'add'}
      />

      {/* Edit Domain Dialog */}
      <DomainDialog
        open={isEditDomainDialogOpen}
        onOpenChange={setIsEditDomainDialogOpen}
        onSave={handleSaveDomainEdit}
        title="Edit Domain"
        description="Update domain information and settings."
        initialData={editingDomain}
        loading={actionLoading === 'edit'}
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
  initialData = null,
  loading = false
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: any) => void
  title: string
  description: string
  initialData?: any
  loading?: boolean
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
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!formData.name || !formData.code || loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {initialData ? "Saving..." : "Adding..."}
              </>
            ) : (
              initialData ? "Save Changes" : "Add Domain"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
