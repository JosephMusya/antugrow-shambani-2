"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import FarmCard from "@/components/shared/FarmCard"
import Sidebar from "@/components/shared/Sidenav"
import { useUserContext } from "@/providers/UserAuthProvider"
import { useNavigate } from "react-router-dom"

export default function FarmerDashboard() {
  const { authUser, farmerProfile} = useUserContext();
  const navigate = useNavigate();

 // Get user's first name for welcome message
  const firstName = farmerProfile?.full_name ?? authUser?.email?.split("@")[0]

  return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar/>
        <div className="flex-1 p-6 md:ml-64 ">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Welcome, {firstName}</h1>
                <p className="text-gray-500">Manage your farms and monitor their performance</p>
              </div>
              <Button onClick={() => navigate('/add-farm')} className="bg-green-600 hover:bg-green-700">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Farm
              </Button>
            </div>
            <FarmCard/>
          </div>
        </div>
      </div>
  )
}
