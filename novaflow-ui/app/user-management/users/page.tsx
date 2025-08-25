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
import { userApiService, User, CreateUserRequest, UpdateUserRequest } from "@/lib/user-api"
import { authService } from "@/lib/auth"
import { userDomainRolesApiService } from "@/lib/user-domain-roles-api"
import { rolesApiService } from "@/lib/roles-api"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()
  const [selectedDomainId, setSelectedDomainId] = useState<string>('')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    full_name: '',
    department: '',
    status: 'Active'
  })

  useEffect(() => {
    loadUsers()
    // Load initial domain from global state
    const savedDomainId = localStorage.getItem("selectedDomainId")
    if (savedDomainId) {
      setSelectedDomainId(savedDomainId)
    }

    // Listen for global domain changes
    const handleDomainChange = (event: CustomEvent) => {
      const { domain } = event.detail
      setSelectedDomainId(domain)
    }

    window.addEventListener('domainChanged', handleDomainChange as EventListener)
    
    return () => {
      window.removeEventListener('domainChanged', handleDomainChange as EventListener)
    }
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const data = await userApiService.getAllUsers()
      setUsers(data)
    } catch (error) {
      console.error('Failed to load users:', error)
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const findDefaultRoleForDomain = async (domainId: string): Promise<string | null> => {
    try {
      const roles = await rolesApiService.getRoles()
      // Look for a "User" role in the specified domain
      const defaultRole = roles.find(role => 
        role.domain_id === domainId && 
        (role.name.toLowerCase().includes('user') || role.name.toLowerCase().includes('member'))
      )
      return defaultRole?.id || null
    } catch (error) {
      console.error('Failed to find default role for domain:', error)
      return null
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      username: '',
      full_name: '',
      department: '',
      status: 'Active'
    })
  }

  const handleAdd = () => {
    resetForm()
    setIsAddDialogOpen(true)
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      name: user.name || '',
      email: user.email || '',
      username: user.username || '',
      full_name: user.full_name || '',
      department: user.department || '',
      status: user.status || 'Active'
    })
    setIsEditDialogOpen(true)
  }

  const handleSave = async () => {
    // Enhanced validation
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Name is required.",
        variant: "destructive",
      })
      return
    }

    if (!formData.email.trim()) {
      toast({
        title: "Validation Error", 
        description: "Email is required.",
        variant: "destructive",
      })
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }

    // Username validation (optional but if provided, must be valid)
    if (formData.username && formData.username.trim().length < 3) {
      toast({
        title: "Validation Error",
        description: "Username must be at least 3 characters long.",
        variant: "destructive",
      })
      return
    }

    try {
      setSaving(true)
      const currentUser = authService.getCurrentUser()
      const currentUserEmail = currentUser?.email || 'system'

      if (editingUser) {
        const updateData: UpdateUserRequest = {
          name: formData.name.trim(),
          email: formData.email.trim(),
          username: formData.username?.trim() || undefined,
          full_name: formData.full_name?.trim() || undefined,
          department: formData.department?.trim() || undefined,
          status: formData.status,
          is_active: true,
          updated_by: currentUserEmail
        }
        await userApiService.updateUser(editingUser.id, updateData)
        toast({
          title: "Success",
          description: "User updated successfully.",
        })
        setIsEditDialogOpen(false)
      } else {
        const createData: CreateUserRequest = {
          name: formData.name.trim(),
          email: formData.email.trim(),
          username: formData.username?.trim() || undefined,
          full_name: formData.full_name?.trim() || undefined,
          department: formData.department?.trim() || undefined,
          status: formData.status,
          is_active: true,
          created_by: currentUserEmail
        }
        const newUser = await userApiService.createUser(createData)
        
        // Auto-assign user to a default role in the selected domain
        if (selectedDomainId && newUser?.id) {
          try {
            // Find a default role for the domain (e.g., "User" role)
            const defaultRoleId = await findDefaultRoleForDomain(selectedDomainId)
            if (defaultRoleId) {
              await userDomainRolesApiService.bulkAssignRolesToUser(newUser.id, [defaultRoleId])
              console.log(`Auto-assigned user ${newUser.id} to role ${defaultRoleId} in domain ${selectedDomainId}`)
            }
          } catch (roleError) {
            console.warn('Failed to auto-assign role to new user:', roleError)
            // Don't fail user creation if role assignment fails
          }
        }
        
        toast({
          title: "Success",
          description: "User created successfully.",
        })
        setIsAddDialogOpen(false)
      }
      
      await loadUsers()
      resetForm()
      setEditingUser(null)
    } catch (error) {
      console.error('Failed to save user:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to save user. Please try again.'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (user: User) => {
    if (!confirm(`Are you sure you want to delete user "${user.name}"?`)) {
      return
    }

    try {
      await userApiService.deleteUser(user.id)
      toast({
        title: "Success",
        description: "User deleted successfully.",
      })
      await loadUsers()
    } catch (error) {
      console.error('Failed to delete user:', error)
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <AccessControl
      requiredPath="/user-management"
      requiredPermissions={['READ']}
      title="User Management"
      description="Manage system users and their information"
    >
      <div className="space-y-6">
        <CrudHeader 
          title="Users"
          description="Manage system users and their information"
          searchPlaceholder="Search users..."
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          addButtonText="Add User"
          onAddClick={() => setIsAddDialogOpen(true)}
        />

        {loading ? (
          <LoadingSkeleton columns={6} />
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.department}</TableCell>
                    <TableCell>
                      <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(user)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(user)}
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

        {/* Add User Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter user name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Enter username (optional)"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="Enter department"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Creating...' : 'Create User'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter user name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email *</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-username">Username</Label>
                <Input
                  id="edit-username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Enter username (optional)"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-fullName">Full Name</Label>
                <Input
                  id="edit-fullName"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-department">Department</Label>
                <Input
                  id="edit-department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="Enter department"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Updating...' : 'Update User'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AccessControl>
  )
}
