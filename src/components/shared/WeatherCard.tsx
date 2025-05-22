import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { WeatherDataResponse } from "@/types/Types"
import { CloudSun, Droplets, Wind, Thermometer } from "lucide-react"

type WeatherProp =  {
  weather: WeatherDataResponse | undefined
}

const WeatherIcon = () => {
  const currentHour = new Date().getHours();
  const isDaytime = currentHour >= 6 && currentHour < 18;

  return (
    <div className="text-5xl">
      {isDaytime ? "⛅" : "☁️"}
    </div>
  );
};


export default function WeatherWidget(props: WeatherProp) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          <CloudSun className="mr-2 h-4 w-4" />
          Weather Forecast
        </CardTitle>
        <p className="text-sm text-gray-500">{props.weather?.main}, {props.weather?.description}</p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-2xl font-bold">{props.weather?.temperature.toFixed(1)}°C</p>
            <p className="text-sm text-gray-500">{props.weather?.location}</p>
          </div>
          <WeatherIcon/>          
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-gray-50 rounded-md">
            <Droplets className="h-4 w-4 mx-auto text-blue-500 mb-1" />
            <p className="text-xs text-gray-500">Humidity</p>
            <p className="text-sm font-medium">{props.weather?.humidity}%</p>
          </div>
          <div className="p-2 bg-gray-50 rounded-md">
            <Wind className="h-4 w-4 mx-auto text-blue-500 mb-1" />
            <p className="text-xs text-gray-500">Wind</p>
            <p className="text-sm font-medium">{props.weather?.wind_speed.toFixed(1)} km/h</p>
          </div>
          <div className="p-2 bg-gray-50 rounded-md">
            <Thermometer className="h-4 w-4 mx-auto text-blue-500 mb-1" />
            <p className="text-xs text-gray-500">Feels Like</p>
            <p className="text-sm font-medium">{props.weather?.feels_like}°C</p>
          </div>
        </div>

        {/* <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-2">5-Day Forecast</p>
          <div className="flex justify-between">
            {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, i) => (
              <div key={day} className="text-center">
                <p className="text-xs">{day}</p>
                <p className="text-lg my-1">{["🌤️", "⛅", "🌦️", "🌤️", "☀️"][i]}</p>
                <p className="text-xs font-medium">{[24, 25, 23, 26, 28][i]}°</p>
              </div>
            ))}
          </div>
        </div> */}
      </CardContent>
    </Card>
  )
}
