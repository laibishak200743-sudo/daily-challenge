import React, { useEffect, useState } from 'react';
import {
  Search,
  Navigation,
  Loader2,
  Car,
  Footprints,
  Bike,
  Plane,
  Bus,
  Clock,
  Route,
} from 'lucide-react';

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocation } from '@/contexts/LocationContext';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

/* =========================================================
   LEAFLET DEFAULT ICON
========================================================= */

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

/* =========================================================
   TYPES
========================================================= */

type TransportMode =
  | 'car'
  | 'bus'
  | 'walk'
  | 'bike'
  | 'plane';

/* =========================================================
   MAP SIZE FIX
========================================================= */

function MapSizeFix() {
  const map = useMap();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      map.invalidateSize(true);
    }, 200);

    return () => {
      window.clearTimeout(timer);
    };
  }, [map]);

  return null;
}

/* =========================================================
   MAP BOUNDS
========================================================= */

function MapBoundsUpdater({
  pointA,
  pointB,
}: {
  pointA: [number, number];
  pointB: [number, number] | null;
}) {
  const map = useMap();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (pointB) {
        const bounds = L.latLngBounds([
          pointA,
          pointB,
        ]);

        map.fitBounds(bounds, {
          padding: [60, 60],
          maxZoom: 10,
          animate: false,
        });
      } else {
        map.setView(pointA, 4, {
          animate: false,
        });
      }

      map.invalidateSize(true);
    }, 150);

    return () => {
      window.clearTimeout(timer);
    };
  }, [map, pointA, pointB]);

  return null;
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function TravelMap() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const { location } = useLocation();

  const isLight = theme === 'light';
  const isRtl = language === 'ar';

  /* =======================================================
     TRANSLATIONS
  ======================================================= */

  const translations = {
    en: {
      title: 'Real Road Route Calculator',

      searchPlaceholder:
        'Search any place, hotel, restaurant, hospital, airport...',

      search: 'Search',

      setA: 'Set (A)',

      routeSettings:
        'Select transport mode for routing:',

      car: 'Car',
      bus: 'Bus',
      walk: 'Walk',
      bike: 'Bike',
      plane: 'Plane',

      pointA: 'Point (A)',
      pointB: 'Point (B)',

      changeA: 'Change (A)...',
      changeB: 'Change (B)...',

      set: 'Set',

      notSelected:
        'Not selected yet',

      selectDestination:
        'Select destination (B)',

      distanceTime:
        'Actual distance & time',

      km: 'km',
      mins: 'mins',
      approx: 'approx',

      destinationSearch:
        'Search destination or any place',

      roadRoute:
        'Real Road Network Route',

      busRoute:
        'Bus Road Route',

      flightRoute:
        'Direct Flight Route',

      pointALabel:
        'Point (A): ',

      pointBLabel:
        'Point (B): ',

      noRoad:
        'No connected road route was found between these points. Switched to plane.',

      routeError:
        'Unable to calculate this route. Please try again.',

      searchError:
        'Location could not be found.',
    },

    ar: {
      title:
        'حاسبة المسارات عبر الطرق الحقيقية',

      searchPlaceholder:
        'ابحث عن أي مكان، فندق، مطعم، مستشفى، مطار...',

      search:
        'بحث',

      setA: 'تعيين (أ)',

      routeSettings:
        'اختر وسيلة النقل لحساب المسار:',

      car: 'سيارة',
      bus: 'حافلة',
      walk: 'مشي',
      bike: 'دراجة',
      plane: 'طائرة',

      pointA: 'النقطة (أ)',
      pointB: 'النقطة (ب)',

      changeA: 'تغيير (أ)...',
      changeB: 'تغيير (ب)...',

      set: 'تعيين',

      notSelected:
        'لم يتم التحديد بعد',

      selectDestination:
        'حدد الوجهة (ب)',

      distanceTime:
        'المسافة والوقت الفعلي',

      km: 'كم',
      mins: 'دقيقة',
      approx: 'تقريباً',

      destinationSearch:
        'ابحث عن وجهة أو أي مكان',

      roadRoute:
        'مسار حقيقي يتبع شبكة الطرق',

      busRoute:
        'مسار الحافلة عبر الطرق',

      flightRoute:
        'مسار طيران مباشر',

      pointALabel:
        'النقطة (أ): ',

      pointBLabel:
        'النقطة (ب): ',

      noRoad:
        '🚫 لم يتم العثور على طريق بري متصل بين النقطتين. تم التحويل إلى الطائرة.',

      routeError:
        '⚠️ تعذر حساب هذا المسار. حاول مرة أخرى.',

      searchError:
        '⚠️ لم يتم العثور على الموقع.',
    },

    fr: {
      title:
        'Calculateur d’itinéraires routiers réels',

      searchPlaceholder:
        'Rechercher un lieu, hôtel, restaurant, hôpital, aéroport...',

      search:
        'Rechercher',

      setA: 'Définir (A)',

      routeSettings:
        'Choisissez le moyen de transport :',

      car: 'Voiture',
      bus: 'Bus',
      walk: 'À pied',
      bike: 'Vélo',
      plane: 'Avion',

      pointA: 'Point (A)',
      pointB: 'Point (B)',

      changeA: 'Modifier (A)...',
      changeB: 'Modifier (B)...',

      set: 'Définir',

      notSelected:
        'Pas encore sélectionné',

      selectDestination:
        'Sélectionnez la destination (B)',

      distanceTime:
        'Distance et temps réels',

      km: 'km',
      mins: 'min',
      approx: 'environ',

      destinationSearch:
        'Rechercher une destination ou un lieu',

      roadRoute:
        'Itinéraire réel suivant le réseau routier',

      busRoute:
        'Itinéraire de bus par la route',

      flightRoute:
        'Itinéraire de vol direct',

      pointALabel:
        'Point (A) : ',

      pointBLabel:
        'Point (B) : ',

      noRoad:
        '🚫 Aucun itinéraire routier connecté trouvé entre ces points. Passage à l’avion.',

      routeError:
        '⚠️ Impossible de calculer cet itinéraire. Veuillez réessayer.',

      searchError:
        '⚠️ Emplacement introuvable.',
    },

    es: {
      title:
        'Calculadora de rutas por carreteras reales',

      searchPlaceholder:
        'Buscar lugar, hotel, restaurante, hospital, aeropuerto...',

      search:
        'Buscar',

      setA: 'Establecer (A)',

      routeSettings:
        'Selecciona el medio de transporte:',

      car: 'Coche',
      bus: 'Autobús',
      walk: 'A pie',
      bike: 'Bicicleta',
      plane: 'Avión',

      pointA: 'Punto (A)',
      pointB: 'Punto (B)',

      changeA: 'Cambiar (A)...',
      changeB: 'Cambiar (B)...',

      set: 'Establecer',

      notSelected:
        'Aún no seleccionado',

      selectDestination:
        'Selecciona el destino (B)',

      distanceTime:
        'Distancia y tiempo reales',

      km: 'km',
      mins: 'min',
      approx: 'aprox.',

      destinationSearch:
        'Buscar destino o cualquier lugar',

      roadRoute:
        'Ruta real siguiendo la red de carreteras',

      busRoute:
        'Ruta de autobús por carretera',

      flightRoute:
        'Ruta de vuelo directo',

      pointALabel:
        'Punto (A): ',

      pointBLabel:
        'Punto (B): ',

      noRoad:
        '🚫 No se encontró una ruta por carretera conectada entre estos puntos. Se cambió al avión.',

      routeError:
        '⚠️ No se pudo calcular esta ruta. Inténtalo de nuevo.',

      searchError:
        '⚠️ No se encontró la ubicación.',
    },
  };

  const text =
    translations[
      language as keyof typeof translations
    ] || translations.en;

  /* =======================================================
     STATES
  ======================================================= */

  const [searchQuery, setSearchQuery] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const [pointAName, setPointAName] =
    useState('Algiers');

  const [pointACoords, setPointACoords] =
    useState<[number, number]>([
      36.7538,
      3.0588,
    ]);

  const [pointBName, setPointBName] =
    useState(text.notSelected);

  const [pointBCoords, setPointBCoords] =
    useState<[number, number] | null>(null);

  const [inputQueryA, setInputQueryA] =
    useState('');

  const [inputQueryB, setInputQueryB] =
    useState('');

  const [transportMode, setTransportMode] =
    useState<TransportMode>('car');

  const [routeCoordinates, setRouteCoordinates] =
    useState<[number, number][]>([
      [36.7538, 3.0588],
    ]);

  const [routeDistance, setRouteDistance] =
    useState(0);

  const [routeDuration, setRouteDuration] =
    useState(0);

  /* =======================================================
     UPDATE DEFAULT B TEXT
  ======================================================= */

  useEffect(() => {
    if (!pointBCoords) {
      setPointBName(text.notSelected);
    }
  }, [language]);

  /* =======================================================
     USER LOCATION
  ======================================================= */

  useEffect(() => {
    if (!location) {
      return;
    }

    const userCoords:
      [number, number] = [
      location.latitude,
      location.longitude,
    ];

    setPointACoords(
      userCoords
    );

    setPointAName(
      language === 'ar'
        ? 'موقعي الحالي'
        : language === 'fr'
          ? 'Ma position actuelle'
          : language === 'es'
            ? 'Mi ubicación actual'
            : 'My current location'
    );
  }, [location]);

  /* =======================================================
     DISTANCE CALCULATOR
  ======================================================= */

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371;

    const dLat =
      (lat2 - lat1) *
      (Math.PI / 180);

    const dLon =
      (lon2 - lon1) *
      (Math.PI / 180);

    const a =
      Math.sin(dLat / 2) *
        Math.sin(dLat / 2) +
      Math.cos(
        lat1 * (Math.PI / 180)
      ) *
        Math.cos(
          lat2 * (Math.PI / 180)
        ) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c =
      2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      );

    return R * c;
  };

  /* =======================================================
     ROUTE CALCULATION
  ======================================================= */

  useEffect(() => {
    if (!pointBCoords) {
      setRouteCoordinates([
        pointACoords,
      ]);

      setRouteDistance(0);
      setRouteDuration(0);

      return;
    }

    /* ================= PLANE ================= */

    if (transportMode === 'plane') {
      const distance =
        calculateDistance(
          pointACoords[0],
          pointACoords[1],
          pointBCoords[0],
          pointBCoords[1]
        );

      setRouteCoordinates([
        pointACoords,
        pointBCoords,
      ]);

      setRouteDistance(distance);

      setRouteDuration(
        (distance / 600) * 60
      );

      return;
    }

    /* ================= ROAD ROUTES ================= */

    const controller =
      new AbortController();

    const calculateRealRoute =
      async () => {
        setLoading(true);

        try {
          let service =
            'routed-car';

          if (
            transportMode ===
            'bike'
          ) {
            service =
              'routed-bike';
          }

          if (
            transportMode ===
            'walk'
          ) {
            service =
              'routed-foot';
          }

          if (
            transportMode ===
            'bus'
          ) {
            service =
              'routed-car';
          }

          const url =
            `https://routing.openstreetmap.de/${service}/route/v1/driving/` +
            `${pointACoords[1]},${pointACoords[0]};` +
            `${pointBCoords[1]},${pointBCoords[0]}` +
            `?overview=full&geometries=geojson&steps=true`;

          const response =
            await fetch(url, {
              signal:
                controller.signal,
            });

          if (!response.ok) {
            throw new Error(
              `Routing server returned ${response.status}`
            );
          }

          const data =
            await response.json();

          if (
            !data ||
            !Array.isArray(
              data.routes
            ) ||
            data.routes.length === 0
          ) {
            alert(text.noRoad);

            setTransportMode(
              'plane'
            );

            return;
          }

          const route =
            data.routes[0];

          if (
            !route.geometry ||
            !route.geometry
              .coordinates ||
            route.geometry.coordinates
              .length < 2
          ) {
            alert(text.noRoad);

            setTransportMode(
              'plane'
            );

            return;
          }

          const coordinates:
            [number, number][] =
            route.geometry.coordinates.map(
              (
                coordinate: [
                  number,
                  number
                ]
              ) => [
                coordinate[1],
                coordinate[0],
              ]
            );

          const distanceKm =
            route.distance / 1000;

          setRouteCoordinates(
            coordinates
          );

          setRouteDistance(
            distanceKm
          );

          /* ================= BUS ================= */

          if (
            transportMode ===
            'bus'
          ) {
            const busMinutes =
              (distanceKm / 45) *
              60;

            setRouteDuration(
              busMinutes
            );
          } else {
            setRouteDuration(
              route.duration / 60
            );
          }
        } catch (error: unknown) {
          if (
            error instanceof Error &&
            error.name ===
              'AbortError'
          ) {
            return;
          }

          console.error(
            'Route calculation error:',
            error
          );

          alert(
            text.routeError
          );
        } finally {
          if (
            !controller.signal
              .aborted
          ) {
            setLoading(false);
          }
        }
      };

    calculateRealRoute();

    return () => {
      controller.abort();
    };
  }, [
    pointACoords,
    pointBCoords,
    transportMode,
  ]);

  /* =======================================================
     TIME FORMAT
  ======================================================= */

  const formatTravelTime = (
    totalMinutes: number
  ) => {
    if (
      !Number.isFinite(
        totalMinutes
      ) ||
      totalMinutes <= 0
    ) {
      return `0 ${text.mins}`;
    }

    if (
      totalMinutes < 60
    ) {
      const minutes =
        Math.max(
          1,
          Math.round(
            totalMinutes
          )
        );

      if (
        language === 'ar'
      ) {
        return `${minutes} ${text.mins} ${text.approx}`;
      }

      if (
        language === 'fr'
      ) {
        return `${text.approx} ${minutes} ${text.mins}`;
      }

      if (
        language === 'es'
      ) {
        return `${text.approx} ${minutes} ${text.mins}`;
      }

      return `~${minutes} ${text.mins}`;
    }

    const hours =
      Math.floor(
        totalMinutes / 60
      );

    const minutes =
      Math.round(
        totalMinutes % 60
      );

    if (
      language === 'ar'
    ) {
      if (minutes > 0) {
        return `${hours} ساعة و ${minutes} دقيقة تقريباً`;
      }

      return `${hours} ساعة تقريباً`;
    }

    if (
      language === 'fr'
    ) {
      if (minutes > 0) {
        return `${hours} h ${minutes} min environ`;
      }

      return `${hours} h environ`;
    }

    if (
      language === 'es'
    ) {
      if (minutes > 0) {
        return `${hours} h ${minutes} min aprox.`;
      }

      return `${hours} h aprox.`;
    }

    if (minutes > 0) {
      return `${hours}h ${minutes}m approx`;
    }

    return `${hours}h approx`;
  };

  /* =======================================================
     MAIN SEARCH
     
     The top search can now search ANY place:
     city, hotel, restaurant, hospital, airport,
     tourist attraction, street, etc.
     
     The result becomes Point B.
  ======================================================= */

  const handleSearchLocation =
    async (
      e?: React.FormEvent
    ) => {
      e?.preventDefault();

      if (
        !searchQuery.trim()
      ) {
        return;
      }

      setLoading(true);

      try {
        const response =
          await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(
              searchQuery
            )}`,
            {
              headers: {
                Accept:
                  'application/json',
              },
            }
          );

        if (!response.ok) {
          throw new Error(
            'Nominatim request failed'
          );
        }

        const data =
          await response.json();

        if (
          data &&
          data.length > 0
        ) {
          const newCoords:
            [number, number] = [
            parseFloat(
              data[0].lat
            ),
            parseFloat(
              data[0].lon
            ),
          ];

          setPointBCoords(
            newCoords
          );

          setPointBName(
            data[0].display_name ||
              searchQuery
          );

          setSearchQuery('');
        } else {
          alert(
            text.searchError
          );
        }
      } catch (error) {
        console.error(
          'Search error:',
          error
        );

        alert(
          text.searchError
        );
      } finally {
        setLoading(false);
      }
    };

  /* =======================================================
     SET POINT A
  ======================================================= */

  const handleSetPointA =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault();

      if (
        !inputQueryA.trim()
      ) {
        return;
      }

      try {
        const response =
          await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(
              inputQueryA
            )}`,
            {
              headers: {
                Accept:
                  'application/json',
              },
            }
          );

        if (!response.ok) {
          throw new Error(
            'Search failed'
          );
        }

        const data =
          await response.json();

        if (
          data &&
          data.length > 0
        ) {
          const coords:
            [number, number] = [
            parseFloat(
              data[0].lat
            ),
            parseFloat(
              data[0].lon
            ),
          ];

          setPointACoords(
            coords
          );

          setPointAName(
            data[0].display_name ||
              inputQueryA
          );

          setInputQueryA('');
        } else {
          alert(
            text.searchError
          );
        }
      } catch (error) {
        console.error(
          error
        );

        alert(
          text.searchError
        );
      }
    };

  /* =======================================================
     SET POINT B
  ======================================================= */

  const handleSetPointB =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault();

      if (
        !inputQueryB.trim()
      ) {
        return;
      }

      try {
        const response =
          await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(
              inputQueryB
            )}`,
            {
              headers: {
                Accept:
                  'application/json',
              },
            }
          );

        if (!response.ok) {
          throw new Error(
            'Search failed'
          );
        }

        const data =
          await response.json();

        if (
          data &&
          data.length > 0
        ) {
          setPointBCoords([
            parseFloat(
              data[0].lat
            ),
            parseFloat(
              data[0].lon
            ),
          ]);

          setPointBName(
            data[0].display_name ||
              inputQueryB
          );

          setInputQueryB('');
        } else {
          alert(
            text.searchError
          );
        }
      } catch (error) {
        console.error(
          error
        );

        alert(
          text.searchError
        );
      }
    };

  /* =======================================================
     TRANSPORT MODES
  ======================================================= */

  const transportModes = [
    {
      id: 'car' as TransportMode,
      label: text.car,
      icon: Car,
    },
    {
      id: 'bus' as TransportMode,
      label: text.bus,
      icon: Bus,
    },
    {
      id: 'walk' as TransportMode,
      label: text.walk,
      icon: Footprints,
    },
    {
      id: 'bike' as TransportMode,
      label: text.bike,
      icon: Bike,
    },
    {
      id: 'plane' as TransportMode,
      label: text.plane,
      icon: Plane,
    },
  ];

  /* =======================================================
     INPUT STYLE
  ======================================================= */

  const inputClass = `
    w-full text-xs px-2.5 py-2 rounded-lg
    border bg-transparent focus:outline-none
    focus:ring-2 focus:ring-cyan-500/30
    transition-all
    ${
      isLight
        ? 'border-slate-300 text-slate-900 placeholder:text-slate-400 bg-white'
        : 'border-slate-700 text-white placeholder:text-slate-500 bg-slate-900/60'
    }
  `;

  /* =======================================================
     RETURN
  ======================================================= */

  return (
    <div
      className={`min-h-screen pt-24 pb-12 transition-colors duration-300 ${
        isLight
          ? 'bg-slate-50'
          : 'bg-slate-950'
      }`}
      dir={
        isRtl
          ? 'rtl'
          : 'ltr'
      }
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* =================================================
            TITLE
        ================================================= */}

        <div className="text-center mb-8">
          <h1
            className={`text-3xl font-extrabold tracking-tight mb-2 ${
              isLight
                ? 'text-slate-900'
                : 'text-white'
            }`}
          >
            {text.title}
          </h1>
        </div>

        {/* =================================================
            MAIN SEARCH
        ================================================= */}

        <div className="max-w-4xl mx-auto mb-6">
          <form
            onSubmit={
              handleSearchLocation
            }
            className="flex items-center gap-2"
          >
            <div
              className={`flex-1 flex items-center gap-3 border rounded-2xl px-4 py-3 shadow-sm ${
                isLight
                  ? 'bg-white border-slate-200'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <Search className="w-5 h-5 text-cyan-500 shrink-0" />

              <input
                type="text"
                value={
                  searchQuery
                }
                onChange={(e) =>
                  setSearchQuery(
                    e.target.value
                  )
                }
                placeholder={
                  text.searchPlaceholder
                }
                className={`w-full bg-transparent text-sm focus:outline-none ${
                  isLight
                    ? 'text-slate-900 placeholder:text-slate-400'
                    : 'text-white placeholder:text-slate-500'
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-60 text-white font-semibold rounded-2xl shadow-lg flex items-center gap-2 transition"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}

              <span>
                {text.search}
              </span>
            </button>
          </form>

          <p
            className={`text-center text-xs mt-2 ${
              isLight
                ? 'text-slate-500'
                : 'text-slate-400'
            }`}
          >
            {text.destinationSearch}
          </p>
        </div>

        {/* =================================================
            TRANSPORT SETTINGS
        ================================================= */}

        <div
          className={`border rounded-3xl p-5 mb-6 shadow-xl ${
            isLight
              ? 'bg-white border-slate-200'
              : 'bg-slate-900 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between flex-wrap gap-4 mb-4 pb-3 border-b border-slate-700/30">

            <div className="flex items-center gap-2">
              <Route className="w-5 h-5 text-cyan-500" />

              <h3
                className={`font-bold text-sm ${
                  isLight
                    ? 'text-slate-900'
                    : 'text-white'
                }`}
              >
                {text.routeSettings}
              </h3>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {transportModes.map(
                (mode) => {
                  const Icon =
                    mode.icon;

                  const active =
                    transportMode ===
                    mode.id;

                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() =>
                        setTransportMode(
                          mode.id
                        )
                      }
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        active
                          ? 'bg-cyan-500 text-white border-cyan-500 shadow-lg shadow-cyan-500/20'
                          : isLight
                            ? 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />

                      <span>
                        {mode.label}
                      </span>
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* =================================================
              POINTS A / B
          ================================================= */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* POINT A */}

            <div
              className={`p-3 rounded-2xl border ${
                isLight
                  ? 'bg-slate-50 border-slate-200'
                  : 'bg-slate-950 border-slate-800'
              }`}
            >
              <span className="text-[10px] text-cyan-500 font-bold block mb-1">
                {text.pointA}
              </span>

              <p
                className={`text-xs font-semibold mb-2 ${
                  isLight
                    ? 'text-slate-800'
                    : 'text-white'
                }`}
              >
                {pointAName}
              </p>

              <form
                onSubmit={
                  handleSetPointA
                }
                className="flex gap-1"
              >
                <input
                  value={
                    inputQueryA
                  }
                  onChange={(e) =>
                    setInputQueryA(
                      e.target.value
                    )
                  }
                  placeholder={
                    text.changeA
                  }
                  className={
                    inputClass
                  }
                />

                <button
                  type="submit"
                  className="px-2.5 py-1 bg-cyan-500 hover:bg-cyan-600 text-white text-[10px] rounded-lg"
                >
                  {text.set}
                </button>
              </form>
            </div>

            {/* POINT B */}

            <div
              className={`p-3 rounded-2xl border ${
                isLight
                  ? 'bg-slate-50 border-slate-200'
                  : 'bg-slate-950 border-slate-800'
              }`}
            >
              <span className="text-[10px] text-purple-500 font-bold block mb-1">
                {text.pointB}
              </span>

              <p
                className={`text-xs font-semibold mb-2 ${
                  isLight
                    ? 'text-slate-800'
                    : 'text-white'
                }`}
              >
                {pointBName}
              </p>

              <form
                onSubmit={
                  handleSetPointB
                }
                className="flex gap-1"
              >
                <input
                  value={
                    inputQueryB
                  }
                  onChange={(e) =>
                    setInputQueryB(
                      e.target.value
                    )
                  }
                  placeholder={
                    text.changeB
                  }
                  className={
                    inputClass
                  }
                />

                <button
                  type="submit"
                  className="px-2.5 py-1 bg-purple-500 hover:bg-purple-600 text-white text-[10px] rounded-lg"
                >
                  {text.set}
                </button>
              </form>
            </div>

            {/* DISTANCE / TIME */}

            <div className="p-3 rounded-2xl border bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-500/30 flex items-center justify-between">

              <div>
                <span className="text-[10px] text-cyan-500 font-bold block">
                  {text.distanceTime}
                </span>

                <p
                  className={`text-xs font-bold ${
                    isLight
                      ? 'text-slate-900'
                      : 'text-white'
                  }`}
                >
                  {pointBCoords
                    ? `${routeDistance.toFixed(
                        1
                      )} ${
                        text.km
                      } • ${formatTravelTime(
                        routeDuration
                      )}`
                    : text.selectDestination}
                </p>
              </div>

              <Clock className="w-6 h-6 text-cyan-500 animate-pulse" />
            </div>
          </div>
        </div>

        {/* =================================================
            MAP
        ================================================= */}

        <div
          className={`relative z-0 border rounded-3xl overflow-hidden shadow-2xl h-[520px] ${
            isLight
              ? 'bg-white border-slate-200'
              : 'bg-slate-900 border-slate-800'
          }`}
        >
          <style>{`
            .travel-map-leaflet,
            .travel-map-leaflet .leaflet-container {
              width: 100% !important;
              height: 100% !important;
              min-height: 520px !important;
            }

            .travel-map-leaflet .leaflet-tile-pane {
              visibility: visible !important;
            }

            .travel-map-leaflet .leaflet-control {
              z-index: 400 !important;
            }

            .travel-map-leaflet .leaflet-pane {
              z-index: 200 !important;
            }

            .travel-map-leaflet .leaflet-top,
            .travel-map-leaflet .leaflet-bottom {
              z-index: 400 !important;
            }

            .travel-map-leaflet .leaflet-popup-pane {
              z-index: 700 !important;
            }
          `}</style>

          <div className="travel-map-leaflet w-full h-full">

            <MapContainer
              center={
                pointACoords
              }
              zoom={4}
              minZoom={2}
              maxZoom={19}
              worldCopyJump
              zoomControl
              scrollWheelZoom
              style={{
                width: '100%',
                height: '100%',
                minHeight:
                  '520px',
                background:
                  isLight
                    ? '#d9edf2'
                    : '#0f172a',
              }}
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                minZoom={2}
                maxZoom={19}
                maxNativeZoom={19}
                keepBuffer={4}
                updateWhenIdle={false}
                updateWhenZooming={false}
              />

              <MapSizeFix />

              <MapBoundsUpdater
                pointA={
                  pointACoords
                }
                pointB={
                  pointBCoords
                }
              />

              {/* POINT A */}

              <Marker
                position={
                  pointACoords
                }
              >
                <Popup>
                  {text.pointALabel}
                  {pointAName}
                </Popup>
              </Marker>

              {/* POINT B */}

              {pointBCoords && (
                <>
                  <Marker
                    position={
                      pointBCoords
                    }
                  >
                    <Popup>
                      {text.pointBLabel}
                      {pointBName}
                    </Popup>
                  </Marker>

                  {/* ROUTE */}

                  {routeCoordinates.length >
                    1 && (
                    <Polyline
                      positions={
                        routeCoordinates
                      }
                      color="#06b6d4"
                      weight={5}
                      opacity={0.9}
                    />
                  )}
                </>
              )}
            </MapContainer>

            {/* ROUTE TYPE LABEL */}

            <div className="absolute top-4 right-4 z-[20] bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-2xl px-4 py-2 text-white text-xs shadow-lg pointer-events-none">
              {transportMode ===
              'plane'
                ? text.flightRoute
                : transportMode ===
                    'bus'
                  ? text.busRoute
                  : text.roadRoute}
            </div>

            {/* LOADING */}

            {loading &&
              transportMode !==
                'plane' && (
                <div className="absolute bottom-4 left-4 z-[20] bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-xl px-3 py-2 text-white text-xs flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />

                  <span>
                    {language ===
                    'ar'
                      ? 'جاري البحث وحساب المسار...'
                      : language ===
                          'fr'
                        ? 'Recherche et calcul de l’itinéraire...'
                        : language ===
                            'es'
                          ? 'Buscando y calculando la ruta...'
                          : 'Searching and calculating route...'}
                  </span>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}