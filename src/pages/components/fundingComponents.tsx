"use client"

import { useState, useEffect } from "react"
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useReadContracts } from "wagmi"
import { formatUnits, parseUnits } from "viem"
import {
    Users,
    DollarSign,
    Loader2,
    RefreshCw,
    AlertCircle,
    CheckCircle,
    Calendar,
    Sprout,
    ArrowRight,
} from "lucide-react"
import { factoryAbi, tokenAbi, fundingAbi } from "../../abis/abis"

// Contract addresses (replace with your deployed contracts)
const TOKEN_ADDRESS = "0xCeBcf96B5153B7DE009dad99BA4Fc42689376610" // Your FarmToken address
const FACTORY_ADDRESS = "0x22fCf53F2d4416D962cb34c961815fc91330f4c3" // Your FarmFundingFactory address

interface FundingContract {
    contractAddress: string
    farmerAddress: string
    fundingRequestId: number
    totalFundingGoal: bigint
    currentFunding: bigint
    createdAt: bigint
    isActive: boolean
}

export function FundingsList() {
    // Step 1: Get all funding IDs
    const {
        data: ids,
        isLoading: loadingIds,
        error: idsError,
    } = useReadContract({
        address: FACTORY_ADDRESS,
        abi: factoryAbi,
        functionName: "getAllFundingIds",
    })

    // Step 2: Batch get details for each ID
    const {
        data: rawFundings,
        isLoading: loadingFundings,
        error: fundingsError,
    } = useReadContracts({
        contracts:
            ids?.map((id: bigint) => ({
                address: FACTORY_ADDRESS,
                abi: factoryAbi,
                functionName: "getFundingContractById",
                args: [id],
            })) || [],
    })

    const loading = loadingIds || loadingFundings
    const error = idsError || fundingsError

    const fundingContracts: FundingContract[] =
        rawFundings?.map((tuple) => ({
            contractAddress: tuple.result[0] as string,
            farmerAddress: tuple.result[1] as string,
            fundingRequestId: Number(tuple.result[2]),
            totalFundingGoal: tuple.result[3] as bigint,
            currentFunding: tuple.result[4] as bigint,
            createdAt: tuple.result[5] as bigint,
            isActive: tuple.result[6] as boolean,
        })) || []

    // Filter active fundings
    const ongoingFundings = fundingContracts
        .filter((f) => f.currentFunding < f.totalFundingGoal)
        .sort((a, b) => Number(b.createdAt - a.createdAt))

    const fundedFundings = fundingContracts
        .filter((f) => f.currentFunding >= f.totalFundingGoal)
        .sort((a, b) => Number(b.createdAt - a.createdAt))

    return (
        <div className="w-full space-y-8">
            {/* Header with stats */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">Farm Funding Opportunities</h2>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">
                        {!loading && (
                            <>
                <span className="inline-flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    {ongoingFundings.length} ongoing campaigns
                </span>
                                {fundedFundings.length > 0 && (
                                    <>
                                        <span className="mx-2">•</span>
                                        <span className="inline-flex items-center gap-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                                            {fundedFundings.length} funded projects
                    </span>
                                    </>
                                )}
                            </>
                        )}
                    </p>
                </div>

                {/* Refresh button */}
                <button
                    onClick={() => window.location.reload()}
                    className="self-start sm:self-auto px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 hover:shadow-sm"
                >
          <span className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </span>
                </button>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="space-y-8">
                    <div className="flex items-center justify-center py-16">
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative">
                                <div className="w-12 h-12 border-4 border-emerald-200 dark:border-emerald-800 rounded-full animate-spin border-t-emerald-500"></div>
                                <Sprout className="w-6 h-6 text-emerald-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                            </div>
                            <p className="text-lg text-slate-600 dark:text-slate-400">Loading funding opportunities...</p>
                            <p className="text-sm text-slate-500 dark:text-slate-500">
                                Fetching the latest campaigns from the blockchain
                            </p>
                        </div>
                    </div>

                    {/* Skeleton cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-4 animate-pulse"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                                    <div className="space-y-2 flex-1">
                                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                                    <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="text-center py-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full mb-6">
                        <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                        Unable to load funding opportunities
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
                        There was an error connecting to the blockchain. Please check your connection and try again.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && fundingContracts.length === 0 && (
                <div className="text-center py-20">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/20 dark:to-green-900/20 rounded-2xl mb-6">
                        <Sprout className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">No funding opportunities yet</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto text-lg">
                        Be the first to create a funding request for your agricultural project and start growing with community
                        support.
                    </p>
                    <button
                        onClick={() => {
                            const createTab = document.querySelector('[data-tab="create"]')
                            createTab?.click()
                        }}
                        className="px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
            <span className="flex items-center gap-3">
              <Sprout className="w-5 h-5" />
              Create Funding Request
              <ArrowRight className="w-5 h-5" />
            </span>
                    </button>
                </div>
            )}

            {/* Fundings Grid */}
            {!loading && !error && fundingContracts.length > 0 && (
                <div className="space-y-10">
                    {/* Active Fundings */}
                    {ongoingFundings.length > 0 && (
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                    Ongoing Campaigns ({ongoingFundings.length})
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {ongoingFundings.map((funding) => (
                                    <FundingCard key={funding.fundingRequestId} funding={funding} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Completed Fundings */}
                    {fundedFundings.length > 0 && (
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                    Funded Projects ({fundedFundings.length})
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {fundedFundings.map((funding) => (
                                    <FundingCard key={funding.fundingRequestId} funding={funding} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

function FundingCard({ funding }: { funding: FundingContract }) {
    const { address } = useAccount()
    const progressPercentage = Math.min(100, Number((funding.currentFunding * BigInt(100)) / funding.totalFundingGoal))
    const isFunded = funding.currentFunding >= funding.totalFundingGoal
    const isCompleted = !funding.isActive
    const currentAmount = formatUnits(funding.currentFunding, 18)
    const goalAmount = formatUnits(funding.totalFundingGoal, 18)
    const isFarmer = address === funding.farmerAddress

    return (
        <div className="group bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
            {/* Header */}
            <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                isCompleted || isFunded
                                    ? "bg-slate-100 dark:bg-slate-700"
                                    : "bg-gradient-to-r from-emerald-500 to-green-600"
                            }`}
                        >
                            <Sprout className={`w-6 h-6 ${isCompleted || isFunded ? "text-slate-500" : "text-white"}`} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Campaign #{funding.fundingRequestId}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Farm Project</p>
                        </div>
                    </div>

                    <div
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                            isCompleted || isFunded
                                ? "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                                : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        }`}
                    >
                        {isFunded ? "Funded" : isCompleted ? "Completed" : "Active"}
                    </div>
                </div>

                {/* Progress Section */}
                <div className="space-y-3">
                    <div className="flex justify-between items-baseline">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Funding Progress</span>
                        <span className="text-lg font-bold text-slate-900 dark:text-white">
              {isFunded ? "100" : progressPercentage.toFixed(1)}%
            </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${
                                isCompleted || isFunded ? "bg-slate-400" : "bg-gradient-to-r from-emerald-500 to-green-600"
                            }`}
                            style={{ width: `${isFunded ? "100%" : progressPercentage}%` }}
                        ></div>
                    </div>

                    {/* Amount Display */}
                    <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {Number.parseFloat(currentAmount).toLocaleString()} ANT raised
            </span>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
              Goal: {Number.parseFloat(goalAmount).toLocaleString()} ANT
            </span>
                    </div>
                </div>
            </div>

            {/* Details Section */}
            <div className="px-6 pb-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                            <Users className="w-4 h-4" />
                            <span className="text-xs font-medium">Farmer</span>
                        </div>
                        <p className="text-sm font-mono text-slate-900 dark:text-white">
                            {`${funding.farmerAddress.substring(0, 6)}...${funding.farmerAddress.substring(funding.farmerAddress.length - 4)}`}
                        </p>
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                            <Calendar className="w-4 h-4" />
                            <span className="text-xs font-medium">Created</span>
                        </div>
                        <p className="text-sm text-slate-900 dark:text-white">
                            {new Date(Number(funding.createdAt) * 1000).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    {!isCompleted && !isFunded && !isFarmer && (
                        <InvestForm fundingAddress={funding.contractAddress} farmerAddress={funding.farmerAddress} />
                    )}

                    {isFarmer && !isCompleted && !isFunded && (
                        <div className="flex items-center justify-center py-3 text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                            This is your project
                        </div>
                    )}

                    {isFunded && (
                        <div className="flex items-center justify-center py-3 text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                            Loan in progress
                        </div>
                    )}

                    {isCompleted && (
                        <div className="flex items-center justify-center py-3 text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Campaign Completed
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function InvestForm({ fundingAddress, farmerAddress }: { fundingAddress: string; farmerAddress: string }) {
    const [amount, setAmount] = useState("")
    const [isExpanded, setIsExpanded] = useState(false)
    const { address } = useAccount()

    const { writeContract, data: approvalHash, error: approvalError, isPending: isApprovePending } = useWriteContract()
    const { isLoading: isApproveLoading, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({
        hash: approvalHash,
    })

    const {
        writeContract: investWrite,
        data: investHash,
        error: investError,
        isPending: isInvestPending,
    } = useWriteContract()
    const { isLoading: isInvestLoading, isSuccess: isInvestSuccess } = useWaitForTransactionReceipt({ hash: investHash })

    const handleInvest = async () => {
        if (!amount || !address) return

        try {
            writeContract({
                address: TOKEN_ADDRESS,
                abi: tokenAbi,
                functionName: "approve",
                args: [fundingAddress, parseUnits(amount, 18)],
            })
        } catch (err) {
            console.error("Error approving tokens:", err)
        }
    }

    useEffect(() => {
        if (isApproveSuccess && amount) {
            try {
                investWrite({
                    address: fundingAddress,
                    abi: fundingAbi,
                    functionName: "invest",
                    args: [parseUnits(amount, 18)],
                })
            } catch (err) {
                console.error("Error investing:", err)
            }
        }
    }, [isApproveSuccess, fundingAddress, amount, investWrite])

    if (address === farmerAddress) {
        return (
            <div className="flex items-center justify-center py-3 text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                You cannot invest in your own project
            </div>
        )
    }

    if (!isExpanded) {
        return (
            <button
                onClick={() => setIsExpanded(true)}
                className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
            >
        <span className="flex items-center justify-center gap-2">
          <DollarSign className="w-4 h-4" />
          Invest in this Project
        </span>
            </button>
        )
    }

    return (
        <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Investment Amount</h4>
                <button
                    onClick={() => setIsExpanded(false)}
                    className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                    Cancel
                </button>
            </div>

            <div className="space-y-3">
                <div className="relative">
                    <input
                        type="number"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 dark:text-slate-400">
            ANT
          </span>
                </div>

                <button
                    onClick={handleInvest}
                    disabled={isApprovePending || isApproveLoading || isInvestPending || isInvestLoading || !amount}
                    className="w-full py-2 px-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-medium rounded-lg transition-all duration-200 disabled:cursor-not-allowed text-sm"
                >
                    {isApprovePending || isApproveLoading ? (
                        <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Approving...
            </span>
                    ) : isInvestPending || isInvestLoading ? (
                        <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Investing...
            </span>
                    ) : (
                        "Confirm Investment"
                    )}
                </button>
            </div>

            {isInvestSuccess && (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    Investment successful!
                </div>
            )}

            {(approvalError || investError) && (
                <div className="flex items-start gap-2 text-red-600 dark:text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span className="break-words">{approvalError?.message || investError?.message}</span>
                </div>
            )}
        </div>
    )
}

export function ReleaseFundsButton({ fundingId }: { fundingId: number }) {
    const { writeContract, data: txHash, error, isPending } = useWriteContract()

    const { isLoading, isSuccess } = useWaitForTransactionReceipt({
        hash: txHash,
    })

    const handleReleaseFunds = () => {
        writeContract({
            address: FACTORY_ADDRESS,
            abi: factoryAbi,
            functionName: "releaseFundsToFarmer",
            args: [fundingId],
        })
    }

    return (
        <div className="space-y-3">
            <button
                onClick={handleReleaseFunds}
                disabled={isPending || isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold rounded-lg transition-all duration-200 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
                {isPending || isLoading ? (
                    <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Releasing Funds...
          </span>
                ) : (
                    <span className="flex items-center justify-center gap-2">
            <DollarSign className="w-5 h-5" />
            Release Funds to Farmer
          </span>
                )}
            </button>

            {isSuccess && (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    Funds released successfully!
                </div>
            )}

            {error && (
                <div className="flex items-start gap-2 text-red-600 dark:text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span className="break-words">Error: {error.message}</span>
                </div>
            )}
        </div>
    )
}
