"use client"

import { Link } from "react-router-dom"
import { formatEther } from "viem"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface FundingCardProps {
    id: string | number
    contractAddress: `0x${string}`
    farmerAddress: `0x${string}`
    totalFundingGoal: bigint
    currentFunding: bigint
    createdAt: bigint
    isActive: boolean
    name?: string
    description?: string
    imageUrl?: string
    tokenSymbol?: string
    onInvestClick?: () => void
}

export function FundingCard({
                                id,
                                contractAddress,
                                farmerAddress,
                                totalFundingGoal,
                                currentFunding,
                                createdAt,
                                isActive,
                                name,
                                description,
                                imageUrl,
                                tokenSymbol = "Tokens",
                                onInvestClick,
                            }: FundingCardProps) {
    // Format date from timestamp
    const formatDate = (timestamp: bigint) => {
        return new Date(Number(timestamp) * 1000).toLocaleDateString()
    }

    // Calculate funding progress percentage
    const calculateProgress = (current: bigint, goal: bigint) => {
        if (goal === 0n) return 0
        return Number((current * 100n) / goal)
    }

    return (
        <Card className="overflow-hidden flex flex-col">
            <div className="aspect-video w-full overflow-hidden">
                <img
                    src={imageUrl || "/placeholder.svg?height=200&width=400"}
                    alt={name || `Project #${id}`}
                    className="w-full h-full object-cover"
                />
            </div>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle>{name || `Project #${id}`}</CardTitle>
                    <Badge variant="outline" className="ml-2">
                        {calculateProgress(currentFunding, totalFundingGoal)}% Funded
                    </Badge>
                </div>
                <CardDescription className="line-clamp-2">
                    {description || "Support this sustainable farming project"}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">
                {formatEther(currentFunding)} / {formatEther(totalFundingGoal)} {tokenSymbol}
              </span>
                        </div>
                        <Progress value={calculateProgress(currentFunding, totalFundingGoal)} />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-muted-foreground">Created</p>
                            <p className="font-medium">{formatDate(createdAt)}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Farmer</p>
                            <p className="font-medium truncate">
                                {farmerAddress.substring(0, 6)}...{farmerAddress.substring(38)}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex gap-2">
                <Button variant="outline" className="flex-1" asChild>
                    <Link to={`/funding/${id}`}>View Details</Link>
                </Button>
                <Button className="flex-1" onClick={onInvestClick} disabled={!isActive}>
                    Invest
                </Button>
            </CardFooter>
        </Card>
    )
}
