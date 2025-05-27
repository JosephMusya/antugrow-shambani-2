"use client"

import { useState, useEffect } from "react"
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { parseUnits, formatUnits } from "viem"
import { Wallet, TrendingUp, Loader2, CheckCircle, AlertCircle, Sprout, Calendar, Target } from "lucide-react"
import { factoryAbi, tokenAbi } from "../../abis/abis"

// Contract addresses - replace with your deployed contract addresses
const TOKEN_ADDRESS = "0xCeBcf96B5153B7DE009dad99BA4Fc42689376610" // Your FarmToken address
const FACTORY_ADDRESS = "0x22fCf53F2d4416D962cb34c961815fc91330f4c3" // Your FarmFundingFactory address

export function TokenBalance() {
    const { address } = useAccount()
    const [balance, setBalance] = useState("0")
    const [isLoading, setIsLoading] = useState(true)

    const { data: tokenData, isLoading: tokenLoading } = useReadContract({
        address: TOKEN_ADDRESS,
        abi: tokenAbi,
        functionName: "balanceOf",
        args: [address],
        query: {
            enabled: !!address,
        },
    })

    const { data: decimals, isLoading: decimalsLoading } = useReadContract({
        address: TOKEN_ADDRESS,
        abi: tokenAbi,
        functionName: "decimals",
        query: {
            enabled: !!address,
        },
    })

    useEffect(() => {
        if (tokenData && decimals) {
            setBalance(formatUnits(tokenData, decimals))
            setIsLoading(false)
        } else if (!tokenLoading && !decimalsLoading && address) {
            setIsLoading(false)
        }
    }, [tokenData, decimals, tokenLoading, decimalsLoading, address])

    const formatBalance = (balance) => {
        const num = Number.parseFloat(balance)
        if (num === 0) return "0.00"
        if (num < 0.01) return num.toFixed(6)
        if (num < 1) return num.toFixed(4)
        if (num < 1000) return num.toFixed(2)
        if (num < 1000000) return (num / 1000).toFixed(2) + "K"
        return (num / 1000000).toFixed(2) + "M"
    }

    if (!address) return null

    return (
        <div className="w-full">
            <div className="relative overflow-hidden p-6 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 rounded-2xl shadow-xl border border-emerald-200/20 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>

                {/* Content */}
                <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                <Wallet className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-white font-bold text-lg">ANT Balance</h2>
                                <p className="text-emerald-100 text-sm">Antugrow Token</p>
                            </div>
                        </div>

                        {/* Status Indicator */}
                        {isLoading || tokenLoading || decimalsLoading ? (
                            <div className="flex items-center gap-2 text-white/80">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span className="text-sm">Syncing...</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-white/80">
                                <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                                <span className="text-sm">Live</span>
                            </div>
                        )}
                    </div>

                    {/* Balance Display */}
                    <div className="space-y-3">
                        {isLoading || tokenLoading || decimalsLoading ? (
                            <div className="space-y-3">
                                <div className="h-8 bg-white/20 rounded-lg animate-pulse"></div>
                                <div className="h-4 bg-white/10 rounded w-2/3 animate-pulse"></div>
                            </div>
                        ) : (
                            <>
                                {/* Main Balance */}
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl lg:text-4xl font-bold text-white font-mono">{formatBalance(balance)}</span>
                                    <span className="text-lg font-semibold text-emerald-100">ANT</span>
                                </div>

                                {/* Full Balance for large numbers */}
                                {Number.parseFloat(balance) >= 1000 && (
                                    <div className="text-sm text-emerald-100/80 font-mono">
                                        {Number.parseFloat(balance).toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 6,
                                        })}{" "}
                                        ANT
                                    </div>
                                )}
                                <h6 className="text-sm text-emerald-100/80 font-mono">1 ANT = 1 KES</h6>

                                {/* Balance Status */}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export function CreateFundingForm() {
    const [fundingGoal, setFundingGoal] = useState("")
    const [duration, setDuration] = useState("")

    const { writeContract, data: hash, error, isPending } = useWriteContract()
    const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash })

    const handleCreateFunding = () => {
        if (!fundingGoal || !duration) return

        try {
            writeContract({
                address: FACTORY_ADDRESS,
                abi: factoryAbi,
                functionName: "createFundingContract",
                args: [parseUnits(fundingGoal, 18), Number.parseInt(duration)],
            })
        } catch (err) {
            console.error("Error creating funding:", err)
        }
    }

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-200/50 dark:border-slate-700/50 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-slate-800 dark:to-emerald-900/20 p-6 border-b border-emerald-200/50 dark:border-slate-700/50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                            <Sprout className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create Farm Funding Request</h2>
                            <p className="text-slate-600 dark:text-slate-400 mt-1">
                                Submit your agricultural project for community funding
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form Content */}
                <div className="p-6 lg:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Form Fields */}
                        <div className="space-y-6">
                            {/* Funding Goal Field */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    <Target className="w-4 h-4 text-emerald-600" />
                                    Funding Goal (ANT)
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={fundingGoal}
                                        onChange={(e) => setFundingGoal(e.target.value)}
                                        className="w-full px-4 py-4 text-lg rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:focus:ring-emerald-400 dark:focus:border-emerald-400 transition-all duration-200"
                                        placeholder="Enter funding goal (e.g., 1000)"
                                        min="1"
                                        step="0.01"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-600 px-2 py-1 rounded">
                      ANT
                    </span>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Minimum funding goal is 1 ANT</p>
                            </div>

                            {/* Duration Field */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    <Calendar className="w-4 h-4 text-emerald-600" />
                                    Campaign Duration (Days)
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                        className="w-full px-4 py-4 text-lg rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:focus:ring-emerald-400 dark:focus:border-emerald-400 transition-all duration-200"
                                        placeholder="Enter duration in days (e.g., 30)"
                                        min="1"
                                        max="365"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-600 px-2 py-1 rounded">
                      Days
                    </span>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Campaign duration between 1-365 days</p>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <button
                                    onClick={handleCreateFunding}
                                    disabled={isPending || isLoading || !fundingGoal || !duration}
                                    className="w-full px-6 py-4 text-lg font-semibold text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 focus:from-emerald-600 focus:to-green-700 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none"
                                >
                                    {isPending || isLoading ? (
                                        <span className="flex items-center justify-center gap-3">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing Request...
                    </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-3">
                      <Sprout className="w-5 h-5" />
                      Create Funding Request
                    </span>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Info Panel */}
                        <div className="space-y-6">
                            <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-slate-700/50 dark:to-emerald-900/20 rounded-xl p-6 border border-emerald-200/50 dark:border-slate-600/50">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">How it works</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                                            1
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-900 dark:text-white">Submit Request</p>
                                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                                Create your funding campaign with goal and duration
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                                            2
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-900 dark:text-white">Community Funding</p>
                                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                                Investors contribute ANT tokens to your project
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                                            3
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-900 dark:text-white">Receive Funds</p>
                                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                                Access funds when your campaign reaches its goal
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Preview */}
                            {(fundingGoal || duration) && (
                                <div className="bg-white dark:bg-slate-700 rounded-xl p-6 border border-slate-200 dark:border-slate-600 shadow-sm">
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Campaign Preview</h3>
                                    <div className="space-y-3">
                                        {fundingGoal && (
                                            <div className="flex justify-between">
                                                <span className="text-sm text-slate-600 dark:text-slate-400">Goal:</span>
                                                <span className="text-sm font-medium text-slate-900 dark:text-white">
                          {Number.parseFloat(fundingGoal).toLocaleString()} ANT
                        </span>
                                            </div>
                                        )}
                                        {duration && (
                                            <div className="flex justify-between">
                                                <span className="text-sm text-slate-600 dark:text-slate-400">Duration:</span>
                                                <span className="text-sm font-medium text-slate-900 dark:text-white">{duration} days</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Status Messages */}
                    {isSuccess && (
                        <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                                <div>
                  <span className="text-base text-green-800 dark:text-green-200 font-semibold">
                    Funding request created successfully!
                  </span>
                                    <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                                        Your campaign is now live and accepting investments.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                                <div className="min-w-0">
                  <span className="text-base text-red-800 dark:text-red-200 font-semibold block">
                    Error creating funding request
                  </span>
                                    <span className="text-sm text-red-600 dark:text-red-400 break-words">{error.message}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
