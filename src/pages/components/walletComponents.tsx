
import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import {factoryAbi, tokenAbi} from "../../abis/abis";
// Contract addresses - replace with your deployed contract addresses
const TOKEN_ADDRESS = "0xCeBcf96B5153B7DE009dad99BA4Fc42689376610"; // Your FarmToken address
const FACTORY_ADDRESS = "0x22fCf53F2d4416D962cb34c961815fc91330f4c3"; // Your FarmFundingFactory address

export function TokenBalance() {
    const { address } = useAccount();
    const [balance, setBalance] = useState('0');
    const [isLoading, setIsLoading] = useState(true);

    const { data: tokenData, isLoading: tokenLoading } = useReadContract({
        address: TOKEN_ADDRESS,
        abi: tokenAbi, // Add your token ABI here
        functionName: 'balanceOf',
        args: [address],
        query: {
            enabled: !!address,
        }
    });

    const { data: decimals, isLoading: decimalsLoading } = useReadContract({
        address: TOKEN_ADDRESS,
        abi: tokenAbi, // Add your token ABI here
        functionName: 'decimals',
        query: {
            enabled: !!address,
        }
    });

    useEffect(() => {
        if (tokenData && decimals) {
            setBalance(formatUnits(tokenData, decimals));
            setIsLoading(false);
        } else if (!tokenLoading && !decimalsLoading && address) {
            setIsLoading(false);
        }
    }, [tokenData, decimals, tokenLoading, decimalsLoading, address]);

    // Format balance for better readability
    const formatBalance = (balance) => {
        const num = parseFloat(balance);
        if (num === 0) return '0.00';
        if (num < 0.01) return num.toFixed(6);
        if (num < 1) return num.toFixed(4);
        if (num < 1000) return num.toFixed(2);
        if (num < 1000000) return (num / 1000).toFixed(2) + 'K';
        return (num / 1000000).toFixed(2) + 'M';
    };

    if (!address) return null;

    return (
        <div className="w-full">
            <div className="p-3 sm:p-4 lg:p-5 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 transition-all duration-200 hover:shadow-md">
                {/* Header */}
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs sm:text-sm font-bold">₳</span>
                        </div>
                        <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-slate-900 dark:text-white">
                            ANT Balance
                        </h2>
                    </div>

                    {/* Refresh indicator */}
                    {(isLoading || tokenLoading || decimalsLoading) && (
                        <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                            <svg className="animate-spin h-3 w-3 sm:h-4 sm:w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="text-xs">Loading...</span>
                        </div>
                    )}
                </div>

                {/* Balance Display */}
                <div className="space-y-1">
                    {isLoading || tokenLoading || decimalsLoading ? (
                        <div className="space-y-2">
                            <div className="h-6 sm:h-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                            <div className="h-3 sm:h-4 bg-slate-100 dark:bg-slate-600 rounded animate-pulse w-2/3"></div>
                        </div>
                    ) : (
                        <>
                            {/* Main Balance */}
                            <div className="flex items-baseline gap-1 sm:gap-2">
                                <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                                    {formatBalance(balance)}
                                </span>
                                <span className="text-sm sm:text-base lg:text-lg font-semibold text-slate-600 dark:text-slate-300">
                                    ANT
                                </span>
                            </div>

                            {/* Full Balance (for large numbers) */}
                            {parseFloat(balance) >= 1000 && (
                                <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-mono">
                                    {parseFloat(balance).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 6
                                    })} ANT
                                </div>
                            )}

                            {/* Balance Status */}
                            <div className="flex items-center gap-1 pt-1">
                                <div className={`w-2 h-2 rounded-full ${
                                    parseFloat(balance) > 0
                                        ? 'bg-green-500'
                                        : 'bg-slate-400'
                                }`}></div>
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                    {parseFloat(balance) > 0 ? 'Active' : 'No balance'}
                                </span>
                            </div>
                        </>
                    )}
                </div>


            </div>
        </div>
    );
}
export function MintTokenForm() {
    const [amount, setAmount] = useState('');
    const [recipient, setRecipient] = useState('');

    const { writeContract, data: hash, error, isPending } = useWriteContract();
    const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

    const handleMint = () => {
        if (!amount || !recipient) return;

        try {
            writeContract({
                address: TOKEN_ADDRESS,
                abi: tokenAbi, // Add your token ABI here
                functionName: 'mint',
                args: [recipient, parseUnits(amount, 18)]
            });
        } catch (err) {
            console.error("Error minting tokens:", err);
        }
    };

    return (
        <div className="p-4 bg-gray-800 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-bold text-white mb-4">Mint ANT Tokens</h2>

            <div className="mb-4">
                <label className="block text-gray-300 mb-2">Recipient Address:</label>
                <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 text-white"
                    placeholder="0x..."
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-300 mb-2">Amount:</label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 text-white"
                    placeholder="100"
                />
            </div>

            <button
                onClick={handleMint}
                disabled={isPending || isLoading || !amount || !recipient}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
                {isPending || isLoading ? "Processing..." : "Mint Tokens"}
            </button>

            {isSuccess && (
                <div className="mt-2 text-green-400">Tokens minted successfully!</div>
            )}

            {error && (
                <div className="mt-2 text-red-400">Error: {error.message}</div>
            )}
        </div>
    );
}

