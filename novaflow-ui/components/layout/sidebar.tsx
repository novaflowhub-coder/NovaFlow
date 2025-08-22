"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Settings,
  Users,
  FileText,
  ListChecks,
  Network,
  Database,
  GitBranch,
  PlayCircle,
  Monitor,
  ShieldCheck,
  FileCode,
  Workflow,
  TableProperties,
  Palette,
  CalendarCheck,
  History,
  Building,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const mainNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/approvals", label: "Approvals", icon: ShieldCheck },
  { href: "/process-monitor", label: "Process Monitor", icon: Monitor },
  { href: "/version-history", label: "Version History", icon: History },
  { href: "/user-management", label: "User Management", icon: Users },
  { href: "/domain-management", label: "Domain Management", icon: Building },
  { href: "/data-workflow", label: "Data Workflow", icon: Workflow },
]

const definitionNavGroups = [
  {
    groupName: "Core Definitions",
    icon: Settings,
    items: [
      { href: "/connections", label: "Connections", icon: Network },
      { href: "/object-manager", label: "Object Manager", icon: Database },
      { href: "/rule-definition", label: "Rule Definition", icon: FileText },
      { href: "/rule-set-definition", label: "Rule Set Definition", icon: ListChecks },
      { href: "/scaffold-definition", label: "Scaffold Definition", icon: GitBranch },
      { href: "/run-control-definition", label: "Run Control Definition", icon: PlayCircle },
      { href: "/holiday-calendars", label: "Holiday Calendars", icon: CalendarCheck },
    ],
  },
  {
    groupName: "UI & Data Definitions",
    icon: Palette,
    items: [
      { href: "/ui-metadata-list", label: "UI Metadata List", icon: TableProperties },
      { href: "/ui-metadata", label: "UI Metadata Editor", icon: FileCode },
    ],
  },
]

interface SidebarProps {
  isCollapsed: boolean
}

export function Sidebar({ isCollapsed }: SidebarProps) {
  const pathname = usePathname()
  const isActive = (href: string) => pathname === href

  return (
    <aside
      data-collapsed={isCollapsed}
      className={cn(
        "hidden md:block border-r bg-background transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-72",
      )}
    >
      <ScrollArea className="h-full py-6 lg:py-8">
        <TooltipProvider delayDuration={0}>
          <nav className={cn("flex flex-col gap-2", isCollapsed ? "px-2 items-center" : "px-4")}>
            {mainNavItems.map((item) =>
              isCollapsed ? (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                        isActive(item.href) ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="sr-only">{item.label}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    isActive(item.href) ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ),
            )}

            <Accordion type="multiple" defaultValue={definitionNavGroups.map((g) => g.groupName)} className="w-full">
              {definitionNavGroups.map((group) => (
                <AccordionItem value={group.groupName} key={group.groupName} className="border-none">
                  <AccordionTrigger
                    className={cn(
                      "py-2 text-sm font-medium text-muted-foreground hover:no-underline hover:bg-accent hover:text-accent-foreground rounded-md [&[data-state=open]>svg]:rotate-180",
                      isCollapsed ? "px-3 justify-center" : "px-3",
                    )}
                  >
                    {isCollapsed ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex h-10 w-10 items-center justify-center">
                            <group.icon className="h-5 w-5" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="right">{group.groupName}</TooltipContent>
                      </Tooltip>
                    ) : (
                      <div className="flex items-center gap-3">
                        <group.icon className="h-4 w-4" />
                        {group.groupName}
                      </div>
                    )}
                  </AccordionTrigger>
                  <AccordionContent className="data-[state=closed]:hidden">
                    <div className={cn("flex flex-col items-center", isCollapsed ? "gap-1" : "gap-1 pl-4")}>
                      {group.items.map((item) =>
                        isCollapsed ? (
                          <Tooltip key={item.href}>
                            <TooltipTrigger asChild>
                              <Link
                                href={item.href}
                                className={cn(
                                  "flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                                  isActive(item.href) ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                                )}
                              >
                                <item.icon className="h-5 w-5" />
                                <span className="sr-only">{item.label}</span>
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">{item.label}</TooltipContent>
                          </Tooltip>
                        ) : (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                              "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                              isActive(item.href) ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                            )}
                          >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                          </Link>
                        ),
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </nav>
        </TooltipProvider>
      </ScrollArea>
    </aside>
  )
}
