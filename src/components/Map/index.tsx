import mapboxgl from 'mapbox-gl';
import { useEffect } from 'react';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

const Map: React.FC = () => {
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [121.5654, 25.033],
      zoom: 8,
      localIdeographFontFamily: "'Noto Sans CJK TC'",
    });
    return () => {
      map.remove();
    };
  }, []);

  return <div id="map" style={{ width: '100%', height: '100vh' }} />;
};

export default Map;
