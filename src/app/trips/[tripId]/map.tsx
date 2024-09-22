import { LngLatBounds } from 'mapbox-gl';
import React, { useEffect, useRef, useState } from 'react';
import { Layer, Map, Marker, Source, ViewStateChangeEvent } from 'react-map-gl';

// import usePlaceStore from '@/lib/store'
import 'mapbox-gl/dist/mapbox-gl.css';

interface Place {
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

interface MapComponentProps {
  places: Place[];
  routes: Route[];
}

const MapComponent: React.FC<MapComponentProps> = ({ places = [], routes = [], onPlaceClick }) => {
  // const { selectedPlace, setSelectedPlace } = usePlaceStore();
  const mapRef = useRef<any>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [viewState, setViewState] = useState({
    longitude: 0,
    latitude: 0,
    zoom: 1.5,
  });

  useEffect(() => {
    if (mapRef.current && isMapLoaded && places.length > 0) {
      const checkIfStyleLoaded = () => {
        if (mapRef.current.isStyleLoaded()) {
          const bounds = new LngLatBounds();
          places.forEach((place) => bounds.extend([place.lng, place.lat]));
          mapRef.current.fitBounds(bounds, {
            padding: 50,
            maxZoom: 15,
          });
        } else {
          setTimeout(checkIfStyleLoaded, 1000);
        }
      };

      checkIfStyleLoaded();
    }
  }, [places, isMapLoaded]);

  const handleMapLoad = () => {
    setIsMapLoaded(true);
  };

  const handleViewStateChange = (evt: ViewStateChangeEvent) => {
    setViewState(evt.viewState);
  };

  const handleMarkerClick = (place: Place) => {
    onPlaceClick(place);
    // setViewState({
    //   longitude: place.lng,
    //   latitude: place.lat,
    //   zoom: viewState.zoom,
    // });
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
              border: `2px solid #ffff`,
              width: '32px',
              height: '32px',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '15px',
            }}
            onClick={() => handleMarkerClick(place)}
          >
            {place.number}
          </Marker>
        ))}
        {/* {selectedPlace && (
          <Popup
            longitude={selectedPlace.lng}
            latitude={selectedPlace.lat}
            onClose={() => setSelectedPlace(null)}
            closeOnClick={false}
          >
            <div>
              <h3>{selectedPlace.name}</h3>
            </div>
          </Popup>
        )} */}
        {/* <RouteLayer places={places} /> */}
        {routes?.map((route, index) => (
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
                //   'line-opacity': 0.9,
                // 'line-dasharray': [3, 3],
              }}
            />
          </Source>
        ))}
      </Map>
    </div>
  );
};

export default MapComponent;
