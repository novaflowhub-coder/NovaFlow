'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Save } from "lucide-react"
import { LoadingSkeleton } from "@/components/um/loading-skeleton"
import { AccessControl } from "@/components/um/access-control"
import { AlertCircle } from "lucide-react"
import { rolesApiService, type Role } from '@/lib/roles-api';
import { pagesApiService, type Page } from '@/lib/pages-api';
import { permissionTypesApiService, type PermissionType } from '@/lib/permission-types-api';
import { rolePagePermissionsApiService, type RolePagePermission } from '@/lib/role-page-permissions-api';
import { authService } from '@/lib/auth';

export default function RolePagePermissionsPage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [pages, setPages] = useState<Page[]>([])
  const [permissionTypes, setPermissionTypes] = useState<PermissionType[]>([])
  const [permissions, setPermissions] = useState<RolePagePermission[]>([])
  const [selectedPageId, setSelectedPageId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (selectedPageId) {
      loadPermissions()
    }
  }, [selectedPageId])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load roles, pages, and permission types - handle each API call separately for better error handling
      const rolesPromise = rolesApiService.getRoles()
      const pagesPromise = pagesApiService.getPages()
      const permissionTypesPromise = permissionTypesApiService.getPermissionTypes()
      
      const [rolesData, pagesData, permissionTypesData] = await Promise.allSettled([
        rolesPromise,
        pagesPromise,
        permissionTypesPromise
      ])
      
      // Handle roles data
      if (rolesData.status === 'fulfilled') {
        setRoles(rolesData.value)
      } else {
        console.log('Roles access not available:', rolesData.reason?.message)
        setRoles([])
      }
      
      // Handle pages data
      if (pagesData.status === 'fulfilled') {
        setPages(pagesData.value)
        console.log('Pages loaded:', pagesData.value.length, pagesData.value)
        // Auto-select first page if available
        if (pagesData.value.length > 0) {
          setSelectedPageId(pagesData.value[0].id)
        }
      } else {
        console.error('Pages access failed:', pagesData.reason)
        setPages([])
      }
      
      // Handle permission types data
      if (permissionTypesData.status === 'fulfilled') {
        setPermissionTypes(permissionTypesData.value)
      } else {
        console.log('Permission types access not available:', permissionTypesData.reason?.message)
        setPermissionTypes([])
      }
      
    } catch (error) {
      console.error('Failed to load data:', error)
      toast({
        title: "Error",
        description: "Failed to load role-page permissions data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadPermissions = async () => {
    if (!selectedPageId) return

    try {
      const permissionsData = await rolePagePermissionsApiService.getPermissionsByPage(selectedPageId)
      setPermissions(permissionsData)
    } catch (error) {
      console.error('Failed to load permissions:', error)
      toast({
        title: "Error",
        description: "Failed to load permissions for selected page. Please try again.",
        variant: "destructive",
      })
    }
  }

  const hasPermission = (roleName: string, permissionTypeId: string): boolean => {
    return permissions.some(p => 
      p.roleName === roleName && 
      (p.permissionTypeId === permissionTypeId || p.permissionType?.id === permissionTypeId)
    )
  }

  const togglePermission = (roleName: string, permissionTypeId: string) => {
    const exists = hasPermission(roleName, permissionTypeId)
    
    if (exists) {
      // Remove permission
      setPermissions(prev => prev.filter(p => 
        !(p.roleName === roleName && 
          (p.permissionTypeId === permissionTypeId || p.permissionType?.id === permissionTypeId))
      ))
    } else {
      // Add permission
      const newPermission: Partial<RolePagePermission> = {
        pageId: selectedPageId,
        roleName,
        permissionTypeId,
        isGranted: true
      }
      setPermissions(prev => [...prev, newPermission as RolePagePermission])
    }
  }

  const handleSave = async () => {
    if (!selectedPageId) {
      toast({
        title: "Error",
        description: "Please select a page first.",
        variant: "destructive",
      })
      return
    }

    try {
      setSaving(true)
      await rolePagePermissionsApiService.saveRolePagePermissions(selectedPageId, permissions)
      toast({
        title: "Success",
        description: "Role-page permissions saved successfully.",
      })
    } catch (error) {
      console.error('Failed to save permissions:', error)
      toast({
        title: "Error",
        description: "Failed to save permissions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const getSelectedPageName = () => {
    const page = pages.find(p => p.id === selectedPageId)
    return page?.name || 'Select a page'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Role-Page Permissions</h1>
            <p className="text-muted-foreground">
              Manage permissions for roles on specific pages
            </p>
          </div>
        </div>
        <LoadingSkeleton columns={4} />
      </div>
    )
  }

  return (
    <AccessControl
      requiredPath="/user-management/role-page-permissions"
      requiredPermissions={['READ', 'WRITE']}
      title="Role-Page Permissions"
      description="Manage permissions for roles on specific pages"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Role-Page Permissions</h1>
            <p className="text-muted-foreground">
              Manage permissions for roles on specific pages
            </p>
          </div>
        </div>

        {/* Page Selection */}
        <div className="flex items-center gap-4">
          <div className="flex-1 max-w-md">
            {pages.length === 0 && !loading ? (
              <div className="p-4 border border-destructive/50 rounded-md bg-destructive/5">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Unable to load pages</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  You may not have permission to access page management. Please contact your administrator.
                </p>
              </div>
            ) : (
            <Select value={selectedPageId} onValueChange={setSelectedPageId}>
              <SelectTrigger>
                <SelectValue placeholder={pages.length === 0 ? "No pages available" : "Select a page"} />
              </SelectTrigger>
              <SelectContent>
                {pages.map((page) => (
                  <SelectItem key={page.id} value={page.id}>
                    {page.name} ({page.path})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            )}
          </div>
          <Button onClick={handleSave} disabled={saving || !selectedPageId}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Permissions'}
          </Button>
        </div>

        {selectedPageId ? (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Managing permissions for: <strong>{getSelectedPageName()}</strong>
            </div>

            {roles.length === 0 || permissionTypes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {roles.length === 0 ? 'No roles found.' : 'No permission types found.'}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role</TableHead>
                      {permissionTypes.map((permissionType) => (
                        <TableHead key={permissionType.id} className="text-center">
                          {permissionType.name}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {roles.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div>{role.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {role.description || 'No description'}
                            </div>
                          </div>
                        </TableCell>
                        {permissionTypes.map((permissionType) => (
                          <TableCell key={permissionType.id} className="text-center">
                            <Checkbox
                              checked={hasPermission(role.name, permissionType.id)}
                              onCheckedChange={() => togglePermission(role.name, permissionType.id)}
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            Please select a page to manage its role permissions.
          </div>
        )}
      </div>
    </AccessControl>
  )
}
