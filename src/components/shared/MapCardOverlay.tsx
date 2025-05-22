import { useState } from 'react'
import { Button } from '../ui/button'
import { Cloud, Rss, Satellite, Sparkles, X } from 'lucide-react'
import { FaSatellite } from 'react-icons/fa'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardTitle, } from '@/components/ui/card'
import type { FarmType, SatelliteDataResponse } from '@/types/Types';
import { getMetricClassification } from '@/utils/farms/metrics';
import { Badge } from '../ui/badge';
import type { Tabs } from '@/pages/FarmView';

type OverlayProps = {farmData: FarmType| undefined, satelliteData: SatelliteDataResponse|undefined, onToggleTab: (tab:  Tabs)=>void}

const formatKey = (key: string) =>
  key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());

const CropMetrics = ({ data }: { data: SatelliteDataResponse }) => {
  if (!data) return null;

  return (
    <div className='flex flex-col gap-4'>
      {Object.entries(data).map(([key, value]) => {
        if (['farm_id', 'id', 'created_at', 'NDVI'].includes(key)) return null;

        const {color, label} = getMetricClassification( key, value as number);

        return (
          <div key={key} className='flex justify-between'>
            <p className='text-sm text-gray-500'>{formatKey(key)}</p>
            <p className='text-sm flex gap-8 justify-between'>
            <Badge className={label ==="Good"? "bg-green-600": label === "Average"? "bg-orange-400":"bg-red-400"}>
                {label}
            </Badge>
            <p className={`text-sm text-${color}`}>
              {(value as number).toFixed(3)}
            </p>
            </p>
          </div>
        );
      })}
    </div>
  );
};



export default function MapCardOverlay(props: OverlayProps) {
    type DataSource = "Satellite"|"IoT"|"Weather";
    

    const [selectedSource, setSelectedSource] = useState<DataSource>("Satellite");

    const handleSelect = (source: DataSource) => {
      setSelectedSource(source);
    };


  return (
    <div>
        <Card style={{zIndex:1}} className='absolute top-5 right-5 bg-gray-50 w-[20rem]'>
            <CardContent className='px-4 py-0'>
              <CardTitle>
                <CardTitle className='text-sm font-medium flex items-center gap-4'>
                <FaSatellite size={30} color='#00A63E'/>
                <div>
                  <div className='flex'>
                    <p>{props.farmData?.name}</p>
                    <span className="mx-2 text-gray-500">•</span>
                    <p className='text-gray-500'>{props.farmData?.location_name}</p>
                  </div>
                  <p className='text-[1.5rem]'>{props.farmData?.size_acres??"---"} <span className='text-gray-500 text-sm'>Total Acres</span> </p>
                </div>
                </CardTitle>
              </CardTitle>
              <div className="w-full mt-3 mb-3 font-medium">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <p className='text-sm text-gray-500'>Data Source
                      <span className="mx-2 text-gray-500">•</span>
                      </p>{selectedSource}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    <DropdownMenuItem
                      onClick={() => handleSelect("Satellite")}
                      className="w-full flex items-center gap-2"
                      disabled={false}
                    >
                      <Satellite className="w-4 h-4 text-gray-600" />
                      Satellite Information
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleSelect("IoT")}
                      className="w-full flex items-center gap-2 text-muted-foreground"
                      disabled={true}
                    >
                      <Rss className="w-4 h-4 text-gray-600" />
                      IoT Sensor Data
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleSelect("Weather")}
                      className="w-full flex items-center gap-2 text-muted-foreground"
                      disabled={true}
                    >
                      <Cloud className="w-4 h-4 text-gray-600" />
                      Weather Data
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className='flex flex-col gap-4'>
                {
                  props.satelliteData ?
                <CropMetrics data={props.satelliteData as SatelliteDataResponse}/>:
                  <p className='text-sm text-red-500 flex gap-2 items-center'> <X size={15}/> {selectedSource} data not available</p>
                }
                <Button className='mt-1 bg-green-600 cursor-pointer' onClick={()=>props.onToggleTab("Analytics")}>
                    <span>
                <Sparkles/>
                </span>
                Check AI Analysis</Button>
                </div>
                </CardContent>
          </Card>
        </div>
  )
}
