import { createContext, useContext, useEffect, useState } from "react";
import type { FarmType, MarketPricesType, ProviderProps } from "../types/Types";
import toast from "react-hot-toast";
import { useUserContext } from "./UserAuthProvider";
import supabase from "@/config/supabase/supabase";

type FarmContextType = {
    farms: FarmType[];
    loadingFarms: boolean;
    loadingPrices: boolean;
    priceHistory: MarketPricesType[] | undefined;
    farmCreationDetails: FarmType | undefined;
    updatePriceHistory: (prices: MarketPricesType[]) => void;
    updateFarms: (farm: FarmType) => void;
    deleteFarm: (id: string) => void;
    getProductPrices: (
        productNames: string[],
        duration: number,
        refresh?: boolean
    ) => Promise<MarketPricesType[]>;
    updateFarmDetails: <K extends keyof FarmType>(
        key: K,
        value: FarmType[K]
    ) => void;
    resetFarmCreationDetails: () => void;
};

const defaultFarmContextValue: FarmContextType = {
    farms: [],
    loadingFarms: true,
    loadingPrices: true,
    priceHistory: [],
    farmCreationDetails: undefined,
    updatePriceHistory: () => {},
    updateFarms: (farm: FarmType) => {
        console.log(`Update farm with ${farm.name}`);
    },
    deleteFarm: (id: string) => {
        console.log(`Delete Farm ${id}`);
    },
    getProductPrices: async () => {
        return [];
    },
    updateFarmDetails: () => {},
    resetFarmCreationDetails: () => {},
};

const FarmContext = createContext<FarmContextType>(defaultFarmContextValue);

export const FarmProvider = (props: ProviderProps) => {
    const { farmerProfile } = useUserContext();
    const [loadingPrices, setLoadingPrices] = useState<boolean>(
        defaultFarmContextValue.loadingPrices
    );
    const [farms, setFarms] = useState<FarmType[]>(
        defaultFarmContextValue.farms
    );
    const [loadingFarms, setLoadingFarms] = useState<boolean>(
        defaultFarmContextValue.loadingFarms
    );

    const [farmCreationDetails, setFarmCreationDetails] = useState<FarmType>();

    const [priceHistory, setPriceHistory] = useState<MarketPricesType[]>();

    const updateFarms = (farm: FarmType) => {
        setFarms((prev) => {
            return [farm, ...prev];
        });
    };

    const updatePriceHistory = (prices: MarketPricesType[]) => {
        setPriceHistory(prices);
    };

    const updateFarmDetails = <K extends keyof FarmType>(
        key: K,
        value: FarmType[K]
    ) => {
        setFarmCreationDetails((prev) => ({
            ...(prev as FarmType),
            [key]: value,
        }));
    };

    // Allow users to delete their own data

    const deleteFarm = async (id: string) => {
        try {
            const { error } = await supabase
                .from("farms")
                .delete()
                .eq("id", id);

            if (error) {
                toast.error("Failed to delete this farm");
                throw new Error(error.message);
            } else {
                setFarms((farms) => farms.filter((farm) => farm.id !== id));
                toast.success("Farm deleted ");
            }
        } catch (error) {
            toast.error("Failed to retrieve farms");
        } finally {
        }
    };

    // Allow users to retrieve their own data

    const retrieveFarms = async () => {
        try {
            setLoadingFarms(true);

            let { data: farms, error } = await supabase
                .from("farms")
                .select()
                .eq("farmer_id", farmerProfile?.id);

            if (error) throw new Error(error.message);

            if (farms) {
                const enrichedFarms = await fetchWeatherForFarms(farms);
                setFarms(enrichedFarms);

                console.log(enrichedFarms);
            }
        } catch (error) {
            toast.error("Failed to retrieve farms or weather data");
            console.error(error);
        } finally {
            setLoadingFarms(false);
        }
    };

    const fetchWeatherForFarms = async (farms: FarmType[]) => {
        const enrichedFarms = await Promise.all(
            farms.map(async (farm) => {
                const { data: weatherData } = await supabase
                    .from("farm_weather")
                    .select("temperature, humidity, wind_speed, main, description")
                    .eq("farm_id", farm.id)
                    .single();

                const weather = weatherData || {
                    temperature: null,
                    humidity: null,
                    wind_speed: null,
                    main: null,
                    description: null
                };

                return {
                    ...farm,
                    weather,
                } as FarmType;
            })
        );

        return enrichedFarms;
    };

    const getProductPrices = async (
        productNames: string[],
        duration: number = 30,
        refresh: boolean = true
    ): Promise<MarketPricesType[]> => {
        if (!productNames.length) return [];

        if (refresh) {
            setLoadingPrices(true);
        }

        try {
            const getPrices = await fetch(
                `${
                    import.meta.env.VITE_BASE_URL
                }/prices?products=${productNames}&days=${duration}`
            );

            if (getPrices.ok) {
                const prices: MarketPricesType[] = await getPrices.json();
                return prices;
            } else {
                // If response not ok, return empty array
                console.error("Failed to fetch prices", getPrices.statusText);
                return [];
            }
        } catch (error) {
            console.error(error);
            return [];
        } finally {
            setLoadingPrices(false);
        }
    };

    const resetFarmCreationDetails = () => {
        setFarmCreationDetails(undefined);
    };

    useEffect(() => {
        if(!farmerProfile?.id)return;
        retrieveFarms();
    }, [farmerProfile?.id]);

    const contextValues: FarmContextType = {
        farms,
        loadingFarms,
        loadingPrices,
        priceHistory,
        farmCreationDetails,
        resetFarmCreationDetails,
        updatePriceHistory,
        updateFarms,
        deleteFarm,
        getProductPrices,
        updateFarmDetails,
    };

    // getProductPriceHistory("Tomato");

    return (
        <FarmContext.Provider value={contextValues}>
            {props.children}
        </FarmContext.Provider>
    );
};

export function useFarmContext() {
    return useContext(FarmContext);
}
