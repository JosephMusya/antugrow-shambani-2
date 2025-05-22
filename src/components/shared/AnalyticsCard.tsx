import { useEffect, useState } from 'react'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { Bug, Leaf, Sparkles } from 'lucide-react'
import type { FarmType, SatelliteDataResponse, WeatherDataResponse } from '@/types/Types'
import { farmStages } from '@/utils/farms/farm'
import { generatePrompt } from '@/utils/ai/prompt'
import { getOpenAIResponse } from '@/utils/ai/chat'
import CardSkeleton from './CardSkeleton'

type AnalyticsProps = {
    farmData: FarmType,
    farmSatellite: SatelliteDataResponse
    weatherData: WeatherDataResponse
}

type FarmHealthReport = {
  farm_health: string;
  potential_pests: string[];
  crop_stage_match: {
    percentage: number;
    status: "Good"|"Average"|"Poor";
  };
  disease_risk_assessment: {
    disease: string;
    description: string;
  }[];
};

export default function AnalyticsCard(props: AnalyticsProps) {
    const [laoding, setLoading] =  useState<boolean>(false);
    const [response, setResponse] = useState<FarmHealthReport>();
    const queryAI = async()=> {
        setLoading(true);
        if(!props.farmSatellite || !props.weatherData){
            throw new Error("No data passed");
        }
        const prompt = generatePrompt({farmData:props.farmData,satelliteData:props.farmSatellite as SatelliteDataResponse,weatherData:props.weatherData});

        const aiResponse = await getOpenAIResponse(prompt);

        const match = aiResponse.match(/{[\s\S]*}/);

        if (match) {
        const cleanJson:FarmHealthReport = JSON.parse(match[0]);
        setResponse(cleanJson);
        } else {
        console.error("JSON content not found.");
        }

        try {

        } catch {

        } finally {
            setLoading(false);
        }
    }

    useEffect(()=>{
        if(!response){
            queryAI();
        }
    },[])

  return (
        laoding ?
        <CardSkeleton/>:
    <Card className='p-4'>
           <div>
            <div className='flex items-end'>
                <p className="text-3xl font-bold leading-none">{(props.farmData.farm_stage?.stage/farmStages.length*100).toFixed()}</p>
                <p className="text-sm font-bold text-gray-500 ml-1 mb-[2px]">%</p>
            </div>
            <div className='flex gap-5 mt-2'>
                <p className="text-sm text-gray-500">{props.farmData?.farm_stage?.value}</p>
                <span className='text-gray-400'>
                     •
                </span>
                <p className="text-sm text-gray-500">{props.farmData.crop_types[0]}</p>                
                <Badge variant="outline" className={response?.crop_stage_match?.status==="Good"?`bg-green-50 text-green-600`:"bg-orange-50 text-orange-700"}>
                    {response?.crop_stage_match?.status}
                </Badge>
            </div>
            <hr className='mt-3 mb-3' />
            <div>
                <p className='mb-2 text-gray-500 text-sm flex gap-4'>
                    <Bug size={18}  className='text-green-600 '/>
                    Potential Pests</p>
                <div className='flex gap-2 flex-wrap'>
                    {
                        response?.potential_pests?.map((pest)=>{
                            return <Badge variant="outline" className="bg-red-50 text-red-500">
                                {pest}
                    </Badge> 
                        })
                    }                  
                </div>
            </div>
            <hr className='mt-4 mb-3' />
            <div className=' mt-4'>
                <p className='text-gray-500  text-sm flex gap-4'>
                    <Leaf size={18}  className='text-green-600'/>
                    Crop Stage Match  
                    <span className='text-gray-400'>
                        •
                    </span>
                     <Badge variant="outline" className="bg-green-50 text-green-500">
                        {response?.crop_stage_match?.status}
                    </Badge>  
                </p>
            </div>
            <hr className='mt-3 mb-3'/>
            <div className=' mt-4'>
                <div className="flex justify-start gap-5">
                    <Sparkles size={18} className='text-green-600 '/>
                    <p className='mb-2 text-gray-700 text-sm font-medium'>Disease Risk Assesment</p>
                </div>
                <div className="flex flex-col gap-2">
                    {
                       response?.disease_risk_assessment?.map((disease)=>{
                        return <div>
                            <p className='text-gray-500 font-medium text-sm'>{disease?.disease}</p>
                             <p className='text-gray-500 text-sm'>
                            
                            • {disease?.description}
                            </p>
                        </div>
                       })
                    }
                </div>
            </div>
          </div>
    </Card>
  )
}
