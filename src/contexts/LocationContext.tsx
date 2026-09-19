import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
}

interface LocationContextType {
  location: LocationCoordinates | null;
  loading: boolean;
  error: string | null;
  permission: PermissionState | 'unknown';
  requestLocation: () => void;
}

const LocationContext =
  createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [location, setLocation] =
    useState<LocationCoordinates | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [permission, setPermission] =
    useState<PermissionState | 'unknown'>('unknown');

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError(
        'تحديد الموقع غير مدعوم في هذا المتصفح.'
      );
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });

        setPermission('granted');
        setLoading(false);
      },
      (positionError) => {
        setLoading(false);

        if (positionError.code === 1) {
          setPermission('denied');
          setError(
            'تم رفض الوصول إلى موقعك. يمكنك السماح به من إعدادات المتصفح.'
          );
        } else if (positionError.code === 2) {
          setError(
            'تعذر تحديد موقعك حاليًا. حاول مرة أخرى.'
          );
        } else if (positionError.code === 3) {
          setError(
            'انتهى وقت تحديد الموقع. حاول مرة أخرى.'
          );
        } else {
          setError(
            'حدث خطأ أثناء تحديد موقعك.'
          );
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 30000,
      }
    );
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return (
    <LocationContext.Provider
      value={{
        location,
        loading,
        error,
        permission,
        requestLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation(): LocationContextType {
  const context = useContext(LocationContext);

  if (!context) {
    throw new Error(
      'useLocation must be used inside a LocationProvider'
    );
  }

  return context;
}

export default LocationContext;