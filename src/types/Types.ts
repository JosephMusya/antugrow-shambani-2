// import { FarmActivity } from "../components/cards/FarmOverview";

export type FarmActivity = {
    id: string;
    title: string;
    date: string;
    value: string;
    farm_id: string;
    done: boolean;
};
export type Coordinate = {
    lat: number;
    lng: number;
};

export type Polygon = Coordinate[];


export type FarmStage = {
    stage: number, value: string
}
export type FarmType = {
    id: string;
    farmer_id: string,
    name: string,
    location?: Polygon; // location can be either a single coordinate or a polygon
    size_acres: number,
    crop_types: string[];
    updated_at?: string;
    created_at: string;
    location_name: string;
    farm_stage: FarmStage;
    activity?: FarmActivity[];
    weather: {
        temperature: number,
        humidity: number,
        wind_speed:number,
        main: string,
        description: string
    }
};

export type ProviderProps = {
    children: React.ReactNode;
};

export type AuthUserDetails = {
    token: string | undefined;
    expires_at: number | undefined;
    expires_in: number | undefined;
    refresh_token: string | undefined;
};

export type AuthUser = {
    created_at?: string;
    email?: string;
    id?: string;
    role?: string;
    phone?: string;
    user_metadata?: UserMeta;
};

export type FarmerProfile = {
    id: string,
    user_id:string,
    farmer_id: string,
    full_name: string,
    phone: string,
    experience_years: number,
    success_rate: number,
    verification_status: string,
    avg_roi: number,
    bio: string,
    skills:{},
    created_at?: string;
    updated_at: string,
    credit: number
};

type UserMeta = {
    email: string;
    email_verified: boolean;
    phone: string;
    phone_verified: boolean;
};

// type SatelliteData = {

// }

export type Parameters = {
    NDVI: {
        value: number;
        description: string;
    };
    GNDVI: {
        value: number;
        description: string;
    };
    NDMI: {
        value: number;
        description: string;
    };
    Water_Stress: {
        value: number;
        description: string;
    };
    EVI: {
        value: number;
        description: string;
    };
    Soil_Moisture: {
        value: number;
        description: string;
    };
    Chlorophyll_Index: {
        value: number;
        description: string;
    };
    NDRE: {
        value: number;
        description: string;
    };
    Source: string;
    from: string;
    to: string;
    totalImages: number;
    categories: (string | number)[];
    series: ApexAxisChartSeries;
    // weatherData: WeatherAndForecastResponse;
    latest: {
        timestamp: string;
        NDVI: {
            value: number;
            description: string;
        };
        GNDVI: {
            value: number;
            description: string;
        };
        NDMI: {
            value: number;
            description: string;
        };
        Water_Stress: {
            value: number;
            description: string;
        };
        EVI: {
            value: number;
            description: string;
        };
        Soil_Moisture: {
            value: number;
            description: string;
        };
        Chlorophyll_Index: {
            value: number;
            description: string;
        };
        NDRE: {
            value: number;
            description: string;
        };
    };
};

// type CurrentWeather = {
//     weather: string;
//     description: string;
//     temperature: number;
//     humidity: number;
//     location: string;
// };

export type WeatherDataResponse = {
  main: string;
  description: string;
  temperature: number;
  humidity: number;
  wind_speed: number;
  wind_deg: number;
  location: string;
  farm_id: string;
  feels_like: number
};

export type SatelliteDataResponse = {
  GNDVI: number;
  NDMI: number;
  NDVI: number;
  Soil_Moisture: number;
  Water_Stress: number;
  farm_id: string;
};


export type Markets = {
    id: string;
    name: string;
    counties: {
        name: string;
    };
};

export type Products = {
    id: string;
    name: string;
};

type Prices = {
    id: string;
    markets: Markets;
    products: Products;
    price_date: string;
    retail_price: number;
    retail_unit: string;
};

type Analysis = {
    crop: string;
    old_price: number;
    new_price: number;
    price_change: string;
};

export type MarketPricesType = {
    prices: Prices[];
    analysis: Analysis;
};


