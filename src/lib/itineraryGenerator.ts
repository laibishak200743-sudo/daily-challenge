import type { ItineraryDay, Activity, TranslateFn } from '@/types';

interface ActivityTemplate {
  titleKey: string;
  descKey: string;
  locationKey: string;
  category: Activity['category'];
  durationKey: string;
}

const activityTemplates: Record<string, ActivityTemplate[]> = {
  sightseeing: [
    { titleKey: 'act.sightseeing.1.title', descKey: 'act.sightseeing.1.desc', locationKey: 'act.sightseeing.1.location', category: 'sightseeing', durationKey: 'duration.2.5h' },
    { titleKey: 'act.sightseeing.2.title', descKey: 'act.sightseeing.2.desc', locationKey: 'act.sightseeing.2.location', category: 'sightseeing', durationKey: 'duration.1h' },
    { titleKey: 'act.sightseeing.3.title', descKey: 'act.sightseeing.3.desc', locationKey: 'act.sightseeing.3.location', category: 'sightseeing', durationKey: 'duration.1.5h' },
  ],
  food: [
    { titleKey: 'act.food.1.title', descKey: 'act.food.1.desc', locationKey: 'act.food.1.location', category: 'food', durationKey: 'duration.2h' },
    { titleKey: 'act.food.2.title', descKey: 'act.food.2.desc', locationKey: 'act.food.2.location', category: 'food', durationKey: 'duration.3h' },
    { titleKey: 'act.food.3.title', descKey: 'act.food.3.desc', locationKey: 'act.food.3.location', category: 'food', durationKey: 'duration.2h' },
  ],
  culture: [
    { titleKey: 'act.culture.1.title', descKey: 'act.culture.1.desc', locationKey: 'act.culture.1.location', category: 'culture', durationKey: 'duration.3h' },
    { titleKey: 'act.culture.2.title', descKey: 'act.culture.2.desc', locationKey: 'act.culture.2.location', category: 'culture', durationKey: 'duration.1.5h' },
    { titleKey: 'act.culture.3.title', descKey: 'act.culture.3.desc', locationKey: 'act.culture.3.location', category: 'culture', durationKey: 'duration.2.5h' },
  ],
  leisure: [
    { titleKey: 'act.leisure.1.title', descKey: 'act.leisure.1.desc', locationKey: 'act.leisure.1.location', category: 'leisure', durationKey: 'duration.2h' },
    { titleKey: 'act.leisure.2.title', descKey: 'act.leisure.2.desc', locationKey: 'act.leisure.2.location', category: 'leisure', durationKey: 'duration.2h' },
    { titleKey: 'act.leisure.3.title', descKey: 'act.leisure.3.desc', locationKey: 'act.leisure.3.location', category: 'leisure', durationKey: 'duration.2h' },
  ],
  shopping: [
    { titleKey: 'act.shopping.1.title', descKey: 'act.shopping.1.desc', locationKey: 'act.shopping.1.location', category: 'shopping', durationKey: 'duration.2h' },
    { titleKey: 'act.shopping.2.title', descKey: 'act.shopping.2.desc', locationKey: 'act.shopping.2.location', category: 'shopping', durationKey: 'duration.1.5h' },
  ],
  transport: [
    { titleKey: 'act.transport.1.title', descKey: 'act.transport.1.desc', locationKey: 'act.transport.1.location', category: 'transport', durationKey: 'duration.3h' },
    { titleKey: 'act.transport.2.title', descKey: 'act.transport.2.desc', locationKey: 'act.transport.2.location', category: 'transport', durationKey: 'duration.1.5h' },
  ],
};

const timeSlots = ['09:00', '12:00', '14:30', '17:00', '19:30'];

const dayTitleKeys = [
  'itinerary.daytitle.1',
  'itinerary.daytitle.2',
  'itinerary.daytitle.3',
  'itinerary.daytitle.4',
  'itinerary.daytitle.5',
  'itinerary.daytitle.6',
  'itinerary.daytitle.7',
];

export function generateItinerary(
  _t: TranslateFn,
  _destination: string,
  numDays: number,
  interests: string[]
): ItineraryDay[] {
  const days: ItineraryDay[] = [];
  const selectedInterests = interests.length > 0 ? interests : ['sightseeing', 'food', 'culture'];
  const today = new Date();

  for (let dayNum = 1; dayNum <= numDays; dayNum++) {
    const date = new Date(today);
    date.setDate(date.getDate() + dayNum - 1);

    const activities: Activity[] = [];
    const numActivities = Math.min(4 + (dayNum % 2), 5);

    for (let i = 0; i < numActivities; i++) {
      const interest = selectedInterests[i % selectedInterests.length];
      const templates = activityTemplates[interest] ?? activityTemplates.sightseeing;
      const template = templates[i % templates.length];

      activities.push({
        titleKey: template.titleKey,
        descKey: template.descKey,
        locationKey: template.locationKey,
        category: template.category,
        durationKey: template.durationKey,
        time: timeSlots[i] ?? '20:00',
      });
    }

    activities.sort((a, b) => a.time.localeCompare(b.time));

    days.push({
      day: dayNum,
      date: date.toISOString().split('T')[0],
      titleKey: dayTitleKeys[(dayNum - 1) % dayTitleKeys.length],
      activities,
    });
  }

  return days;
}
