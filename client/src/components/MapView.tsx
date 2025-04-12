import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Destination } from "@shared/schema";
import L from 'leaflet';

// Fix default icon issue in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapViewProps {
  destinations: Destination[];
  height?: string;
  selectedDestinations?: number[];
  onDestinationSelect?: (id: number) => void;
}

// Component to recenter the map when destinations change
function SetMapView({ destinations }: { destinations: Destination[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (destinations.length === 0) return;
    
    if (destinations.length === 1) {
      map.setView(
        [parseFloat(destinations[0].latitude), parseFloat(destinations[0].longitude)], 
        10
      );
    } else {
      // Create bounds from all destinations
      const bounds = L.latLngBounds(
        destinations.map(d => [parseFloat(d.latitude), parseFloat(d.longitude)])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [destinations, map]);
  
  return null;
}

export default function MapView({ destinations, height = "400px", selectedDestinations = [], onDestinationSelect }: MapViewProps) {
  const [mapKey, setMapKey] = useState(0);

  // Update map key when destinations change to force re-render
  useEffect(() => {
    setMapKey(prev => prev + 1);
  }, [destinations.length]);

  // Custom marker icon for selected destinations
  const selectedIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  return (
    <div style={{ height }}>
      {destinations.length > 0 ? (
        <MapContainer 
          key={mapKey} 
          style={{ height: "100%", width: "100%" }} 
          center={[0, 0]} 
          zoom={2} 
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {destinations.map((destination) => (
            <Marker 
              key={destination.id} 
              position={[parseFloat(destination.latitude), parseFloat(destination.longitude)]}
              icon={selectedDestinations.includes(destination.id) ? selectedIcon : new L.Icon.Default()}
              eventHandlers={{
                click: () => {
                  if (onDestinationSelect) {
                    onDestinationSelect(destination.id);
                  }
                }
              }}
            >
              <Popup>
                <div>
                  <h3 className="font-bold">{destination.name}</h3>
                  <p className="text-sm">{destination.country}</p>
                  {destination.popularAttractions && destination.popularAttractions.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-medium">Popular Attractions:</p>
                      <ul className="text-xs list-disc list-inside">
                        {destination.popularAttractions.slice(0, 3).map((attraction, index) => (
                          <li key={index}>{attraction}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
          
          <SetMapView destinations={destinations} />
        </MapContainer>
      ) : (
        <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-md">
          <p className="text-gray-500">No destinations available</p>
        </div>
      )}
    </div>
  );
}
