import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Destination } from '@shared/schema';
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from '@/lib/constants';

interface MapProps {
  destinations?: Destination[];
  height?: string;
  center?: [number, number];
  zoom?: number;
  onDestinationSelect?: (destination: Destination) => void;
  selectedDestination?: Destination | null;
}

// Component to handle map recenter
function MapUpdater({ center, zoom }: { center?: [number, number]; zoom?: number }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || map.getZoom());
    }
  }, [center, zoom, map]);
  
  return null;
}

export default function Map({ 
  destinations = [], 
  height = '500px',
  center = DEFAULT_MAP_CENTER as [number, number], 
  zoom = DEFAULT_MAP_ZOOM,
  onDestinationSelect,
  selectedDestination
}: MapProps) {
  const [activeDestination, setActiveDestination] = useState<Destination | null>(selectedDestination || null);
  
  // Update active destination when selectedDestination changes
  useEffect(() => {
    if (selectedDestination) {
      setActiveDestination(selectedDestination);
    }
  }, [selectedDestination]);
  
  // Handle marker click
  const handleMarkerClick = (destination: Destination) => {
    setActiveDestination(destination);
    if (onDestinationSelect) {
      onDestinationSelect(destination);
    }
  };
  
  return (
    <div style={{ height }} className="rounded-lg shadow-md overflow-hidden border border-gray-200">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {destinations.map((destination) => (
          <Marker 
            key={destination.id}
            position={[destination.lat, destination.lng]}
            eventHandlers={{
              click: () => handleMarkerClick(destination),
            }}
          >
            <Popup>
              <div className="text-center">
                <h3 className="font-semibold text-lg">{destination.name}</h3>
                <p className="text-gray-500 text-sm">{destination.country}</p>
                <button 
                  className="mt-2 text-xs bg-primary text-white px-2 py-1 rounded hover:bg-primary/90"
                  onClick={() => handleMarkerClick(destination)}
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {activeDestination && (
          <MapUpdater 
            center={[activeDestination.lat, activeDestination.lng]} 
            zoom={10} 
          />
        )}
      </MapContainer>
    </div>
  );
}
