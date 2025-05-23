
import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import {factoryAbi, fundingAbi, tokenAbi} from "../../abis/abis";
// Contract addresses - replace with your deployed contract addresses
const TOKEN_ADDRESS = "0xCeBcf96B5153B7DE009dad99BA4Fc42689376610"; // Your FarmToken address
const FACTORY_ADDRESS = "0x22fCf53F2d4416D962cb34c961815fc91330f4c3"; // Your FarmFundingFactory address

export function TokenBalance() {
    const { address } = useAccount();
    const [balance, setBalance] = useState('0');

    const { data: tokenData } = useReadContract({
        address: TOKEN_ADDRESS,
        abi: tokenAbi, // Add your token ABI here
        functionName: 'balanceOf',
        args: [address],
        query: {
            enabled: !!address,
        }
    });

    const { data: decimals } = useReadContract({
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
        }
    }, [tokenData, decimals]);

    if (!address) return null;

    return (
        <div className="p-4 bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-white mb-2">Your ANT Token Balance</h2>
            <p className="text-2xl font-bold text-green-400">{balance} ANT</p>
        </div>
    );
}

export function MintTokenForm() {
    const [amount, setAmount] = useState('');
    const [recipient, setRecipient] = useState('');
    const { address } = useAccount();

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
        <div className="p-4 bg-gray-800 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-bold text-white mb-4">Create Farm Funding</h2>
            <div className="mb-4">
                <label className="block text-gray-300 mb-2">Funding Goal (ANT):</label>
                <input
                    type="number"
                    value={fundingGoal}
                    onChange={(e) => setFundingGoal(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 text-white"
                    placeholder="1000"
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-300 mb-2">Duration (Days):</label>
                <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 text-white"
                    placeholder="30"
                />
            </div>

            <button
                onClick={handleCreateFunding}
                disabled={isPending || isLoading || !fundingGoal || !duration}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
                {isPending || isLoading ? "Processing..." : "Create Funding"}
            </button>

            {isSuccess && (
                <div className="mt-2 text-green-400">Funding created successfully!</div>
            )}

            {error && (
                <div className="mt-2 text-red-400">Error: {error.message}</div>
            )}
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