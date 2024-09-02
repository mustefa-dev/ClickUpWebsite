import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface LocationPickerProps {
    onChange: (location: { lat: number, lng: number }) => void;
    className?: string;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ onChange, className }) => {
    const [position, setPosition] = useState<{ lat: number, lng: number } | null>(null);

    const LocationMarker = () => {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                setPosition({ lat, lng });
                onChange({ lat, lng });
            },
        });

        return position === null ? null : (
            <Marker position={position} />
        );
    };

    return (
        <div className={className}>
            <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: "400px", width: "100%" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <LocationMarker />
            </MapContainer>
        </div>
    );
};

export default LocationPicker;