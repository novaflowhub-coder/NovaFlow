'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Trash2, Edit } from "lucide-react"
import { CrudHeader } from "@/components/um/crud-header"
import { LoadingSkeleton } from "@/components/um/loading-skeleton"
import { AccessControl } from "@/components/um/access-control"
import { permissionTypesApiService, type PermissionType, type CreatePermissionTypeRequest, type UpdatePermissionTypeRequest } from '@/lib/permission-types-api'
import { authService } from '@/lib/auth'

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
      // Handle permission errors gracefully - don't show error toast for 403
      if (error.message?.includes('Access denied')) {
        console.log('Permission types management access not available for this user:', error.message)
        setPermissionTypes([])
      } else {
        console.error('Failed to load permission types:', error)
        toast({
          title: "Error",
          description: "Failed to load permission types. Please try again.",
          variant: "destructive",
        })
      }
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
      name: permissionType.name || '',
      description: permissionType.description || ''
    })
    setIsEditDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formData.name) {
      toast({
        title: "Validation Error",
        description: "Permission name is required.",
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
          name: formData.name,
          description: formData.description,
          last_modified_by: currentUserEmail
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

  const handleDelete = async (id: string) => {
    if (!confirm(`Are you sure you want to delete permission type?`)) {
      return
    }

    try {
      await permissionTypesApiService.deletePermissionType(id)
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

  return (
    <AccessControl
      requiredPath="/user-management/permission-types"
      requiredPermissions={['READ']}
      title="Permission Type Management"
      description="Manage permission types for role-based access control"
    >
      <div className="space-y-6">
        <CrudHeader 
          title="Permission Types"
          description="Manage permission types for role-based access control"
          searchPlaceholder="Search permission types..."
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          addButtonText="Add Permission Type"
          onAddClick={() => setIsAddDialogOpen(true)}
        />

        {loading ? (
          <LoadingSkeleton columns={3} />
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPermissionTypes.map((permissionType) => (
                  <TableRow key={permissionType.id}>
                    <TableCell className="font-medium">{permissionType.name}</TableCell>
                    <TableCell>{permissionType.description}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(permissionType)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(permissionType.id)}
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

        {/* Add Permission Type Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open)
          if (!open) {
            resetForm()
            setEditingPermissionType(null)
          }
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Permission Type</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
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
    </AccessControl>
  )
}
