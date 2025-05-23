import { useState } from "react";
import { ConnectBtn } from "../components/connectButton";
import { useAccount } from "wagmi";
import Sidebar from "@/components/shared/Sidenav"
import { TokenBalance, CreateFundingForm } from "../components/walletComponents";
import { FundingsList } from "../components/fundingComponents";

export default function Home() {
    const { isConnected } = useAccount()
    const [activeTab, setActiveTab] = useState("fundings")

    const tabs = [
        { id: "fundings", label: "Active Fundings", icon: "📊" },
        { id: "create", label: "Request Funding"},
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 p-6 md:ml-64">
                {/* Header */}
                <header className="sticky top-0 z-10 backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex h-16 items-center justify-between px-4 sm:px-6">
                        <div className="flex items-center gap-4 min-w-0">
                            <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 truncate">
                                Antugrow Funding
                            </h2>
                        </div>
                        <div className="flex items-center gap-4 flex-shrink-0">
                            <ConnectBtn />
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-4 sm:p-6 overflow-auto">
                    <div className="mx-auto max-w-7xl w-full">
                        {!isConnected ? (
                            <div className="flex items-center justify-center min-h-[60vh] px-4">
                                <div className="text-center space-y-4 max-w-md w-full">
                                    <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                        <span className="text-2xl">🌾</span>
                                    </div>
                                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
                                        Welcome to Antugrow Funding
                                    </h1>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                                        Connect your wallet to access funding opportunities.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6 sm:space-y-8">
                                {/* Dashboard Header */}
                                <div className="flex flex-col space-y-4 sm:space-y-6 lg:flex-row lg:items-start lg:justify-between lg:space-y-0 lg:gap-6">
                                    <div className="min-w-0 flex-1">
                                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
                                            Dashboard
                                        </h1>
                                        <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm sm:text-base">
                                            Access sustainable funding
                                        </p>
                                    </div>
                                    <div className="flex-shrink-0 w-full sm:w-auto">
                                        <TokenBalance />
                                    </div>
                                </div>

                                {/* Tab Navigation */}
                                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                                    {/* Mobile Tab Navigation */}
                                    <div className="sm:hidden">
                                        <select
                                            value={activeTab}
                                            onChange={(e) => setActiveTab(e.target.value)}
                                            className="w-full p-4 bg-transparent border-0 border-b border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-0 focus:outline-none"
                                        >
                                            {tabs.map((tab) => (
                                                <option key={tab.id} value={tab.id}>
                                                    {tab.icon} {tab.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Desktop Tab Navigation */}
                                    <div className="hidden sm:flex overflow-x-auto border-b border-slate-200 dark:border-slate-700">
                                        {tabs.map((tab) => (
                                            <button
                                                key={tab.id}
                                                className={`flex items-center gap-2 py-4 px-4 md:px-6 whitespace-nowrap font-medium transition-colors relative text-sm md:text-base ${
                                                    activeTab === tab.id
                                                        ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50"
                                                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                                                }`}
                                                onClick={() => setActiveTab(tab.id)}
                                            >
                                                <span className="text-sm">{tab.icon}</span>
                                                <span>{tab.label}</span>
                                                {activeTab === tab.id && (
                                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
                                                )}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Tab Content */}
                                    <div className="p-4 sm:p-6">
                                        {activeTab === "fundings" && (
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <span className="text-lg">📊</span>
                                                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100">
                                                        Active Funding Opportunities
                                                    </h3>
                                                </div>
                                                <div className="overflow-x-auto">
                                                    <FundingsList />
                                                </div>
                                            </div>
                                        )}
                                        {activeTab === "create" && (
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100">
                                                        Request Funding
                                                    </h3>
                                                </div>
                                                <div className="max-w-2xl">
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