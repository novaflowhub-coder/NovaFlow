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
import { authService, UserDomain } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

export function DomainSelector() {
  const { toast } = useToast()
  const [selectedDomain, setSelectedDomain] = useState<UserDomain | null>(null)
  const [userDomains, setUserDomains] = useState<UserDomain[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUserDomains()
  }, [])

  const loadUserDomains = async () => {
    try {
      setLoading(true)
      console.log('Loading user domains from /api/me...')
      const userProfile = await authService.fetchUserProfile()
      console.log('User profile response:', userProfile)
      
      if (userProfile.domains && userProfile.domains.length > 0) {
        console.log('Found user domains:', userProfile.domains)
        setUserDomains(userProfile.domains)
        
        // Check for saved domain ID or use first domain
        const savedDomainId = localStorage.getItem("selectedDomainId")
        if (savedDomainId) {
          const savedDomain = userProfile.domains.find(d => d.id.toString() === savedDomainId)
          if (savedDomain) {
            setSelectedDomain(savedDomain)
          } else {
            setSelectedDomain(userProfile.domains[0])
            localStorage.setItem("selectedDomainId", userProfile.domains[0].id.toString())
          }
        } else {
          setSelectedDomain(userProfile.domains[0])
          localStorage.setItem("selectedDomainId", userProfile.domains[0].id.toString())
        }
      } else {
        // Fallback if no domains returned
        console.warn('No domains found for user, userProfile:', userProfile)
        console.warn('userProfile.domains:', userProfile.domains)
        const fallbackDomain = { id: 1, code: 'ADMIN', name: 'Administration' }
        setUserDomains([fallbackDomain])
        setSelectedDomain(fallbackDomain)
        localStorage.setItem("selectedDomainId", fallbackDomain.id.toString())
      }
    } catch (error) {
      console.error('Failed to load user domains:', error)
      console.error('Error details:', error)
      toast({
        title: "Error",
        description: "Failed to load user domains",
        variant: "destructive"
      })
      // Fallback to a default domain
      const fallbackDomain = { id: 1, code: 'ADMIN', name: 'Administration' }
      setUserDomains([fallbackDomain])
      setSelectedDomain(fallbackDomain)
      localStorage.setItem("selectedDomainId", fallbackDomain.id.toString())
    } finally {
      setLoading(false)
    }
  }

  const handleDomainChange = (domain: UserDomain) => {
    setSelectedDomain(domain)
    localStorage.setItem("selectedDomainId", domain.id.toString())
    
    // Dispatch global domain change event for all pages to listen to
    window.dispatchEvent(new CustomEvent("domainChanged", { detail: { domain: domain.id.toString() } }))
  }

  if (loading) {
    return (
      <Button variant="outline" className="h-8 gap-2 px-3" disabled>
        <Building className="h-4 w-4" />
        <span className="hidden sm:inline-block">Loading...</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-8 gap-2 px-3">
          <Building className="h-4 w-4" />
          <span className="hidden sm:inline-block">{selectedDomain?.name}</span>
          <Badge variant="secondary" className="hidden md:inline-flex text-xs">
            {selectedDomain?.code}
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
