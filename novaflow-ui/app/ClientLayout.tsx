"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/components/layout/sidebar"
import { Toaster } from "@/components/ui/toaster"
import { usePathname } from "next/navigation"
import { Banner } from "@/components/layout/banner"
import ProtectedRoute from "@/components/ProtectedRoute"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const isLogin = pathname === "/login"
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  useEffect(() => {
    // Load Google Identity Services script
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    document.head.appendChild(script)

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]')
      if (existingScript) {
        document.head.removeChild(existingScript)
      }
    }
  }, [])

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
      themes={["light", "dark"]}
    >
      <ProtectedRoute>
        {isLogin ? (
          // ----- LOGIN PAGE: no menus -----
          <>
            {children}
            <Toaster />
          </>
        ) : (
          // ----- MAIN APP SHELL -----
          <div className="flex min-h-screen w-full flex-col">
            <Banner toggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)} />
            <div className="flex flex-1">
              <Sidebar isCollapsed={isSidebarCollapsed} />
              <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">{children}</main>
            </div>
            <Toaster />
          </div>
        )}
      </ProtectedRoute>
    </ThemeProvider>
  )
}
