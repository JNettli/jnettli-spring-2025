import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const customMarkerIcon = new L.Icon({
    iconUrl: "/src/assets/favicon/favicon.svg",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
});

const MapPicker = ({ onLocationSelect }) => {
    const [markerPosition, setMarkerPosition] = useState(null);

    const getAddress = async (lat, lng) => {
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
            );
            const data = await res.json();
            return {
                address: data.address.road || "",
                houseNumber: data.address.house_number || "",
                city:
                    data.address.city ||
                    data.address.town ||
                    data.address.village ||
                    "",
                zip: data.address.postcode || "",
                country: data.address.country || "",
                continent: data.address.continent || "",
                lat,
                lng,
            };
        } catch (error) {
            console.error("Error fetching address:", error);
            return { lat, lng };
        }
    };

    const LocationMarker = () => {
        useMapEvents({
            click: async (e) => {
                const { lat, lng } = e.latlng;
                setMarkerPosition([lat, lng]);

                const locationInfo = await getAddress(lat, lng);

                if (onLocationSelect) {
                    onLocationSelect(locationInfo);
                }
            },
        });

        return markerPosition ? (
            <Marker position={markerPosition} icon={customMarkerIcon} />
        ) : null;
    };

    return (
        <div className="w-full h-100">
            <MapContainer center={[52, 8]} zoom={3} className="h-full w-full">
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />
                <LocationMarker />
            </MapContainer>
        </div>
    );
};

function MapDisplay({ lat, lng }) {
    if (lat === null || lng === null) {
        return (
            <p>
                There seems to be an issue with the provided map data. Ask the
                venue manager for updated map details!
            </p>
        );
    } else if (lat === 0 && lng === 0) {
        lat = -50.605630278205524;
        lng = 165.9734630584717;
        return (
            <MapContainer
                center={[lat, lng]}
                zoom={13}
                style={{ height: "400px", width: "100%" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />
                <Marker position={[lat, lng]} icon={customMarkerIcon} />
            </MapContainer>
        );
    } else {
        return (
            <MapContainer
                center={[lat, lng]}
                zoom={13}
                style={{ height: "400px", width: "100%" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />
                <Marker position={[lat, lng]} icon={customMarkerIcon} />
            </MapContainer>
        );
    }
}

export { MapPicker, MapDisplay };
