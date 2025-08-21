"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DebugPage() {
  const { theme, setTheme, themes, systemTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Theme Debug Page</h1>

      <Card>
        <CardHeader>
          <CardTitle>Theme Information</CardTitle>
          <CardDescription>Current theme settings and available options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Current Theme:</p>
              <p className="text-xl font-bold">{theme || "Not set"}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Resolved Theme:</p>
              <p className="text-xl font-bold">{resolvedTheme || "Not resolved"}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">System Theme:</p>
              <p className="text-xl font-bold">{systemTheme || "Unknown"}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Available Themes:</p>
              <p className="text-xl font-bold">{themes.join(", ")}</p>
            </div>
          </div>

          <div className="pt-4">
            <p className="text-sm font-medium mb-2">Theme Switcher:</p>
            <div className="flex flex-wrap gap-2">
              {themes.map((t) => (
                <Button key={t} variant={theme === t ? "default" : "outline"} onClick={() => setTheme(t)}>
                  {t}
                </Button>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <p className="text-sm font-medium mb-2">CSS Variables Test:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 bg-background border rounded-md">background</div>
              <div className="p-4 bg-foreground text-background border rounded-md">foreground</div>
              <div className="p-4 bg-card border rounded-md">card</div>
              <div className="p-4 bg-card-foreground text-background border rounded-md">card-foreground</div>
              <div className="p-4 bg-primary text-primary-foreground border rounded-md">primary</div>
              <div className="p-4 bg-secondary text-secondary-foreground border rounded-md">secondary</div>
              <div className="p-4 bg-muted text-muted-foreground border rounded-md">muted</div>
              <div className="p-4 bg-accent text-accent-foreground border rounded-md">accent</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
