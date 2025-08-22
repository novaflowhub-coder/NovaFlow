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
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Search, UserPlus, Users, Shield, Lock, Edit, Trash, FileText, Plus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea"

// Mock data for domains
const mockDomains = [
  { id: "DOM001", name: "Finance", code: "FINANCE" },
  { id: "DOM002", name: "Human Resources", code: "HR" },
  { id: "DOM003", name: "Sales", code: "SALES" },
  { id: "DOM004", name: "Operations", code: "OPS" },
]

// Mock data for users with domain memberships
const mockUsers = [
  {
    id: "user1",
    name: "John Smith",
    email: "john.smith@example.com",
    status: "Active",
    lastLogin: "2024-01-15T10:30:00Z",
    domainRoles: [
      { domainId: "DOM001", domainName: "Finance", role: "Administrator" },
      { domainId: "DOM002", domainName: "Human Resources", role: "Data Steward" },
    ],
  },
  {
    id: "user2",
    name: "Jane Doe",
    email: "jane.doe@example.com",
    status: "Active",
    lastLogin: "2024-01-14T16:45:00Z",
    domainRoles: [
      { domainId: "DOM001", domainName: "Finance", role: "Data Steward" },
      { domainId: "DOM003", domainName: "Sales", role: "Rule Author" },
    ],
  },
  {
    id: "user3",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    status: "Inactive",
    lastLogin: "2023-12-28T09:15:00Z",
    domainRoles: [
      { domainId: "DOM003", domainName: "Sales", role: "Rule Author" },
    ],
  },
  {
    id: "user4",
    name: "Emily Wilson",
    email: "emily.wilson@example.com",
    status: "Active",
    lastLogin: "2024-01-15T08:20:00Z",
    domainRoles: [
      { domainId: "DOM001", domainName: "Finance", role: "Approver" },
      { domainId: "DOM002", domainName: "Human Resources", role: "Approver" },
      { domainId: "DOM004", domainName: "Operations", role: "Viewer" },
    ],
  },
  {
    id: "user5",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    status: "Active",
    lastLogin: "2024-01-13T14:10:00Z",
    domainRoles: [
      { domainId: "DOM002", domainName: "Human Resources", role: "Viewer" },
    ],
  },
]

// Mock data for roles (domain-agnostic role definitions)
const mockRoles = [
  {
    id: "role1",
    name: "Administrator",
    description: "Full domain access with user management capabilities",
    userCount: 2,
  },
  {
    id: "role2",
    name: "Data Steward",
    description: "Manages data objects and schemas within domain",
    userCount: 3,
  },
  {
    id: "role3",
    name: "Rule Author",
    description: "Creates and edits rules and rule sets within domain",
    userCount: 5,
  },
  {
    id: "role4",
    name: "Approver",
    description: "Reviews and approves changes within domain",
    userCount: 4,
  },
  {
    id: "role5",
    name: "Viewer",
    description: "Read-only access to domain data",
    userCount: 8,
  },
]

// Mock data for pages with permissions
const mockPages = [
  {
    id: "page1",
    name: "Dashboard",
    path: "/dashboard",
    description: "Main dashboard and analytics",
  },
  {
    id: "page2",
    name: "Object Manager",
    path: "/object-manager",
    description: "Manage integration objects and schemas",
  },
  {
    id: "page3",
    name: "Rule Definition",
    path: "/rule-definition",
    description: "Create and edit individual rules",
  },
  {
    id: "page4",
    name: "Rule Set Definition",
    path: "/rule-set-definition",
    description: "Create and manage rule sets",
  },
  {
    id: "page5",
    name: "Run Control Definition",
    path: "/run-control-definition",
    description: "Define execution controls",
  },
  {
    id: "page6",
    name: "Process Monitor",
    path: "/process-monitor",
    description: "Monitor rule execution",
  },
  {
    id: "page7",
    name: "Approvals",
    path: "/approvals",
    description: "Review and approve changes",
  },
  {
    id: "page8",
    name: "UI Metadata",
    path: "/ui-metadata-list",
    description: "Manage dynamic UI definitions",
  },
]

// Permission types
const permissionTypes = [
  { id: "view", name: "View", description: "Can view the page and its content" },
  { id: "create", name: "Create", description: "Can create new items" },
  { id: "edit", name: "Edit", description: "Can edit existing items" },
  { id: "delete", name: "Delete", description: "Can delete items" },
  { id: "approve", name: "Approve", description: "Can approve changes" },
]

