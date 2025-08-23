'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Trash2, Edit } from "lucide-react"
import { CrudHeader } from "@/components/um/crud-header"
import { LoadingSkeleton } from "@/components/um/loading-skeleton"
import { AccessControl } from "@/components/um/access-control"
import { pagesApiService, type Page, type CreatePageRequest, type UpdatePageRequest } from '@/lib/pages-api'
import { authService } from "@/lib/auth"
import { Textarea } from "@/components/ui/textarea"

export default function PagesPage() {
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingPage, setEditingPage] = useState<Page | null>(null)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: '',
    path: '',
    description: ''
  })

  useEffect(() => {
    loadPages()
  }, [])

  const loadPages = async () => {
    try {
      setLoading(true)
      const data = await pagesApiService.getPages()
      setPages(data)
    } catch (error) {
      // Handle permission errors gracefully - don't show error toast for 403
      if (error.message?.includes('Access denied')) {
        console.log('Page management access not available for this user:', error.message)
        setPages([])
      } else {
        console.error('Failed to load pages:', error)
        toast({
          title: "Error",
          description: "Failed to load pages. Please try again.",
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const filteredPages = pages.filter(page =>
    page.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.path?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const resetForm = () => {
    setFormData({
      name: '',
      path: '',
      description: ''
    })
  }

  const handleAdd = () => {
    resetForm()
    setIsAddDialogOpen(true)
  }

  const handleEdit = (page: Page) => {
    setEditingPage(page)
    setFormData({
      name: page.name || '',
      path: page.path || '',
      description: page.description || ''
    })
    setIsEditDialogOpen(true)
  }

  const validatePath = (path: string, excludeId?: string): boolean => {
    return !pages.some(p => p.path === path && p.id !== excludeId)
  }

  const handleSave = async () => {
    if (!formData.name || !formData.path) {
      toast({
        title: "Validation Error",
        description: "Page name and path are required.",
        variant: "destructive",
      })
      return
    }

    // Path validation
    if (!formData.path.startsWith('/')) {
      toast({
        title: "Validation Error",
        description: "Path must start with '/'.",
        variant: "destructive",
      })
      return
    }

    // Check for unique path
    if (!validatePath(formData.path, editingPage?.id)) {
      toast({
        title: "Validation Error",
        description: "A page with this path already exists.",
        variant: "destructive",
      })
      return
    }

    try {
      setSaving(true)
      const currentUser = authService.getCurrentUser()
      const currentUserEmail = currentUser?.email || 'system'

      if (editingPage) {
        const updateData: UpdatePageRequest = {
          name: formData.name,
          path: formData.path,
          description: formData.description,
          last_modified_by: currentUserEmail
        }
        await pagesApiService.updatePage(editingPage.id, updateData)
        toast({
          title: "Success",
          description: "Page updated successfully.",
        })
        setIsEditDialogOpen(false)
      } else {
        const createData: CreatePageRequest = {
          ...formData,
          created_by: currentUserEmail
        }
        await pagesApiService.createPage(createData)
        toast({
          title: "Success",
          description: "Page created successfully.",
        })
        setIsAddDialogOpen(false)
      }
      
      await loadPages()
      resetForm()
      setEditingPage(null)
    } catch (error) {
      console.error('Failed to save page:', error)
      toast({
        title: "Error",
        description: "Failed to save page. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (page: Page) => {
    if (!confirm(`Are you sure you want to delete page "${page.name}"?`)) {
      return
    }

    try {
      await pagesApiService.deletePage(page.id)
      toast({
        title: "Success",
        description: "Page deleted successfully.",
      })
      await loadPages()
    } catch (error) {
      console.error('Failed to delete page:', error)
      toast({
        title: "Error",
        description: "Failed to delete page. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <AccessControl
      requiredPath="/user-management/pages"
      requiredPermissions={['READ']}
      title="Page Management"
      description="Manage system pages and their configurations"
    >
      <div className="space-y-6">
        <CrudHeader 
          title="Pages"
          description="Manage system pages and their configurations"
          searchPlaceholder="Search pages..."
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          addButtonText="Add Page"
          onAddClick={() => setIsAddDialogOpen(true)}
        />

        {loading ? (
          <LoadingSkeleton columns={4} />
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Path</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPages.map((page) => (
                  <TableRow key={page.id}>
                    <TableCell className="font-medium">{page.name}</TableCell>
                    <TableCell className="font-mono text-sm">{page.path}</TableCell>
                    <TableCell>{page.description}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(page)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(page)}
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

        {/* Add Page Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Page</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Page Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter page name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="path">Path *</Label>
                <Input
                  id="path"
                  value={formData.path}
                  onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                  placeholder="/example/path"
                  className="font-mono"
                />
                <p className="text-sm text-muted-foreground">
                  Must start with '/' and be unique across all pages
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter page description"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Creating...' : 'Create Page'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Page Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Page</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Page Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter page name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-path">Path *</Label>
                <Input
                  id="edit-path"
                  value={formData.path}
                  onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                  placeholder="/example/path"
                  className="font-mono"
                />
                <p className="text-sm text-muted-foreground">
                  Must start with '/' and be unique across all pages
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter page description"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Updating...' : 'Update Page'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AccessControl>
  )
}
