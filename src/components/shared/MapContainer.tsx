import React, { useCallback, useRef, useState } from "react";
import { GoogleMap, LoadScript, Marker, Polygon } from "@react-google-maps/api";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";

type LatLng = { lat: number; lng: number };

type MapArgs = {
    center: google.maps.LatLng;
    zoom?: number;
    additionalMapStyle?: React.CSSProperties;
    polygonPoints?: LatLng[];
    onPointClick?: (lat: number, lng: number) => void;
    autofit?: boolean;
};

export default function MapContainers({
    center,
    additionalMapStyle,
    zoom = 17,
    polygonPoints,
    autofit,
    onPointClick,
}: MapArgs) {
    const mapRef = useRef<google.maps.Map | null>(null);
    const [mapCenter, setMapCenter] = useState<google.maps.LatLng>(center);

    const onLoad = useCallback(
        (map: google.maps.Map) => {
            mapRef.current = map;

            if (autofit && polygonPoints && polygonPoints.length > 0) {
                const bounds = new google.maps.LatLngBounds();
                polygonPoints.forEach((point) => bounds.extend(point));
                if (autofit && polygonPoints && polygonPoints.length > 0) {
                    const bounds = new google.maps.LatLngBounds();
                    polygonPoints.forEach((point) => bounds.extend(point));
                    map.fitBounds(bounds, 50); // <- pass number directly
                }
            }

            // Custom Tile Layer
        },
        [autofit, polygonPoints]
    );

    const onUnmount = useCallback(() => {
        mapRef.current = null;
    }, []);

    const mapOptions: google.maps.MapOptions = {
        zoomControl: true,
        streetViewControl: false,
        fullscreenControl: false,
        mapTypeControl: false,
        maxZoom: 20,
        minZoom: 6,
        mapTypeId: "hybrid",
        styles: styles,
    };

    const mapStyle: React.CSSProperties = {
        height: "600px",
        borderRadius: "0rem",
        overflow: "hidden",
        position: "relative",
        aspectRatio: 1,
    };

    // const handleZoomChanged = useCallback(() => {
    //     if (!mapRef.current) return;
    // }, []);

    const handleMapClick = (event: google.maps.MapMouseEvent) => {
        const lat = event.latLng?.lat();
        const lng = event.latLng?.lng();
        if (lat && lng) {
            const newCenter = new google.maps.LatLng(lat, lng);

            setMapCenter(new google.maps.LatLng(lat, lng));
            if (mapRef.current) {
                mapRef.current.panTo(newCenter);
                onPointClick && onPointClick(lat, lng);
            }
        }
    };

    return (
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API}>
            {(center?.lat as any) ? (
                <GoogleMap
                    mapContainerStyle={{ ...mapStyle, ...additionalMapStyle }}
                    center={center}
                    zoom={zoom}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                    options={mapOptions}
                    // onZoomChanged={handleZoomChanged}
                    onClick={handleMapClick}
                >
                    <Marker
                        position={mapCenter as google.maps.LatLng}
                        options={{
                            clickable: false,
                            title: "My Farm", // Prevents any hover popups
                        }}
                    />
                    {polygonPoints && polygonPoints.length > 0 && (
                        <Polygon
                            path={polygonPoints}
                            options={{
                                fillColor: "#00A63E",
                                fillOpacity: 0.8,
                                strokeColor: "red",
                                strokeOpacity: 0.5,
                                strokeWeight: 2,
                                clickable: true,
                                editable: false,
                                zIndex: 1,
                            }}
                        />
                    )}
                </GoogleMap>
            ) : (
                <div className="max-w-2xl">
                <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>Provide location for this farm</AlertDescription>
                </Alert>
            </div>
            )}
        </LoadScript>
    );
}

const styles = [
    {
        featureType: "all",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
    },
    {
        featureType: "administrative",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
    },
    {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
    },
    {
        featureType: "road",
        elementType: "labels",
        stylers: [{ visibility: "on" }],
    },
    {
        featureType: "transit",
        elementType: "labels",
        stylers: [{ visibility: "on" }],
    },
    {
        featureType: "water",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
    },
];
