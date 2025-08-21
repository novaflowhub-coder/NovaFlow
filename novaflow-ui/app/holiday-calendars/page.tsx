"use client"

import { Label } from "@/components/ui/label"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import { PlusCircle, Edit3, Trash2, Save, XCircle, CalendarPlus, CalendarMinus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import type { HolidayCalendar, Holiday, Status } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"
import { mockHolidayCalendars } from "@/lib/mock-data" // Assuming mock data is here
import { DatePicker } from "@/components/ui/date-picker"
import { format, parseISO } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const initialHolidayCalendarState: Partial<HolidayCalendar> = {
  name: "",
  description: "",
  year: new Date().getFullYear(),
  status: "A",
  holidays: [],
}

export default function HolidayCalendarsPage() {
  const { toast } = useToast()
  const [calendars, setCalendars] = useState<HolidayCalendar[]>(mockHolidayCalendars)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentCalendar, setCurrentCalendar] = useState<Partial<HolidayCalendar>>(initialHolidayCalendarState)
  const [editingCalendarId, setEditingCalendarId] = useState<string | null>(null)

  const handleInputChange = (field: keyof HolidayCalendar, value: any) => {
    setCurrentCalendar((prev) => ({ ...prev, [field]: value }))
  }

  const handleHolidayChange = (index: number, field: keyof Holiday, value: string) => {
    const updatedHolidays = [...(currentCalendar.holidays || [])]
    updatedHolidays[index] = { ...updatedHolidays[index], [field]: value }
    setCurrentCalendar((prev) => ({ ...prev, holidays: updatedHolidays }))
  }

  const addHoliday = () => {
    const newHoliday: Holiday = {
      id: `HOL${Date.now()}`,
      date: format(new Date(), "yyyy-MM-dd"),
      name: "",
    }
    setCurrentCalendar((prev) => ({
      ...prev,
      holidays: [...(prev.holidays || []), newHoliday],
    }))
  }

  const removeHoliday = (index: number) => {
    setCurrentCalendar((prev) => ({
      ...prev,
      holidays: (prev.holidays || []).filter((_, i) => i !== index),
    }))
  }

  const handleSaveCalendar = () => {
    if (!currentCalendar.name || !currentCalendar.year) {
      toast({
        title: "Validation Error",
        description: "Calendar Name and Year are required.",
        variant: "destructive",
      })
      return
    }

    if (editingCalendarId) {
      setCalendars((prev) =>
        prev.map((cal) => (cal.id === editingCalendarId ? ({ ...cal, ...currentCalendar } as HolidayCalendar) : cal)),
      )
      toast({ title: "Calendar Updated", description: `${currentCalendar.name} has been updated.` })
    } else {
      const newCalendar: HolidayCalendar = {
        ...initialHolidayCalendarState,
        ...currentCalendar,
        id: `HCAL${Date.now()}`,
        holidays: currentCalendar.holidays || [],
      } as HolidayCalendar
      setCalendars((prev) => [...prev, newCalendar])
      toast({ title: "Calendar Created", description: `${newCalendar.name} has been created.` })
    }
    closeDialog()
  }

  const openEditDialog = (calendar: HolidayCalendar) => {
    setEditingCalendarId(calendar.id)
    setCurrentCalendar({
      ...calendar,
      holidays: calendar.holidays.map((h) => ({ ...h, date: h.date ? format(parseISO(h.date), "yyyy-MM-dd") : "" })), // Ensure date is in yyyy-MM-dd
    })
    setIsDialogOpen(true)
  }

  const openNewDialog = () => {
    setEditingCalendarId(null)
    setCurrentCalendar({ ...initialHolidayCalendarState, year: new Date().getFullYear(), holidays: [] })
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setEditingCalendarId(null)
    setCurrentCalendar(initialHolidayCalendarState)
  }

  const handleDeleteCalendar = (calendarId: string) => {
    // Add confirmation dialog here in a real app
    setCalendars((prev) => prev.filter((cal) => cal.id !== calendarId))
    toast({ title: "Calendar Deleted", description: "The holiday calendar has been deleted." })
  }

  return (
    <>
      <PageHeader
        title="Holiday Calendars"
        description="Manage holiday calendars for scheduling purposes."
        actions={
          <Button onClick={openNewDialog}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Calendar
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Existing Holiday Calendars</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Holidays Count</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {calendars.map((calendar) => (
                <TableRow key={calendar.id}>
                  <TableCell>{calendar.name}</TableCell>
                  <TableCell>{calendar.description}</TableCell>
                  <TableCell>{calendar.year}</TableCell>
                  <TableCell>
                    <Badge variant={calendar.status === "A" ? "default" : "secondary"}>
                      {calendar.status === "A" ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>{calendar.holidays.length}</TableCell>
                  <TableCell className="space-x-2">
                    <Button variant="outline" size="icon" onClick={() => openEditDialog(calendar)}>
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDeleteCalendar(calendar.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {calendars.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">
                    No holiday calendars found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          {" "}
          {/* Increased width */}
          <DialogHeader>
            <DialogTitle>{editingCalendarId ? "Edit" : "Add New"} Holiday Calendar</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
            {" "}
            {/* Scrollable content */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={currentCalendar.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={currentCalendar.description || ""}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="year" className="text-right">
                Year
              </Label>
              <Input
                id="year"
                type="number"
                value={currentCalendar.year || ""}
                onChange={(e) => handleInputChange("year", Number.parseInt(e.target.value))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={currentCalendar.status}
                onValueChange={(value) => handleInputChange("status", value as Status)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">Active</SelectItem>
                  <SelectItem value="I">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Holidays</h4>
                <Button variant="outline" size="sm" onClick={addHoliday}>
                  <CalendarPlus className="mr-2 h-4 w-4" /> Add Holiday
                </Button>
              </div>
              {(currentCalendar.holidays || []).map((holiday, index) => (
                <div
                  key={holiday.id || index}
                  className="grid grid-cols-12 items-center gap-2 mb-2 p-2 border rounded-md"
                >
                  <div className="col-span-5">
                    <DatePicker
                      date={holiday.date ? parseISO(holiday.date) : undefined}
                      setDate={(date) => handleHolidayChange(index, "date", date ? format(date, "yyyy-MM-dd") : "")}
                      buttonClassName="w-full"
                    />
                  </div>
                  <div className="col-span-5">
                    <Input
                      placeholder="Holiday Name"
                      value={holiday.name}
                      onChange={(e) => handleHolidayChange(index, "name", e.target.value)}
                    />
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <Button variant="ghost" size="icon" onClick={() => removeHoliday(index)}>
                      <CalendarMinus className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
              {(currentCalendar.holidays || []).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-2">No holidays added yet.</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              <XCircle className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button onClick={handleSaveCalendar}>
              <Save className="mr-2 h-4 w-4" /> Save Calendar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
