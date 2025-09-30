'use client';

import { useEffect, useRef } from 'react';

export default function ChaletMap({ coordinates, title, address }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.L && mapRef.current && !mapInstanceRef.current) {
      // Initialize map
      mapInstanceRef.current = window.L.map(mapRef.current).setView(
        [coordinates.latitude, coordinates.longitude], 
        13
      );

      // Add OpenStreetMap tiles
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);

      // Add marker
      const marker = window.L.marker([coordinates.latitude, coordinates.longitude])
        .addTo(mapInstanceRef.current);

      // Add popup
      marker.bindPopup(`
        <div class="p-2">
          <h3 class="font-semibold text-sm mb-1">${title}</h3>
          <p class="text-xs text-gray-600">${address}</p>
        </div>
      `);
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [coordinates, title, address]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full"
      style={{ minHeight: '300px' }}
    />
  );
}