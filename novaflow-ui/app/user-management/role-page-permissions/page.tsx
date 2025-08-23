'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Save } from "lucide-react"
import { CrudHeader } from "@/components/um/crud-header"
import { LoadingSkeleton } from "@/components/um/loading-skeleton"
import { rolesApiService, type Role } from '@/lib/roles-api';
import { pagesApiService, type Page } from '@/lib/pages-api';
import { permissionTypesApiService, type PermissionType } from '@/lib/permission-types-api';
import { rolePagePermissionsApiService, type RolePagePermission } from '@/lib/role-page-permissions-api';

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
      const [rolesData, pagesData, permissionTypesData] = await Promise.all([
        rolesApiService.getRoles(),
        pagesApiService.getPages(),
        permissionTypesApiService.getPermissionTypes()
      ])
      setRoles(rolesData)
      setPages(pagesData)
      setPermissionTypes(permissionTypesData)
      
      // Auto-select first page if available
      if (pagesData.length > 0) {
        setSelectedPageId(pagesData[0].id)
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
      const permissionsData = await rolePagePermissionsApiService.getRolePagePermissions(selectedPageId)
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
    return permissions.some(p => p.roleName === roleName && p.permissionTypeId === permissionTypeId)
  }

  const togglePermission = (roleName: string, permissionTypeId: string) => {
    const exists = hasPermission(roleName, permissionTypeId)
    
    if (exists) {
      // Remove permission
      setPermissions(prev => prev.filter(p => 
        !(p.roleName === roleName && p.permissionTypeId === permissionTypeId)
      ))
    } else {
      // Add permission
      const newPermission: RolePagePermission = {
        pageId: selectedPageId,
        roleName,
        permissionTypeId
      }
      setPermissions(prev => [...prev, newPermission])
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
        <CrudHeader
          title="Role-Page Permissions"
          description="Manage permissions for roles on specific pages"
          searchPlaceholder=""
          searchValue=""
          onSearchChange={() => {}}
          addButtonText=""
          onAddClick={() => {}}
        />
        <LoadingSkeleton columns={4} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <CrudHeader
        title="Role-Page Permissions"
        description="Manage permissions for roles on specific pages"
        searchPlaceholder=""
        searchValue=""
        onSearchChange={() => {}}
        addButtonText=""
        onAddClick={() => {}}
      />

      {/* Page Selection */}
      <div className="flex items-center gap-4">
        <div className="flex-1 max-w-md">
          <Select value={selectedPageId} onValueChange={setSelectedPageId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a page" />
            </SelectTrigger>
            <SelectContent>
              {pages.map((page) => (
                <SelectItem key={page.id} value={page.id}>
                  {page.name} ({page.path})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
  )
}
