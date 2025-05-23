
import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useReadContracts } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import {factoryAbi, tokenAbi, fundingAbi} from "../../abis/abis";

// Contract addresses (replace with your deployed contracts)
const TOKEN_ADDRESS = "0xCeBcf96B5153B7DE009dad99BA4Fc42689376610"; // Your FarmToken address
const FACTORY_ADDRESS = "0x22fCf53F2d4416D962cb34c961815fc91330f4c3"; // Your FarmFundingFactory address

interface FundingContract {
    contractAddress: string;
    farmerAddress: string;
    fundingRequestId: number;
    totalFundingGoal: bigint;
    currentFunding: bigint;
    createdAt: bigint;
    isActive: boolean;
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
    });

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
    });

    const loading = loadingIds || loadingFundings;
    const error = idsError || fundingsError;

    const fundingContracts: FundingContract[] =
        rawFundings?.map((tuple) => ({
            contractAddress: tuple.result[0] as string,
            farmerAddress: tuple.result[1] as string,
            fundingRequestId: Number(tuple.result[2]),
            totalFundingGoal: tuple.result[3] as bigint,
            currentFunding: tuple.result[4] as bigint,
            createdAt: tuple.result[5] as bigint,
            isActive: tuple.result[6] as boolean,
        })) || [];

    // Filter active fundings
    const activeFundings = fundingContracts.filter(f => f.isActive);
    const completedFundings = fundingContracts.filter(f => !f.isActive);

    return (
        <div className="w-full space-y-4 sm:space-y-6">
            {/* Header with stats */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div>
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 dark:text-white">
                        Farm Fundings
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {!loading && (
                            <>
                                {activeFundings.length} active • {completedFundings.length} completed
                            </>
                        )}
                    </p>
                </div>

                {/* Refresh button */}
                <button
                    onClick={() => window.location.reload()}
                    className="self-start sm:self-auto px-3 py-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                    <span className="flex items-center gap-1.5">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                    </span>
                </button>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="space-y-4">
                    <div className="flex items-center justify-center py-8 sm:py-12">
                        <div className="flex flex-col items-center gap-3">
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            </div>
                            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                                Loading funding opportunities...
                            </p>
                        </div>
                    </div>

                    {/* Skeleton cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 sm:p-6 space-y-4 animate-pulse">
                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="text-center py-8 sm:py-12">
                    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
                        <svg className="w-6 h-6 sm:w-8 sm:h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-2">
                        Unable to load fundings
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-4 max-w-md mx-auto">
                        There was an error loading the funding opportunities. Please try again.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && fundingContracts.length === 0 && (
                <div className="text-center py-8 sm:py-12 lg:py-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 dark:bg-slate-800 rounded-full mb-4 sm:mb-6">
                        <svg className="w-8 h-8 sm:w-10 sm:h-10 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mb-2">
                        No funding opportunities yet
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
                        Be the first to create a funding request for your farm project.
                    </p>
                    <button
                        onClick={() => {
                            // This would typically navigate to the create funding tab
                            const createTab = document.querySelector('[data-tab="create"]');
                            createTab?.click();
                        }}
                        className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                        Create Funding Request
                    </button>
                </div>
            )}

            {/* Fundings Grid */}
            {!loading && !error && fundingContracts.length > 0 && (
                <div className="space-y-6 sm:space-y-8">
                    {/* Active Fundings */}
                    {activeFundings.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
                                    Active Fundings ({activeFundings.length})
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                {activeFundings.map((funding) => (
                                    <FundingCard key={funding.fundingRequestId} funding={funding} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Completed Fundings */}
                    {completedFundings.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                                <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
                                    Completed Fundings ({completedFundings.length})
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                {completedFundings.map((funding) => (
                                    <FundingCard key={funding.fundingRequestId} funding={funding} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function FundingCard({ funding }: { funding: FundingContract }) {
    return (
        <div className="bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-all">
            <h3 className="text-xl font-bold text-white mb-2">{funding.fundingRequestId}</h3>

            <div className="mb-4">
                <div className="flex justify-between mb-1">
                    <span className="text-gray-300">Progress:</span>
                    <span className="text-gray-300">
            {formatUnits(funding.currentFunding, 18)} / {formatUnits(funding.totalFundingGoal, 18)} ANT
          </span>
                </div>

                <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{
                            width: `${Math.min(100, Number(funding.currentFunding * BigInt(100) / funding.totalFundingGoal))}%`
                        }}
                    ></div>
                </div>
            </div>

            <div className="flex flex-col space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                    <span className="text-gray-400">Farmer:</span>
                    <span className="text-gray-300">{`${funding.farmerAddress.substring(0, 6)}...${funding.farmerAddress.substring(funding.farmerAddress.length - 4)}`}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Created:</span>
                    <span className="text-gray-300">{new Date(Number(funding.createdAt) * 1000).toLocaleDateString()}</span>
                </div>
            </div>

            {/*<InvestForm fundingAddress={funding.contractAddress} />*/}
            {/*<ReleaseFundsButton fundingId={funding.fundingRequestId} />*/}


        </div>
    );
}

function InvestForm({ fundingAddress }: { fundingAddress: string }) {
    const [amount, setAmount] = useState('');
    const { address } = useAccount();

    const { writeContract, data: approvalHash, error: approvalError, isPending: isApprovePending } = useWriteContract();
    const { isLoading: isApproveLoading, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({ hash: approvalHash });

    const { writeContract: investWrite, data: investHash, error: investError, isPending: isInvestPending } = useWriteContract();
    const { isLoading: isInvestLoading, isSuccess: isInvestSuccess } = useWaitForTransactionReceipt({ hash: investHash });

    const handleInvest = async () => {
        if (!amount || !address) return;

        try {
            // First approve tokens to be spent by the funding contract
            writeContract({
                address: TOKEN_ADDRESS,
                abi: tokenAbi, // Add your token ABI here
                functionName: 'approve',
                args: [fundingAddress, parseUnits(amount, 18)]
            });
        } catch (err) {
            console.error("Error approving tokens:", err);
        }
    };

    useEffect(() => {
        // After approval is successful, send the investment transaction
        if (isApproveSuccess && amount) {
            try {
                investWrite({
                    address: fundingAddress,
                    abi: fundingAbi, // Add your FarmFunding ABI here
                    functionName: 'invest',
                    args: [parseUnits(amount, 18)]
                });
            } catch (err) {
                console.error("Error investing:", err);
            }
        }
    }, [isApproveSuccess, fundingAddress, amount, investWrite]);

    return (
        <div className="mt-2">
            <div className="flex space-x-2">
                <input
                    type="number"
                    placeholder="Amount to invest"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="flex-1 p-2 rounded bg-gray-700 text-white"
                />
                <button
                    onClick={handleInvest}
                    disabled={isApprovePending || isApproveLoading || isInvestPending || isInvestLoading || !amount}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                >
                    {isApprovePending || isApproveLoading ? "Approving..." :
                        isInvestPending || isInvestLoading ? "Investing..." : "Invest"}
                </button>
            </div>

            {isInvestSuccess && (
                <div className="mt-2 text-sm text-green-400">Investment successful!</div>
            )}

            {(approvalError || investError) && (
                <div className="mt-2 text-sm text-red-400">
                    Error: {approvalError?.message || investError?.message}
                </div>
            )}
        </div>
    );
}

export function ReleaseFundsButton({ fundingId }: { fundingId: number }) {
    const {
        writeContract,
        data: txHash,
        error,
        isPending,
    } = useWriteContract();

    const { isLoading, isSuccess } = useWaitForTransactionReceipt({
        hash: txHash,
    });

    const handleReleaseFunds = () => {
        writeContract({
            address: FACTORY_ADDRESS,
            abi: factoryAbi,
            functionName: 'releaseFundsToFarmer',
            args: [fundingId],
        });
    };

    return (
        <div className="mt-4">
            <button
                onClick={handleReleaseFunds}
                disabled={isPending || isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
                {isPending || isLoading ? "Releasing Funds..." : "Release Funds to Farmer"}
            </button>

            {isSuccess && (
                <p className="mt-2 text-green-400 text-sm">
                    Funds released successfully!
                </p>
            )}

            {error && (
                <p className="mt-2 text-red-400 text-sm">
                    Error: {error.message}
                </p>
            )}
        </div>
    );
}
