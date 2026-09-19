import React from 'react';
import { X, Check, Zap, Crown, Shield } from 'lucide-react';

interface PremiumModalProps {
  isOpen?: boolean;
  open?: boolean;
  onClose: () => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, open, onClose }) => {
  const isVisible = isOpen ?? open ?? false;
  if (!isVisible) return null;

  // قراءة الخطة المفعلة من المتصفح (بعد العودة من الدفع الناجح)
  const activePlan = typeof window !== 'undefined' ? localStorage.getItem('user_plan') : null;

  // روابط الدفع مع تمرير معلومات الخطة عند العودة (لاحظ إضافة ?success=true&plan=...)
  // يمكنك ضبط روابط Stripe الخاصة بك لتعود إلى: http://localhost:5173/?success=true&plan=monthly (مثلاً)
  const monthlyPaymentLink = 'https://buy.stripe.com/test_9B68wP7LnbDUcAmdfj4ZG00';
  const annualPaymentLink = 'https://buy.stripe.com/test_9B628r4zbeQ6gQCejn4ZG01';
  const lifetimePaymentLink = 'https://buy.stripe.com/test_aFa5kD5DfcHY9oa6QV4ZG02';

  const handleSelectPlan = (link?: string) => {
    if (link) {
      window.location.href = link;
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 md:p-8 text-white my-8">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors bg-slate-800/80 p-2 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 mb-3 shadow-inner">
            <Zap className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">اختر خطتك المميزة</h2>
          <p className="text-slate-400 text-sm mt-2">عزز تجربتك في السفر مع التخطيط الذكي بالذكاء الاصطناعي والخرائط التفاعلية المتقدمة.</p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          
          {/* 1. Free Plan */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 flex flex-col justify-between transition-all hover:border-slate-600">
            <div>
              <div className="text-sm font-semibold text-slate-400 mb-1">تجربة مجانية</div>
              <div className="text-3xl font-black mb-4">$0 <span className="text-xs font-normal text-slate-400">/ 14 يوماً</span></div>
              
              <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" /><span>توليد خط رحلة واحد بالذكاء الاصطناعي</span></li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" /><span>وصول أساسي للخريطة</span></li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" /><span>حفظ حتى 5 أماكن</span></li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" /><span>حزمة رحلة واحدة</span></li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" /><span>دعم المجتمع</span></li>
              </ul>
            </div>

            <button
              onClick={() => handleSelectPlan()}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-xl transition-all text-center border border-slate-700"
            >
              اختر الخطة
            </button>
          </div>

          {/* 2. Monthly Plan */}
          <div className="bg-cyan-950/20 border-2 border-cyan-500/60 rounded-2xl p-5 flex flex-col justify-between transition-all relative shadow-lg shadow-cyan-500/10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-500 text-slate-950 text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
              الأكثر طلباً
            </div>
            <div>
              <div className="text-sm font-semibold text-cyan-400 mb-1">شهري</div>
              <div className="text-3xl font-black mb-4">$9.99 <span className="text-xs font-normal text-slate-400">/ شهرياً</span></div>
              
              <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" /><span>خطط رحلات غير محدودة بالذكاء الاصطناعي</span></li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" /><span>خرائط تفاعلية كاملة</span></li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" /><span>أماكن محفوظة غير محدودة</span></li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" /><span>خزنات رحلات متعددة</span></li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" /><span>تخطيط المسارات</span></li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" /><span>دعم ذو أولوية</span></li>
              </ul>
            </div>

            <button
              onClick={() => handleSelectPlan(monthlyPaymentLink)}
              className={`w-full py-2.5 rounded-xl font-semibold transition-all text-center ${
                activePlan === 'monthly'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25'
              }`}
            >
              {activePlan === 'monthly' ? 'تم الاختيار!' : 'اختر الخطة'}
            </button>
          </div>

          {/* 3. Annual Plan */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 flex flex-col justify-between transition-all hover:border-slate-600">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-slate-300">سنوي</span>
                <span className="bg-blue-500/20 text-blue-400 text-[10px] px-2 py-0.5 rounded-full font-medium">وفر 33%</span>
              </div>
              <div className="text-3xl font-black mb-4">$79.99 <span className="text-xs font-normal text-slate-400">/ سنوياً</span></div>
              
              <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /><span>كل ميزات الخطة الشهرية</span></li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /><span>وصول لخطط الرحلات دون اتصال</span></li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /><span>طبقات خرائط مخصصة</span></li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /><span>مشاركة وتعاون في الرحلات</span></li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /><span>وصول مبكر للميزات</span></li>
              </ul>
            </div>

            <button
              onClick={() => handleSelectPlan(annualPaymentLink)}
              className={`w-full py-2.5 rounded-xl font-semibold transition-all text-center border ${
                activePlan === 'annual'
                  ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              {activePlan === 'annual' ? 'تم الاختيار!' : 'اختر الخطة'}
            </button>
          </div>

          {/* 4. Lifetime Plan */}
          <div className="bg-amber-950/20 border border-amber-500/40 rounded-2xl p-5 flex flex-col justify-between transition-all hover:border-amber-500/70 relative">
            <div className="absolute -top-3 right-4 bg-amber-500 text-slate-950 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow">
              <Crown className="w-3 h-3" /> مدى الحياة
            </div>
            <div>
              <div className="text-sm font-semibold text-amber-400 mb-1">مدى الحياة</div>
              <div className="text-3xl font-black mb-4 text-amber-400">$199.99 <span className="text-xs font-normal text-slate-400">/ دفعة واحدة</span></div>
              
              <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400 shrink-0" /><span>كل ميزات الخطة السنوية</span></li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400 shrink-0" /><span>وصول مدى الحياة - بلا تجديد</span></li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400 shrink-0" /><span>كل الميزات المستقبلية مشمولة</span></li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400 shrink-0" /><span>مشاركة رحلات غير محدودة</span></li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400 shrink-0" /><span>طلبات ميزات ذات أولوية</span></li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400 shrink-0" /><span>وصول مجتمع النخبة</span></li>
              </ul>
            </div>

            <button
              onClick={() => handleSelectPlan(lifetimePaymentLink)}
              className={`w-full py-2.5 rounded-xl font-bold transition-all text-center ${
                activePlan === 'lifetime'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20'
              }`}
            >
              {activePlan === 'lifetime' ? 'تم الاختيار!' : 'اختر الخطة'}
            </button>
          </div>

        </div>

        {/* Footer info inside modal */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-800 gap-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>دفع آمن عبر Stripe • ضمان استرداد المال خلال 30 يوماً • إلغاء في أي وقت</span>
          </div>
          <button onClick={onClose} className="hover:text-white transition-colors">
            ربما لاحقاً
          </button>
        </div>

      </div>
    </div>
  );
};

export default PremiumModal;