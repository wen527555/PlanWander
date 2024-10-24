import { LngLatBounds } from 'mapbox-gl';
import React, { useEffect, useRef, useState } from 'react';
import { Layer, Map, Marker, Source, ViewStateChangeEvent } from 'react-map-gl';
import styled, { css, keyframes } from 'styled-components';

import 'mapbox-gl/dist/mapbox-gl.css';

interface Place {
  id: string;
  name: string;
  lat: number;
  lng: number;
  color: string;
  number: number;
}

interface Route {
  color: string;
  type: string;
  coordinates: [number, number][];
}

interface MapProps {
  places: Place[];
  routes: Route[];
  onMarkerClick: (place: any) => void;
  selectedPlace?: any | null;
  isArticle: boolean;
}

const BaseMap: React.FC<MapProps> = ({ places = [], routes = [], onMarkerClick, selectedPlace, isArticle }) => {
  const mapRef = useRef<any>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [viewState, setViewState] = useState({
    longitude: 0,
    latitude: 0,
    zoom: 1.5,
  });

  const handleMapLoad = () => {
    const map = mapRef.current;
    if (map && map.isStyleLoaded()) {
      setIsMapLoaded(true);
    }
  };

  const handleStyleLoad = () => {
    setIsMapLoaded(true);
  };

  useEffect(() => {
    const map = mapRef.current;
    if (map) {
      if (map.isStyleLoaded()) {
        setIsMapLoaded(true);
      } else {
        map.on('style.load', handleStyleLoad);
        return () => {
          map.off('style.load', handleStyleLoad);
        };
      }
    }
  }, [mapRef]);

  useEffect(() => {
    if (mapRef.current && isMapLoaded && places.length > 0) {
      const bounds = new LngLatBounds();
      places.forEach((place) => bounds.extend([place.lng, place.lat]));
      mapRef.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15,
      });
    }
  }, [places, isMapLoaded]);

  useEffect(() => {
    if (!isArticle && mapRef.current && isMapLoaded && places.length > 0 && !selectedPlace) {
      const bounds = new LngLatBounds();
      places.forEach((place) => bounds.extend([place.lng, place.lat]));
      mapRef.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15,
      });
    }
  }, [places, isMapLoaded]);

  useEffect(() => {
    if (!isArticle && selectedPlace && mapRef.current) {
      mapRef.current.flyTo({
        center: [selectedPlace.lng, selectedPlace.lat],
        zoom: 14,
        speed: 1.2,
        curve: 1,
        essential: false,
      });
    }
  }, [selectedPlace]);

  useEffect(() => {
    if (isArticle && selectedPlace && isMapLoaded && mapRef.current) {
      const place = places.find((p) => p.id === selectedPlace);
      if (place) {
        mapRef.current.flyTo({
          center: [place.lng, place.lat],
          zoom: 14,
          speed: 1.2,
          curve: 1,
        });
      }
    }
  }, [selectedPlace, places, isMapLoaded]);

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
        {isMapLoaded &&
          places?.map((place, index) => (
            <Marker
              key={index}
              longitude={place.lng}
              latitude={place.lat}
              onClick={() => onMarkerClick(isArticle ? place.id : place)}
            >
              <MarkerWrapper
                color={place.color}
                isActive={isArticle ? selectedPlace === place.id : selectedPlace?.id === place.id}
              >
                {place.number}
              </MarkerWrapper>
            </Marker>
          ))}

        {isMapLoaded &&
          routes?.map((route, index) => (
            <Source
              key={`route-${index}`}
              id={`route-${index}`}
              type="geojson"
              data={{
                type: 'Feature',
                geometry: {
                  type: route.type,
                  coordinates: route.coordinates,
                },
              }}
            >
              <Layer
                key={`route-${index}`}
                id={`route-${index}`}
                type="line"
                paint={{
                  'line-color': route.color,
                  'line-width': 5,
                }}
              />
            </Source>
          ))}
      </Map>
    </div>
  );
};

export default BaseMap;

const framesColor = (color: string) => keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(${color}, 0.7);
  }
  100% {
    box-shadow: 0 0 0 20px rgba(${color}, 0);
  }
`;

const hexToRgb = (hex: string) => {
  hex = hex.replace('#', '');
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `${r}, ${g}, ${b}`;
};

const MarkerWrapper = styled.div<{ color: string; isActive: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ color }) => color};
  border-radius: 50%;
  border: 2px solid white;
  width: 32px;
  height: 32px;
  color: white;
  font-weight: bold;
  font-size: 15px;
  cursor: pointer;
  position: relative;
  z-index: ${({ isActive }) => (isActive ? 100 : 1)};
  &:hover {
    ${({ color }) => css`
      animation: ${framesColor(hexToRgb(color))} 1s ease infinite;
    `}
    border: 2px solid ${({ color }) => color};
  }

  &:active {
    ${({ color }) => css`
      animation: ${framesColor(hexToRgb(color))} 1s ease infinite;
    `}
    border: 2px solid ${({ color }) => color};
  }

  ${({ color, isActive }) =>
    isActive &&
    css`
      animation: ${framesColor(hexToRgb(color))} 1s ease infinite;
      border: 2px solid ${color};
      width: 36px;
      height: 36px;
      font-size: 16px;
    `}
`;
