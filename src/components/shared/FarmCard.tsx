"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

import {
  Card,
  CardContent
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  MoreVertical,
  Droplets,
  Thermometer,
  ChevronRight,
  Search,
  Cloud,
  SearchX
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { useFarmContext } from "@/providers/FarmProvider"
import { farmStages } from "@/utils/farms/farm"
import LoadingSkeleton from "./LoadingSkeleton"

dayjs.extend(relativeTime)

export default function FarmCard() {
  const [searchTerm, setSearchTerm] = useState("")
  const { farms, loadingFarms } = useFarmContext()
  const navigate = useNavigate()

  const filteredFarms = farms.filter((farm) =>
    farm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farm.crop_types.some((crop) =>
      crop.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  if (loadingFarms) return <LoadingSkeleton />

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">My Farms ({farms.length})</h2>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search farms..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {farms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFarms.map((farm) => (
            <Card key={farm?.id} className="overflow-hidden hover:shadow-md transition-shadow pt-0">
              <div className="relative h-32 bg-gray-100">
                <img
                  src="./farm.jpg"
                  alt={farm?.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="bg-white/80 backdrop-blur-sm rounded-full h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Farm Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate(`/farm/${farm?.id}`)}>View Details</DropdownMenuItem>
                      <DropdownMenuItem disabled>Edit Farm</DropdownMenuItem>
                      <DropdownMenuItem disabled>Request Funding</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem disabled className="text-red-600">Delete Farm</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{farm?.name}</h3>
                    <p className="text-sm text-gray-500">Updated {dayjs(farm?.updated_at).fromNow()}</p>
                  </div>
                  <div>
                    {farm?.crop_types.map((type, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200 mr-2"
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="text-sm text-gray-500 mb-3">
                  <span>{farm?.size_acres} Acres</span>
                  <span className="mx-2">•</span>
                  <span>{farm?.location_name}</span>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <div>
                      <span>Crop Stage</span>
                      <span className="mx-2">•</span>
                      <span className="text-gray-500">{farm?.farm_stage?.value}</span>
                      {/* <span className="font-medium text-green-600">
                        {farm?.farm_stage?.stage} of {farmStages.length }
                      </span> */}
                    </div>
                  </div>
                  <Progress
                    value={farm?.farm_stage?.stage / farmStages.length * 100}
                    className="h-2"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="flex flex-col items-center p-2 bg-blue-50 rounded-md">
                    <Droplets className="h-4 w-4 text-blue-600 mb-1" />
                    <span className="text-xs text-gray-600">Humidity</span>
                    <span className="text-sm font-medium">{farm?.weather?.humidity}</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-orange-50 rounded-md">
                    <Thermometer className="h-4 w-4 text-orange-600 mb-1" />
                    <span className="text-xs text-gray-600">Temp</span>
                    <span className="text-sm font-medium">{farm?.weather?.temperature?.toFixed()}°C</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-yellow-50 rounded-md">
                    <Cloud className="h-4 w-4 text-yellow-600 mb-1" />
                    <span className="text-xs text-gray-600">{farm?.weather?.description}</span>
                    <span className="text-sm font-medium">{farm?.weather?.main}</span>
                  </div>
                </div>

                <Button
                  onClick={() => navigate(`./farm/${farm?.id}`)}
                  variant="outline"
                  className="w-full text-green-600 border-green-200 hover:bg-green-50"
                >
                  View Details <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="flex items-center justify-center max-w-[22rem] mx-auto mt-[15dvh]">
          <CardContent className="flex flex-col items-center justify-center text-center space-y-4 py-6">
            <SearchX size={100} className="text-gray-400" />
            <p  className="font-medium">No farms onbaorded</p>
            <p className="text-gray-600 text-[12px] max-w-[16rem]">
              Antugrow Shambani will help you monitor your crop growth
            </p>
            <Button className="bg-green-600 hover:bg-green-700" onClick={()=>navigate('/add-farm')}>Add Farm</Button>
          </CardContent>
        </Card>

      )}
    </div>
  )
}
