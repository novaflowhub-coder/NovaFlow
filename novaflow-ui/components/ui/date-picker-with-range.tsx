"use client"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DatePickerWithRangeProps {
  date: DateRange | undefined
  setDate: (date: DateRange | undefined) => void
  placeholder?: string
}

export function DatePickerWithRange({ date, setDate, placeholder = "Pick a date range" }: DatePickerWithRangeProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            date?.from && date?.to ? "data-[state=open]:bg-accent data-[state=open]:text-accent-foreground" : "",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date?.from && date?.to ? (
            `${format(date.from, "PPP")} - ${format(date.to, "PPP")}`
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="range" selected={date} onSelect={setDate} numberOfMonths={2} initialFocus />
      </PopoverContent>
    </Popover>
  )
}
