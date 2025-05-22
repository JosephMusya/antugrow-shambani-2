import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function FundingOpportunities() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          <Wallet className="mr-2 h-4 w-4" />
          Funding Opportunities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-100 rounded-md p-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-green-800">Irrigation Project</h4>
                <p className="text-xs text-green-700 mt-1">3 investors interested</p>
              </div>
              <div className="bg-white rounded-full px-2 py-1 text-xs font-medium text-green-700">New</div>
            </div>
            <div className="mt-2 flex justify-between items-center">
              <p className="text-sm font-medium">KSh 120,000</p>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-green-700 hover:text-green-800 hover:bg-green-100 p-0"
              >
                <span className="text-xs">Apply</span>
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="border border-gray-200 rounded-md p-3">
            <h4 className="font-medium">Seed Funding</h4>
            <p className="text-xs text-gray-500 mt-1">For maize and bean farmers</p>
            <div className="mt-2 flex justify-between items-center">
              <p className="text-sm font-medium">KSh 50,000</p>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-green-700 hover:text-green-800 hover:bg-green-100 p-0"
              >
                <span className="text-xs">Apply</span>
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="border border-gray-200 rounded-md p-3">
            <h4 className="font-medium">Equipment Loan</h4>
            <p className="text-xs text-gray-500 mt-1">Low interest rates</p>
            <div className="mt-2 flex justify-between items-center">
              <p className="text-sm font-medium">KSh 200,000</p>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-green-700 hover:text-green-800 hover:bg-green-100 p-0"
              >
                <span className="text-xs">Apply</span>
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100 text-center">
          <a href="#" className="text-sm text-green-600 hover:underline">
            View all opportunities
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
