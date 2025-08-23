'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, UserCheck, UserX } from "lucide-react"
import { CrudHeader } from "@/components/um/crud-header"
import { LoadingSkeleton } from "@/components/um/loading-skeleton"
import { userApiService, type User } from "@/lib/user-api"
import { rolesApiService, type Role } from '@/lib/roles-api'
import { userDomainRolesApiService, type UserDomainRole } from '@/lib/user-domain-roles-api'
import { AccessControl } from "@/components/um/access-control"

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<UserDomainRole[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingAssignment, setEditingAssignment] = useState<UserDomainRole | null>(null)
  const [selectedUserId, setSelectedUserId] = useState<string>('')
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([])
  const [loadingRoleAssignments, setLoadingRoleAssignments] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load assignments, users, and roles - handle each API call separately for better error handling
      const assignmentsPromise = userDomainRolesApiService.getAllUserDomainRoles(searchTerm)
      const usersPromise = userApiService.getAllUsers()
      const rolesPromise = rolesApiService.getRoles()
      
      const [assignmentsData, usersData, rolesData] = await Promise.allSettled([
        assignmentsPromise,
        usersPromise, 
        rolesPromise
      ])
      
      // Handle assignments data
      if (assignmentsData.status === 'fulfilled') {
        setAssignments(assignmentsData.value)
      } else {
        console.log('Assignments access not available:', assignmentsData.reason?.message)
        setAssignments([])
      }
      
      // Handle users data
      if (usersData.status === 'fulfilled') {
        setUsers(usersData.value)
      } else {
        console.log('Users access not available:', usersData.reason?.message)
        setUsers([])
      }
      
      // Handle roles data
      if (rolesData.status === 'fulfilled') {
        setRoles(rolesData.value)
      } else {
        console.log('Roles access not available:', rolesData.reason?.message)
        setRoles([])
      }
      
    } catch (error) {
      console.error('Failed to load data:', error)
      toast({
        title: "Error",
        description: "Failed to load assignments data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (value: string) => {
    setSearchTerm(value)
    try {
      const assignmentsData = await userDomainRolesApiService.getAllUserDomainRoles(value)
      setAssignments(assignmentsData)
    } catch (error) {
      console.error('Failed to search assignments:', error)
      toast({
        title: "Error",
        description: "Failed to search assignments. Please try again.",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setSelectedUserId('')
    setSelectedRoleIds([])
    setEditingAssignment(null)
  }

  const handleAdd = () => {
    resetForm()
    setIsAddDialogOpen(true)
  }

  const handleEdit = async (assignment: UserDomainRole) => {
    setEditingAssignment(assignment)
    setSelectedUserId(assignment.userId)
    setLoadingRoleAssignments(true)
    await loadUserRoleAssignments(assignment.userId)
    setIsEditDialogOpen(true)
  }

  const loadUserRoleAssignments = async (userId: string) => {
    try {
      const userAssignments = await userDomainRolesApiService.getUserDomainRolesByUserId(userId)
      const activeRoleIds = userAssignments
        .filter(a => a.isActive)
        .map(a => a.roleId)
      console.log('Loading role assignments for user:', userId, 'Active roles:', activeRoleIds)
      setSelectedRoleIds(activeRoleIds)
    } catch (error) {
      console.error('Failed to load user role assignments:', error)
      toast({
        title: "Error",
        description: "Failed to load current role assignments.",
        variant: "destructive",
      })
    } finally {
      setLoadingRoleAssignments(false)
    }
  }

  const handleRoleToggle = (roleId: string) => {
    setSelectedRoleIds(prev => 
      prev.includes(roleId) 
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    )
  }

  const handleSave = async () => {
    if (!selectedUserId) {
      toast({
        title: "Validation Error",
        description: "Please select a user.",
        variant: "destructive",
      })
      return
    }

    try {
      setSaving(true)

      if (editingAssignment) {
        // Update existing assignments - replace all roles for this user
        await userDomainRolesApiService.replaceUserRoleAssignments(selectedUserId, selectedRoleIds)
        toast({
          title: "Success",
          description: "User role assignments updated successfully.",
        })
        setIsEditDialogOpen(false)
      } else {
        // Create new assignments
        await userDomainRolesApiService.bulkAssignRolesToUser(selectedUserId, selectedRoleIds)
        toast({
          title: "Success",
          description: "User role assignments created successfully.",
        })
        setIsAddDialogOpen(false)
      }
      
      await loadData()
      resetForm()
    } catch (error) {
      console.error('Failed to save assignment:', error)
      toast({
        title: "Error",
        description: "Failed to save assignment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleActivate = async (assignment: UserDomainRole) => {
    try {
      await userDomainRolesApiService.activateUserDomainRole(assignment.id)
      toast({
        title: "Success",
        description: "Assignment activated successfully.",
      })
      await loadData()
    } catch (error) {
      console.error('Failed to activate assignment:', error)
      toast({
        title: "Error",
        description: "Failed to activate assignment. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeactivate = async (assignment: UserDomainRole) => {
    try {
      await userDomainRolesApiService.deactivateUserDomainRole(assignment.id)
      toast({
        title: "Success",
        description: "Assignment deactivated successfully.",
      })
      await loadData()
    } catch (error) {
      console.error('Failed to deactivate assignment:', error)
      toast({
        title: "Error",
        description: "Failed to deactivate assignment. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (assignment: UserDomainRole) => {
    if (!confirm('Are you sure you want to delete this assignment?')) return

    try {
      await userDomainRolesApiService.deleteUserDomainRole(assignment.id)
      toast({
        title: "Success",
        description: "Assignment deleted successfully.",
      })
      await loadData()
    } catch (error) {
      console.error('Failed to delete assignment:', error)
      toast({
        title: "Error",
        description: "Failed to delete assignment. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId)
    return user ? `${user.name} (${user.email})` : userId
  }

  const getRoleName = (roleId: string) => {
    const role = roles.find(r => r.id === roleId)
    return role ? role.name : roleId
  }

  if (loading) {
    return (
      <AccessControl
        requiredPath="/user-management/user-domain-roles"
        requiredPermissions={['READ', 'WRITE']}
        title="User Role Assignments"
        description="Manage user role assignments and permissions"
      >
        <div className="space-y-6">
          <CrudHeader
            title="User Role Assignments"
            description="Manage user role assignments and permissions"
            searchPlaceholder="Search assignments..."
            searchValue={searchTerm}
            onSearchChange={handleSearch}
            addButtonText="Add Assignment"
            onAddClick={handleAdd}
          />
          <LoadingSkeleton columns={6} />
        </div>
      </AccessControl>
    )
  }

  return (
    <AccessControl
      requiredPath="/user-management/user-domain-roles"
      requiredPermissions={['READ', 'WRITE']}
      title="User Role Assignments"
      description="Manage user role assignments and permissions"
    >
      <div className="space-y-6">
        <CrudHeader
          title="User Role Assignments"
          description="Manage user role assignments and permissions"
          searchPlaceholder="Search assignments..."
          searchValue={searchTerm}
          onSearchChange={handleSearch}
          addButtonText="Add Assignment"
          onAddClick={handleAdd}
        />

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned By</TableHead>
                <TableHead>Assigned Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No assignments found.
                  </TableCell>
                </TableRow>
              ) : (
                assignments.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div>{assignment.userName || getUserName(assignment.userId)}</div>
                        <div className="text-sm text-muted-foreground">
                          {assignment.userEmail || users.find(u => u.id === assignment.userId)?.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{assignment.roleName || getRoleName(assignment.roleId)}</div>
                        <div className="text-sm text-muted-foreground">
                          {assignment.roleDescription || roles.find(r => r.id === assignment.roleId)?.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={assignment.isActive ? "default" : "secondary"}>
                        {assignment.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>{assignment.assignedBy}</TableCell>
                    <TableCell>{new Date(assignment.assignedDate).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(assignment)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        {assignment.isActive ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeactivate(assignment)}
                          >
                            <UserX className="h-4 w-4 mr-1" />
                            Deactivate
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleActivate(assignment)}
                          >
                            <UserCheck className="h-4 w-4 mr-1" />
                            Activate
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(assignment)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Add Assignment Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add User Role Assignment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">User</label>
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Roles</label>
                <div className="grid grid-cols-2 gap-2 mt-2 max-h-60 overflow-y-auto border rounded p-3">
                  {roles.map((role) => (
                    <div key={role.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={role.id}
                        checked={selectedRoleIds.includes(role.id)}
                        onCheckedChange={() => handleRoleToggle(role.id)}
                      />
                      <label htmlFor={role.id} className="text-sm cursor-pointer">
                        <div className="font-medium">{role.name}</div>
                        <div className="text-xs text-muted-foreground">{role.description}</div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Assignment'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Assignment Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit User Role Assignments</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">User</label>
                <div className="p-2 bg-muted rounded">
                  {getUserName(selectedUserId)}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Roles</label>
                {loadingRoleAssignments ? (
                  <div className="p-2 bg-muted rounded">
                    <LoadingSkeleton columns={1} />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 mt-2 max-h-60 overflow-y-auto border rounded p-3">
                    {roles.map((role) => (
                      <div key={role.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`edit-${role.id}`}
                          checked={selectedRoleIds.includes(role.id)}
                          onCheckedChange={() => handleRoleToggle(role.id)}
                        />
                        <label htmlFor={`edit-${role.id}`} className="text-sm cursor-pointer">
                          <div className="font-medium">{role.name}</div>
                          <div className="text-xs text-muted-foreground">{role.description}</div>
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? 'Updating...' : 'Update Assignments'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AccessControl>
  )
}
