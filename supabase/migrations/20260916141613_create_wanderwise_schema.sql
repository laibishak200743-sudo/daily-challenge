/*
# WanderWise Pro - Travel Companion Schema

1. New Tables
- `trips` — saved trips with destination, dates, and metadata
- `saved_places` — places saved to the trip vault (bookings, tickets, notes)
- `itineraries` — AI-generated multi-day itinerary plans

2. Security
- Single-tenant app (no auth). RLS enabled on all tables.
- Policies allow anon + authenticated full CRUD (data is intentionally shared/public).
*/

CREATE TABLE IF NOT EXISTS trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  destination text NOT NULL,
  start_date date,
  end_date date,
  cover_image text,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_trips" ON trips;
CREATE POLICY "anon_select_trips" ON trips FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_trips" ON trips;
CREATE POLICY "anon_insert_trips" ON trips FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_trips" ON trips;
CREATE POLICY "anon_update_trips" ON trips FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_trips" ON trips;
CREATE POLICY "anon_delete_trips" ON trips FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS saved_places (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid REFERENCES trips(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text NOT NULL DEFAULT 'note',
  lat double precision,
  lng double precision,
  address text,
  booking_ref text,
  notes text,
  image_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE saved_places ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_saved_places" ON saved_places;
CREATE POLICY "anon_select_saved_places" ON saved_places FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_saved_places" ON saved_places;
CREATE POLICY "anon_insert_saved_places" ON saved_places FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_saved_places" ON saved_places;
CREATE POLICY "anon_update_saved_places" ON saved_places FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_saved_places" ON saved_places;
CREATE POLICY "anon_delete_saved_places" ON saved_places FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS itineraries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid REFERENCES trips(id) ON DELETE CASCADE,
  destination text NOT NULL,
  days jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_itineraries" ON itineraries;
CREATE POLICY "anon_select_itineraries" ON itineraries FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_itineraries" ON itineraries;
CREATE POLICY "anon_insert_itineraries" ON itineraries FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_itineraries" ON itineraries;
CREATE POLICY "anon_update_itineraries" ON itineraries FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_itineraries" ON itineraries;
CREATE POLICY "anon_delete_itineraries" ON itineraries FOR DELETE
  TO anon, authenticated USING (true);
