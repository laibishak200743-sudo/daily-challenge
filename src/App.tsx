import { useState } from 'react';

import Header from '@/components/Header';
import { Hero } from '@/components/Hero';
import TravelMap from '@/components/TravelMap';
import { ItineraryGenerator } from '@/components/ItineraryGenerator';
import { TripVault } from '@/components/TripVault';
import { AuthModal } from '@/components/AuthModal';
import { Footer } from '@/components/Footer';

import {
  ThemeProvider,
  useTheme,
} from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { LocationProvider } from '@/contexts/LocationContext';

export function AppContent() {
  const [activeSection, setActiveSection] = useState('discover');
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const { theme } = useTheme();
  const isLight = theme === 'light';

  const handleSectionNavigation = (section: string) => {
    setActiveSection(section);

    const element = document.getElementById(section);

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const handleOpenAuth = () => {
    setIsAuthOpen(true);
  };

  const handleCloseAuth = () => {
    setIsAuthOpen(false);
  };

  const handleAuthSuccess = () => {
    setIsAuthOpen(false);
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        isLight
          ? 'bg-slate-50 text-slate-900'
          : 'bg-slate-950 text-slate-100'
      } selection:bg-cyan-500 selection:text-white`}
    >
      <Header
        activeTab={activeSection}
        setActiveTab={handleSectionNavigation}
        onOpenAuth={handleOpenAuth}
      />

      <main className="flex-1">
        <section id="discover" className="scroll-mt-20">
          <Hero onNavigate={handleSectionNavigation} />
        </section>

        <section id="map" className="scroll-mt-20">
          <TravelMap />
        </section>

        <section id="itinerary" className="scroll-mt-20">
          <ItineraryGenerator />
        </section>

        <section id="trips" className="scroll-mt-20">
          <TripVault />
        </section>
      </main>

      <Footer />

      {isAuthOpen && (
        <AuthModal
          isOpen={isAuthOpen}
          onClose={handleCloseAuth}
          onSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <LocationProvider>
            <AppContent />
          </LocationProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}