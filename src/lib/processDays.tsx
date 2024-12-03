import { getColorForDate } from '@/lib/colors';

interface Place {
  name: string;
  latitude: number;
  longitude: number;
  color: string;
  number: number;
  route?: {
    type: 'LineString';
    coordinates: { lat: number; lng: number }[];
  };
}

interface Route {
  type: string;
  coordinates: [number, number][];
  color?: string;
}

interface Day {
  places: Place[];
  route?: Route;
}

export const processDays = (days: Day[]): { places: Place[]; route: Route[] } => {
  const places: Place[] = [];
  const route: Route[] = [];
  days.forEach((day, dayIndex) => {
    const color = getColorForDate(dayIndex);
    day.places?.forEach((place, index) => {
      places.push({
        ...place,
        color,
        number: index + 1,
      });

      if (place.route) {
        route.push({
          type: place.route.type,
          coordinates: place.route.coordinates.map((coord: { lat: number; lng: number }) => [coord.lng, coord.lat]),
          color: color,
        });
      }
    });
  });
  return { places, route };
};
