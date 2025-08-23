'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Trash2, Edit } from "lucide-react"
import { CrudHeader } from "@/components/um/crud-header"
import { LoadingSkeleton } from "@/components/um/loading-skeleton"
import { authService } from "@/lib/auth"
import { permissionTypesApiService, type PermissionType, type CreatePermissionTypeRequest, type UpdatePermissionTypeRequest } from '@/lib/permission-types-api';

export default function PermissionTypesPage() {
  const [permissionTypes, setPermissionTypes] = useState<PermissionType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingPermissionType, setEditingPermissionType] = useState<PermissionType | null>(null)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: ''
  })

  useEffect(() => {
    loadPermissionTypes()
  }, [])

  const loadPermissionTypes = async () => {
    try {
      setLoading(true)
      const data = await permissionTypesApiService.getPermissionTypes()
      setPermissionTypes(data)
    } catch (error) {
      console.error('Failed to load permission types:', error)
      toast({
        title: "Error",
        description: "Failed to load permission types. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredPermissionTypes = permissionTypes.filter(pt =>
    pt.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pt.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      description: ''
    })
  }

  const handleAdd = () => {
    resetForm()
    setIsAddDialogOpen(true)
  }

  const handleEdit = (permissionType: PermissionType) => {
    setEditingPermissionType(permissionType)
    setFormData({
      id: permissionType.id || '',
      name: permissionType.name || '',
      description: permissionType.description || ''
    })
    setIsEditDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formData.id || !formData.name) {
      toast({
        title: "Validation Error",
        description: "Permission ID and name are required.",
        variant: "destructive",
      })
      return
    }

    try {
      setSaving(true)
      const currentUser = authService.getCurrentUser()
      const currentUserEmail = currentUser?.email || 'system'

      if (editingPermissionType) {
        const updateData: UpdatePermissionTypeRequest = {
          id: formData.id, // ID should remain the same for updates
          name: formData.name,
          description: formData.description,
          updatedBy: currentUserEmail
        }
        await permissionTypesApiService.updatePermissionType(editingPermissionType.id, updateData)
        toast({
          title: "Success",
          description: "Permission type updated successfully.",
        })
        setIsEditDialogOpen(false)
      } else {
        const createData: CreatePermissionTypeRequest = {
          name: formData.name,
          description: formData.description,
          created_by: currentUserEmail
        }
        await permissionTypesApiService.createPermissionType(createData)
        toast({
          title: "Success",
          description: "Permission type created successfully.",
        })
        setIsAddDialogOpen(false)
      }
      
      await loadPermissionTypes()
      resetForm()
      setEditingPermissionType(null)
    } catch (error) {
      console.error('Failed to save permission type:', error)
      toast({
        title: "Error",
        description: "Failed to save permission type. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (permissionType: PermissionType) => {
    if (!confirm(`Are you sure you want to delete permission type "${permissionType.name}"?`)) {
      return
    }

    try {
      await permissionTypesApiService.deletePermissionType(permissionType.id)
      toast({
        title: "Success",
        description: "Permission type deleted successfully.",
      })
      await loadPermissionTypes()
    } catch (error) {
      console.error('Failed to delete permission type:', error)
      toast({
        title: "Error",
        description: "Failed to delete permission type. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <CrudHeader
          title="Permission Types"
          description="Manage permission types that can be assigned to roles"
          searchPlaceholder="Search permission types..."
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          addButtonText="Add Permission Type"
          onAddClick={handleAdd}
        />
        <LoadingSkeleton columns={4} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <CrudHeader
        title="Permission Types"
        description="Manage permission types that can be assigned to roles"
        searchPlaceholder="Search permission types..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonText="Add Permission Type"
        onAddClick={handleAdd}
      />

      {filteredPermissionTypes.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {searchTerm ? 'No permission types found matching your search.' : 'No permission types found.'}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Permission ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPermissionTypes.map((permissionType) => (
                <TableRow key={permissionType.id}>
                  <TableCell className="font-mono text-sm">{permissionType.id}</TableCell>
                  <TableCell className="font-medium">{permissionType.name}</TableCell>
                  <TableCell>{permissionType.description || '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(permissionType)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(permissionType)}
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

      {/* Add Permission Type Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Permission Type</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="id">Permission ID *</Label>
              <Input
                id="id"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                placeholder="e.g., READ_USERS, WRITE_ROLES"
                className="font-mono"
              />
              <p className="text-sm text-muted-foreground">
                Use uppercase with underscores (e.g., READ_USERS, WRITE_ROLES)
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Display Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter display name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter permission description"
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Creating...' : 'Create Permission Type'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Permission Type Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Permission Type</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-id">Permission ID *</Label>
              <Input
                id="edit-id"
                value={formData.id}
                disabled
                className="font-mono bg-muted"
              />
              <p className="text-sm text-muted-foreground">
                Permission ID cannot be changed after creation
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Display Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter display name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter permission description"
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Updating...' : 'Update Permission Type'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
