'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Trash2, Edit, Plus } from "lucide-react"
import { CrudHeader } from "@/components/um/crud-header"
import { LoadingSkeleton } from "@/components/um/loading-skeleton"
import { AccessControl } from "@/components/um/access-control"
import { rolesApiService, type Role, type CreateRoleRequest, type UpdateRoleRequest } from '@/lib/roles-api'
import { domainApiService, type Domain } from '@/lib/domain-api'
import { authService } from '@/lib/auth'

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
      
      // Try to load roles, but handle permission errors gracefully
      try {
        const rolesData = await rolesApiService.getRoles()
        setRoles(rolesData)
      } catch (rolesError: unknown) {
        // If user doesn't have role permissions, just log it and continue
        const errorMessage = rolesError instanceof Error ? rolesError.message : 'Unknown error'
        console.log('Role management access not available for this user:', errorMessage)
        setRoles([])
      }
      
      // Try to load domains, but handle permission errors gracefully
      try {
        const domainsData = await domainApiService.getAllDomains()
        setDomains(domainsData)
        console.log('Loaded domains:', domainsData)
        console.log('Domain count:', domainsData.length)
        if (domainsData.length > 0) {
          console.log('First domain structure:', domainsData[0])
        }
      } catch (domainError: unknown) {
        // If user doesn't have domain permissions, just log it and continue
        const errorMessage = domainError instanceof Error ? domainError.message : 'Unknown error'
        console.log('Domain access not available for this user:', errorMessage)
        setDomains([])
      }
      
    } catch (error: unknown) {
      console.error('Failed to load data:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to load roles. Please try again.'
      toast({
        title: "Error",
        description: errorMessage,
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
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Role name is required.",
        variant: "destructive",
      })
      return
    }

    try {
      setSaving(true)
      const currentUser = authService.getCurrentUser()
      const currentUserEmail = currentUser?.email || 'system'

      console.log('Form data before save:', formData)
      console.log('Available domains:', domains)
      console.log('Selected domainId:', formData.domainId)
      console.log('Domain ID type:', typeof formData.domainId)
      console.log('Domain ID length:', formData.domainId?.length)

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
        console.log('Creating role with data:', createData)
        console.log('Form data domainId:', formData.domainId)
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
    } catch (error: unknown) {
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

  const handleDelete = async (roleId: string) => {
    if (!confirm(`Are you sure you want to delete role?`)) {
      return
    }

    try {
      await rolesApiService.deleteRole(roleId)
      toast({
        title: "Success",
        description: "Role deleted successfully.",
      })
      await loadData()
    } catch (error: unknown) {
      console.error('Failed to delete role:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete role. Please try again.'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  const getDomainName = (domainId: string) => {
    const domain = domains.find(d => d.id === domainId)
    return domain?.name || 'Unknown'
  }

  return (
    <AccessControl
      requiredPath="/user-management/roles"
      requiredPermissions={['READ']}
      title="Role Management"
      description="Manage user roles and permissions"
    >
      <div className="space-y-6">
        <CrudHeader 
          title="Roles"
          description="Manage user roles and permissions"
          searchPlaceholder="Search roles..."
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          addButtonText="Add Role"
          onAddClick={handleAdd}
        />

        {loading ? (
          <LoadingSkeleton columns={5} />
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead>User Count</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell>{role.description}</TableCell>
                    <TableCell>{getDomainName(role.domain_id)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{role.user_count || 0}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(role)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(role.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
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
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter role description"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="domain">Domain *</Label>
                <Select 
                  value={formData.domainId} 
                  onValueChange={(value) => {
                    console.log('Domain selected:', value)
                    setFormData({ ...formData, domainId: value })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a domain" />
                  </SelectTrigger>
                  <SelectContent>
                    {domains.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground">No domains available</div>
                    ) : (
                      domains.map((domain) => (
                        <SelectItem key={domain.id} value={domain.id}>
                          {domain.name}
                        </SelectItem>
                      ))
                    )}
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
                <Input
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter role description"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-domain">Domain *</Label>
                <Select 
                  value={formData.domainId} 
                  onValueChange={(value) => {
                    console.log('Domain selected (edit):', value)
                    setFormData({ ...formData, domainId: value })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a domain" />
                  </SelectTrigger>
                  <SelectContent>
                    {domains.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground">No domains available</div>
                    ) : (
                      domains.map((domain) => (
                        <SelectItem key={domain.id} value={domain.id}>
                          {domain.name}
                        </SelectItem>
                      ))
                    )}
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
    </AccessControl>
  )
}
