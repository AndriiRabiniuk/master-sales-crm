import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { FiMapPin } from 'react-icons/fi';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useRouter } from 'next/navigation';

// Initialize Mapbox
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
if (!MAPBOX_TOKEN) {
  console.error('Mapbox token is not set in environment variables');
}
mapboxgl.accessToken = MAPBOX_TOKEN || '';

interface Client {
  _id: string;
  name: string;
  latitude: string;
  longitude: string;
  address?: string;
}

interface ClientMapProps {
  clients: Client[];
}

const ClientMap: React.FC<ClientMapProps> = ({ clients }) => {
  const router = useRouter();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapLoading, setMapLoading] = useState(true);

  // Initialize map
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!mapContainer.current || !MAPBOX_TOKEN) {
      setMapError('Map initialization failed');
      setMapLoading(false);
      return;
    }

    const initializeMap = async () => {
      try {
        setMapLoading(true);

        // Clean up existing map
        if (map.current) {
          map.current.remove();
        }

        // Create new map
        const newMap = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/light-v11',
          center: [-7.9811, 31.6295],
          zoom: 6,
          attributionControl: false
        });

        // Add navigation controls
        newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // Wait for map to load
        await new Promise((resolve) => {
          newMap.on('load', resolve);
        });

        map.current = newMap;
        setMapError(null);
        setMapLoading(false);
      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError('Error loading map');
        setMapLoading(false);
      }
    };

    initializeMap();

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
    };
  }, []);

  // Add markers when map is loaded and clients change
  useEffect(() => {
    if (!map.current || mapLoading || !clients.length) return;

    // Remove existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    const validClients = clients.filter(client => client.latitude && client.longitude);
    const markers: mapboxgl.Marker[] = [];

    validClients.forEach((client) => {
      // Create marker element
      const el = document.createElement('div');
      el.className = "marker";
      el.style.width = "20px";
      el.style.height = "20px";
      el.style.backgroundColor = "#4F46E5";
      el.style.borderRadius = "50%";
      el.style.border = "2px solid white";
      el.style.boxShadow = "0 0 0 2px #4F46E5";
      el.style.cursor = "pointer";

      // Create popup content
      const popupContent = document.createElement("div");
      popupContent.innerHTML = `
        <div class="p-2">
          <h3 class="font-semibold">${client.name}</h3>
          <button id="viewClient" class="text-blue-500 underline">View Client leads</button>
        </div>
      `;

      // Add click handler
      popupContent.querySelector("#viewClient")?.addEventListener("click", () => {
        router.push(`/leads?client_id=${client._id}`);
      });

      // Create marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([parseFloat(client.longitude), parseFloat(client.latitude)])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setDOMContent(popupContent)
        )
        .addTo(map.current!);

      markers.push(marker);
    });

    // Store markers for cleanup
    markersRef.current = markers;

    // Fit bounds if we have valid clients
    if (validClients.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      validClients.forEach((client) => {
        bounds.extend([parseFloat(client.longitude), parseFloat(client.latitude)]);
      });
      map.current.fitBounds(bounds, { padding: 50 });
    }
  }, [clients, mapLoading, router]);

  return (
    <div className="mt-8 bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <FiMapPin className="h-6 w-6 text-indigo-600 mr-2" />
          <h3 className="text-lg leading-6 font-medium text-gray-900">Client Locations</h3>
        </div>
        <div className="text-sm text-gray-500">
          {clients.filter(c => c.latitude && c.longitude).length} clients on map
        </div>
      </div>
      {mapError ? (
        <div className="w-full h-[400px] rounded-lg flex items-center justify-center bg-gray-50">
          <p className="text-red-500">{mapError}</p>
        </div>
      ) : (
        <div className="relative">
          <div ref={mapContainer} className="w-full h-[400px] rounded-lg" />
          {mapLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
              <div className="flex flex-col items-center">
                <LoadingSpinner />
                <p className="mt-2 text-sm text-gray-600">Loading map...</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClientMap; 