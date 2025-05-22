"use client"

import {
  LogOut,
  Menu,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"
// import { useToast } from "@/components/ui/use-toast"
import supabase from "@/config/supabase/supabase"
import { AvatarImage } from "@radix-ui/react-avatar"
import { Avatar } from "../ui/avatar"
import {Link}  from "react-router-dom";
import { navItems } from "@/utils/navigation/routes"
import { useUserContext } from "@/providers/UserAuthProvider"

export default function Sidebar() {
  const {authUser, loadingUser, farmerProfile} = useUserContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)


  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error("Error logging out:", error)

    }
  }

  return (
      <>
        {/* Mobile menu button */}
        <div className="fixed top-4 left-4 z-50 md:hidden">
          <Button
              variant="outline"
              size="icon"
              className="bg-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Sidebar */}
        <aside
            className={cn(
                "fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 text-white transform transition-transform duration-200 ease-in-out md:translate-x-0",
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
            )}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center gap-2 px-4 py-6 border-b border-gray-800">
                <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Antugrow Logo" width={40} height={40} />
                </Avatar>
              <div>
                <h1 className="text-xl font-bold">Antugrow</h1>
                <p className="text-xs text-gray-400">Shambani</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href
                // const isActive = false;
                return (
                    <Link
                        key={item.name}
                        to={item.href}
                        className={cn(
                            "flex items-center px-4 py-3 text-sm rounded-md transition-colors",
                            isActive ? "bg-green-700 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white",
                        )}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                )
              })}
            </nav>

            {/* User profile */}
            <div className="p-4 border-t border-gray-800">
              {loadingUser ? (
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-700 animate-pulse"></div>
                    <div className="ml-3 space-y-2">
                      <div className="h-4 w-24 bg-gray-700 rounded animate-pulse"></div>
                      <div className="h-3 w-32 bg-gray-700 rounded animate-pulse"></div>
                    </div>
                  </div>
              ) : authUser ? (
                  <Link to={"/user-profile"} className="flex items-center">
                    <div className="flex-shrink-0">
                        <Avatar>
                            <AvatarImage
                                className="h-10 w-10 rounded-full bg-gray-700"
                                src={
                                    `/placeholder.svg?height=40&width=40&text=${authUser.email?.charAt(0).toUpperCase() || "U"}`
                                }
                                alt="User avatar"
                                width={40}
                                height={40}
                            />
                        </Avatar>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">
                        {farmerProfile?.full_name ?? authUser.email?.split("@")[0]}
                      </p>
                      <p className="text-xs text-gray-400">{authUser.email}</p>
                    </div>
                  </Link>
              ) : (
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Avatar>
                        <AvatarImage
                          className="h-10 w-10 rounded-full bg-gray-700"
                          src="/placeholder.svg?height=40&width=40&text=?"
                          alt="User avatar"
                          width={40}
                          height={40}
                      />
                      </Avatar>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">Not logged in</p>
                      <Link to="/login" className="text-xs text-gray-400 hover:text-white">
                        Sign in
                      </Link>
                    </div>
                  </div>
              )}
              <Button
                  variant="ghost"
                  className="w-full mt-4 text-gray-300 hover:bg-gray-800 hover:text-white justify-start"
                  onClick={handleLogout}
                  disabled={!authUser}
              >
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </Button>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isMobileMenuOpen && (
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
            />
        )}
      </>
  )
}
