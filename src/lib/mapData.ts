export interface MapMarker {
  id: string;
  nameKey: string;
  lat: number;
  lng: number;
  type: 'landmark' | 'hotel' | 'restaurant' | 'transport' | 'activity';
  descKey: string;
}

export interface MapRoute {
  id: string;
  nameKey: string;
  points: { lat: number; lng: number }[];
  color: string;
}

export const destinationMarkers: MapMarker[] = [
  { id: '1', nameKey: 'map.marker.eiffel.name', lat: 48.8584, lng: 2.2945, type: 'landmark', descKey: 'map.marker.eiffel.desc' },
  { id: '2', nameKey: 'map.marker.louvre.name', lat: 48.8606, lng: 2.3376, type: 'landmark', descKey: 'map.marker.louvre.desc' },
  { id: '3', nameKey: 'map.marker.notredame.name', lat: 48.8530, lng: 2.3499, type: 'landmark', descKey: 'map.marker.notredame.desc' },
  { id: '4', nameKey: 'map.marker.ritz.name', lat: 48.8683, lng: 2.3287, type: 'hotel', descKey: 'map.marker.ritz.desc' },
  { id: '5', nameKey: 'map.marker.julesverne.name', lat: 48.8584, lng: 2.2945, type: 'restaurant', descKey: 'map.marker.julesverne.desc' },
  { id: '6', nameKey: 'map.marker.garedunord.name', lat: 48.8809, lng: 2.3553, type: 'transport', descKey: 'map.marker.garedunord.desc' },
  { id: '7', nameKey: 'map.marker.seine.name', lat: 48.8551, lng: 2.3548, type: 'activity', descKey: 'map.marker.seine.desc' },
  { id: '8', nameKey: 'map.marker.sacrecoeur.name', lat: 48.8867, lng: 2.3431, type: 'landmark', descKey: 'map.marker.sacrecoeur.desc' },
  { id: '9', nameKey: 'map.marker.arc.name', lat: 48.8738, lng: 2.2950, type: 'landmark', descKey: 'map.marker.arc.desc' },
  { id: '10', nameKey: 'map.marker.orsay.name', lat: 48.8600, lng: 2.3266, type: 'landmark', descKey: 'map.marker.orsay.desc' },
];

export const destinationRoutes: MapRoute[] = [
  {
    id: 'route1',
    nameKey: 'map.route.classic',
    points: [
      { lat: 48.8584, lng: 2.2945 },
      { lat: 48.8738, lng: 2.2950 },
      { lat: 48.8809, lng: 2.3553 },
      { lat: 48.8606, lng: 2.3376 },
      { lat: 48.8530, lng: 2.3499 },
    ],
    color: '#22d3ee',
  },
  {
    id: 'route2',
    nameKey: 'map.route.seine',
    points: [
      { lat: 48.8551, lng: 2.3548 },
      { lat: 48.8584, lng: 2.2945 },
      { lat: 48.8600, lng: 2.3266 },
      { lat: 48.8683, lng: 2.3287 },
    ],
    color: '#f59e0b',
  },
];

export const destinations = [
  { nameKey: 'map.dest.paris', lat: 48.8566, lng: 2.3522, zoom: 12 },
  { nameKey: 'map.dest.tokyo', lat: 35.6762, lng: 139.6503, zoom: 11 },
  { nameKey: 'map.dest.marrakech', lat: 31.6295, lng: -7.9811, zoom: 12 },
  { nameKey: 'map.dest.newyork', lat: 40.7128, lng: -74.0060, zoom: 11 },
  { nameKey: 'map.dest.istanbul', lat: 41.0082, lng: 28.9784, zoom: 11 },
];
