'use client'

import { useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { authService } from "@/lib/auth"
import { toast } from "@/hooks/use-toast"

export default function UnauthorizedPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if this is an access denied redirect
    const urlParams = new URLSearchParams(window.location.search)
    const reason = urlParams.get('reason')
    
    if (reason === 'access_denied') {
      // Show toast notification for access denied
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You are not authorized to access this system. Please contact your administrator.",
      })
    }
  }, [])

  const handleBackToLogin = () => {
    router.push('/login')
  }

  const handleContactAdmin = () => {
    // You can customize this to open email client or support system
    window.location.href = 'mailto:admin@novaflow.com?subject=Access Request&body=I need access to the NovaFlow system. My email: '
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-red-100 p-3">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-sm text-gray-600 mt-2">
            You are not authorized to access this system
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-700">
              Your Google account was authenticated successfully, but you don't have permission to access NovaFlow.
            </p>
            <p className="text-sm text-gray-600">
              Please contact your system administrator to request access.
            </p>
          </div>
          
          <div className="space-y-2">
            <Button 
              onClick={handleContactAdmin}
              className="w-full"
              variant="default"
            >
              Contact Administrator
            </Button>
            
            <Button 
              onClick={handleBackToLogin}
              className="w-full"
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-gray-500">
              If you believe this is an error, please contact support with your email address.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
