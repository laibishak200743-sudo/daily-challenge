export interface Trip {
  id: string;
  title: string;
  destination: string;
  start_date: string | null;
  end_date: string | null;
  cover_image: string | null;
  notes: string | null;
  created_at: string;
}

export type SavedPlaceCategory =
  | 'booking'
  | 'ticket'
  | 'note'
  | 'place';

export interface SavedPlace {
  id: string;
  trip_id: string | null;
  name: string;
  category: SavedPlaceCategory;
  lat: number | null;
  lng: number | null;
  address: string | null;
  booking_ref: string | null;
  notes: string | null;
  image_url: string | null;
  created_at: string;
}

export interface SavedPlaceFirestoreData {
  userId: string;
  trip_id: string | null;
  name: string;
  category: SavedPlaceCategory;
  lat: number | null;
  lng: number | null;
  address: string | null;
  booking_ref: string | null;
  notes: string | null;
  image_url: string | null;
  created_at: string;
}

export interface ItineraryDay {
  day: number;
  date: string;
  titleKey: string;
  activities: Activity[];
}

export interface Activity {
  time: string;
  titleKey: string;
  descKey: string;
  category:
    | 'sightseeing'
    | 'food'
    | 'transport'
    | 'leisure'
    | 'culture'
    | 'shopping';
  durationKey: string;
  locationKey: string;
}

export interface Itinerary {
  id: string;
  trip_id: string | null;
  destination: string;
  days: ItineraryDay[];
  created_at: string;
}

export type ThemeMode = 'light' | 'dark';

export type Language =
  | 'en'
  | 'ar'
  | 'fr'
  | 'es';

export type TranslateFn = (
  key: string
) => string;

export interface PricingPlan {
  id: string;
  nameKey: string;
  price: string;
  periodKey: string;
  featureKeys: string[];
  highlighted: boolean;
  icon: string;
}