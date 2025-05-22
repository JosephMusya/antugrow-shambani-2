import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import { useFarmContext } from "@/providers/FarmProvider";
import CardSkeletonMinimal from "./CardSkeletonMinimal";

export default function MarketPrices() {
  const {priceHistory, loadingPrices} = useFarmContext();

    // type Durations = "2 Weeks"|"1 Month"|"3 Months"|"6 Months" | "1 Year";

    // const durations: Durations[] =  ['2 Weeks',"1 Year","3 Months","6 Months", "1 Year"]
      
  
    //   const [selectedSource, setSelectedSource] = useState<Durations>("1 Month");
  
    //   const handleSelect = (source: Durations) => {
    //     setSelectedSource(source);
      // };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
        <div className="flex">
          <TrendingUp className="mr-2 h-4 w-4" />
          <p>Market Prices</p>
        </div>
        <p className="text-gray-500 text-[11px]">3 Months ago</p>
        {/* <div className="relative">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="justify-start">
                {selectedSource}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end" className="border rounded flex flex-col gap-1 p-2  bg-gray-50 absolute top-11 w-[4rem] right-[-6rem]">
              {durations.map((source) => (
                <DropdownMenuItem
                className="w-full flex items-center gap-2"
                  key={source}
                  onSelect={() => setSelectedSource(source)}
                >
                  <p className="text-sm ">{source}</p>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div> */}
      </CardTitle>
      </CardHeader>
      {
        loadingPrices ?
        <CardSkeletonMinimal/>:
      
      <CardContent>
        <div className="space-y-4">
          {priceHistory?.map((item, key) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{item?.analysis.crop}</p>
                <p className="text-sm text-gray-500 text-[11px]">Per kg</p>
              </div>
              <div className="text-right">
                <p className="font-bold">KSh {item?.analysis?.new_price}</p>
                <p className={`text-xs flex items-center ${item?.analysis?.price_change?.startsWith("+") ? "text-green-600" :  "text-red-600"}`}>
                  {item?.analysis?.price_change?.startsWith("+") ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {item?.analysis?.price_change}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-gray-100 text-center">
          <a href="#" className="text-sm text-green-600 hover:underline">
            View all market prices
          </a>
        </div>
      </CardContent>}
    </Card>
  )
}
