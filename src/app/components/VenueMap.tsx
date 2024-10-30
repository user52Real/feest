// src/app/components/VenueMap.tsx
'use client';

import { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Venue } from '@/app/types/events';

export default function VenueMap({ venue }: { venue: Venue }) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!,
      version: 'weekly',
    });

    loader.load().then((google) => {
      const map = new google.maps.Map(mapRef.current!, {
        center: venue.coordinates,
        zoom: 15,
      });

      new google.maps.Marker({
        position: venue.coordinates,
        map,
        title: venue.name,
      });
    });
  }, [venue]);

  return <div ref={mapRef} className="w-full h-[400px] rounded-lg" />;
}