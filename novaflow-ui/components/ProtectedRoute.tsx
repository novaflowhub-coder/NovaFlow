"use client"

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { authService } from '@/lib/auth'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Skip auth check for public routes
        if (pathname === '/login') {
          setIsLoading(false)
          return
        }

        const authenticated = authService.isAuthenticated()
        
        if (!authenticated) {
          router.push('/login')
          return
        }

        // Try to fetch user profile to validate token with backend
        try {
          await authService.fetchUserProfile()
          setIsAuthenticated(true)
        } catch (error) {
          console.error('Failed to validate authentication:', error)
          authService.signOut()
          return
        }
      } catch (error) {
        console.error('Authentication check failed:', error)
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [pathname, router])

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // For login page, always render
  if (pathname === '/login') {
    return <>{children}</>
  }

  // For protected routes, only render if authenticated
  if (!isAuthenticated) {
    return null // Will redirect to login
  }

  return <>{children}</>
}
