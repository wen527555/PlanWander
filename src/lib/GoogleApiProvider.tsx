'use client';

import { LoadScript } from '@react-google-maps/api';

import { useGoogleApiStore } from '@/lib/store';

const GoogleApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isGoogleApiLoaded, setGoogleApiLoaded } = useGoogleApiStore();

  return (
    <>
      {!isGoogleApiLoaded && (
        <LoadScript
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY!}
          libraries={['places']}
          onLoad={() => setGoogleApiLoaded(true)}
        />
      )}
      {isGoogleApiLoaded && children}
    </>
  );
};

export default GoogleApiProvider;
