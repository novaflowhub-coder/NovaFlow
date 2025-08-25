"use client"

import { useState, useTransition, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { Edit, Loader2, PlusCircle, Trash2, Zap, History, Power, PowerOff, Search, Filter } from "lucide-react"
import { AccessControl } from "@/components/um/access-control"
import { metadataConnectionService, CreateConnectionRequest } from "@/lib/metadata-connection"

// Helper to validate JSON
const isValidJson = (str: string) => {
  try {
    JSON.parse(str)
    return true
  } catch (e) {
    return false
  }
}

// Connection types for the select dropdown
const connectionTypes = [
  { value: "POSTGRES", label: "PostgreSQL Database" },
  { value: "SQLSERVER", label: "SQL Server Database" },
  { value: "ORACLE", label: "Oracle Database" },
  { value: "MYSQL", label: "MySQL Database" },
  { value: "REST", label: "REST API" },
  { value: "SOAP", label: "SOAP Web Service" },
  { value: "FILE", label: "File System" },
  { value: "SFTP", label: "SFTP Server" },
  { value: "FTP", label: "FTP Server" },
  { value: "KAFKA", label: "Apache Kafka" },
  { value: "RABBITMQ", label: "RabbitMQ" },
  { value: "REDIS", label: "Redis Cache" },
  { value: "MONGODB", label: "MongoDB" },
  { value: "ELASTICSEARCH", label: "Elasticsearch" },
  { value: "S3", label: "Amazon S3" },
  { value: "AZURE_BLOB", label: "Azure Blob Storage" },
  { value: "GCS", label: "Google Cloud Storage" }
]

// Status filter options
const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" }
]

// Type filter options
const typeFilterOptions = [
  { value: "all", label: "All Types" },
  ...connectionTypes
]

// Connection interface for UI - matches backend exactly
interface Connection {
  id: string
  connection_key: string
  domain_id: string
  name: string
  type_code: string
  description?: string
  parameters: string
  status: 'ACTIVE' | 'INACTIVE'
  version_no: number
  is_current: boolean
  last_tested_date?: string
  last_test_status?: 'SUCCESS' | 'FAILURE' | 'PENDING'
  last_test_error?: string
  created_by: string
  created_date: string
  last_modified_by?: string
  last_modified_date?: string
}

interface ConnectionFormData {
  name: string
  typeCode: string
  description: string
  parameters: string
  status: 'ACTIVE' | 'INACTIVE'
}

