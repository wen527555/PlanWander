import React from 'react';

import BaseMap from '@/components/CommonMap';

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
  visiblePlace: string | null;
  onMarkerClick: (place: string) => void;
}

const ArticleMap: React.FC<MapProps> = ({ places = [], routes = [], visiblePlace, onMarkerClick }) => {
  return (
    <BaseMap
      places={places}
      routes={routes}
      selectedPlace={visiblePlace}
      onMarkerClick={onMarkerClick}
      isArticle={true}
    />
  );
};

export default ArticleMap;
