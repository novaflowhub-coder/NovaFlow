'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Trash2, Edit, Power, PowerOff } from "lucide-react"
import { CrudHeader } from "@/components/um/crud-header"
import { LoadingSkeleton } from "@/components/um/loading-skeleton"
import { AccessControl } from "@/components/um/access-control"
import { domainApiService, Domain } from "@/lib/domain-api"
import { authService } from "@/lib/auth"

export default function DomainsPage() {
  const [domains, setDomains] = useState<Domain[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingDomain, setEditingDomain] = useState<Domain | null>(null)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    code: ''
  })

  useEffect(() => {
    loadDomains()
  }, [])

  const loadDomains = async () => {
    try {
      setLoading(true)
      const data = await domainApiService.getAllDomains()
      setDomains(data)
    } catch (error) {
      // Handle permission errors gracefully - don't show error toast for 403
      if (error.message?.includes('Access denied')) {
        console.log('Domain management access not available for this user:', error.message)
        setDomains([])
      } else {
        console.error('Failed to load domains:', error)
        toast({
          title: "Error",
          description: "Failed to load domains. Please try again.",
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const filteredDomains = domains.filter(domain =>
    domain.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    domain.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    domain.code?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      code: ''
    })
  }

  const handleAdd = () => {
    resetForm()
    setIsAddDialogOpen(true)
  }

  const handleEdit = (domain: Domain) => {
    setEditingDomain(domain)
    setFormData({
      name: domain.name || '',
      description: domain.description || '',
      code: domain.code || ''
    })
    setIsEditDialogOpen(true)
  }

  const validateCode = (code: string, excludeId?: string): boolean => {
    return !domains.some(d => d.code === code && d.id !== excludeId)
  }

  const handleSave = async () => {
    if (!formData.name || !formData.code) {
      toast({
        title: "Validation Error",
        description: "Domain name and code are required.",
        variant: "destructive",
      })
      return
    }

    // Check for unique code
    if (!validateCode(formData.code, editingDomain?.id)) {
      toast({
        title: "Validation Error",
        description: "A domain with this code already exists.",
        variant: "destructive",
      })
      return
    }

    try {
      setSaving(true)
      const currentUser = authService.getCurrentUser()
      const currentUserEmail = currentUser?.email || 'system'

      if (editingDomain) {
        const updateData = {
          ...formData,
          isActive: editingDomain.isActive,
          createdBy: editingDomain.createdBy,
          lastModifiedBy: currentUserEmail
        }
        await domainApiService.updateDomain(editingDomain.id, updateData)
        toast({
          title: "Success",
          description: "Domain updated successfully.",
        })
        setIsEditDialogOpen(false)
      } else {
        const createData = {
          ...formData,
          createdBy: currentUserEmail,
          isActive: true
        }
        await domainApiService.createDomain(createData)
        toast({
          title: "Success",
          description: "Domain created successfully.",
        })
        setIsAddDialogOpen(false)
      }
      
      await loadDomains()
      resetForm()
      setEditingDomain(null)
    } catch (error) {
      console.error('Failed to save domain:', error)
      toast({
        title: "Error",
        description: "Failed to save domain. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (domain: Domain) => {
    if (!confirm(`Are you sure you want to delete domain "${domain.name}"?`)) {
      return
    }

    try {
      await domainApiService.deleteDomain(domain.id)
      toast({
        title: "Success",
        description: "Domain deleted successfully.",
      })
      await loadDomains()
    } catch (error) {
      console.error('Failed to delete domain:', error)
      toast({
        title: "Error",
        description: "Failed to delete domain. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleToggleStatus = async (domain: Domain) => {
    try {
      if (domain.isActive) {
        await domainApiService.deactivateDomain(domain.id)
        toast({
          title: "Success",
          description: "Domain deactivated successfully.",
        })
      } else {
        await domainApiService.activateDomain(domain.id)
        toast({
          title: "Success",
          description: "Domain activated successfully.",
        })
      }
      await loadDomains()
    } catch (error) {
      console.error('Failed to toggle domain status:', error)
      toast({
        title: "Error",
        description: "Failed to update domain status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <AccessControl
        requiredPath="/domains"
        requiredPermissions={['READ', 'VIEW']}
        title="Domains"
        description="Manage business domains for role organization"
      >
        <div className="space-y-6">
          <CrudHeader
            title="Domains"
            description="Manage business domains for role organization"
            searchPlaceholder="Search domains..."
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            addButtonText="Add Domain"
            onAddClick={handleAdd}
          />
          <LoadingSkeleton columns={6} />
        </div>
      </AccessControl>
    )
  }

  return (
    <AccessControl
      requiredPath="/domains"
      requiredPermissions={['READ', 'VIEW']}
      title="Domains"
      description="Manage business domains for role organization"
    >
      <div className="space-y-6">
        <CrudHeader
          title="Domains"
          description="Manage business domains for role organization"
          searchPlaceholder="Search domains..."
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          addButtonText="Add Domain"
          onAddClick={handleAdd}
        />

        {filteredDomains.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm ? 'No domains found matching your search.' : 'No domains found.'}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Domain Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDomains.map((domain) => (
                  <TableRow key={domain.id}>
                    <TableCell className="font-medium">{domain.name}</TableCell>
                    <TableCell className="font-mono text-sm">{domain.code}</TableCell>
                    <TableCell>{domain.description || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={domain.isActive ? 'default' : 'secondary'}>
                        {domain.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(domain.createdDate)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleStatus(domain)}
                          title={domain.isActive ? 'Deactivate domain' : 'Activate domain'}
                        >
                          {domain.isActive ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(domain)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(domain)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Add Domain Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Domain</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Domain Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter domain name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="code">Domain Code *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="DOMAIN_CODE"
                  className="font-mono"
                />
                <p className="text-sm text-muted-foreground">
                  Unique identifier for the domain (will be converted to uppercase)
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter domain description"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Creating...' : 'Create Domain'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Domain Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Domain</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Domain Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter domain name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-code">Domain Code *</Label>
                <Input
                  id="edit-code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="DOMAIN_CODE"
                  className="font-mono"
                />
                <p className="text-sm text-muted-foreground">
                  Unique identifier for the domain (will be converted to uppercase)
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter domain description"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Updating...' : 'Update Domain'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AccessControl>
  )
}
