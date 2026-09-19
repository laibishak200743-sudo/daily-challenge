import { useEffect, useState } from 'react';

import Header from '@/components/Header';
import { Hero } from '@/components/Hero';
import TravelMap from '@/components/TravelMap';
import { ItineraryGenerator } from '@/components/ItineraryGenerator';
import { TripVault } from '@/components/TripVault';
import PremiumModal from '@/components/PremiumModal';
import { AuthModal } from '@/components/AuthModal';
import { Footer } from '@/components/Footer';
import PaymentResult from '@/components/PaymentResult';

import {
  ThemeProvider,
  useTheme,
} from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { LocationProvider } from '@/contexts/LocationContext';

export function AppContent() {
  const [activeSection, setActiveSection] =
    useState('discover');

  const [isPremiumOpen, setIsPremiumOpen] =
    useState(false);

  const [isAuthOpen, setIsAuthOpen] =
    useState(false);

  const { theme } = useTheme();

  const isLight = theme === 'light';

  const pathname =
    window.location.pathname.toLowerCase();

  const isPaymentSuccess =
    pathname === '/payment-success';

  const isPaymentCancel =
    pathname === '/payment-cancelled' ||
    pathname === '/payment-cancel';

  useEffect(() => {
    const handleOpenPremium = () => {
      setIsPremiumOpen(true);
    };

    window.addEventListener(
      'wanderwise:open-premium',
      handleOpenPremium
    );

    return () => {
      window.removeEventListener(
        'wanderwise:open-premium',
        handleOpenPremium
      );
    };
  }, []);

  const handleSectionNavigation = (
    section: string
  ) => {
    setActiveSection(section);

    const element =
      document.getElementById(section);

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const handleOpenPricing = () => {
    setIsPremiumOpen(true);
  };

  const handleOpenAuth = () => {
    setIsPremiumOpen(false);
    setIsAuthOpen(true);
  };

  const handleCloseAuth = () => {
    setIsAuthOpen(false);
  };

  const handleAuthSuccess = () => {
    setIsAuthOpen(false);
  };

  const handleBackToApp = () => {
    window.history.pushState(
      {},
      '',
      '/'
    );

    window.location.reload();
  };

  const handleOpenPremiumFromResult = () => {
    window.history.pushState(
      {},
      '',
      '/'
    );

    setIsPremiumOpen(true);
  };

  if (
    isPaymentSuccess ||
    isPaymentCancel
  ) {
    return (
      <PaymentResult
        type={
          isPaymentSuccess
            ? 'success'
            : 'cancel'
        }
        onBack={handleBackToApp}
        onPremium={handleOpenPremiumFromResult}
      />
    );
  }

  return (
    <div
      className={`min-h-screen
        flex flex-col
        transition-colors duration-300
        ${
          isLight
            ? 'bg-slate-50 text-slate-900'
            : 'bg-slate-950 text-slate-100'
        }
        selection:bg-cyan-500
        selection:text-white
      `}
    >
      <Header
        activeTab={activeSection}
        setActiveTab={handleSectionNavigation}
        onOpenPricing={handleOpenPricing}
        onOpenAuth={handleOpenAuth}
      />

      <main className="flex-1">
        <section
          id="discover"
          className="scroll-mt-20"
        >
          <Hero
            onNavigate={handleSectionNavigation}
          />
        </section>

        <section
          id="map"
          className="scroll-mt-20"
        >
          <TravelMap />
        </section>

        <section
          id="itinerary"
          className="scroll-mt-20"
        >
          <ItineraryGenerator />
        </section>

        <section
          id="trips"
          className="scroll-mt-20"
        >
          <TripVault />
        </section>
      </main>

      <Footer />

      {isPremiumOpen && (
        <PremiumModal
          isOpen={true}
          onClose={() =>
            setIsPremiumOpen(false)
          }
          onOpenAuth={handleOpenAuth}
        />
      )}

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