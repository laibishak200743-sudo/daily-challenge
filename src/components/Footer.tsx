import { useTheme } from '@/contexts/ThemeContext';
import { Heart, Globe, Shield } from 'lucide-react';

export function Footer() {
  const { theme } = useTheme();

  return (
    <footer className={`w-full py-8 px-6 border-t transition-colors ${
      theme === 'dark' ? 'bg-slate-900/80 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
    }`} dir="rtl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* معلومات التطبيق والشعار */}
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Globe className="w-4 h-4 text-cyan-400" />
          <span className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>WanderWise Pro</span>
          <span className="text-xs opacity-65">© 2026 جميع الحقوق محفوظة</span>
        </div>

        {/* التوقيع الشخصي الذي طلبته */}
        <div className="flex items-center gap-1.5 text-xs font-bold tracking-wider px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          <span>Designed & Developed with</span>
          <Heart className="w-3 h-3 text-red-500 fill-red-500 inline" />
          <span>by JB</span>
        </div>

        {/* روابط أو معلومات إضافية سريعة */}
        <div className="flex items-center gap-6 text-xs">
          <a href="#privacy" className="hover:text-cyan-400 transition-colors">سياسة الخصوصية</a>
          <a href="#terms" className="hover:text-cyan-400 transition-colors">شروط الاستخدام</a>
          <a href="#support" className="hover:text-cyan-400 transition-colors">الدعم الفني</a>
        </div>

      </div>
    </footer>
  );
}