import { useState } from "react";
import { ConnectBtn } from "../components/connectButton";
import { useAccount } from "wagmi";
import Sidebar from "@/components/shared/Sidenav"
import { TokenBalance, MintTokenForm, CreateFundingForm, VerifyFarmerForm, RepayForm } from "../components/walletComponents";
import { FundingsList } from "../components/fundingComponents";

export default function Home() {
    const { isConnected } = useAccount()
    const [activeTab, setActiveTab] = useState("fundings")

    const tabs = [
        { id: "fundings", label: "Active Fundings", icon: "📊" },
        { id: "create", label: "Request Funding"},
        // { id: "mint", label: "Mint Tokens", icon: "🪙" },
        // { id: "verify", label: "Verify", icon: "✅" },
        // { id: "repay", label: "Repay" }
    ]

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="sticky top-0 z-10 backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex h-16 items-center justify-between px-6">
                        <div className="flex items-center gap-4">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                Antugrow Funding
                            </h2>
                        </div>
                        <div className="flex items-center gap-4">
                            <ConnectBtn />
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-6 overflow-auto">
                    <div className="mx-auto max-w-7xl">
                        {!isConnected ? (
                            <div className="flex items-center justify-center min-h-[60vh]">
                                <div className="text-center space-y-4">
                                    <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                        <span className="text-2xl">🌾</span>
                                    </div>
                                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                                        Welcome to Antugrow Funding
                                    </h1>
                                    <p className="text-slate-600 dark:text-slate-400 max-w-md">
                                        Connect your wallet to access funding opportunities.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {/* Dashboard Header */}
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                                    <div>
                                        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                                            Dashboard
                                        </h1>
                                        <p className="text-slate-600 dark:text-slate-400 mt-1">
                                            Access sustainable funding

                                        </p>
                                    </div>
                                    <div className="">
                                        <TokenBalance />
                                    </div>
                                </div>

                                {/* Tab Navigation */}
                                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                                    <div className="flex overflow-x-auto border-b border-slate-200 dark:border-slate-700">
                                        {tabs.map((tab) => (
                                            <button
                                                key={tab.id}
                                                className={`flex items-center gap-2 py-4 px-6 whitespace-nowrap font-medium transition-colors relative ${
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
                                    <div className="p-6">
                                        {activeTab === "fundings" && (
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <span className="text-lg">📊</span>
                                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                                        Active Funding Opportunities
                                                    </h3>
                                                </div>
                                                <FundingsList />
                                            </div>
                                        )}
                                        {activeTab === "create" && (
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2 mb-4">

                                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                                        Request Funding
                                                    </h3>
                                                </div>
                                                <CreateFundingForm />
                                            </div>
                                        )}
                                        {/*{activeTab === "mint" && (*/}
                                        {/*    <div className="space-y-4">*/}
                                        {/*        <div className="flex items-center gap-2 mb-4">*/}
                                        {/*            <span className="text-lg">🪙</span>*/}
                                        {/*            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">*/}
                                        {/*                Mint Platform Tokens*/}
                                        {/*            </h3>*/}
                                        {/*        </div>*/}
                                        {/*        <MintTokenForm />*/}
                                        {/*    </div>*/}
                                        {/*)}*/}
                                        {/*{activeTab === "verify" && (*/}
                                        {/*    <div className="space-y-4">*/}
                                        {/*        <div className="flex items-center gap-2 mb-4">*/}
                                        {/*            <span className="text-lg">✅</span>*/}
                                        {/*            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">*/}
                                        {/*                Verify Farmer Status*/}
                                        {/*            </h3>*/}
                                        {/*        </div>*/}
                                        {/*        <VerifyFarmerForm />*/}
                                        {/*    </div>*/}
                                        {/*)}*/}
                                        {/*{activeTab === "repay" && (*/}
                                        {/*    <div className="space-y-4">*/}
                                        {/*        <div className="flex items-center gap-2 mb-4">*/}
                                        {/*            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">*/}
                                        {/*                Repay Funding*/}
                                        {/*            </h3>*/}
                                        {/*        </div>*/}
                                        {/*        <RepayForm />*/}
                                        {/*    </div>*/}
                                        {/*)}*/}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>

                {/* Footer */}
            </div>
        </div>
    )
}