"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, CheckCircle2 } from "lucide-react"
import { useUserContext } from "@/providers/UserAuthProvider"

// Mock data for tasks
const tasks = [
  { id: 1, title: "Apply fertilizer to Nyeri Farm", date: new Date(2025, 4, 12), completed: false, farm: "Nyeri Farm" },
  {
    id: 2,
    title: "Harvest beans at Waceke's Farm",
    date: new Date(2025, 4, 15),
    completed: false,
    farm: "Waceke's Farm",
  },
  {
    id: 3,
    title: "Irrigation maintenance at Karatina",
    date: new Date(2025, 4, 10),
    completed: true,
    farm: "Karatina Farm",
  },
  {
    id: 4,
    title: "Pest control at Malaysia Farm",
    date: new Date(2025, 4, 14),
    completed: false,
    farm: "Malaysia Farm",
  },
  { id: 5, title: "Soil testing at Jakarta", date: new Date(2025, 4, 18), completed: false, farm: "Jakarta" },
]

export default function TasksCalendar() {
  const {farmerProfile} = useUserContext();
  const [date, setDate] = useState<Date | undefined>(new Date())

  const [showWelcome, setShowWelcome] = useState(false)
  const [animateOut, setAnimateOut] = useState(false)

    useEffect(() => {
    const showTimer = setTimeout(() => setShowWelcome(true), 3000)
    const hideTimer = setTimeout(() => setAnimateOut(true), 6000)
    const finalHide = setTimeout(() => setShowWelcome(false), 7000)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
      clearTimeout(finalHide)
    }
  }, [])

  // Get tasks for the selected date
  const selectedDateTasks = tasks.filter((task) => {
    if (!date) return false
    return task.date.toDateString() === date.toDateString()
  })

  // Function to highlight dates with tasks
  const isDayWithTask = (day: Date) => {
    return tasks.some((task) => task.date.toDateString() === day.toDateString())
  }

  return (
    <div className="flex flex-col gap-6">
      {showWelcome && (
        <div
          className={`fixed top-0 left-1/2 transform -translate-x-1/2 mt-4 z-50 transition-all duration-700 ease-in-out ${
            animateOut ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
          } bg-green-100 text-green-800 px-6 py-3 rounded-md shadow-md`}
        >
          👋 Hi {farmerProfile?.full_name}, Create and manage all your farm activities here!
        </div>
      )}

      <Card className="md:col-span-1 gap-2">
        <CardHeader>
          <CardTitle className="text-lg">Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            modifiers={{
              withTask: (date) => isDayWithTask(date),
            }}
            modifiersStyles={{
              withTask: {
                fontWeight: "bold",
                backgroundColor: "#dcfce7",
                color: "#166534",
              },
            }}
          />
          <div className="mt-4 text-center">
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="mr-2 h-4 w-4" /> Add New Task
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-1 max-w-[22rem] max-h-[14rem]">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">
            Tasks for {date?.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </CardTitle>
          <Badge variant="outline" className="bg-green-50 text-green-700">
            {selectedDateTasks.length} Tasks
          </Badge>
        </CardHeader>
        <CardContent>
          {selectedDateTasks.length > 0 ? (
            <div className="space-y-4">
              {selectedDateTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-md border flex items-start justify-between ${
                    task.completed ? "bg-gray-50 border-gray-200" : "bg-white border-gray-200"
                  }`}
                >
                  <div className="flex items-start">
                    <div className={`mt-0.5 mr-3 ${task.completed ? "text-green-500" : "text-gray-400"}`}>
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className={`font-medium ${task.completed ? "line-through text-gray-500" : ""}`}>
                        {task.title}
                      </h4>
                      <p className="text-sm text-gray-500">{task.farm}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8">
                    {task.completed ? "Completed" : "Mark Complete"}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No tasks scheduled for this day</p>
              <Button variant="outline" className="mt-4">
                <Plus className="mr-2 h-4 w-4" /> Add Task
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
