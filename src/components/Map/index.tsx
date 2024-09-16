import { LngLatBounds } from 'mapbox-gl';
import React, { useEffect, useRef, useState } from 'react';
import { Map, Marker, ViewStateChangeEvent } from 'react-map-gl';

import RouteLayer from '@/app/trips/[tripId]/Routes';

import 'mapbox-gl/dist/mapbox-gl.css';

interface Place {
  name: string;
  lat: number;
  lng: number;
  color: string;
  number: number;
}

interface Route {
  start: {
    lat: number;
    lng: number;
  };
  end: {
    lat: number;
    lng: number;
  };
  color: string;
}

interface MapComponentProps {
  placesWithMarkerAndRoutes: {
    places: Place[];
  };
}

const MapComponent: React.FC<MapComponentProps> = ({ placesWithMarkerAndRoutes }) => {
  const mapRef = useRef<any>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  // const [isStyleLoaded, setIsStyleLoaded] = useState(false);
  const [viewState, setViewState] = useState({
    longitude: 0,
    latitude: 0,
    zoom: 1.5,
  });

  const { places } = placesWithMarkerAndRoutes;

  useEffect(() => {
    if (mapRef.current && isMapLoaded && places.length > 0) {
      setTimeout(() => {
        const bounds = new LngLatBounds();
        places.forEach((place) => bounds.extend([place.lng, place.lat]));

        mapRef.current.fitBounds(bounds, {
          padding: 50,
          maxZoom: 15,
        });
      }, 300);
    }
  }, [places, isMapLoaded]);

  const handleMapLoad = () => {
    setIsMapLoaded(true);
  };

  const handleViewStateChange = (evt: ViewStateChangeEvent) => {
    setViewState(evt.viewState);
  };

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Map
        {...viewState}
        onMove={handleViewStateChange}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/wen527555/cm14ozgao042001pqbf590bfy"
        onLoad={handleMapLoad}
        ref={mapRef}
      >
        {places?.map((place, index) => (
          <Marker
            key={index}
            longitude={place.lng}
            latitude={place.lat}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: `${place.color}`,
              borderRadius: '50%',
              border: `1px solid #ffff`,
              width: '30px',
              height: '30px',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '15px',
            }}
          >
            {place.number}
          </Marker>
        ))}
        <RouteLayer places={places} />
      </Map>
    </div>
  );
};

export default MapComponent;
