"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Script from "next/script"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { authService } from "@/lib/auth"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [gsiLoaded, setGsiLoaded] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already authenticated
    if (authService.isAuthenticated()) {
      router.push("/dashboard")
      return
    }
  }, [router])

  const handleGsiLoad = () => {
    setGsiLoaded(true)
    // Initialize Google Sign-In after GSI script loads
    authService.initializeGoogleSignIn().catch((error) => {
      console.error('Failed to initialize Google Sign-In:', error)
      setError('Failed to initialize Google Sign-In')
    })
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    // Simulate API call for demo purposes
    setTimeout(() => {
      setIsLoading(false)
      // Set authentication token cookie
      document.cookie = "nf_token=mock_token_12345; path=/; max-age=86400"
      router.push("/dashboard")
    }, 1500)
  }

  const handleGoogleLogin = async () => {
    if (!gsiLoaded) {
      setError('Google Sign-In is still loading. Please wait.')
      return
    }
    
    setIsGoogleLoading(true)
    setError(null)
    
    try {
      // Use the improved AuthService with proper initialization order
      await authService.signInWithGoogle();
    } catch (error: any) {
      console.error('Google sign-in failed:', error)
      setError(error.message || 'Failed to sign in with Google. Please try again.')
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <>
      <Script 
        src="https://accounts.google.com/gsi/client" 
        strategy="afterInteractive"
        onLoad={handleGsiLoad}
      />
      <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
        <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <CardTitle className="text-2xl font-bold">NovaFlow</CardTitle>
          <CardDescription>Enterprise Integration Framework</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          {/* Google Sign-In - Primary Method */}
          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full bg-white hover:bg-gray-50 border-gray-300"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
            >
              {isGoogleLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              Sign in with Google
            </Button>
          </div>

          <div className="my-6 flex items-center">
            <Separator className="flex-1" />
            <span className="mx-4 text-xs uppercase text-muted-foreground">Or</span>
            <Separator className="flex-1" />
          </div>

          {/* Traditional Login - Secondary Method */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">User ID</Label>
              <Input id="username" placeholder="Enter your user ID" required />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-sm font-medium text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="remember-me" />
              <Label htmlFor="remember-me" className="font-normal">
                Remember me
              </Label>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading} variant="secondary">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In (Demo)
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
    </>
  )
}
