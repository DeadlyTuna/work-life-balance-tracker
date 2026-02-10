import React, { useState } from "react"
// **CHANGES HERE:**
// Adjusted imports from '@/components/ui/...' to relative paths
// The components are in `../components/ui/` relative to the `pages/Reminders.jsx` file.

import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../components/ui/table"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/select"


const initialReminders = {
  Monday: [
    { id: 1, name: "Morning Stretch", time: "07:00 AM", frequency: "Daily", isActive: true },
    { id: 2, name: "Team Standup", time: "09:00 AM", frequency: "Weekdays", isActive: true },
  ],
  Tuesday: [
    { id: 3, name: "Deep Work Block", time: "10:00 AM", frequency: "Weekdays", isActive: true },
  ],
  Wednesday: [],
  Thursday: [],
  Friday: [],
}

export default function Reminders() {
  const [reminders, setReminders] = useState(initialReminders)
  const [activeDay, setActiveDay] = useState("Monday")
  const [newReminder, setNewReminder] = useState({ name: "", time: "09:00", frequency: "Daily" })

  const handleAddReminder = (e) => {
    e.preventDefault()
    if (!newReminder.name.trim()) return
    const reminder = {
      id: Date.now(),
      name: newReminder.name,
      time: newReminder.time,
      frequency: newReminder.frequency,
      isActive: true,
    }
    setReminders({
      ...reminders,
      [activeDay]: [...reminders[activeDay], reminder],
    })
    setNewReminder({ name: "", time: "09:00", frequency: "Daily" })
  }

  const toggleActive = (day, id) => {
    setReminders({
      ...reminders,
      [day]: reminders[day].map((r) =>
        r.id === id ? { ...r, isActive: !r.isActive } : r
      ),
    })
  }

  const handleDelete = (day, id) => {
    setReminders({
      ...reminders,
      [day]: reminders[day].filter((r) => r.id !== id),
    })
  }

  const dayNames = Object.keys(reminders)

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-yellow-400">⏰ Weekly Reminders</h1>

      <Tabs value={activeDay} onValueChange={setActiveDay} className="space-y-6">
        <TabsList className="flex flex-wrap gap-2">
          {dayNames.map((day) => (
            <TabsTrigger key={day} value={day}>
              {day}
            </TabsTrigger>
          ))}
        </TabsList>

        {dayNames.map((day) => (
          <TabsContent key={day} value={day}>
            {/* Add Reminder Form */}
            <form onSubmit={handleAddReminder} className="grid md:grid-cols-4 gap-4 mb-6">
              <Input
                placeholder="Reminder name"
                value={newReminder.name}
                onChange={(e) => setNewReminder({ ...newReminder, name: e.target.value })}
                className="bg-gray-800 text-gray-100 border-gray-700"
              />
              <Input
                type="time"
                value={newReminder.time}
                onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                className="bg-gray-800 text-gray-100 border-gray-700"
              />
              <Select
                value={newReminder.frequency}
                onValueChange={(value) => setNewReminder({ ...newReminder, frequency: value })}
              >
                <SelectTrigger className="bg-gray-800 text-gray-100 border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-gray-100 border-gray-700">
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Weekdays">Weekdays</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" className="bg-yellow-500 text-gray-900 hover:bg-yellow-400">
                + Add
              </Button>
            </form>

            {/* Reminders Table */}
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reminders[day].length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-gray-400 py-6 italic">
                        No reminders yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    reminders[day].map((r) => (
                      <TableRow
                        key={r.id}
                        className={`transition-colors ${!r.isActive ? "opacity-60" : ""}`}
                      >
                        <TableCell className="font-medium">{r.name}</TableCell>
                        <TableCell>{r.time}</TableCell>
                        <TableCell>{r.frequency}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 text-xs rounded-md ${
                              r.isActive
                                ? "bg-green-500/20 text-green-400"
                                : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {r.isActive ? "Active" : "Paused"}
                          </span>
                        </TableCell>
                        <TableCell className="flex gap-2">
                          <Button
                            onClick={() => toggleActive(day, r.id)}
                            size="sm"
                            className={`${
                              r.isActive
                                ? "bg-yellow-500 text-gray-900 hover:bg-yellow-400"
                                : "bg-green-500 text-gray-900 hover:bg-green-400"
                            }`}
                          >
                            {r.isActive ? "Pause" : "Resume"}
                          </Button>
                          <Button
                            onClick={() => handleDelete(day, r.id)}
                            size="sm"
                            variant="destructive"
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}