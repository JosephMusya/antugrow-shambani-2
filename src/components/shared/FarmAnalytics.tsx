"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { AlertCircle } from "lucide-react"

// Mock data for charts
const yieldData = [
  { name: "Waceke's Farm", value: 400 },
  { name: "Nyeri Farm", value: 300 },
  { name: "Karatina Farm", value: 500 },
  { name: "Malaysia Farm", value: 450 },
  { name: "Jakarta", value: 320 },
  { name: "Hannicha's Farm", value: 280 },
  { name: "Embakasi Farm", value: 390 },
  { name: "Kabete Farm", value: 180 },
]

const healthData = [
  { date: "Jan", soil: 65, moisture: 70, sunlight: 80 },
  { date: "Feb", soil: 68, moisture: 72, sunlight: 75 },
  { date: "Mar", soil: 75, moisture: 82, sunlight: 85 },
  { date: "Apr", soil: 80, moisture: 78, sunlight: 90 },
  { date: "May", soil: 85, moisture: 80, sunlight: 88 },
  { date: "Jun", soil: 82, moisture: 75, sunlight: 92 },
]

const expensesData = [
  { category: "Seeds", value: 12000 },
  { category: "Fertilizer", value: 18000 },
  { category: "Labor", value: 25000 },
  { category: "Equipment", value: 15000 },
  { category: "Irrigation", value: 10000 },
  { category: "Transport", value: 8000 },
]

export const revenueData = [
  { month: "Jan", revenue: 45000 },
  { month: "Feb", revenue: 52000 },
  { month: "Mar", revenue: 48000 },
  { month: "Apr", revenue: 61000 },
  { month: "May", revenue: 55000 },
  { month: "Jun", revenue: 67000 },
]

export default function FarmAnalytics() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Farm Analytics</h2>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Farm" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Farms</SelectItem>
            <SelectItem value="waceke">Waceke's Farm</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="yield">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="health">Farm Health</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="yield" className="pt-4">
          <Card>
            <CardHeader className="relative">
              <CardTitle>Crop Yield</CardTitle>
              <CardDescription>Yield comparison across your farms</CardDescription>
              <div className="absolute top-0 right-4">
                  <p className='text-[11px] text-red-400'>Information unavailable</p>
                  <AlertCircle size={20} className='text-red-400 absolute right-0'/>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={yieldData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickMargin={8} />
                  <Tooltip
                    cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                    }}
                  />
                  <Bar dataKey="value" fill="#16a34a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Farm Health Trends</CardTitle>
              <CardDescription>Health metrics over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={healthData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickMargin={8} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="soil"
                    stroke="#16a34a"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="moisture"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="sunlight"
                    stroke="#eab308"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Farm Expenses</CardTitle>
              <CardDescription>Breakdown of expenses by category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={expensesData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="category" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickMargin={8} />
                  <Tooltip
                    cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                    }}
                  />
                  <Bar dataKey="value" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
              <CardDescription>Monthly revenue across all farms</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickMargin={8} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#16a34a"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
