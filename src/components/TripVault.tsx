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
  Lock,
  Crown,
} from 'lucide-react';

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  query,
  where,
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

type Plan = 'free' | 'monthly' | 'annual' | 'lifetime';

const premiumPlans: Plan[] = [
  'monthly',
  'annual',
  'lifetime',
];

export function TripVault() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { user } = useAuth();

  const [places, setPlaces] = useState<SavedPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [planLoading, setPlanLoading] = useState(true);
  const [plan, setPlan] = useState<Plan>('free');
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<Category | null>(null);

  const [form, setForm] = useState({
    name: '',
    category: 'note' as Category,
    address: '',
    booking_ref: '',
    notes: '',
  });

  const isPremium = premiumPlans.includes(plan);

  /*
   * قراءة خطة المستخدم من Firestore.
   *
   * مهم:
   * - لا نعتمد على بيانات موجودة في localStorage.
   * - لا نعتمد على قيمة يرسلها المستخدم من الواجهة.
   * - الخطة تأتي من users/{uid}.
   */
  const loadPlan = useCallback(async () => {
    if (!user) {
      setPlan('free');
      setPlanLoading(false);
      return;
    }

    setPlanLoading(true);

    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnapshot = await getDoc(userRef);

      if (!userSnapshot.exists()) {
        setPlan('free');
        return;
      }

      const data = userSnapshot.data();
      const currentPlan = data.plan;

      if (
        currentPlan === 'monthly' ||
        currentPlan === 'annual' ||
        currentPlan === 'lifetime'
      ) {
        setPlan(currentPlan);
      } else {
        setPlan('free');
      }

      console.log('TripVault plan:', {
        uid: user.uid,
        plan: currentPlan ?? 'free',
      });
    } catch (error) {
      console.error('Error loading user plan:', error);
      setPlan('free');
    } finally {
      setPlanLoading(false);
    }
  }, [user]);

  /*
   * تحميل بيانات Trip Vault الخاصة بالمستخدم الحالي فقط.
   */
  const loadPlaces = useCallback(async () => {
    if (!user) {
      setPlaces([]);
      setLoading(false);
      return;
    }

    /*
     * لا نحمل بيانات Trip Vault للمستخدم المجاني.
     */
    if (!isPremium) {
      setPlaces([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setPlaces([]);

    try {
      const placesRef = collection(db, 'saved_places');

      const placesQuery = query(
        placesRef,
        where('userId', '==', user.uid)
      );

      const snapshot = await getDocs(placesQuery);

      const loadedPlaces: SavedPlace[] = snapshot.docs
        .filter((item) => {
          const data = item.data();

          return data.userId === user.uid;
        })
        .map((item) => {
          const data = item.data();

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
            created_at: data.created_at ?? '',
          };
        });

      loadedPlaces.sort((a, b) =>
        b.created_at.localeCompare(a.created_at)
      );

      setPlaces(loadedPlaces);

      console.log('TripVault current user:', {
        uid: user.uid,
        email: user.email,
        plan,
        documentsLoaded: loadedPlaces.length,
      });
    } catch (error) {
      console.error('Error loading places:', error);
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  }, [user, isPremium, plan]);

  /*
   * تحميل الخطة عند تسجيل الدخول أو تغيير الحساب.
   */
  useEffect(() => {
    loadPlan();
  }, [loadPlan]);

  /*
   * تحميل Trip Vault بعد معرفة الخطة.
   */
  useEffect(() => {
    if (!planLoading) {
      loadPlaces();
    }
  }, [planLoading, loadPlaces]);

  const handleAdd = async () => {
    /*
     * حماية إضافية:
     * لا يمكن للحساب المجاني إنشاء عنصر Premium.
     */
    if (!user || !isPremium) {
      console.error(
        'TripVault add blocked: Premium plan required.'
      );
      return;
    }

    if (!form.name.trim()) {
      return;
    }

    try {
      const placeData = {
        userId: user.uid,
        trip_id: null,
        name: form.name.trim(),
        category: form.category,
        lat: null,
        lng: null,
        address: form.address.trim() || null,
        booking_ref: form.booking_ref.trim() || null,
        notes: form.notes.trim() || null,
        image_url: null,
        created_at: new Date().toISOString(),
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

      if (user.uid === placeData.userId) {
        setPlaces((prev) => [newPlace, ...prev]);
      }

      setForm({
        name: '',
        category: 'note',
        address: '',
        booking_ref: '',
        notes: '',
      });

      setShowForm(false);
    } catch (error) {
      console.error('Error adding place:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!user || !isPremium) {
      return;
    }

    try {
      const placesRef = collection(db, 'saved_places');

      const ownershipQuery = query(
        placesRef,
        where('userId', '==', user.uid)
      );

      const snapshot = await getDocs(ownershipQuery);

      const ownedDocument = snapshot.docs.find(
        (item) =>
          item.id === id &&
          item.data().userId === user.uid
      );

      if (!ownedDocument) {
        console.error(
          'Delete blocked: this document does not belong to the current user.'
        );
        return;
      }

      await deleteDoc(
        doc(db, 'saved_places', id)
      );

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

  /*
   * انتظار قراءة خطة الحساب.
   */
  if (planLoading) {
    return (
      <section
        id="vault"
        className={`py-20 ${
          theme === 'dark'
            ? 'bg-slate-950'
            : 'bg-white'
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`rounded-2xl p-10 text-center border ${
              theme === 'dark'
                ? 'bg-slate-900 border-slate-800 text-slate-400'
                : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}
          >
            Loading...
          </div>
        </div>
      </section>
    );
  }

  /*
   * Premium Lock Screen
   */
  if (!isPremium) {
    return (
      <section
        id="vault"
        className={`py-20 ${
          theme === 'dark'
            ? 'bg-slate-950'
            : 'bg-white'
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`relative overflow-hidden rounded-3xl border p-10 sm:p-16 text-center ${
              theme === 'dark'
                ? 'bg-slate-900 border-slate-800'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/10 pointer-events-none" />

            <div className="relative">
              <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center">
                <Lock
                  size={30}
                  className="text-violet-500"
                />
              </div>

              <div className="flex items-center justify-center gap-2 mb-3">
                <Crown
                  size={20}
                  className="text-yellow-400"
                />

                <span className="text-sm font-semibold text-violet-500 uppercase tracking-wider">
                  Premium
                </span>
              </div>

              <h2
                className={`text-3xl sm:text-4xl font-bold mb-4 ${
                  theme === 'dark'
                    ? 'text-white'
                    : 'text-slate-900'
                }`}
              >
                Trip Vault
              </h2>

              <p
                className={`max-w-xl mx-auto text-base sm:text-lg mb-8 ${
                  theme === 'dark'
                    ? 'text-slate-400'
                    : 'text-slate-600'
                }`}
              >
                Save your places, bookings, tickets,
                and travel notes in one secure place.
              </p>

              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent(
                      'wanderwise:open-premium'
                    )
                  );
                }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-700 transition"
              >
                <Crown size={18} />
                Unlock Premium
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="vault"
      className={`py-20 ${
        theme === 'dark'
          ? 'bg-slate-950'
          : 'bg-white'
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
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
                <Bookmark
                  size={24}
                  className="text-violet-500"
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2
                    className={`text-2xl sm:text-3xl font-bold ${
                      theme === 'dark'
                        ? 'text-white'
                        : 'text-slate-900'
                    }`}
                  >
                    Trip Vault
                  </h2>

                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-violet-500/10 text-violet-500 text-xs font-semibold">
                    <Crown size={12} />
                    Premium
                  </span>
                </div>

                <p
                  className={`text-sm ${
                    theme === 'dark'
                      ? 'text-slate-400'
                      : 'text-slate-500'
                  }`}
                >
                  {places.length} saved item
                  {places.length === 1 ? '' : 's'}
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowForm(true)}
            disabled={!user || !isPremium}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={18} />
            Add
          </button>
        </div>

        {/* Filters */}
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
            All
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() =>
                setFilter(category.id)
              }
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

        {/* Loading */}
        {loading && (
          <div
            className={`rounded-2xl p-10 text-center border ${
              theme === 'dark'
                ? 'bg-slate-900 border-slate-800 text-slate-400'
                : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}
          >
            Loading...
          </div>
        )}

        {/* Empty */}
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
              No saved items
            </h3>

            <p
              className={`text-sm ${
                theme === 'dark'
                  ? 'text-slate-400'
                  : 'text-slate-500'
              }`}
            >
              Add your first place, booking, ticket,
              or note.
            </p>
          </div>
        )}

        {/* Places */}
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
                        style={{
                          backgroundColor: config.bg,
                        }}
                      >
                        <Icon
                          size={20}
                          style={{
                            color: config.color,
                          }}
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
                          style={{
                            color: config.color,
                          }}
                        >
                          {t(config.labelKey)}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(place.id)
                      }
                      className={`p-2 rounded-lg transition ${
                        theme === 'dark'
                          ? 'text-slate-500 hover:text-red-400 hover:bg-slate-800'
                          : 'text-slate-400 hover:text-red-500 hover:bg-slate-100'
                      }`}
                      aria-label="Delete"
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
                      <MapPin
                        size={16}
                        className="shrink-0 mt-0.5"
                      />

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
                        Reference:
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
                      ? new Date(
                          place.created_at
                        ).toLocaleString()
                      : ''}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div
            className={`w-full max-w-lg rounded-2xl p-6 shadow-2xl ${
              theme === 'dark'
                ? 'bg-slate-900'
                : 'bg-white'
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
                Add to Trip Vault
              </h3>

              <button
                type="button"
                onClick={() =>
                  setShowForm(false)
                }
                className={`p-2 rounded-lg ${
                  theme === 'dark'
                    ? 'text-slate-400 hover:bg-slate-800'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
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
                  Name
                </label>

                <input
                  value={form.name}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                  placeholder="e.g. Hotel reservation"
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
                  Category
                </label>

                <select
                  value={form.category}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      category:
                        event.target.value as Category,
                    }))
                  }
                  className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-violet-500 ${
                    theme === 'dark'
                      ? 'bg-slate-950 border-slate-700 text-white'
                      : 'bg-white border-slate-300 text-slate-900'
                  }`}
                >
                  {categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
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
                  Address
                </label>

                <input
                  value={form.address}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      address: event.target.value,
                    }))
                  }
                  placeholder="Optional"
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
                  Booking / Ticket Reference
                </label>

                <input
                  value={form.booking_ref}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      booking_ref:
                        event.target.value,
                    }))
                  }
                  placeholder="Optional"
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
                  Notes
                </label>

                <textarea
                  value={form.notes}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      notes: event.target.value,
                    }))
                  }
                  placeholder="Optional"
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
                  onClick={() =>
                    setShowForm(false)
                  }
                  className={`flex-1 px-4 py-3 rounded-xl font-semibold ${
                    theme === 'dark'
                      ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={
                    !form.name.trim() ||
                    !user ||
                    !isPremium
                  }
                  className="flex-1 px-4 py-3 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save
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