export default function ConnectionsPage() {
  const { toast } = useToast()
  const [connections, setConnections] = useState<Connection[]>([])
  const [selectedDomain, setSelectedDomain] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false)
  const [editingConnection, setEditingConnection] = useState<Connection | null>(null)
  const [connectionHistory, setConnectionHistory] = useState<Connection[]>([])
  const [formData, setFormData] = useState<ConnectionFormData>({
    name: '',
    typeCode: '',
    description: '',
    parameters: '{}',
    status: 'ACTIVE'
  })
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null)
  const [loading, setLoading] = useState(false)
  const [isSaving, startSaveTransition] = useTransition()

  // Load initial domain from localStorage and listen for domain changes
  useEffect(() => {
    // Get initial domain ID from localStorage (set by global domain selector)
    const savedDomainId = localStorage.getItem("selectedDomainId")
    if (savedDomainId) {
      setSelectedDomain(savedDomainId)
    } else {
      // If no saved domain, wait for the global domain selector to set one
      console.log('No saved domain ID found, waiting for global domain selector')
    }

    // Listen for global domain changes
    const handleDomainChange = (event: CustomEvent) => {
      const { domain } = event.detail
      console.log('Domain ID changed to:', domain)
      setSelectedDomain(domain)
    }

    window.addEventListener('domainChanged', handleDomainChange as EventListener)
    
    return () => {
      window.removeEventListener('domainChanged', handleDomainChange as EventListener)
    }
  }, [])

  useEffect(() => {
    if (selectedDomain) {
      console.log('Loading connections for domain:', selectedDomain)
      loadConnections()
    }
  }, [selectedDomain])

  const loadConnections = async () => {
    try {
      setLoading(true)
      const data = await metadataConnectionService.getConnections(selectedDomain)
      // Convert parameters from string to display format
      // Use connections directly from backend (already has correct field names)
      setConnections(data)
    } catch (error) {
      console.error('Failed to load connections:', error)
      toast({
        title: "Error",
        description: "Failed to load connections",
        variant: "destructive"
      })
      setConnections([])
    } finally {
      setLoading(false)
    }
  }

  // Filter connections based on search and filters
  const filteredConnections = connections.filter(conn => {
    const matchesSearch = !searchTerm || 
      conn.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (conn.description && conn.description.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = selectedType === 'all' || conn.type_code === selectedType
    const matchesStatus = statusFilter === 'all' || conn.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  const handleAddConnection = () => {
    setEditingConnection(null)
    setFormData({
      name: '',
      typeCode: '',
      description: '',
      parameters: '{}',
      status: 'ACTIVE'
    })
    setIsAddDialogOpen(true)
  }

  const handleEditConnection = (connection: Connection) => {
    setEditingConnection(connection)
    setFormData({
      name: connection.name,
      typeCode: connection.type_code,
      description: connection.description || '',
      parameters: connection.parameters || '{}',
      status: connection.status
    })
    setIsEditDialogOpen(true)
  }

  const handleSaveConnection = () => {
    startSaveTransition(async () => {
      try {
        // Validate form data
        if (!formData.name.trim()) {
          toast({
            title: "Validation Error",
            description: "Connection name is required",
            variant: "destructive"
          })
          return
        }

        if (!formData.typeCode) {
          toast({
            title: "Validation Error", 
            description: "Connection type is required",
            variant: "destructive"
          })
          return
        }

        if (!formData.description.trim()) {
          toast({
            title: "Validation Error",
            description: "Connection description is required", 
            variant: "destructive"
          })
          return
        }

        // Validate JSON parameters
        if (formData.parameters && !isValidJson(formData.parameters)) {
          toast({
            title: "Validation Error",
            description: "Connection parameters must be valid JSON",
            variant: "destructive"
          })
          return
        }

        if (editingConnection) {
          // Update existing connection (creates new version)
          await metadataConnectionService.updateConnection(editingConnection.id, {
            connection_key: editingConnection.connection_key,
            domain_id: editingConnection.domain_id,
            name: formData.name,
            type_code: formData.typeCode,
            description: formData.description,
            parameters: JSON.parse(formData.parameters),
            status: formData.status
          })
          
          toast({
            title: "Success",
            description: "Connection updated successfully"
          })
          setIsEditDialogOpen(false)
        } else {
          // Create new connection
          await metadataConnectionService.createConnection({
            domain_id: selectedDomain,
            name: formData.name,
            type_code: formData.typeCode,
            description: formData.description,
            parameters: JSON.parse(formData.parameters),
            status: formData.status
          })
          
          toast({
            title: "Success", 
            description: "Connection created successfully"
          })
          setIsAddDialogOpen(false)
        }

        // Reload connections after save
        await loadConnections()
      } catch (error) {
        console.error('Failed to save connection:', error)
        toast({
          title: "Error",
          description: "Failed to save connection",
          variant: "destructive"
        })
      }
    })
  }

  const handleTestConnection = () => {
    startSaveTransition(async () => {
      try {
        // Validate required fields
        if (!formData.name.trim() || !formData.typeCode) {
          toast({
            title: "Validation Error",
            description: "Connection name and type are required for testing",
            variant: "destructive"
          })
          return
        }

        // Validate JSON parameters
        if (formData.parameters && !isValidJson(formData.parameters)) {
          toast({
            title: "Validation Error", 
            description: "Connection parameters must be valid JSON for testing",
            variant: "destructive"
          })
          return
        }

        // Test connection via backend API
        const result = await metadataConnectionService.testConnection({
          name: formData.name,
          type_code: formData.typeCode,
          parameters: JSON.parse(formData.parameters)
        })
        
        toast({
          title: result.success ? "Test Successful" : "Test Failed",
          description: result.message || (result.success ? "Connection test completed successfully" : "Connection test failed"),
          variant: result.success ? "default" : "destructive"
        })
      } catch (error) {
        console.error('Failed to test connection:', error)
        toast({
          title: "Error",
          description: "Failed to test connection",
          variant: "destructive"
        })
      }
    })
  }

  const handleViewHistory = async (connection: Connection) => {
    try {
      // Mock history data for now
      const mockHistory: Connection[] = [
        { ...connection, last_modified_date: new Date(Date.now() - 86400000).toISOString() },
        { ...connection, last_modified_date: new Date(Date.now() - 172800000).toISOString() }
      ]
      setConnectionHistory(mockHistory)
      setIsHistoryDialogOpen(true)
    } catch (error) {
      console.error('Failed to load connection history:', error)
      toast({
        title: "Error",
        description: "Failed to load connection history",
        variant: "destructive"
      })
    }
  }

  const handleToggleStatus = async (connection: Connection) => {
    try {
      const newStatus = connection.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
      setConnections(prev => prev.map(conn => 
        conn.id === connection.id 
          ? { ...conn, status: newStatus, last_modified_date: new Date().toISOString() }
          : conn
      ))
      toast({
        title: "Success",
        description: `Connection ${newStatus === 'ACTIVE' ? 'activated' : 'deactivated'} successfully`
      })
    } catch (error) {
      console.error('Failed to toggle connection status:', error)
      toast({
        title: "Error", 
        description: "Failed to update connection status",
        variant: "destructive"
      })
    }
  }

  return (
    <AccessControl requiredPath="/connections">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Connections</h1>
            <p className="text-muted-foreground">
              Manage your data connections and integrations
            </p>
          </div>
          <Button onClick={handleAddConnection}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Connection
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Connections</CardTitle>
            <CardDescription>View and manage all your data connections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex-1">
                <Input
                  placeholder="Search connections..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  {typeFilterOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Connections Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Domain</TableHead>
                    <TableHead>Last Modified</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    // Loading skeletons
                    Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      </TableRow>
                    ))
                  ) : filteredConnections.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No connections found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredConnections.map((conn) => (
                      <TableRow key={conn.id}>
                        <TableCell className="font-medium">{conn.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {connectionTypes.find(t => t.value === conn.type_code)?.label || conn.type_code}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{conn.description}</TableCell>
                        <TableCell>
                          <Badge variant={conn.status === 'ACTIVE' ? 'default' : 'secondary'}>
                            {conn.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{conn.domain_id}</TableCell>
                        <TableCell>
                          {new Date(conn.last_modified_date || conn.created_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEditConnection(conn)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleViewHistory(conn)}>
                              <History className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleToggleStatus(conn)}>
                              {conn.status === 'ACTIVE' ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Add Connection Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Connection</DialogTitle>
              <DialogDescription>
                Create a new data connection configuration.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="conn-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="conn-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="conn-type" className="text-right">
                  Type
                </Label>
                <Select
                  value={formData.typeCode}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, typeCode: value }))}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select connection type" />
                  </SelectTrigger>
                  <SelectContent>
                    {connectionTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="conn-desc" className="text-right">
                  Description
                </Label>
                <Input
                  id="conn-desc"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="conn-params" className="text-right pt-2">
                  Parameters (JSON)
                </Label>
                <Textarea
                  id="conn-params"
                  placeholder='Enter connection parameters as JSON, e.g.,\n{\n  "host": "localhost",\n  "port": 5432\n}'
                  value={formData.parameters}
                  onChange={(e) => setFormData(prev => ({ ...prev, parameters: e.target.value }))}
                  className="col-span-3 min-h-[120px] font-mono text-sm"
                  rows={6}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="conn-status" className="text-right">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as 'ACTIVE' | 'INACTIVE' }))}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handleTestConnection}
                disabled={isSaving || !formData.name || !formData.typeCode}
              >
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Zap className="mr-2 h-4 w-4" />
                )}
                Test Connection
              </Button>
              <div>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)} className="mr-2">
                  Cancel
                </Button>
                <Button type="submit" onClick={handleSaveConnection} disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Connection
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Connection Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Connection</DialogTitle>
              <DialogDescription>
                Modify the connection details below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-conn-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-conn-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-conn-type" className="text-right">
                  Type
                </Label>
                <Select
                  value={formData.typeCode}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, typeCode: value }))}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select connection type" />
                  </SelectTrigger>
                  <SelectContent>
                    {connectionTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-conn-desc" className="text-right">
                  Description
                </Label>
                <Input
                  id="edit-conn-desc"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="edit-conn-params" className="text-right pt-2">
                  Parameters (JSON)
                </Label>
                <Textarea
                  id="edit-conn-params"
                  placeholder='Enter connection parameters as JSON, e.g.,\n{\n  "host": "localhost",\n  "port": 5432\n}'
                  value={formData.parameters}
                  onChange={(e) => setFormData(prev => ({ ...prev, parameters: e.target.value }))}
                  className="col-span-3 min-h-[120px] font-mono text-sm"
                  rows={6}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-conn-status" className="text-right">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as 'ACTIVE' | 'INACTIVE' }))}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handleTestConnection}
                disabled={isSaving || !formData.name || !formData.typeCode}
              >
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Zap className="mr-2 h-4 w-4" />
                )}
                Test Connection
              </Button>
              <div>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)} className="mr-2">
                  Cancel
                </Button>
                <Button type="submit" onClick={handleSaveConnection} disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update Connection
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* History Dialog */}
        <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
          <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle>Connection History</DialogTitle>
              <DialogDescription>
                View the version history for this connection.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Version</TableHead>
                    <TableHead>Modified Date</TableHead>
                    <TableHead>Modified By</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {connectionHistory.map((version, index) => (
                    <TableRow key={index}>
                      <TableCell>v{connectionHistory.length - index}</TableCell>
                      <TableCell>
                        <p><strong>Last Modified:</strong> {new Date(version.last_modified_date || version.created_date).toLocaleString()}</p>
                        <p><strong>Modified By:</strong> {version.last_modified_by || version.created_by}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant={version.status === 'ACTIVE' ? 'default' : 'secondary'}>
                          {version.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsHistoryDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AccessControl>
  )
}
