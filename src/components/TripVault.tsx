import { useState, useEffect, useCallback } from 'react';
import {
  Bookmark,
  Hotel,
  Ticket,
  StickyNote,
  MapPin,
  Plus,
  Trash2,
  X,
  Inbox,
} from 'lucide-react';

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';

import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import type { SavedPlace } from '@/types';

const categoryConfig = {
  booking: {
    icon: Hotel,
    color: '#fbbf24',
    bg: 'rgba(251, 191, 36, 0.1)',
    labelKey: 'vault.booking',
  },
  ticket: {
    icon: Ticket,
    color: '#22d3ee',
    bg: 'rgba(34, 211, 238, 0.1)',
    labelKey: 'vault.ticket',
  },
  note: {
    icon: StickyNote,
    color: '#a78bfa',
    bg: 'rgba(167, 139, 250, 0.1)',
    labelKey: 'vault.note',
  },
  place: {
    icon: MapPin,
    color: '#34d399',
    bg: 'rgba(52, 211, 153, 0.1)',
    labelKey: 'vault.place',
  },
};

type Category = SavedPlace['category'];

export function TripVault() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { user } = useAuth();

  const [places, setPlaces] = useState<SavedPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<Category | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const [form, setForm] = useState({
    name: '',
    category: 'note' as Category,
    address: '',
    booking_ref: '',
    notes: '',
  });

  const loadPlaces = useCallback(async () => {
    if (!user) {
      setPlaces([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const placesQuery = query(
        collection(db, 'saved_places'),
        where('userId', '==', user.uid)
      );

      const snapshot = await getDocs(placesQuery);

      const loadedPlaces: SavedPlace[] = snapshot.docs
        .filter((item) => item.data().userId === user.uid)
        .map((item) => {
          const data = item.data();

          let createdAt = '';

          if (typeof data.created_at === 'string') {
            createdAt = data.created_at;
          } else if (
            data.created_at &&
            typeof data.created_at.toDate === 'function'
          ) {
            createdAt = data.created_at.toDate().toISOString();
          }

          return {
            id: item.id,
            trip_id: data.trip_id ?? null,
            name: data.name ?? '',
            category: data.category ?? 'note',
            lat: data.lat ?? null,
            lng: data.lng ?? null,
            address: data.address ?? null,
            booking_ref: data.booking_ref ?? null,
            notes: data.notes ?? null,
            image_url: data.image_url ?? null,
            created_at: createdAt,
          };
        });

      loadedPlaces.sort((a, b) =>
        b.created_at.localeCompare(a.created_at)
      );

      setPlaces(loadedPlaces);
    } catch (error: any) {
      console.error('Error loading places:', error);

      const code = error?.code ?? '';

      if (code === 'permission-denied') {
        setErrorMessage(
          'Firestore permission denied. Please check your Firestore Security Rules.'
        );
      } else {
        setErrorMessage(
          error?.message || 'Could not load your saved trips.'
        );
      }

      setPlaces([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadPlaces();
  }, [loadPlaces]);

  const handleAdd = async () => {
    if (!user) {
      setErrorMessage('Please sign in before saving an item.');
      return;
    }

    const trimmedName = form.name.trim();

    if (!trimmedName) {
      return;
    }

    if (saving) {
      return;
    }

    setSaving(true);
    setErrorMessage('');

    try {
      const placeData = {
        userId: user.uid,
        trip_id: null,
        name: trimmedName,
        category: form.category,
        lat: null,
        lng: null,
        address: form.address.trim() || null,
        booking_ref: form.booking_ref.trim() || null,
        notes: form.notes.trim() || null,
        image_url: null,

        // Keep an ISO date for compatibility with existing documents.
        created_at: new Date().toISOString(),

        // Also store a real Firestore timestamp for reliable ordering.
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(
        collection(db, 'saved_places'),
        placeData
      );

      const newPlace: SavedPlace = {
        id: docRef.id,
        trip_id: placeData.trip_id,
        name: placeData.name,
        category: placeData.category,
        lat: placeData.lat,
        lng: placeData.lng,
        address: placeData.address,
        booking_ref: placeData.booking_ref,
        notes: placeData.notes,
        image_url: placeData.image_url,
        created_at: placeData.created_at,
      };

      setPlaces((prev) => [newPlace, ...prev]);

      setForm({
        name: '',
        category: 'note',
        address: '',
        booking_ref: '',
        notes: '',
      });

      setShowForm(false);
    } catch (error: any) {
      console.error('Error adding place:', error);

      const code = error?.code ?? '';

      if (code === 'permission-denied') {
        setErrorMessage(
          'Firebase permission denied. Your Firestore Security Rules are blocking the save.'
        );
      } else if (code === 'unauthenticated') {
        setErrorMessage(
          'Your session has expired. Please sign in again.'
        );
      } else {
        setErrorMessage(
          error?.message ||
            'Could not save this item. Please try again.'
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) return;

    try {
      const ownershipQuery = query(
        collection(db, 'saved_places'),
        where('userId', '==', user.uid)
      );

      const snapshot = await getDocs(ownershipQuery);

      const ownedDocument = snapshot.docs.find(
        (item) =>
          item.id === id &&
          item.data().userId === user.uid
      );

      if (!ownedDocument) return;

      await deleteDoc(doc(db, 'saved_places', id));

      setPlaces((prev) =>
        prev.filter((place) => place.id !== id)
      );
    } catch (error) {
      console.error('Error deleting place:', error);
    }
  };

  const filteredPlaces = filter
    ? places.filter((place) => place.category === filter)
    : places;

  const categories: {
    id: Category;
    labelKey: string;
  }[] = [
    { id: 'booking', labelKey: 'vault.booking' },
    { id: 'ticket', labelKey: 'vault.ticket' },
    { id: 'note', labelKey: 'vault.note' },
    { id: 'place', labelKey: 'vault.place' },
  ];

  const itemCount =
    places.length === 1
      ? `${places.length} ${t('vault.savedItem')}`
      : `${places.length} ${t('vault.savedItems')}`;

  return (
    <section
      id="vault"
      className={`py-20 ${
        theme === 'dark' ? 'bg-slate-950' : 'bg-white'
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-xl ${
                  theme === 'dark'
                    ? 'bg-slate-900'
                    : 'bg-slate-100'
                }`}
              >
                <Bookmark size={24} className="text-violet-500" />
              </div>

              <div>
                <h2
                  className={`text-2xl sm:text-3xl font-bold ${
                    theme === 'dark'
                      ? 'text-white'
                      : 'text-slate-900'
                  }`}
                >
                  {t('section.vault.title')}
                </h2>

                <p
                  className={`text-sm ${
                    theme === 'dark'
                      ? 'text-slate-400'
                      : 'text-slate-500'
                  }`}
                >
                  {itemCount}
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setErrorMessage('');
              setShowForm(true);
            }}
            disabled={!user}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={18} />
            {t('vault.add')}
          </button>
        </div>

        {errorMessage && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
            {errorMessage}
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-8">
          <button
            type="button"
            onClick={() => setFilter(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === null
                ? 'bg-violet-600 text-white'
                : theme === 'dark'
                  ? 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t('vault.all')}
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setFilter(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === category.id
                  ? 'bg-violet-600 text-white'
                  : theme === 'dark'
                    ? 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t(category.labelKey)}
            </button>
          ))}
        </div>

        {loading && (
          <div
            className={`rounded-2xl p-10 text-center border ${
              theme === 'dark'
                ? 'bg-slate-900 border-slate-800 text-slate-400'
                : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}
          >
            {t('vault.loading')}
          </div>
        )}

        {!loading && filteredPlaces.length === 0 && (
          <div
            className={`rounded-2xl p-10 text-center border ${
              theme === 'dark'
                ? 'bg-slate-900 border-slate-800'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <Inbox
              size={42}
              className={`mx-auto mb-4 ${
                theme === 'dark'
                  ? 'text-slate-600'
                  : 'text-slate-400'
              }`}
            />

            <h3
              className={`text-lg font-semibold mb-2 ${
                theme === 'dark'
                  ? 'text-white'
                  : 'text-slate-900'
              }`}
            >
              {t('vault.emptyTitle')}
            </h3>

            <p
              className={`text-sm ${
                theme === 'dark'
                  ? 'text-slate-400'
                  : 'text-slate-500'
              }`}
            >
              {t('vault.emptyDescription')}
            </p>
          </div>
        )}

        {!loading && filteredPlaces.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPlaces.map((place) => {
              const config =
                categoryConfig[place.category] ??
                categoryConfig.note;

              const Icon = config.icon;

              return (
                <div
                  key={place.id}
                  className={`rounded-2xl border p-5 transition ${
                    theme === 'dark'
                      ? 'bg-slate-900 border-slate-800'
                      : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className="p-3 rounded-xl shrink-0"
                        style={{ backgroundColor: config.bg }}
                      >
                        <Icon
                          size={20}
                          style={{ color: config.color }}
                        />
                      </div>

                      <div className="min-w-0">
                        <h3
                          className={`font-semibold truncate ${
                            theme === 'dark'
                              ? 'text-white'
                              : 'text-slate-900'
                          }`}
                        >
                          {place.name}
                        </h3>

                        <p
                          className="text-xs mt-1"
                          style={{ color: config.color }}
                        >
                          {t(config.labelKey)}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(place.id)}
                      className={`p-2 rounded-lg transition ${
                        theme === 'dark'
                          ? 'text-slate-500 hover:text-red-400 hover:bg-slate-800'
                          : 'text-slate-400 hover:text-red-500 hover:bg-slate-100'
                      }`}
                      aria-label={t('vault.delete')}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {place.address && (
                    <div
                      className={`mt-4 text-sm flex items-start gap-2 ${
                        theme === 'dark'
                          ? 'text-slate-400'
                          : 'text-slate-600'
                      }`}
                    >
                      <MapPin size={16} className="shrink-0 mt-0.5" />
                      <span>{place.address}</span>
                    </div>
                  )}

                  {place.booking_ref && (
                    <div
                      className={`mt-3 text-sm ${
                        theme === 'dark'
                          ? 'text-slate-400'
                          : 'text-slate-600'
                      }`}
                    >
                      <span className="font-medium">
                        {t('vault.bookingRef')}:
                      </span>{' '}
                      {place.booking_ref}
                    </div>
                  )}

                  {place.notes && (
                    <div
                      className={`mt-3 text-sm whitespace-pre-wrap ${
                        theme === 'dark'
                          ? 'text-slate-400'
                          : 'text-slate-600'
                      }`}
                    >
                      {place.notes}
                    </div>
                  )}

                  <div
                    className={`mt-4 pt-3 border-t text-xs ${
                      theme === 'dark'
                        ? 'border-slate-800 text-slate-600'
                        : 'border-slate-100 text-slate-400'
                    }`}
                  >
                    {place.created_at
                      ? new Date(place.created_at).toLocaleString()
                      : ''}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div
            className={`w-full max-w-lg rounded-2xl p-6 shadow-2xl ${
              theme === 'dark' ? 'bg-slate-900' : 'bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <h3
                className={`text-xl font-bold ${
                  theme === 'dark'
                    ? 'text-white'
                    : 'text-slate-900'
                }`}
              >
                {t('vault.addToVault')}
              </h3>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className={`p-2 rounded-lg ${
                  theme === 'dark'
                    ? 'text-slate-400 hover:bg-slate-800'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
                aria-label={t('common.cancel')}
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === 'dark'
                      ? 'text-slate-300'
                      : 'text-slate-700'
                  }`}
                >
                  {t('vault.name')}
                </label>

                <input
                  value={form.name}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                  placeholder={t('vault.placeholder')}
                  className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-violet-500 ${
                    theme === 'dark'
                      ? 'bg-slate-950 border-slate-700 text-white placeholder:text-slate-600'
                      : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                  }`}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === 'dark'
                      ? 'text-slate-300'
                      : 'text-slate-700'
                  }`}
                >
                  {t('vault.category')}
                </label>

                <select
                  value={form.category}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      category: event.target.value as Category,
                    }))
                  }
                  className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-violet-500 ${
                    theme === 'dark'
                      ? 'bg-slate-950 border-slate-700 text-white'
                      : 'bg-white border-slate-300 text-slate-900'
                  }`}
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {t(category.labelKey)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === 'dark'
                      ? 'text-slate-300'
                      : 'text-slate-700'
                  }`}
                >
                  {t('vault.address')}
                </label>

                <input
                  value={form.address}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      address: event.target.value,
                    }))
                  }
                  placeholder={t('vault.optional')}
                  className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-violet-500 ${
                    theme === 'dark'
                      ? 'bg-slate-950 border-slate-700 text-white placeholder:text-slate-600'
                      : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                  }`}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === 'dark'
                      ? 'text-slate-300'
                      : 'text-slate-700'
                  }`}
                >
                  {t('vault.bookingRef')}
                </label>

                <input
                  value={form.booking_ref}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      booking_ref: event.target.value,
                    }))
                  }
                  placeholder={t('vault.optional')}
                  className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-violet-500 ${
                    theme === 'dark'
                      ? 'bg-slate-950 border-slate-700 text-white placeholder:text-slate-600'
                      : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                  }`}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === 'dark'
                      ? 'text-slate-300'
                      : 'text-slate-700'
                  }`}
                >
                  {t('vault.notes')}
                </label>

                <textarea
                  value={form.notes}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      notes: event.target.value,
                    }))
                  }
                  placeholder={t('vault.optional')}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-xl border outline-none resize-none focus:ring-2 focus:ring-violet-500 ${
                    theme === 'dark'
                      ? 'bg-slate-950 border-slate-700 text-white placeholder:text-slate-600'
                      : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                  }`}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  disabled={saving}
                  className={`flex-1 px-4 py-3 rounded-xl font-semibold disabled:opacity-50 ${
                    theme === 'dark'
                      ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {t('common.cancel')}
                </button>

                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={!form.name.trim() || !user || saving}
                  className="flex-1 px-4 py-3 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : t('common.save')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default TripVault;