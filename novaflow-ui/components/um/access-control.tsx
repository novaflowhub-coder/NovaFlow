'use client'

import { useState, useEffect, ReactNode } from 'react'
import { useToast } from "@/hooks/use-toast"
import { LoadingSkeleton } from "@/components/um/loading-skeleton"
import { authService } from '@/lib/auth'
import { AlertCircle, Lock } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

interface AccessControlProps {
  children: ReactNode
  requiredPath?: string
  requiredPermissions?: string[]
  fallbackRoles?: string[]
  title?: string
  description?: string
}

export function AccessControl({ 
  children, 
  requiredPath, 
  requiredPermissions = ['READ'], 
  fallbackRoles = ['admin', 'super_admin'],
  title = 'this page',
  description = 'Access this content'
}: AccessControlProps) {
  const [authChecking, setAuthChecking] = useState(true)
  const [hasAccess, setHasAccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    checkAccess()
  }, [])

  const checkAccess = async () => {
    try {
      setAuthChecking(true)
      setErrorMessage('')
      
      // Check if user is authenticated
      if (!authService.isAuthenticated()) {
        setErrorMessage('Authentication required. Please sign in to access this page.')
        toast({
          variant: "destructive",
          title: "Authentication Required",
          description: "Please sign in to access this page.",
        })
        setTimeout(() => {
          window.location.href = '/login'
        }, 2000)
        return
      }

      // Get current user to check permissions
      let currentUser = authService.getCurrentUser()
      if (!currentUser) {
        // Try to fetch user profile from backend
        try {
          await authService.fetchUserProfile()
          currentUser = authService.getCurrentUser()
          if (!currentUser) {
            throw new Error('Unable to get user profile')
          }
        } catch (error: any) {
          if (error.message === 'UNAUTHORIZED_USER') {
            setErrorMessage('You are not authorized to access this system. Please contact your administrator to request access.')
          } else {
            setErrorMessage('Unable to verify your permissions. Please try refreshing the page or contact your administrator.')
          }
          return
        }
      }

      // Check if user has required permissions or fallback roles
      const hasRequiredPermission = currentUser.permissions?.some(p => 
        p.page === requiredPath && requiredPermissions.includes(p.permission)
      )
      
      const hasFallbackRole = currentUser.roles?.some(role => 
        fallbackRoles.includes(role)
      )

      if (!hasRequiredPermission && !hasFallbackRole) {
        setErrorMessage(`You don't have permission to access ${title?.toLowerCase() || 'this page'}. Please contact your administrator to request the necessary permissions.`)
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: `You don't have permission to access ${title?.toLowerCase() || 'this page'}.`,
        })
        return
      }

      setHasAccess(true)
    } catch (error) {
      console.error('Access check failed:', error)
      setErrorMessage('Unable to verify your access. Please try refreshing the page or contact your administrator.')
      toast({
        variant: "destructive",
        title: "Access Check Failed",
        description: "Unable to verify your access. Please try again.",
      })
    } finally {
      setAuthChecking(false)
    }
  }

  const handleRetry = () => {
    checkAccess()
  }

  const handleGoBack = () => {
    window.history.back()
  }

  if (authChecking) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{title || 'this page'}</h1>
            <p className="text-muted-foreground">{description || 'Access this content'}</p>
          </div>
        </div>
        <LoadingSkeleton columns={4} />
      </div>
    )
  }

  if (!hasAccess) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{title || 'this page'}</h1>
            <p className="text-muted-foreground">{description || 'Access this content'}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="max-w-md w-full space-y-6">
            <div className="text-center">
              <Lock className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold text-foreground mb-2">Access Denied</h2>
            </div>
            
            <Alert className="border-destructive/50 text-destructive dark:border-destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm leading-relaxed">
                {errorMessage}
              </AlertDescription>
            </Alert>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" onClick={handleGoBack}>
                Go Back
              </Button>
              <Button onClick={handleRetry}>
                Try Again
              </Button>
            </div>
            
            <div className="text-center text-sm text-muted-foreground">
              <p>If you believe this is an error, please contact your system administrator.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
