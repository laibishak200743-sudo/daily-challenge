import { Compass, MapPin, Calendar, Plane, ArrowRight, Sparkles } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface HeroProps {
  onNavigate: (section: string) => void;
}

export function Hero({ onNavigate }: HeroProps) {
  const { theme } = useTheme();
  const { t, isRTL } = useLanguage();

  const stats = [
    { icon: MapPin, value: '190+', labelKey: 'hero.stat.destinations' },
    { icon: Calendar, value: '50K+', labelKey: 'hero.stat.itineraries' },
    { icon: Plane, value: '4.9★', labelKey: 'hero.stat.rating' },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background */}
      <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-slate-950' : 'bg-gradient-to-b from-slate-50 to-cyan-50'}`}>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-emerald-500 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
        </div>
        <div className="absolute inset-0" style={{
          backgroundImage: theme === 'dark'
            ? 'radial-gradient(circle at 1px 1px, rgba(34, 211, 238, 0.07) 1px, transparent 0)'
            : 'radial-gradient(circle at 1px 1px, rgba(56, 189, 248, 0.05) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 animate-fade-in" style={{
          background: theme === 'dark' ? 'rgba(34, 211, 238, 0.1)' : 'rgba(34, 211, 238, 0.08)',
          border: '1px solid rgba(34, 211, 238, 0.2)'
        }}>
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className={`text-sm font-medium ${theme === 'dark' ? 'text-cyan-300' : 'text-cyan-700'}`}>{t('app.tagline')}</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 animate-slide-up" style={{ lineHeight: '1.15' }}>
          <span className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>{t('hero.titleA')}</span>
          <br />
          <span className="gradient-text">{t('hero.titleB')}</span>
        </h1>

        <p className={`text-lg sm:text-xl max-w-2xl mx-auto mb-8 animate-slide-up ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`} style={{ animationDelay: '0.1s', opacity: 0 }}>
          {t('hero.subtitle')}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
          <button
            onClick={() => onNavigate('itinerary')}
            className="group flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold text-lg hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/30 hover:scale-105"
          >
            <Compass className="w-5 h-5" />
            {t('hero.cta')}
            <ArrowRight className={`w-5 h-5 group-hover:${isRTL ? '-translate-x-1' : 'translate-x-1'} transition-transform`} />
          </button>
          <button
            onClick={() => onNavigate('map')}
            className={`px-8 py-3.5 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 ${
              theme === 'dark'
                ? 'bg-slate-800/50 text-cyan-300 border border-cyan-500/20 hover:bg-slate-800/80 hover:border-cyan-500/40'
                : 'bg-white text-cyan-600 border border-cyan-200 hover:border-cyan-400 hover:shadow-lg'
            }`}
          >
            {t('hero.cta2')}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto mt-16 animate-slide-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className={`p-4 rounded-2xl ${theme === 'dark' ? 'glass-dark' : 'glass-light'} border ${theme === 'dark' ? 'border-cyan-500/10' : 'border-slate-200/50'}`}>
                <Icon className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                <div className={`text-2xl sm:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{stat.value}</div>
                <div className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>{t(stat.labelKey)}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
