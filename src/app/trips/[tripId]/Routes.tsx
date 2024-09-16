import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useMemo, useState } from 'react';
import { Layer, Source } from 'react-map-gl';

// interface Route {
//   start: {
//     latitude: number;
//     longitude: number;
//   };
//   end: {
//     latitude: number;
//     longitude: number;
//   };
//   color: string;
// }

interface Places {
  name: string;
  lat: number;
  lng: number;
  color: string;
  number: number;
}

const getRoute = async (
  start: { longitude: number; latitude: number },
  end: { longitude: number; latitude: number }
) => {
  const accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?geometries=geojson&access_token=${accessToken}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.routes[0].geometry;
};

const RouteLayer: React.FC<{ place: Places[] }> = ({ places }) => {
  const geojson = useMemo(
    () => ({
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: places.map((place) => [place.lng, place.lat]),
      },
    }),
    [places]
  );

  return (
    <>
      <Source type="geojson" data={geojson}>
        <Layer
          id={`route-line`}
          type="line"
          paint={{
            'line-color': '#9a9a9a',
            'line-width': 2,
            //   'line-opacity': 0.9,
            'line-dasharray': [3, 3],
          }}
        />
      </Source>
    </>
  );
};

export default RouteLayer;
