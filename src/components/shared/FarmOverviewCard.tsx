import { Card, CardHeader, CardTitle } from '../ui/card'
import { AlertCircle, Lightbulb, Wifi } from 'lucide-react'
import { FaHeart, FaTasks } from 'react-icons/fa'

export default function FarmOverviewCard() {
  return (
    <Card className='relative'>
        <div className="absolute top-5 right-4">
            <p className='text-[11px] text-red-400'>Information unavailable</p>
            <AlertCircle size={20} className='text-red-400 absolute right-0'/>
        </div>
        <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          <Lightbulb className="mr-2 h-4 w-4" />
          Farm Overview
        </CardTitle>
        {/* <div>
            <p>Farm Stage</p>
            <p>Growth Stage</p>
        </div> */}
        <div className='mt-3 mb-3'>
            <p className='flex text-gray-500 text-sm'>
              
                Updated<span className="mx-2 text-gray-400">•</span>7 hours ago</p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-gray-50 rounded-md flex flex-col">
                <FaTasks className="h-4 w-4 mx-auto text-blue-500 mb-1" />
                <p className="text-xs text-gray-500">Activities</p>
                <p className="text-sm font-medium">7</p>
            </div>
            <div className="p-2 bg-gray-50 rounded-md">
                <Wifi className="h-4 w-4 mx-auto text-blue-500 mb-1" />
                <p className="text-xs text-gray-500">IoT Device</p>
                <p className="text-sm font-medium">Offline</p>
            </div>
            <div className="p-2 bg-gray-50 rounded-md">
                <FaHeart className="h-4 w-4 mx-auto text-blue-500 mb-1" />
                <p className="text-xs text-gray-500">Health</p>
                <p className="text-sm font-medium">Good</p>
            </div>
        </div>

      </CardHeader>
    </Card>
  )
}
