import BaseMap from '@/components/BaseMap';
import { usePlaceStore } from '@/lib/store';

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
}

const TripMap: React.FC<MapProps> = ({ places = [], routes = [] }) => {
  const { selectedPlace, setSelectedPlace } = usePlaceStore();
  const handleMarkerClick = (place: Place) => {
    setSelectedPlace(place);
  };

  return (
    <BaseMap
      places={places}
      routes={routes}
      selectedPlace={selectedPlace}
      onMarkerClick={handleMarkerClick}
      isArticle={false}
    />
  );
};

export default TripMap;
