import MapContainers from '@/components/shared/MapContainer'
import MarketPrices from '@/components/shared/MarketPrices'
import TasksCalendar from '@/components/shared/TaskCalendar'
import WeatherWidget from '@/components/shared/WeatherCard'
import { Card} from '@/components/ui/card'
import { useFarmContext } from '@/providers/FarmProvider'
import { useUserContext } from '@/providers/UserAuthProvider'
import type { Coordinate,  FarmType, MarketPricesType, WeatherDataResponse, SatelliteDataResponse } from '@/types/Types'
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar'
import { Tabs, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import {
  Activity,
  HeartPulse,
  LineChart,
  LayoutDashboard,
} from "lucide-react";
import type  { Parameters } from '@/types/Types'

// type CardParams = {stages: FarmStage, currentStage: FarmStage}
import { Bot } from "lucide-react"; // Import this with the others
import { useEffect,  useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import supabase from '@/config/supabase/supabase'
import type { PostgrestSingleResponse } from '@supabase/supabase-js'
import FarmOverviewCard from '@/components/shared/FarmOverviewCard'
import { AnimatePresence, motion } from "framer-motion";
import AnalyticsCard from '@/components/shared/AnalyticsCard'
import MapCardOverlay from '@/components/shared/MapCardOverlay'
// import { CartesianGrid, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
// import FarmAnalytics, { revenueData } from '@/components/shared/FarmAnalytics'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import CustomLineChart from '@/components/shared/LineChart'

// const FarmStageCard = (param: CardParams) => {
//     return <div className="flex items-center">
//             <div className="bg-green-400 text-white py-2 rounded-l-md w-[10rem]">
//                 <p className="text-sm text-center">{param.stages.value}</p>
//             </div>
//             <div className="w-0 h-0 border-t-[18px] border-b-[18px] border-l-[20px] border-t-transparent border-b-transparent border-l-green-400"></div>
//         </div>
// }

export type Tabs = "Overview" | "Activities" | "Health" | "Analytics" | "IoT Data" | "AI Chat";

export default function FarmView() {

  const {farmerProfile} = useUserContext();
  // const {updateCreditScore} = useFarmContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const {
        getProductPrices,
        updatePriceHistory,
    } = useFarmContext();


    // const [farmErr, setFarmErr] = useState<boolean>(false);

    const [weatherInfo, setWeatherInfo] =
        useState<WeatherDataResponse>();
    const [satelliteData, setSatelliteData] = useState<SatelliteDataResponse>();

    const [activeTab, setActiveTab] = useState<Tabs>("Overview");

    const toggleTab =(tab: Tabs)=>{
      setActiveTab(tab);
    }


    const [loadingFarm, setLoadingFarm] = useState<boolean>(true);
    const [farmData, setFarmData] = useState<FarmType>();
    const [farmLocation, setFarmLocation] = useState<Coordinate>({
        lat: -1.286389,
        lng: 36.817223,
    });

    const[satRawData, setSatRawData] = useState<Parameters>();
    const [fromDate, setFromDate] = useState<Dayjs | null>(
            dayjs().subtract(3, "month")
        );

    const [toDate, setToDate] = useState<Dayjs | null>(dayjs());

    console.log(setToDate, setFromDate);

     
    const generateUrl = (farm:FarmType): string => {
        const farmLocation = farm?.location as Coordinate[];

        const transformedCoordinates = farmLocation?.map((coord) => [
            coord.lng,
            coord.lat,
        ]);


        const formattedStartDate = fromDate?.format("YYYY-MM-DD");
        const formattedEndDate = toDate?.format("YYYY-MM-DD");

        const polygonParam = encodeURIComponent(
            JSON.stringify(transformedCoordinates)
        );

        return `${
            import.meta.env.VITE_BASE_URL
        }/get-parameters?polygon=${polygonParam}&mode=all&startDate=${formattedStartDate}&endDate=${formattedEndDate}&cropHealth=true&growth=true&waterContent=true`;
    };

    const generateData = async (farm: FarmType) => {

        const url: string = generateUrl(farm);

        console.log(url);

        try {

            const request = await fetch(url);


            if (!request.ok) {
                const errorText = await request.text(); // or request.json() if you expect JSON errors
                console.error("Error: ", errorText);
                throw new Error(
                    `Server error: ${request.status} - ${errorText}`
                );
            }


            const response: { parameters: Parameters } = await request.json();
            console.log(response.parameters);
            // setFarmErr(false);
            setSatRawData(response.parameters);
        } catch (error: any) {
            // setFarmErr(true);
        } finally {
        }
    };

    const retrieveWeather = async(farm_id: string) => {
      try {
            let { data: weatherInfo, error }: PostgrestSingleResponse<WeatherDataResponse> =
                await supabase
                    .from("farm_weather")
                    .select()
                    .eq("farm_id", farm_id)
                    .single();
            if (weatherInfo) {
                setWeatherInfo(weatherInfo);
            } else if (error) {
                throw new Error(error.message);
            }
        } catch (error) {
          console.error(error);
        } 
    }
    const retrieveSatellite = async(farm_id: string) => {
      try {
            let { data: satelliteData, error }: PostgrestSingleResponse<SatelliteDataResponse> =
                await supabase
                    .from("farm_satellite")
                    .select()
                    .eq("farm_id", farm_id)
                    .single();
            if (satelliteData) {
                setSatelliteData(satelliteData as SatelliteDataResponse);
            } else if (error) {
                throw new Error(error.message);
            }
        } catch (error) {
          console.error(error);
        } 
    }

    const retrieveFarm = async (id: string) => {
        setLoadingFarm(true);
        console.log("Retrieving...",farmerProfile?.id)
        try {
            // Step 1: Fetch farm data
            const { data: farm, error: farmError }: PostgrestSingleResponse<FarmType> =
                await supabase
                    .from("farms")
                    .select()
                    .eq("farmer_id", farmerProfile?.id)
                    .eq("id", id)
                    .single();
            if (farm) {
                // Set location center if coordinates exist
                if (Array.isArray(farm.location)) {
                    const coords = farm.location as Coordinate[];
                    const numPoints = coords.length;

                    const center = coords.reduce(
                        (acc, point) => ({
                            lat: acc.lat + point.lat / numPoints,
                            lng: acc.lng + point.lng / numPoints,
                        }),
                        { lat: 0, lng: 0 }
                    );

                    setFarmLocation(center);
                }

                console.log(farm);

                // Step 2: Fetch weather using farm_id
                await Promise.all([
                  retrieveWeather(farm.id.toString()),
                  retrieveSatellite(farm.id.toString()),
                ]
                );
                setFarmData(farm);
                generateData(farm);
            } else if (farmError) {
                throw new Error(farmError.message);
            }
        } catch (error) {
          // setFarmErr(true);
            console.error("Error retrieving farm or weather:", error);
        } finally {
            setLoadingFarm(false);
        }
    };


    // const handleDeleteActivity = (activityId: string) => {
    //     if (!farmData) return;

    //     const updatedActivities = farmData?.activity?.filter(
    //         (activity) => activity.id !== activityId
    //     );

    //     setFarmData({
    //         ...farmData,
    //         activity: updatedActivities,
    //     });
    // };

    // const handleMarkActivityDone = (updatedActivity: FarmActivity) => {
    //     setFarmData((prevFarm) => {
    //         if (!prevFarm || !prevFarm.activity) return prevFarm;

    //         const updatedActivityList = prevFarm.activity.map((activity) =>
    //             activity.id === updatedActivity.id ? updatedActivity : activity
    //         );

    //         return {
    //             ...prevFarm,
    //             activity: updatedActivityList,
    //         };
    //     });
    // };

    // const handleAddActivityToFarm = (newActivity: FarmActivity) => {
    //     setFarmData((prevFarm) => {
    //         if (!prevFarm) return prevFarm;

    //         return {
    //             ...prevFarm,
    //             activity: [...(prevFarm.activity || []), newActivity],
    //         };
    //     });
    // };

    const getPriceHistory = async(refresh?: boolean, duration: number = 30) => {
        if (farmData && Array.isArray(farmData?.crop_types)) {
            await getProductPrices(farmData?.crop_types, duration, refresh)
                .then((res: MarketPricesType[]) => {
                    updatePriceHistory(res);
                })
                .catch((err) => {
                    console.error("Error fetching product prices:", err);
          });
        }
    };

    useEffect(() => {
      if(farmData?.crop_types.length){
        getPriceHistory();
      }
    }, [farmData]);

    useEffect(() => {
      if(farmerProfile?.id){
        retrieveFarm(id as string);
      }
    }, [id,farmerProfile?.id]);

    // useEffect(() => {
    //     if (prevFarmData !== farmData || !farmData) {
    //         generateData();
    //     }
    // }, [farmData, prevFarmData]);

    // useEffect(() => {
    //     if (prevFarmData !== farmData || prevWeatherInfo !== weatherInfo) {
    //         generateWeatherData();
    //     }
    // }, [farmData, weatherInfo, prevFarmData, prevWeatherInfo]);

  return (
    loadingFarm ?
    <LoadingSkeleton/>:
    <div className='min-h-screen bg-gray-50 flex'>
        <div>
        <Tabs value={activeTab} onValueChange={(e)=>setActiveTab(e as Tabs)} className="flex">
            <Card className='flex flex-col gap-8 items-center rounded-none h-[100dvh]'>
             <Avatar className="relative w-12 h-12 border-2 border-green-400 shadow-sm rounded-full group cursor-pointer" onClick={()=>navigate(-1)}>
                <AvatarFallback className="bg-gray-200 text-gray-700 text-xl font-semibold flex items-center justify-center w-full h-full rounded-full">
                  <p className="text-[0.9rem]">{farmerProfile?.full_name.charAt(0)}{farmerProfile?.full_name?.split(" ")[1]?.charAt(0)??"AG"}</p>
                </AvatarFallback>
              </Avatar>
              <div className='border border-[1px] w-[90%]'></div>
              <TabsList className="flex flex-col gap-10 px-4">
                <TabsTrigger
                  value="Overview"
                  className="flex flex-col items-center justify-center h-[4rem] w-[4rem] rounded-md text-gray-600 data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:border-transparent transition-colors"
                >
                  <LayoutDashboard className="w-6 h-6 mb-1" />
                  <p className="text-[12px]">Overview</p>
                </TabsTrigger>

                <TabsTrigger
                  value="Analytics"
                  className="flex flex-col items-center justify-center h-[4rem] w-[4rem] rounded-md text-gray-600 data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:border-transparent transition-colors"
                >
                  <LineChart className="w-6 h-6 mb-1" />
                  <p className="text-[12px]">Analytics</p>
                </TabsTrigger>
                <TabsTrigger
                  value="Activities"
                  className="flex flex-col items-center justify-center h-[4rem] w-[4rem] rounded-md text-gray-600 data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:border-transparent transition-colors"
                >
                  <Activity className="w-6 h-6 mb-1" />
                  <p className="text-[12px]">Activities</p>
                </TabsTrigger>
                <TabsTrigger
                  disabled
                  value="Chat"
                  className="flex flex-col items-center justify-center h-[4rem] w-[4rem] rounded-md text-gray-300 data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:border-transparent transition-colors"
                >
                  <Bot className="w-6 h-6 mb-1" />
                  <p className="text-[12px]">AI Chat</p>
                </TabsTrigger>
                <TabsTrigger
                  value="Health"
                  disabled
                  className="flex flex-col items-center justify-center h-[4rem] w-[4rem] rounded-md text-gray-300 data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:border-transparent transition-colors"
                >
                  <HeartPulse className="w-6 h-6 mb-1" />
                  <p className="text-[12px]">Soil Health</p>
                </TabsTrigger>
                <TabsTrigger
                  disabled
                  value="IoT Sensor"
                  className="flex flex-col items-center justify-center h-[4rem] w-[4rem] rounded-md text-gray-300 data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:border-transparent transition-colors"
                >
                  <Activity className="w-6 h-6 mb-1" />
                  <p className="text-[12px]">IoT Data</p>
                </TabsTrigger>
              </TabsList>
            </Card>
            <AnimatePresence mode="wait">
                {activeTab === "Overview" && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 flex pl-4"
                  >
                    <div className="flex w-[22rem] gap-6 flex-col mt-4">
                      <MarketPrices />
                      <WeatherWidget weather={weatherInfo} />
                      <FarmOverviewCard />
                    </div>
                  </motion.div>
                )}

                {activeTab === "Activities" && (
                  <motion.div
                    key="activities"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 flex pl-4"
                  >
                    <div className="flex w-[22rem] gap-6 flex-col mt-4">
                      <TasksCalendar />
                    </div>
                  </motion.div>
                )}
                {activeTab === "Analytics" && (
                  <motion.div
                    key="analytics"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 flex pl-4"
                  >
                    <div className="flex w-[22rem] gap-6 flex-col mt-4">
                      <AnalyticsCard farmData={farmData as FarmType} farmSatellite={satelliteData as SatelliteDataResponse} weatherData={weatherInfo as WeatherDataResponse}/>
                      {
                        satRawData &&
                        <CustomLineChart
                        
                           series={satRawData?.series as ApexAxisChartSeries}
                          categories={
                                satRawData?.categories as (
                                    | string
                                    | number
                                )[]
                          } />
                      }
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
          </Tabs>
        </div>
        <MapCardOverlay farmData={farmData as FarmType} satelliteData={satelliteData} onToggleTab={toggleTab}  />
        <div className='ml-4 relative flex-grow'>
            {farmData?.location && (
                  <MapContainers
                      center={
                          farmData?.location
                              ? ({
                                    lat: farmLocation?.lat,
                                    lng: farmLocation?.lng,
                                } as unknown as google.maps.LatLng)
                              : ({
                                    lat: -1.286389,
                                    lng: 36.817223,
                                } as unknown as google.maps.LatLng)
                      }
                      additionalMapStyle={{
                          width: "100%",
                          height: "100dvh",
                      }}
                      polygonPoints={farmData?.location}
                      autofit
                  />
              )}
          </div>

    </div>
  )
}