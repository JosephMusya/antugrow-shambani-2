"use client";

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import {factoryAbi, fundingAbi, tokenAbi} from "@/lib/abis";
import {emojiAvatarForAddress} from "@/lib/emojiAvatarForAddress";
// Contract addresses (replace with your deployed contracts)
const FACTORY_ADDRESS = "0x3Dbd1716cA3b4c7C7B46AEc0431aca4aB7B41F6E"; // Your FarmFundingFactory address

interface FarmFundingDetails {
    contractAddress: string;
    fundingRequestId: string;
    fundingGoal: bigint;
    currentFunding: bigint;
    deadline: bigint;
    state: number; // 0=Active, 1=Funded, 2=Repaid, 3=Completed, 4=Cancelled
    harvestValue: bigint;
    harvestDate: bigint;
    repaymentDeadline: bigint;
}

export function FarmerDashboard() {
    const { address } = useAccount();
    const [farmFundings, setFarmFundings] = useState<FarmFundingDetails[]>([]);
    const [isVerifiedFarmer, setIsVerifiedFarmer] = useState(false);
    const [loading, setLoading] = useState(true);

    // Check if connected wallet is a verified farmer
    const { data: verifiedStatus } = useReadContract({
        address: FACTORY_ADDRESS,
        abi: factoryAbi, // Add your factory ABI here
        functionName: 'verifiedFarmers',
        args: [address],
        query: {
            enabled: !!address,
        }
    });

    useEffect(() => {
        if (verifiedStatus !== undefined) {
            setIsVerifiedFarmer(verifiedStatus as boolean);
        }
    }, [verifiedStatus]);

    // This is a mock implementation since we'd need to get the list of funding contracts for this farmer
    useEffect(() => {
        const fetchFarmerFundings = async () => {
            if (!isVerifiedFarmer || !address) {
                setLoading(false);
                return;
            }

            try {
                // In a real implementation, you would fetch the farmer's fundings from events or an indexer
                // This is mock data for demonstration
                const mockFundings: FarmFundingDetails[] = [
                    {
                        contractAddress: "0x123...",
                        fundingRequestId: "organic-farm-2025",
                        fundingGoal: BigInt("1000000000000000000000"), // 1000 tokens
                        currentFunding: BigInt("500000000000000000000"), // 500 tokens
                        deadline: BigInt(Math.floor(Date.now() / 1000) + 1209600), // 14 days from now
                        state: 1, // Funded
                        harvestValue: BigInt(0),
                        harvestDate: BigInt(0),
                        repaymentDeadline: BigInt(0)
                    },
                    {
                        contractAddress: "0x456...",
                        fundingRequestId: "sustainable-agriculture-project",
                        fundingGoal: BigInt("2000000000000000000000"), // 2000 tokens
                        currentFunding: BigInt("2000000000000000000000"), // 2000 tokens (fully funded)
                        deadline: BigInt(Math.floor(Date.now() / 1000) - 86400), // 1 day ago
                        state: 1, // Funded
                        harvestValue: BigInt(0),
                        harvestDate: BigInt(0),
                        repaymentDeadline: BigInt(0)
                    }
                ];

                setFarmFundings(mockFundings);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching farmer fundings:", error);
                setLoading(false);
            }
        };

        fetchFarmerFundings();
    }, [isVerifiedFarmer, address]);

    if (!address) {
        return (
            <div className="p-6 bg-gray-800 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-white mb-4">Farmer Dashboard</h2>
                <p className="text-gray-400">Please connect your wallet to view your farm fundings.</p>
            </div>
        );
    }

    if (!isVerifiedFarmer) {
        return (
            <div className="p-6 bg-gray-800 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-white mb-4">Farmer Dashboard</h2>
                <p className="text-gray-400">Your address is not registered as a verified farmer.</p>
                <p className="text-gray-400 mt-2">Please contact the platform administrator to get verified.</p>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-white mb-4">Farmer Dashboard</h2>

            {loading ? (
                <p className="text-gray-400">Loading your farm fundings...</p>
            ) : farmFundings.length === 0 ? (
                <p className="text-gray-400">You haven't created any farm fundings yet.</p>
            ) : (
                <div className="space-y-6">
                    {farmFundings.map((funding) => (
                        <FarmerFundingCard key={funding.contractAddress} funding={funding} />
                    ))}
                </div>
            )}
        </div>
    );
}

function FarmerFundingCard({ funding }: { funding: FarmFundingDetails }) {
    const { writeContract: reportHarvest, data: reportHash, isPending: isReportPending } = useWriteContract();
    const { isLoading: isReportLoading, isSuccess: isReportSuccess } = useWaitForTransactionReceipt({ hash: reportHash });

    const { writeContract: makeRepayment, data: repayHash, isPending: isRepayPending } = useWriteContract();
    const { isLoading: isRepayLoading, isSuccess: isRepaySuccess } = useWaitForTransactionReceipt({ hash: repayHash });

    const [harvestValue, setHarvestValue] = useState('');
    const [repaymentDays, setRepaymentDays] = useState('30');
    const [repaymentAmount, setRepaymentAmount] = useState('');

    const handleReportHarvest = () => {
        if (!harvestValue || !repaymentDays) return;

        reportHarvest({
            address: funding.contractAddress,
            abi: fundingAbi, // Add your FarmFunding ABI here
            functionName: 'reportHarvest',
            args: [parseUnits(harvestValue, 18), parseInt(repaymentDays)]
        });
    };

    const handleMakeRepayment = () => {
        if (!repaymentAmount) return;

        makeRepayment({
            address: funding.contractAddress,
            abi: fundingAbi, // Add your FarmFunding ABI here
            functionName: 'makeRepayment',
            args: [parseUnits(repaymentAmount, 18)]
        });
    };

    // Format state as a string
    const getStateString = (state: number) => {
        const states = ["Active", "Funded", "Repaid", "Completed", "Cancelled"];
        return states[state] || "Unknown";
    };

    return (
        <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-2">{funding.fundingRequestId}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <p className="text-gray-300 text-sm mb-1">Status: <span className="font-semibold">{getStateString(funding.state)}</span></p>
                    <p className="text-gray-300 text-sm mb-1">
                        Funding: <span className="font-semibold">{formatUnits(funding.currentFunding, 18)} / {formatUnits(funding.fundingGoal, 18)} ANT</span>
                    </p>
                    <p className="text-gray-300 text-sm mb-1">
                        Deadline: <span className="font-semibold">{new Date(Number(funding.deadline) * 1000).toLocaleDateString()}</span>
                    </p>
                </div>

                <div>
                    {funding.harvestValue > BigInt(0) && (
                        <>
                            <p className="text-gray-300 text-sm mb-1">
                                Harvest Value: <span className="font-semibold">{formatUnits(funding.harvestValue, 18)} ANT</span>
                            </p>
                            <p className="text-gray-300 text-sm mb-1">
                                Harvest Date: <span className="font-semibold">{new Date(Number(funding.harvestDate) * 1000).toLocaleDateString()}</span>
                            </p>
                            <p className="text-gray-300 text-sm mb-1">
                                Repayment Deadline: <span className="font-semibold">{new Date(Number(funding.repaymentDeadline) * 1000).toLocaleDateString()}</span>
                            </p>
                        </>
                    )}
                </div>
            </div>

            {/* Action Section */}
            <div className="mt-4">
                {funding.state === 1 && funding.harvestValue === BigInt(0) && (
                    <div className="bg-gray-800 p-3 rounded-md mb-4">
                        <h4 className="text-md font-medium text-white mb-2">Report Harvest</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                            <input
                                type="number"
                                placeholder="Harvest Value (ANT)"
                                value={harvestValue}
                                onChange={(e) => setHarvestValue(e.target.value)}
                                className="p-2 rounded bg-gray-700 text-white"
                            />
                            <input
                                type="number"
                                placeholder="Repayment Period (Days)"
                                value={repaymentDays}
                                onChange={(e) => setRepaymentDays(e.target.value)}
                                className="p-2 rounded bg-gray-700 text-white"
                            />
                        </div>
                        <button
                            onClick={handleReportHarvest}
                            disabled={isReportPending || isReportLoading || !harvestValue || !repaymentDays}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded disabled:opacity-50"
                        >
                            {isReportPending || isReportLoading ? "Processing..." : "Report Harvest"}
                        </button>
                        {isReportSuccess && <p className="text-green-400 text-sm mt-1">Harvest reported successfully!</p>}
                    </div>
                )}

                {funding.state === 1 && funding.harvestValue > BigInt(0) && (
                    <div className="bg-gray-800 p-3 rounded-md">
                        <h4 className="text-md font-medium text-white mb-2">Make Repayment</h4>
                        <div className="flex space-x-2 mb-2">
                            <input
                                type="number"
                                placeholder="Repayment Amount (ANT)"
                                value={repaymentAmount}
                                onChange={(e) => setRepaymentAmount(e.target.value)}
                                className="flex-1 p-2 rounded bg-gray-700 text-white"
                            />
                            <button
                                onClick={handleMakeRepayment}
                                disabled={isRepayPending || isRepayLoading || !repaymentAmount}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded disabled:opacity-50"
                            >
                                {isRepayPending || isRepayLoading ? "Processing..." : "Repay"}
                            </button>
                        </div>
                        {isRepaySuccess && <p className="text-green-400 text-sm">Repayment sent successfully!</p>}
                    </div>
                )}
            </div>
        </div>
    );
}