export default function UserManagementPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("users")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false)
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false)
  const [isAddRoleDialogOpen, setIsAddRoleDialogOpen] = useState(false)
  const [isEditRoleDialogOpen, setIsEditRoleDialogOpen] = useState(false)
  const [isEditPermissionsDialogOpen, setIsEditPermissionsDialogOpen] = useState(false)
  const [isAddPageDialogOpen, setIsAddPageDialogOpen] = useState(false)
  const [isEditPageDialogOpen, setIsEditPageDialogOpen] = useState(false)
  const [selectedPage, setSelectedPage] = useState<string | null>(null)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [editingRole, setEditingRole] = useState<any>(null)
  const [editingRoleName, setEditingRoleName] = useState("")
  const [editingPage, setEditingPage] = useState<any>(null)
  const [pages, setPages] = useState(mockPages)

  // Filter users based on search query and selected role
  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.domainRoles.some(dr => dr.role.toLowerCase().includes(searchQuery.toLowerCase()) || dr.domainName.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesRole = selectedRole === "all" ? true : user.domainRoles.some(dr => dr.role === selectedRole)

    return matchesSearch && matchesRole
  })

  // Filter roles based on search query
  const filteredRoles = mockRoles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Handle adding a new user
  const handleAddUser = () => {
    toast({
      title: "User Added",
      description: "The new user has been added successfully.",
    })
    setIsAddUserDialogOpen(false)
  }

  // Handle editing a user
  const handleEditUser = (user: any) => {
    setEditingUser(user)
    setIsEditUserDialogOpen(true)
  }

  // Handle saving user edits
  const handleSaveUserEdit = () => {
    toast({
      title: "User Updated",
      description: "The user has been updated successfully.",
    })
    setIsEditUserDialogOpen(false)
    setEditingUser(null)
  }

  // Handle adding a new role
  const handleAddRole = () => {
    toast({
      title: "Role Added",
      description: "The new role has been added successfully.",
    })
    setIsAddRoleDialogOpen(false)
  }

  // Handle editing a role
  const handleEditRole = (role: any) => {
    setEditingRole(role)
    setIsEditRoleDialogOpen(true)
  }

  // Handle saving role edits
  const handleSaveRoleEdit = () => {
    toast({
      title: "Role Updated",
      description: "The role has been updated successfully.",
    })
    setIsEditRoleDialogOpen(false)
    setEditingRole(null)
  }

  // Handle saving permissions
  const handleSavePermissions = () => {
    toast({
      title: "Permissions Updated",
      description: "The role permissions have been updated successfully.",
    })
    setIsEditPermissionsDialogOpen(false)
  }

  // Handle opening permissions dialog
  const handleOpenPermissions = (roleName: string) => {
    setEditingRoleName(roleName)
    setIsEditPermissionsDialogOpen(true)
  }

  // Handle adding a new page
  const handleAddPage = (formData: any) => {
    const newPage = {
      id: `page${pages.length + 1}`,
      name: formData.name,
      path: formData.path,
      description: formData.description,
    }
    
    setPages([...pages, newPage])
    toast({
      title: "Page Added",
      description: `Page "${formData.name}" has been added successfully.`,
    })
    setIsAddPageDialogOpen(false)
  }

  // Handle editing a page
  const handleEditPage = (page: any) => {
    setEditingPage(page)
    setIsEditPageDialogOpen(true)
  }

  // Handle saving page edits
  const handleSavePageEdit = (formData: any) => {
    setPages(pages.map(p => 
      p.id === editingPage.id 
        ? { ...p, ...formData }
        : p
    ))
    toast({
      title: "Page Updated",
      description: `Page "${formData.name}" has been updated successfully.`,
    })
    setIsEditPageDialogOpen(false)
    setEditingPage(null)
  }

  // Handle deleting a page
  const handleDeletePage = (pageId: string) => {
    setPages(pages.filter(p => p.id !== pageId))
    toast({
      title: "Page Deleted",
      description: "Page has been deleted successfully.",
    })
  }

  return (
    <>
      <PageHeader
        title="User Management"
        description="Manage users, roles, and access permissions"
        actions={
          activeTab === "users" ? (
            <Button onClick={() => setIsAddUserDialogOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" /> Add User
            </Button>
          ) : activeTab === "roles" ? (
            <Button onClick={() => setIsAddRoleDialogOpen(true)}>
              <Shield className="mr-2 h-4 w-4" /> Add Role
            </Button>
          ) : activeTab === "pages" ? (
            <Button onClick={() => setIsAddPageDialogOpen(true)}>
              <FileText className="mr-2 h-4 w-4" /> Add Page
            </Button>
          ) : null
        }
      />

      <Tabs defaultValue="users" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="users" className="flex items-center">
            <Users className="mr-2 h-4 w-4" /> Users
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center">
            <Shield className="mr-2 h-4 w-4" /> Roles
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center">
            <Lock className="mr-2 h-4 w-4" /> Permissions
          </TabsTrigger>
          <TabsTrigger value="pages" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" /> Pages
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>View and manage system users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search users..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {mockRoles.map((role) => (
                      <SelectItem key={role.id} value={role.name}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Domain Roles</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {user.domainRoles.map((dr, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {dr.domainName}: {dr.role}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={user.status === "Active" ? "default" : "secondary"}
                            className={user.status === "Active" ? "bg-green-100 text-green-800" : ""}
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(user.lastLogin).toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredUsers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No users found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Role Management</CardTitle>
              <CardDescription>Define and manage user roles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search roles..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Users</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRoles.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell className="font-medium">{role.name}</TableCell>
                        <TableCell>{role.description}</TableCell>
                        <TableCell>{role.userCount}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditRole(role)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleOpenPermissions(role.name)}>
                              <Lock className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredRoles.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          No roles found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Page Permissions</CardTitle>
              <CardDescription>Configure access permissions for each page</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Label htmlFor="page-select">Select Page</Label>
                    <Select
                      value={selectedPage || "none"}
                      onValueChange={(value) => setSelectedPage(value === "none" ? null : value)}
                    >
                      <SelectTrigger id="page-select">
                        <SelectValue placeholder="Select a page" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Select a page</SelectItem>
                        {mockPages.map((page) => (
                          <SelectItem key={page.id} value={page.id}>
                            {page.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {selectedPage && selectedPage !== "none" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>{mockPages.find((p) => p.id === selectedPage)?.name} Permissions</CardTitle>
                      <CardDescription>{mockPages.find((p) => p.id === selectedPage)?.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Role</TableHead>
                            {permissionTypes.map((permission) => (
                              <TableHead key={permission.id}>{permission.name}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockRoles.map((role) => (
                            <TableRow key={role.id}>
                              <TableCell className="font-medium">{role.name}</TableCell>
                              {permissionTypes.map((permission) => (
                                <TableCell key={permission.id}>
                                  <Checkbox
                                    // Default permissions based on role
                                    defaultChecked={
                                      permission.id === "view" ||
                                      role.name === "Administrator" ||
                                      (role.name === "Data Steward" &&
                                        ["view", "create", "edit"].includes(permission.id)) ||
                                      (role.name === "Approver" && permission.id === "approve") ||
                                      (role.name === "Rule Author" &&
                                        ["view", "create", "edit"].includes(permission.id))
                                    }
                                  />
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <div className="mt-4 flex justify-end">
                        <Button
                          onClick={() => {
                            toast({
                              title: "Permissions Saved",
                              description: "Page permissions have been updated successfully.",
                            })
                          }}
                        >
                          Save Permissions
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pages Tab */}
        <TabsContent value="pages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Page Management</CardTitle>
              <CardDescription>Manage system pages and their access controls</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search pages..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Page Name</TableHead>
                      <TableHead>Path</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pages.filter(page => 
                      page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      page.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      page.description.toLowerCase().includes(searchQuery.toLowerCase())
                    ).map((page) => (
                      <TableRow key={page.id}>
                        <TableCell className="font-medium">{page.name}</TableCell>
                        <TableCell>
                          <code className="rounded bg-muted px-[0.3rem] py-[0.2rem] text-sm font-mono">
                            {page.path}
                          </code>
                        </TableCell>
                        <TableCell>{page.description}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditPage(page)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeletePage(page.id)}>
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {pages.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          No pages found.
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

      {/* Add User Dialog */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Create a new user account with role assignment.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input id="email" type="email" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {mockRoles.map((role) => (
                    <SelectItem key={role.id} value={role.name}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch id="status" defaultChecked />
                <Label htmlFor="status">Active</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser}>Add User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information and role assignment.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <Input id="edit-name" defaultValue={editingUser?.name} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-email" className="text-right">
                Email
              </Label>
              <Input id="edit-email" type="email" defaultValue={editingUser?.email} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-role" className="text-right">
                Role
              </Label>
              <Select defaultValue={editingUser?.role}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {mockRoles.map((role) => (
                    <SelectItem key={role.id} value={role.name}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-status" className="text-right">
                Status
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch id="edit-status" defaultChecked={editingUser?.status === "Active"} />
                <Label htmlFor="edit-status">Active</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveUserEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Role Dialog */}
      <Dialog open={isAddRoleDialogOpen} onOpenChange={setIsAddRoleDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Role</DialogTitle>
            <DialogDescription>Create a new role with specific permissions.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role-name" className="text-right">
                Role Name
              </Label>
              <Input id="role-name" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input id="description" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Base Permissions</Label>
              <div className="col-span-3 space-y-2">
                {permissionTypes.map((permission) => (
                  <div key={permission.id} className="flex items-center space-x-2">
                    <Checkbox id={`permission-${permission.id}`} defaultChecked={permission.id === "view"} />
                    <Label htmlFor={`permission-${permission.id}`}>{permission.name}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddRoleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddRole}>Add Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={isEditRoleDialogOpen} onOpenChange={setIsEditRoleDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>Update role information and permissions.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-role-name" className="text-right">
                Role Name
              </Label>
              <Input id="edit-role-name" defaultValue={editingRole?.name} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">
                Description
              </Label>
              <Input id="edit-description" defaultValue={editingRole?.description} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Base Permissions</Label>
              <div className="col-span-3 space-y-2">
                {permissionTypes.map((permission) => (
                  <div key={permission.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`edit-permission-${permission.id}`}
                      defaultChecked={
                        permission.id === "view" ||
                        editingRole?.name === "Administrator" ||
                        (editingRole?.name === "Data Steward" && ["view", "create", "edit"].includes(permission.id)) ||
                        (editingRole?.name === "Approver" && permission.id === "approve") ||
                        (editingRole?.name === "Rule Author" && ["view", "create", "edit"].includes(permission.id))
                      }
                    />
                    <Label htmlFor={`edit-permission-${permission.id}`}>{permission.name}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditRoleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveRoleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Permissions Dialog */}
      <Dialog open={isEditPermissionsDialogOpen} onOpenChange={setIsEditPermissionsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Role Permissions</DialogTitle>
            <DialogDescription>Configure permissions for {editingRoleName} role across all pages.</DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto py-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Page</TableHead>
                  {permissionTypes.map((permission) => (
                    <TableHead key={permission.id}>{permission.name}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPages.map((page) => (
                  <TableRow key={page.id}>
                    <TableCell className="font-medium">{page.name}</TableCell>
                    {permissionTypes.map((permission) => (
                      <TableCell key={permission.id}>
                        <Checkbox
                          // Default permissions based on role
                          defaultChecked={
                            permission.id === "view" ||
                            editingRoleName === "Administrator" ||
                            (editingRoleName === "Data Steward" &&
                              ["view", "create", "edit"].includes(permission.id)) ||
                            (editingRoleName === "Approver" &&
                              (permission.id === "approve" || permission.id === "view")) ||
                            (editingRoleName === "Rule Author" && ["view", "create", "edit"].includes(permission.id))
                          }
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditPermissionsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePermissions}>Save Permissions</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Page Dialog */}
      <PageDialog
        open={isAddPageDialogOpen}
        onOpenChange={setIsAddPageDialogOpen}
        onSave={handleAddPage}
        title="Add New Page"
        description="Create a new system page with access controls."
      />

      {/* Edit Page Dialog */}
      <PageDialog
        open={isEditPageDialogOpen}
        onOpenChange={setIsEditPageDialogOpen}
        onSave={handleSavePageEdit}
        title="Edit Page"
        description="Update page information and settings."
        initialData={editingPage}
      />
    </>
  )
}

// Reusable Page Dialog Component
function PageDialog({ 
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
    path: "",
    description: "",
  })

  // Reset form when dialog opens/closes or initialData changes
  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({
          name: initialData.name || "",
          path: initialData.path || "",
          description: initialData.description || "",
        })
      } else {
        setFormData({
          name: "",
          path: "",
          description: "",
        })
      }
    }
  }, [open, initialData])

  const handleSave = () => {
    if (!formData.name || !formData.path) {
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
            <Label htmlFor="page-name" className="text-right">
              Name
            </Label>
            <Input
              id="page-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="col-span-3"
              placeholder="e.g., Dashboard"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="page-path" className="text-right">
              Path
            </Label>
            <Input
              id="page-path"
              value={formData.path}
              onChange={(e) => setFormData({ ...formData, path: e.target.value })}
              className="col-span-3"
              placeholder="e.g., /dashboard"
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="page-description" className="text-right pt-2">
              Description
            </Label>
            <Textarea
              id="page-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="col-span-3"
              placeholder="Describe the page's purpose and functionality"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!formData.name || !formData.path}>
            {initialData ? "Save Changes" : "Add Page"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
