import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useFarmContext } from "../../providers/FarmProvider";
import { type FarmType } from "../../types/Types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import MapContainer from "./MapContainer";

interface Place {
    place_id: number;
    display_name: string;
    lat: string;
    lon: string;
}

export default function Step1() {
    const { updateFarmDetails, resetFarmCreationDetails, farmCreationDetails } = useFarmContext();

    const extractCenter = () => {
        const location = farmCreationDetails?.location;
        if (Array.isArray(location) && location.length > 0) {
            return {
                lat: location[0].lat,
                lng: location[0].lng,
            };
        }
        return { lat: -1.286389, lng: 36.817223 };
    };

    const [center, setCenter] = useState<{ lat: number; lng: number }>(extractCenter());
    const [polygonPoints, setPolygonPoints] = useState<{ lat: number; lng: number }[]>(() => {
        const location = farmCreationDetails?.location;
        return Array.isArray(location) ? location.map((p) => ({ lat: p.lat, lng: p.lng })) : [];
    });

    const [query, setQuery] = useState<string>("");
    const [debouncedQuery, setDebouncedQuery] = useState(query);
    const [results, setResults] = useState<Place[]>([]);
    const [loadingPlaces, setLoadingPlaces] = useState(false);

    const calculateFarmSize = (polygon: FarmType["location"]): string => {
        if (!polygon || polygon.length < 3) return "0";
        const R = 6371000;
        const toRad = (deg: number) => (deg * Math.PI) / 180;
        let area = 0;
        const points = [...polygon, polygon[0]];
        for (let i = 0; i < polygon.length; i++) {
            const p1 = points[i], p2 = points[i + 1];
            area += (toRad(p2.lng) - toRad(p1.lng)) * (2 + Math.sin(toRad(p1.lat)) + Math.sin(toRad(p2.lat)));
        }
        area = Math.abs((area * R * R) / 2);
        const acres = area / 4046.8564224;
        return acres.toFixed(1);
    };

    useEffect(() => {
        const farmsize = calculateFarmSize(farmCreationDetails?.location);
        updateFarmDetails("size_acres", parseFloat(farmsize));
    }, [farmCreationDetails?.location]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    const searchPlaces = async (text: string) => {
        if (text.trim() === "") return setResults([]);
        try {
            setLoadingPlaces(true);
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(text)}&format=json&limit=5`,
                {
                    headers: {
                        "Accept-Language": "en",
                        "User-Agent": "FarmApp (email@example.com)",
                    },
                }
            );
            const data = await response.json();
            setResults(data);
        } catch (error) {
            console.error("Error fetching location data:", error);
        } finally {
            setLoadingPlaces(false);
        }
    };

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedQuery(query), 800);
        return () => clearTimeout(handler);
    }, [query]);

    useEffect(() => {
        if (debouncedQuery.trim()) {
            searchPlaces(debouncedQuery);
        } else {
            setResults([]);
        }
    }, [debouncedQuery]);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setCenter({
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                    });
                },
                () => {
                    toast.error("Failed to get your location, defaulting to Nairobi");
                    setCenter({ lat: -1.286389, lng: 36.817223 });
                }
            );
        } else {
            toast.error("Geolocation is not supported");
        }
    }, []);

    const handlePointClick = (lat: number, lng: number) => {
        const updated = [...polygonPoints, { lat, lng }];
        let coordinates = [...updated];
        if (
            updated.length > 2 &&
            (updated[0].lat !== updated[updated.length - 1].lat ||
                updated[0].lng !== updated[updated.length - 1].lng)
        ) {
            coordinates.push({ ...updated[0] });
            
        }

        updateFarmDetails("location", coordinates);
        setPolygonPoints(updated);
    };

    return (
        <div className="relative w-full max-w-3md space-y-4 overfloww-hidden">
            <div className="relative">
                <Input
                    placeholder="Search locations..."
                    className="w-full pr-11 py-6"
                    onChange={handleChange}
                />
                {loadingPlaces && (
                    <Loader2 className="absolute right-3 top-1/2 h-4 w-4 animate-spin text-gray-500" />
                )}
            </div>
            {results.length > 0 && (
                <div className="absolute z-20 mt-1 w-full max-w-2xl overflow-y-auto bg-white shadow-md rounded-md border">
                    <ul className="divide-y divide-gray-200">
                        {results.map((place) => (
                            <li
                                key={place.place_id}
                                className="cursor-pointer px-4 py-2 hover:bg-gray-100 text-sm"
                                onClick={() => {
                                    setCenter({
                                        lat: parseFloat(place.lat),
                                        lng: parseFloat(place.lon),
                                    });
                                    setResults([]);
                                }}
                            >
                                {place.display_name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}


            {polygonPoints.length > 1 && (
                <div className="pt-2">
                    <Button
                        variant="default"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => {
                            setPolygonPoints([]);
                            resetFarmCreationDetails();
                        }}
                    >
                        Reset
                    </Button>
                </div>
            )}

            <div className="w-full pt-2">
                <MapContainer
                    center={center as unknown as google.maps.LatLng}
                    zoom={18}
                    polygonPoints={polygonPoints}
                    onPointClick={handlePointClick}
                    additionalMapStyle={{
                        width: "100%",
                        height: "74dvh",
                    }}
                />
            </div>
        </div>
    );
}
