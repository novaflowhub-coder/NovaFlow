'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Trash2, Edit } from "lucide-react"
import { CrudHeader } from "@/components/um/crud-header"
import { LoadingSkeleton } from "@/components/um/loading-skeleton"
import { domainApiService, Domain } from "@/lib/domain-api"
import { authService } from "@/lib/auth"
import { rolesApiService, type Role, type CreateRoleRequest, type UpdateRoleRequest } from '@/lib/roles-api';

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [domains, setDomains] = useState<Domain[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    domainId: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [rolesData, domainsData] = await Promise.all([
        rolesApiService.getRoles(),
        domainApiService.getAllDomains()
      ])
      setRoles(rolesData)
      setDomains(domainsData)
    } catch (error) {
      console.error('Failed to load data:', error)
      toast({
        title: "Error",
        description: "Failed to load roles and domains. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredRoles = roles.filter(role =>
    role.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      domainId: ''
    })
  }

  const handleAdd = () => {
    resetForm()
    setIsAddDialogOpen(true)
  }

  const handleEdit = (role: Role) => {
    setEditingRole(role)
    setFormData({
      name: role.name || '',
      description: role.description || '',
      domainId: role.domain_id || ''
    })
    setIsEditDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.domainId) {
      toast({
        title: "Validation Error",
        description: "Role name and domain are required.",
        variant: "destructive",
      })
      return
    }

    try {
      setSaving(true)
      const currentUser = authService.getCurrentUser()
      const currentUserEmail = currentUser?.email || 'system'

      if (editingRole) {
        const updateData: UpdateRoleRequest = {
          name: formData.name.trim(),
          description: formData.description?.trim() || undefined,
          domain_id: formData.domainId,
          updated_by: currentUserEmail
        }
        await rolesApiService.updateRole(editingRole.id, updateData)
        toast({
          title: "Success",
          description: "Role updated successfully.",
        })
        setIsEditDialogOpen(false)
      } else {
        const createData: CreateRoleRequest = {
          name: formData.name.trim(),
          description: formData.description?.trim() || undefined,
          domain_id: formData.domainId,
          created_by: currentUserEmail
        }
        await rolesApiService.createRole(createData)
        toast({
          title: "Success",
          description: "Role created successfully.",
        })
        setIsAddDialogOpen(false)
      }
      
      await loadData()
      resetForm()
      setEditingRole(null)
    } catch (error) {
      console.error('Failed to save role:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to save role. Please try again.'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (role: Role) => {
    if (!confirm(`Are you sure you want to delete role "${role.name}"?`)) {
      return
    }

    try {
      await rolesApiService.deleteRole(role.id)
      toast({
        title: "Success",
        description: "Role deleted successfully.",
      })
      await loadData()
    } catch (error) {
      console.error('Failed to delete role:', error)
      toast({
        title: "Error",
        description: "Failed to delete role. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getDomainName = (domainId: string) => {
    const domain = domains.find(d => d.id === domainId)
    return domain?.name || 'Unknown'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <CrudHeader
          title="Roles"
          description="Manage roles and their domain assignments"
          searchPlaceholder="Search roles..."
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          addButtonText="Add Role"
          onAddClick={handleAdd}
        />
        <LoadingSkeleton columns={5} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <CrudHeader
        title="Roles"
        description="Manage roles and their domain assignments"
        searchPlaceholder="Search roles..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonText="Add Role"
        onAddClick={handleAdd}
      />

      {filteredRoles.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {searchTerm ? 'No roles found matching your search.' : 'No roles found.'}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Domain</TableHead>
                <TableHead>User Count</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  <TableCell>{role.description || '-'}</TableCell>
                  <TableCell>{getDomainName(role.domain_id)}</TableCell>
                  <TableCell>{role.user_count || 0}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(role)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(role)}
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

      {/* Add Role Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Role</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Role Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter role name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter role description"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="domain">Domain *</Label>
              <Select value={formData.domainId} onValueChange={(value) => setFormData({ ...formData, domainId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a domain" />
                </SelectTrigger>
                <SelectContent>
                  {domains.map((domain) => (
                    <SelectItem key={domain.id} value={domain.id}>
                      {domain.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Creating...' : 'Create Role'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Role Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter role name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter role description"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-domain">Domain *</Label>
              <Select value={formData.domainId} onValueChange={(value) => setFormData({ ...formData, domainId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a domain" />
                </SelectTrigger>
                <SelectContent>
                  {domains.map((domain) => (
                    <SelectItem key={domain.id} value={domain.id}>
                      {domain.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Updating...' : 'Update Role'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
