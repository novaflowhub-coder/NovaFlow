'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface CrudHeaderProps {
  title: string
  description: string
  searchPlaceholder: string
  searchValue: string
  onSearchChange: (value: string) => void
  addButtonText: string
  onAddClick: () => void
  children?: React.ReactNode
}

export function CrudHeader({
  title,
  description,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  addButtonText,
  onAddClick,
  children
}: CrudHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <Button onClick={onAddClick}>
          {addButtonText}
        </Button>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={searchPlaceholder}
            className="pl-8"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        {children}
      </div>
    </div>
  )
}