export function CreateFundingForm() {
    const [fundingGoal, setFundingGoal] = useState('');
    const [duration, setDuration] = useState('');

    const { writeContract, data: hash, error, isPending } = useWriteContract();
    const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

    const handleCreateFunding = () => {
        if (!fundingGoal || !duration) return;

        try {
            writeContract({
                address: FACTORY_ADDRESS,
                abi: factoryAbi, // Add your factory ABI here
                functionName: 'createFundingContract',
                args: [parseUnits(fundingGoal, 18), parseInt(duration)]
            });
        } catch (err) {
            console.error("Error creating funding:", err);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="p-4 sm:p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">
                    Create Farm Funding
                </h2>

                <div className="space-y-4 sm:space-y-6">
                    {/* Funding Goal Field */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Funding Goal (ANT):
                        </label>
                        <input
                            type="number"
                            value={fundingGoal}
                            onChange={(e) => setFundingGoal(e.target.value)}
                            className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors"
                            placeholder="Enter funding goal (e.g., 1000)"
                            min="1"
                            step="0.01"
                        />
                    </div>

                    {/* Duration Field */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Duration (Days):
                        </label>
                        <input
                            type="number"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors"
                            placeholder="Enter duration in days (e.g., 30)"
                            min="1"
                            max="365"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                        <button
                            onClick={handleCreateFunding}
                            disabled={isPending || isLoading || !fundingGoal || !duration}
                            className="w-full sm:w-auto px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
                        >
                            {isPending || isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : (
                                "Create Funding"
                            )}
                        </button>
                    </div>

                    {/* Status Messages */}
                    {isSuccess && (
                        <div className="p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                            <div className="flex items-center gap-2">
                                <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-sm sm:text-base text-green-800 dark:text-green-200 font-medium">
                                    Funding created successfully!
                                </span>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <div className="flex items-start gap-2">
                                <svg className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <div className="min-w-0">
                                    <span className="text-sm sm:text-base text-red-800 dark:text-red-200 font-medium block">
                                        Error creating funding
                                    </span>
                                    <span className="text-xs sm:text-sm text-red-600 dark:text-red-400 break-words">
                                        {error.message}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
export function VerifyFarmerForm() {
    const [farmerAddress, setFarmerAddress] = useState('');


    const { writeContract, data: hash, error, isPending } = useWriteContract();
    const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

    const handleVerifyFarmer = () => {
        if (!farmerAddress) return;

        try {
            writeContract({
                address: FACTORY_ADDRESS,
                abi: factoryAbi, // Add your factory ABI here
                functionName: 'verifyFarmer',
                args: [farmerAddress]
            });
        } catch (err) {
            console.error("Error verifying farmer:", err);
        }
    };

    return (
        <div className="p-4 bg-gray-800 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-bold text-white mb-4">Verify Farmer</h2>
            <div className="mb-4">
                <label className="block text-gray-300 mb-2">Farmer Address:</label>
                <input
                    type="string"
                    value={farmerAddress}
                    onChange={(e) => setFarmerAddress(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 text-white"
                    placeholder="0x..."
                />
            </div>



            <button
                onClick={handleVerifyFarmer}
                disabled={!farmerAddress || isPending || isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
                {isPending || isLoading ? "Processing..." : "Verify Farmer"}
            </button>

            {isSuccess && (
                <div className="mt-2 text-green-400">Farmer verified successfully!</div>
            )}

            {error && (
                <div className="mt-2 text-red-400">Error: {error.message}</div>
            )}
        </div>
    );
}

export function RepayForm() {
    const [farmerAddress, setFarmerAddress] = useState('');


    const { writeContract, data: hash, error, isPending } = useWriteContract();
    const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

    const handleVerifyFarmer = () => {
        if (!farmerAddress) return;

        try {
            writeContract({
                address: FACTORY_ADDRESS,
                abi: factoryAbi, // Add your factory ABI here
                functionName: 'verifyFarmer',
                args: [farmerAddress]
            });
        } catch (err) {
            console.error("Error verifying farmer:", err);
        }
    };

    return (
        <div className="p-4 bg-gray-800 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-bold text-white mb-4">Verify Farmer</h2>
            <div className="mb-4">
                <label className="block text-gray-300 mb-2">Farmer Address:</label>
                <input
                    type="string"
                    value={farmerAddress}
                    onChange={(e) => setFarmerAddress(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 text-white"
                    placeholder="0x..."
                />
            </div>



            <button
                onClick={handleVerifyFarmer}
                disabled={!farmerAddress || isPending || isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
                {isPending || isLoading ? "Processing..." : "Verify Farmer"}
            </button>

            {isSuccess && (
                <div className="mt-2 text-green-400">Farmer verified successfully!</div>
            )}

            {error && (
                <div className="mt-2 text-red-400">Error: {error.message}</div>
            )}
        </div>
    );
}