'use client';

interface CountryAPIResponse {
  name: {
    common: string;
  };
  cca3: string;
  flags: {
    png: string;
  };
}

interface Country {
  name: string;
  code: string;
  flag: string;
}

interface Coordinates {
  lat: number;
  lng: number;
}

export const getRoute = async (start: Coordinates, end: Coordinates, mode: string = 'driving') => {
  const accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;
  const url = `https://api.mapbox.com/directions/v5/mapbox/${mode}/${start.lng},${start.lat};${end.lng},${end.lat}?geometries=geojson&access_token=${accessToken}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    const route = data.routes[0];
    const duration = route.duration;
    const distance = (route.distance / 1000).toFixed(2);

    return {
      coordinates: route.geometry.coordinates,
      type: 'LineString',
      duration: duration,
      distance: distance,
    };
  } catch (error) {
    console.error('Error fetching route:', error);
    return null;
  }
};

export const fetchCountries = async (): Promise<Country[]> => {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all');
    if (!response.ok) {
      throw new Error('Failed to fetch countries');
    }
    const data: CountryAPIResponse[] = await response.json();
    return data.map((country) => ({
      name: country.name.common,
      code: country.cca3,
      flag: country.flags?.png,
    }));
  } catch (error) {
    console.error('Error fetching countries', error);
    return [];
  }
};

export const fetchCountryImage = async (countryName: string): Promise<string | null> => {
  const unsplashAccessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${countryName}&client_id=${unsplashAccessKey}&per_page=1`
  );
  const data = await res.json();

  if (data.results && data.results.length > 0) {
    return data.results[0].urls.regular;
  }
  return null;
};
