import { useState } from 'react';
import {
  Sparkles,
  Moon,
  Sun,
  LogIn,
  LogOut,
  Menu,
  X,
  Languages,
  Plane,
  UserCircle,
} from 'lucide-react';

import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenPricing?: () => void;
  onOpenAuth?: () => void;
}

const SUPPORTED_LANGS = [
  { code: 'en', label: 'English', short: 'US' },
  { code: 'ar', label: 'العربية', short: 'DZ' },
  { code: 'fr', label: 'Français', short: 'FR' },
  { code: 'es', label: 'Español', short: 'ES' },
];

export function Header({
  activeTab,
  setActiveTab,
  onOpenAuth,
}: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { user, logout } = useAuth();

  const [languageOpen, setLanguageOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const isLight = theme === 'light';
  const isRtl = language === 'ar';

  const navItems = [
    {
      id: 'discover',
      label:
        language === 'ar'
          ? 'اكتشف'
          : language === 'fr'
            ? 'Découvrir'
            : language === 'es'
              ? 'Descubrir'
              : 'Discover',
    },
    {
      id: 'map',
      label:
        language === 'ar'
          ? 'الخريطة'
          : language === 'fr'
            ? 'Carte'
            : language === 'es'
              ? 'Mapa'
              : 'Map',
    },
    {
      id: 'itinerary',
      label:
        language === 'ar'
          ? 'خط الرحلة'
          : language === 'fr'
            ? 'Itinéraire'
            : language === 'es'
              ? 'Itinerario'
              : 'Itinerary',
    },
    {
      id: 'trips',
      label:
        language === 'ar'
          ? 'خزنة الرحلات'
          : language === 'fr'
            ? 'Coffre de voyages'
            : language === 'es'
              ? 'Bóveda de viajes'
              : 'Trip Vault',
    },
  ];

  const handleNavigation = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const handleLanguageChange = (code: string) => {
    setLanguage(code as any);
    setLanguageOpen(false);
    setMobileMenuOpen(false);
  };

  const handleAuth = () => {
    onOpenAuth?.();
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    if (logoutLoading) return;

    try {
      setLogoutLoading(true);
      await logout();
      setMobileMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLogoutLoading(false);
    }
  };

  const userName =
    user?.displayName?.trim() ||
    user?.email?.split('@')[0] ||
    (isRtl ? 'المستخدم' : 'User');

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-colors duration-300 ${
        isLight
          ? 'bg-white/90 border-slate-200 text-slate-800'
          : 'bg-slate-950/90 border-slate-800 text-white'
      }`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

        {/* LOGO */}
        <div
          className="flex items-center gap-3 cursor-pointer shrink-0"
          onClick={() => handleNavigation('discover')}
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
            <Sparkles className="w-5 h-5" />
          </div>

          <Plane className="w-5 h-5 text-cyan-500 shrink-0" />

          <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
            WanderWise Pro
          </span>
        </div>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-500'
                    : isLight
                      ? 'text-slate-600 hover:bg-slate-100'
                      : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* DESKTOP RIGHT SIDE */}
        <div className="hidden lg:flex items-center gap-2">

          {/* LANGUAGE */}
          <div className="relative">
            <button
              onClick={() => setLanguageOpen(!languageOpen)}
              className={`p-2.5 rounded-xl border transition-all ${
                languageOpen
                  ? 'bg-slate-800 text-white border-slate-700'
                  : isLight
                    ? 'border-transparent hover:bg-slate-100 text-slate-700'
                    : 'border-transparent hover:bg-slate-900 text-slate-300'
              }`}
              aria-label="Language"
            >
              <Languages className="w-5 h-5" />
            </button>

            {languageOpen && (
              <div
                className={`absolute top-12 ${
                  isRtl ? 'left-0' : 'right-0'
                } w-44 rounded-xl overflow-hidden shadow-2xl border ${
                  isLight
                    ? 'bg-white border-slate-200'
                    : 'bg-slate-800 border-slate-700'
                }`}
              >
                {SUPPORTED_LANGS.map((lang) => {
                  const selected = language === lang.code;

                  return (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-all ${
                        selected
                          ? 'bg-cyan-500/10 text-cyan-500'
                          : isLight
                            ? 'text-slate-700 hover:bg-slate-100'
                            : 'text-slate-200 hover:bg-slate-700'
                      }`}
                    >
                      <span>{lang.label}</span>
                      <span className="text-[10px] opacity-70">
                        {lang.short}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* THEME */}
          <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-xl border transition-all ${
              isLight
                ? 'border-transparent hover:bg-slate-100 text-slate-700'
                : 'border-transparent hover:bg-slate-900 text-slate-300'
            }`}
            aria-label="Toggle theme"
          >
            {isLight ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>

          {/* AUTH */}
          {user ? (
            <div className="flex items-center gap-2">
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${
                  isLight
                    ? 'bg-slate-100 border-slate-200 text-slate-800'
                    : 'bg-slate-800 border-slate-700 text-white'
                }`}
                title={user.email || ''}
              >
                <UserCircle className="w-5 h-5 text-cyan-500" />

                <div className="max-w-[150px]">
                  <p className="truncate text-xs font-bold">{userName}</p>
                  <p className="truncate text-[10px] opacity-60">
                    {user.email}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                disabled={logoutLoading}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  isLight
                    ? 'bg-slate-800 border-slate-800 text-white hover:bg-red-600 hover:border-red-600'
                    : 'bg-slate-800 border-slate-700 text-white hover:bg-red-600 hover:border-red-600'
                } disabled:cursor-not-allowed disabled:opacity-60`}
              >
                <LogOut className="w-4 h-4" />

                <span>
                  {logoutLoading
                    ? '...'
                    : language === 'ar'
                      ? 'خروج'
                      : language === 'fr'
                        ? 'Déconnexion'
                        : language === 'es'
                          ? 'Salir'
                          : 'Logout'}
                </span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleAuth}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                isLight
                  ? 'bg-slate-800 border-slate-800 text-white hover:bg-slate-700'
                  : 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700'
              }`}
            >
              <LogIn className="w-4 h-4" />

              <span>
                {language === 'ar'
                  ? 'دخول'
                  : language === 'fr'
                    ? 'Connexion'
                    : language === 'es'
                      ? 'Iniciar sesión'
                      : 'Login'}
              </span>
            </button>
          )}
        </div>

        {/* MOBILE */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-xl border ${
              isLight ? 'border-slate-200' : 'border-slate-800'
            }`}
          >
            {isLight ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div
          className={`lg:hidden border-t border-b p-4 space-y-3 ${
            isLight
              ? 'bg-white border-slate-200'
              : 'bg-slate-950 border-slate-800'
          }`}
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className={`block w-full text-start px-4 py-3 rounded-xl text-sm font-semibold ${
                activeTab === item.id
                  ? 'bg-cyan-500/10 text-cyan-500'
                  : 'hover:bg-cyan-500/10'
              }`}
            >
              {item.label}
            </button>
          ))}

          {/* LANGUAGES */}
          <div className="pt-3 border-t border-slate-700/30">
            <div className="text-xs font-semibold mb-2 opacity-70">
              {language === 'ar'
                ? 'اللغة'
                : language === 'fr'
                  ? 'Langue'
                  : language === 'es'
                    ? 'Idioma'
                    : 'Language'}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {SUPPORTED_LANGS.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`px-3 py-2.5 rounded-xl text-xs ${
                    language === lang.code
                      ? 'bg-cyan-500/10 text-cyan-500'
                      : isLight
                        ? 'bg-slate-50'
                        : 'bg-slate-900'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* MOBILE AUTH */}
          {user ? (
            <button
              onClick={handleLogout}
              disabled={logoutLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-semibold disabled:opacity-60"
            >
              <LogOut className="w-5 h-5" />

              <span>
                {logoutLoading
                  ? '...'
                  : language === 'ar'
                    ? 'تسجيل الخروج'
                    : language === 'fr'
                      ? 'Déconnexion'
                      : language === 'es'
                        ? 'Cerrar sesión'
                        : 'Logout'}
              </span>
            </button>
          ) : (
            <button
              onClick={handleAuth}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 text-white rounded-xl font-semibold"
            >
              <LogIn className="w-5 h-5" />

              <span>
                {language === 'ar'
                  ? 'دخول'
                  : language === 'fr'
                    ? 'Connexion'
                    : language === 'es'
                      ? 'Iniciar sesión'
                      : 'Login'}
              </span>
            </button>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;