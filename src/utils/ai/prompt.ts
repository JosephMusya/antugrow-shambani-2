import type { FarmType, SatelliteDataResponse, WeatherDataResponse } from "@/types/Types"

type PromptProps = {
    satelliteData: SatelliteDataResponse,
    weatherData: WeatherDataResponse,
    farmData: FarmType
}

export const generatePrompt = (props: PromptProps): string =>{
    console.log(props)
    const refinedPrompt = `You are given the following farm data ${props.satelliteData}, Location:${props.farmData.location_name} Weather: Temperature=${props.weatherData.temperature} degrees celcius, Humidity=${props.weatherData.humidity}%. Using this data, return a JSON formatted response with the following fields "farm_health": A string value — "Good", "Average", or "Poor" based on based on these overal conditions

    "potential_pests": A list of strings indicating pests likely to affect the crop under these conditions.

    "crop_stage_match": An object with:

    "percentage": A number (0 to 100) showing how well current environmental conditions match the needs of the crop at the ${props.farmData.farm_stage.value} - stage. and "status": "Good" or "Poor", based on the percentage match.

    "disease_risk_assessment": A list of objects, each with:

    "disease": The name of the potential disease.

    "description": A VERY brief explanation of the disease and its risk factors based on the current conditions.

    Output only in JSON. No additional explanation`

    return refinedPrompt;
}