"use client"

import { useState, useEffect } from "react"
import { Building, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

// Mock domains - in real app, this would come from API/context
const mockUserDomains = [
  { id: "DOM001", name: "Finance", code: "FINANCE", isActive: true },
  { id: "DOM002", name: "Human Resources", code: "HR", isActive: true },
  { id: "DOM003", name: "Sales", code: "SALES", isActive: true },
]

export function DomainSelector() {
  const [selectedDomain, setSelectedDomain] = useState(mockUserDomains[0])
  const [userDomains, setUserDomains] = useState(mockUserDomains)

  // In real app, this would be managed by context/state management
  useEffect(() => {
    // Load user's accessible domains and last selected domain
    const savedDomainId = localStorage.getItem("selectedDomainId")
    if (savedDomainId) {
      const savedDomain = userDomains.find(d => d.id === savedDomainId)
      if (savedDomain) {
        setSelectedDomain(savedDomain)
      }
    }
  }, [])

  const handleDomainChange = (domain: typeof mockUserDomains[0]) => {
    setSelectedDomain(domain)
    localStorage.setItem("selectedDomainId", domain.id)
    
    // In real app, this would trigger a context update that filters all data
    // and refreshes the current page with domain-specific data
    window.dispatchEvent(new CustomEvent("domainChanged", { detail: domain }))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-8 gap-2 px-3">
          <Building className="h-4 w-4" />
          <span className="hidden sm:inline-block">{selectedDomain.name}</span>
          <Badge variant="secondary" className="hidden md:inline-flex text-xs">
            {selectedDomain.code}
          </Badge>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Select Domain</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {userDomains.map((domain) => (
          <DropdownMenuItem
            key={domain.id}
            onClick={() => handleDomainChange(domain)}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              <span>{domain.name}</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {domain.code}
            </Badge>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
