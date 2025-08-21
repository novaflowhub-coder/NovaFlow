"use client"

import type React from "react"
import { useState } from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/components/layout/sidebar"
import { Toaster } from "@/components/ui/toaster"
import { usePathname } from "next/navigation"
import { Banner } from "@/components/layout/banner"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const isLogin = pathname === "/login"
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
          themes={["light", "dark"]}
        >
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
        </ThemeProvider>
      </body>
    </html>
  )
}
