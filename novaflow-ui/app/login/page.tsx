"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Loader2 } from "lucide-react"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isOktaLoading, setIsOktaLoading] = useState(false)
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Set authentication token cookie
      document.cookie = "nf_token=mock_token_12345; path=/; max-age=86400"
      router.push("/dashboard")
    }, 1500)
  }

  const handleOktaLogin = () => {
    setIsOktaLoading(true)
    // Simulate Okta redirect
    setTimeout(() => {
      setIsOktaLoading(false)
      // Set authentication token cookie for Okta login
      document.cookie = "nf_token=okta_token_67890; path=/; max-age=86400"
      router.push("/dashboard")
    }, 1500)
  }

  return (
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
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>

          <div className="my-6 flex items-center">
            <Separator className="flex-1" />
            <span className="mx-4 text-xs uppercase text-muted-foreground">Or</span>
            <Separator className="flex-1" />
          </div>

          <Button
            variant="outline"
            className="w-full bg-transparent"
            onClick={handleOktaLogin}
            disabled={isOktaLoading}
          >
            {isOktaLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
                  fill="#007DC1"
                />
                <path
                  d="M12.1947 5.43359C8.43993 5.43359 5.43359 8.43993 5.43359 12.1947C5.43359 15.9504 8.43993 18.9557 12.1947 18.9557C15.9504 18.9557 18.9557 15.9504 18.9557 12.1947C18.9557 8.43993 15.9504 5.43359 12.1947 5.43359ZM12.1947 16.943C9.5493 16.943 7.4463 14.84 7.4463 12.1947C7.4463 9.5493 9.5493 7.4463 12.1947 7.4463C14.84 7.4463 16.943 9.5493 16.943 12.1947C16.943 14.84 14.84 16.943 12.1947 16.943Z"
                  fill="white"
                />
              </svg>
            )}
            Sign in with Okta SSO
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
