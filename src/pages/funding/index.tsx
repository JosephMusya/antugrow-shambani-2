"use client"

import { useState } from "react"
import { ConnectBtn } from "../components/connectButton"
import { useAccount } from "wagmi"
import Sidebar from "@/components/shared/Sidenav"
import { TokenBalance, CreateFundingForm } from "../components/walletComponents"
import { FundingsList } from "../components/fundingComponents"
import { Sprout, TrendingUp, Users, DollarSign } from "lucide-react"

export default function Home() {
    const { isConnected } = useAccount()
    const [activeTab, setActiveTab] = useState("fundings")

    const tabs = [
        { id: "fundings", label: "Active Fundings", icon: TrendingUp },
        { id: "create", label: "Request Funding", icon: Sprout },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950">
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 md:ml-64">
                {/* Header */}
                <header className="sticky top-0 z-10 backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-emerald-200/50 dark:border-slate-700/50 shadow-sm">
                    <div className="flex h-16 items-center justify-between px-4 sm:px-6">
                        <div className="flex items-center gap-4 min-w-0">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                                    <Sprout className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                                    Antugrow Funding
                                </h2>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 flex-shrink-0">
                            <ConnectBtn />
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="p-4 sm:p-6 lg:p-8">
                    <div className="mx-auto max-w-7xl w-full">
                        {!isConnected ? (
                            <div className="flex items-center justify-center min-h-[70vh] px-4">
                                <div className="text-center space-y-6 max-w-lg w-full">
                                    <div className="relative">
                                        <div className="w-24 h-24 mx-auto bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                                            <Sprout className="w-12 h-12 text-white" />
                                        </div>
                                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-pulse"></div>
                                    </div>
                                    <div className="space-y-3">
                                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">
                                            Welcome to{" "}
                                            <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                        Antugrow
                      </span>
                                        </h1>
                                        <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                                            Empowering sustainable agriculture through decentralized funding. Connect your wallet to access
                                            funding opportunities.
                                        </p>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4">
                                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                            <Users className="w-4 h-4" />
                                            <span>Join 1,200+ farmers</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                            <DollarSign className="w-4 h-4" />
                                            <span>$2.4M+ funded</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {/* Dashboard Header */}
                                <div className="flex flex-col space-y-6 lg:flex-row lg:items-start lg:justify-between lg:space-y-0 lg:gap-8">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                            <span className="text-sm font-medium text-green-600 dark:text-green-400">Connected</span>
                                        </div>
                                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                                            Dashboard
                                        </h1>
                                        <p className="text-slate-600 dark:text-slate-400 text-lg">
                                            Access sustainable funding opportunities and grow your agricultural projects
                                        </p>
                                    </div>
                                    <div className="flex-shrink-0 w-full sm:w-auto lg:w-80">
                                        <TokenBalance />
                                    </div>
                                </div>

                                {/* Tab Navigation */}
                                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-200/50 dark:border-slate-700/50 overflow-hidden">
                                    {/* Mobile Tab Navigation */}
                                    <div className="sm:hidden">
                                        <select
                                            value={activeTab}
                                            onChange={(e) => setActiveTab(e.target.value)}
                                            className="w-full p-4 bg-transparent border-0 border-b border-emerald-200/50 dark:border-slate-700/50 text-slate-900 dark:text-slate-100 focus:ring-0 focus:outline-none"
                                        >
                                            {tabs.map((tab) => (
                                                <option key={tab.id} value={tab.id}>
                                                    {tab.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Desktop Tab Navigation */}
                                    <div className="hidden sm:flex overflow-x-auto border-b border-emerald-200/50 dark:border-slate-700/50 bg-gradient-to-r from-emerald-50/50 to-green-50/50 dark:from-slate-800/50 dark:to-emerald-900/20">
                                        {tabs.map((tab) => {
                                            const Icon = tab.icon
                                            return (
                                                <button
                                                    key={tab.id}
                                                    className={`flex items-center gap-3 py-4 px-6 whitespace-nowrap font-medium transition-all duration-200 relative text-base ${
                                                        activeTab === tab.id
                                                            ? "text-emerald-700 dark:text-emerald-300 bg-white/80 dark:bg-slate-700/80 shadow-sm"
                                                            : "text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-white/40 dark:hover:bg-slate-700/40"
                                                    }`}
                                                    onClick={() => setActiveTab(tab.id)}
                                                >
                                                    <Icon className="w-5 h-5" />
                                                    <span>{tab.label}</span>
                                                    {activeTab === tab.id && (
                                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-t-full" />
                                                    )}
                                                </button>
                                            )
                                        })}
                                    </div>

                                    {/* Tab Content */}
                                    <div className="p-6 lg:p-8">
                                        {activeTab === "fundings" && (
                                            <div className="space-y-6">
                                                <div className="flex items-center gap-3 mb-6">
                                                    <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                                                        Active Funding Opportunities
                                                    </h3>
                                                </div>
                                                <FundingsList />
                                            </div>
                                        )}
                                        {activeTab === "create" && (
                                            <div className="space-y-6">
                                                <div className="flex items-center gap-3 mb-6">
                                                    <Sprout className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Request Funding</h3>
                                                </div>
                                                <div className="max-w-3xl">
                                                    <CreateFundingForm />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}
