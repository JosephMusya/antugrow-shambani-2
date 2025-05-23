
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
    } = useReadContract({
        address: FACTORY_ADDRESS,
        abi: factoryAbi,
        functionName: "getAllFundingIds",
    });

    // Step 2: Batch get details for each ID
    const {
        data: rawFundings,
        isLoading: loadingFundings,
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

    return (
        <div className="mt-6">
            <h2 className="text-2xl font-bold text-white mb-4">
                Active Farm Fundings
            </h2>

            {loading ? (
                <p className="text-gray-400">Loading fundings...</p>
            ) : fundingContracts.length === 0 ? (
                <p className="text-gray-400">No active fundings found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {fundingContracts.map((f) => (
                        <FundingCard key={f.fundingRequestId} funding={f} />
                    ))}
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
