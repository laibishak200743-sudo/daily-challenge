import React, { useEffect, useState } from 'react';
import {
  X,
  Check,
  Zap,
  Shield,
  Loader2,
  LogIn,
  AlertCircle,
  Crown,
} from 'lucide-react';

import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface PremiumModalProps {
  isOpen?: boolean;
  open?: boolean;
  onClose: () => void;
  onOpenAuth?: () => void;
}

type PlanType = 'monthly' | 'annual' | 'lifetime';

type UserPlan = 'free' | 'monthly' | 'annual' | 'lifetime';

const STRIPE_PAYMENT_LINKS: Record<PlanType, string> = {
  monthly:
    'https://buy.stripe.com/test_9B68wP7LnbDUcAmdfj4ZG00',
  annual:
    'https://buy.stripe.com/test_9B628r4zbeQ6gQCejn4ZG01',
  lifetime:
    'https://buy.stripe.com/test_aFa5kD5DfcHY9oa6QV4ZG02',
};

const PREMIUM_PLANS: UserPlan[] = [
  'monthly',
  'annual',
  'lifetime',
];

export default function PremiumModal({
  isOpen,
  open,
  onClose,
  onOpenAuth,
}: PremiumModalProps) {
  const { language } = useLanguage();
  const { user } = useAuth();

  const visible = isOpen ?? open ?? false;

  const [selectedPlan, setSelectedPlan] =
    useState<PlanType>('annual');

  const [userPlan, setUserPlan] =
    useState<UserPlan>('free');

  const [loadingPlan, setLoadingPlan] =
    useState(true);

  const [checkoutLoading, setCheckoutLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  const isPremium =
    PREMIUM_PLANS.includes(userPlan);

  /*
   * =========================
   * TRANSLATIONS
   * =========================
   */

  const translations = {
    en: {
      title: 'Upgrade to Premium',
      subtitle:
        'Unlock the full WanderWise Pro experience.',
      monthly: 'Monthly',
      annual: 'Annual',
      lifetime: 'Lifetime',
      month: '/month',
      year: '/year',
      oneTime: 'one-time payment',
      save: 'Save 30%',
      popular: 'Most Popular',

      monthlyPrice: '$9.99',
      annualPrice: '$79.99',
      lifetimePrice: '$199.99',

      monthlyDescription:
        'Flexible premium access every month.',
      annualDescription:
        'Premium access for a full year.',
      lifetimeDescription:
        'Pay once and keep Premium forever.',

      featuresTitle: 'Premium includes',
      feature1: 'Unlimited Trip Vault',
      feature2: 'Save unlimited places and trips',
      feature3: 'Premium travel planning features',
      feature4: 'Priority access to new features',
      feature5: 'No Premium feature restrictions',

      securePayment:
        'Secure payment powered by Stripe',

      loginRequired:
        'Please log in before purchasing Premium.',
      login: 'Log in',

      alreadyPremium:
        'Your account already has Premium access.',
      currentPlan: 'Current plan',

      monthlyPlan: 'Monthly Premium',
      annualPlan: 'Annual Premium',
      lifetimePlan: 'Lifetime Premium',
      freePlan: 'Free',

      continue: 'Continue to payment',
      processing: 'Opening secure checkout...',

      testMode:
        'Test mode: no real payment will be charged.',

      errorLoading:
        'Unable to load your account plan.',
      errorCheckout:
        'Unable to open the payment page. Please try again.',

      close: 'Close',
    },

    ar: {
      title: 'الترقية إلى Premium',
      subtitle:
        'افتح تجربة WanderWise Pro الكاملة.',
      monthly: 'شهري',
      annual: 'سنوي',
      lifetime: 'مدى الحياة',
      month: '/شهر',
      year: '/سنة',
      oneTime: 'دفعة واحدة',
      save: 'وفر 30%',
      popular: 'الأكثر شعبية',

      monthlyPrice: '$9.99',
      annualPrice: '$79.99',
      lifetimePrice: '$199.99',

      monthlyDescription:
        'وصول Premium مرن كل شهر.',
      annualDescription:
        'وصول Premium لمدة سنة كاملة.',
      lifetimeDescription:
        'ادفع مرة واحدة واحصل على Premium مدى الحياة.',

      featuresTitle: 'مميزات Premium',
      feature1: 'Trip Vault بدون حدود',
      feature2: 'حفظ عدد غير محدود من الأماكن والرحلات',
      feature3: 'مميزات متقدمة لتخطيط الرحلات',
      feature4: 'أولوية الوصول إلى المميزات الجديدة',
      feature5: 'بدون قيود على مميزات Premium',

      securePayment:
        'الدفع الآمن بواسطة Stripe',

      loginRequired:
        'يرجى تسجيل الدخول قبل شراء Premium.',
      login: 'تسجيل الدخول',

      alreadyPremium:
        'حسابك لديه بالفعل وصول Premium.',
      currentPlan: 'الخطة الحالية',

      monthlyPlan: 'Premium شهري',
      annualPlan: 'Premium سنوي',
      lifetimePlan: 'Premium مدى الحياة',
      freePlan: 'مجاني',

      continue: 'المتابعة إلى الدفع',
      processing: 'جاري فتح صفحة الدفع الآمنة...',

      testMode:
        'وضع الاختبار: لن يتم خصم أي مبلغ حقيقي.',

      errorLoading:
        'تعذر تحميل خطة حسابك.',
      errorCheckout:
        'تعذر فتح صفحة الدفع. حاول مرة أخرى.',

      close: 'إغلاق',
    },

    fr: {
      title: 'Passer à Premium',
      subtitle:
        'Débloquez toute l’expérience WanderWise Pro.',
      monthly: 'Mensuel',
      annual: 'Annuel',
      lifetime: 'À vie',
      month: '/mois',
      year: '/an',
      oneTime: 'paiement unique',
      save: 'Économisez 30 %',
      popular: 'Le plus populaire',

      monthlyPrice: '$9.99',
      annualPrice: '$79.99',
      lifetimePrice: '$199.99',

      monthlyDescription:
        'Accès Premium flexible chaque mois.',
      annualDescription:
        'Accès Premium pendant une année complète.',
      lifetimeDescription:
        'Payez une fois et gardez Premium à vie.',

      featuresTitle: 'Premium comprend',
      feature1: 'Trip Vault illimité',
      feature2: 'Enregistrez des lieux et voyages illimités',
      feature3: 'Fonctions avancées de planification',
      feature4: 'Accès prioritaire aux nouvelles fonctions',
      feature5: 'Aucune restriction Premium',

      securePayment:
        'Paiement sécurisé avec Stripe',

      loginRequired:
        'Connectez-vous avant d’acheter Premium.',
      login: 'Se connecter',

      alreadyPremium:
        'Votre compte possède déjà Premium.',
      currentPlan: 'Forfait actuel',

      monthlyPlan: 'Premium mensuel',
      annualPlan: 'Premium annuel',
      lifetimePlan: 'Premium à vie',
      freePlan: 'Gratuit',

      continue: 'Continuer vers le paiement',
      processing: 'Ouverture du paiement sécurisé...',

      testMode:
        'Mode test : aucun paiement réel ne sera effectué.',

      errorLoading:
        'Impossible de charger le forfait du compte.',
      errorCheckout:
        'Impossible d’ouvrir la page de paiement.',

      close: 'Fermer',
    },

    es: {
      title: 'Actualizar a Premium',
      subtitle:
        'Desbloquea toda la experiencia de WanderWise Pro.',
      monthly: 'Mensual',
      annual: 'Anual',
      lifetime: 'De por vida',
      month: '/mes',
      year: '/año',
      oneTime: 'pago único',
      save: 'Ahorra 30%',
      popular: 'Más popular',

      monthlyPrice: '$9.99',
      annualPrice: '$79.99',
      lifetimePrice: '$199.99',

      monthlyDescription:
        'Acceso Premium flexible cada mes.',
      annualDescription:
        'Acceso Premium durante un año completo.',
      lifetimeDescription:
        'Paga una vez y conserva Premium para siempre.',

      featuresTitle: 'Premium incluye',
      feature1: 'Trip Vault ilimitado',
      feature2: 'Guarda lugares y viajes ilimitados',
      feature3: 'Funciones avanzadas de planificación',
      feature4: 'Acceso prioritario a nuevas funciones',
      feature5: 'Sin restricciones de funciones Premium',

      securePayment:
        'Pago seguro mediante Stripe',

      loginRequired:
        'Inicia sesión antes de comprar Premium.',
      login: 'Iniciar sesión',

      alreadyPremium:
        'Tu cuenta ya tiene acceso Premium.',
      currentPlan: 'Plan actual',

      monthlyPlan: 'Premium mensual',
      annualPlan: 'Premium anual',
      lifetimePlan: 'Premium de por vida',
      freePlan: 'Gratis',

      continue: 'Continuar al pago',
      processing: 'Abriendo el pago seguro...',

      testMode:
        'Modo de prueba: no se realizará ningún cargo real.',

      errorLoading:
        'No se pudo cargar el plan de tu cuenta.',
      errorCheckout:
        'No se pudo abrir la página de pago.',

      close: 'Cerrar',
    },
  };

  const t =
    translations[
      language as keyof typeof translations
    ] || translations.en;

  const isRTL = language === 'ar';

  /*
   * =========================
   * LOAD USER PLAN
   * =========================
   */

  useEffect(() => {
    let cancelled = false;

    const loadUserPlan = async () => {
      setLoadingPlan(true);
      setError('');

      if (!user) {
        setUserPlan('free');
        setLoadingPlan(false);
        return;
      }

      try {
        const userRef = doc(db, 'users', user.uid);
        const snapshot = await getDoc(userRef);

        if (cancelled) return;

        if (!snapshot.exists()) {
          setUserPlan('free');
          setLoadingPlan(false);
          return;
        }

        const data = snapshot.data();

        const plan =
          data.plan === 'monthly' ||
          data.plan === 'annual' ||
          data.plan === 'lifetime'
            ? data.plan
            : 'free';

        setUserPlan(plan);
      } catch (err) {
        console.error(
          'Error loading Premium plan:',
          err
        );

        if (!cancelled) {
          setUserPlan('free');
          setError(t.errorLoading);
        }
      } finally {
        if (!cancelled) {
          setLoadingPlan(false);
        }
      }
    };

    if (visible) {
      loadUserPlan();
    }

    return () => {
      cancelled = true;
    };
  }, [user, visible]);

  /*
   * =========================
   * CLOSE WITH ESC
   * =========================
   */

  useEffect(() => {
    if (!visible) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener(
      'keydown',
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        'keydown',
        handleKeyDown
      );
    };
  }, [visible, onClose]);

  /*
   * =========================
   * CHECKOUT
   * =========================
   */

  const handleCheckout = () => {
    setError('');

    if (!user) {
      if (onOpenAuth) {
        onOpenAuth();
      }
      return;
    }

    if (isPremium) {
      return;
    }

    try {
      setCheckoutLoading(true);

      const baseUrl =
        STRIPE_PAYMENT_LINKS[selectedPlan];

      const separator = baseUrl.includes('?')
        ? '&'
        : '?';

      const checkoutUrl =
        `${baseUrl}${separator}` +
        `client_reference_id=${encodeURIComponent(
          `${user.uid}_${selectedPlan}`
        )}`;

      window.location.href = checkoutUrl;
    } catch (err) {
      console.error(
        'Stripe checkout error:',
        err
      );

      setCheckoutLoading(false);
      setError(t.errorCheckout);
    }
  };

  /*
   * =========================
   * HELPERS
   * =========================
   */

  const getCurrentPlanLabel = () => {
    switch (userPlan) {
      case 'monthly':
        return t.monthlyPlan;

      case 'annual':
        return t.annualPlan;

      case 'lifetime':
        return t.lifetimePlan;

      default:
        return t.freePlan;
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t.title}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label={t.close}
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-sm"
      />

      {/* Modal */}
      <div
        className="
          relative z-10
          w-full max-w-5xl
          max-h-[92vh]
          overflow-y-auto
          rounded-3xl
          border border-white/10
          bg-slate-950
          text-white
          shadow-2xl
        "
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label={t.close}
          className="
            absolute
            right-4 top-4
            z-20
            flex h-10 w-10
            items-center justify-center
            rounded-full
            border border-white/10
            bg-white/5
            text-slate-300
            transition
            hover:bg-white/10
            hover:text-white
          "
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="px-6 pb-6 pt-8 text-center sm:px-10">
          <div
            className="
              mx-auto mb-4
              flex h-16 w-16
              items-center justify-center
              rounded-2xl
              bg-cyan-500/10
              text-cyan-400
            "
          >
            <Crown size={32} />
          </div>

          <h2 className="text-3xl font-bold sm:text-4xl">
            {isPremium ? t.alreadyPremium : t.title}
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-400 sm:text-base">
            {isPremium
              ? `${t.currentPlan}: ${getCurrentPlanLabel()}`
              : t.subtitle}
          </p>

          {/* Current plan */}
          {user && !loadingPlan && (
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">
              <span className="text-slate-400">
                {t.currentPlan}:
              </span>

              <span
                className={
                  isPremium
                    ? 'font-semibold text-cyan-400'
                    : 'font-semibold text-slate-200'
                }
              >
                {getCurrentPlanLabel()}
              </span>
            </div>
          )}

          {/* Loading */}
          {user && loadingPlan && (
            <div className="mt-5 inline-flex items-center gap-2 text-sm text-slate-400">
              <Loader2
                size={16}
                className="animate-spin"
              />
              Loading...
            </div>
          )}
        </div>

        {/* Premium already active */}
        {isPremium ? (
          <div className="px-6 pb-10 sm:px-10">
            <div className="mx-auto max-w-2xl rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400">
                <Check size={26} />
              </div>

              <h3 className="text-xl font-semibold">
                {t.alreadyPremium}
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                {t.currentPlan}: {getCurrentPlanLabel()}
              </p>

              <button
                type="button"
                onClick={onClose}
                className="
                  mt-6
                  rounded-xl
                  bg-cyan-500
                  px-6 py-3
                  font-semibold
                  text-slate-950
                  transition
                  hover:bg-cyan-400
                "
              >
                OK
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Login required */}
            {!user && (
              <div className="mx-6 mb-6 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5 sm:mx-10">
                <div className="flex items-start gap-3">
                  <LogIn
                    size={22}
                    className="mt-0.5 shrink-0 text-amber-400"
                  />

                  <div className="flex-1">
                    <p className="font-medium text-white">
                      {t.loginRequired}
                    </p>

                    <button
                      type="button"
                      onClick={onOpenAuth}
                      className="
                        mt-3
                        rounded-lg
                        bg-cyan-500
                        px-4 py-2
                        text-sm
                        font-semibold
                        text-slate-950
                        transition
                        hover:bg-cyan-400
                      "
                    >
                      {t.login}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Plans */}
            <div className="grid gap-4 px-6 sm:grid-cols-3 sm:px-10">
              {/* Monthly */}
              <button
                type="button"
                onClick={() =>
                  setSelectedPlan('monthly')
                }
                className={`
                  relative
                  rounded-2xl
                  border
                  p-5
                  text-left
                  transition
                  ${
                    selectedPlan === 'monthly'
                      ? 'border-cyan-400 bg-cyan-500/10 shadow-lg shadow-cyan-500/10'
                      : 'border-white/10 bg-white/[0.03] hover:border-white/20'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">
                    {t.monthly}
                  </span>

                  {selectedPlan === 'monthly' && (
                    <Check
                      size={18}
                      className="text-cyan-400"
                    />
                  )}
                </div>

                <div className="mt-4">
                  <span className="text-3xl font-bold">
                    {t.monthlyPrice}
                  </span>

                  <span className="text-sm text-slate-400">
                    {t.month}
                  </span>
                </div>

                <p className="mt-3 text-sm text-slate-400">
                  {t.monthlyDescription}
                </p>
              </button>

              {/* Annual */}
              <button
                type="button"
                onClick={() =>
                  setSelectedPlan('annual')
                }
                className={`
                  relative
                  rounded-2xl
                  border
                  p-5
                  text-left
                  transition
                  ${
                    selectedPlan === 'annual'
                      ? 'border-cyan-400 bg-cyan-500/10 shadow-lg shadow-cyan-500/10'
                      : 'border-white/10 bg-white/[0.03] hover:border-white/20'
                  }
                `}
              >
                <div className="absolute -top-3 left-5 rounded-full bg-cyan-500 px-3 py-1 text-xs font-bold text-slate-950">
                  {t.popular}
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-semibold">
                    {t.annual}
                  </span>

                  {selectedPlan === 'annual' && (
                    <Check
                      size={18}
                      className="text-cyan-400"
                    />
                  )}
                </div>

                <div className="mt-4">
                  <span className="text-3xl font-bold">
                    {t.annualPrice}
                  </span>

                  <span className="text-sm text-slate-400">
                    {t.year}
                  </span>
                </div>

                <div className="mt-2 inline-block rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-400">
                  {t.save}
                </div>

                <p className="mt-3 text-sm text-slate-400">
                  {t.annualDescription}
                </p>
              </button>

              {/* Lifetime */}
              <button
                type="button"
                onClick={() =>
                  setSelectedPlan('lifetime')
                }
                className={`
                  relative
                  rounded-2xl
                  border
                  p-5
                  text-left
                  transition
                  ${
                    selectedPlan === 'lifetime'
                      ? 'border-cyan-400 bg-cyan-500/10 shadow-lg shadow-cyan-500/10'
                      : 'border-white/10 bg-white/[0.03] hover:border-white/20'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">
                    {t.lifetime}
                  </span>

                  {selectedPlan === 'lifetime' && (
                    <Check
                      size={18}
                      className="text-cyan-400"
                    />
                  )}
                </div>

                <div className="mt-4">
                  <span className="text-3xl font-bold">
                    {t.lifetimePrice}
                  </span>
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  {t.oneTime}
                </p>

                <p className="mt-3 text-sm text-slate-400">
                  {t.lifetimeDescription}
                </p>
              </button>
            </div>

            {/* Features */}
            <div className="px-6 pb-6 pt-8 sm:px-10">
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                    <Zap size={20} />
                  </div>

                  <h3 className="text-lg font-semibold">
                    {t.featuresTitle}
                  </h3>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    t.feature1,
                    t.feature2,
                    t.feature3,
                    t.feature4,
                    t.feature5,
                  ].map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-3 text-sm text-slate-300"
                    >
                      <Check
                        size={18}
                        className="shrink-0 text-cyan-400"
                      />

                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mx-6 mb-5 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-300 sm:mx-10">
                <AlertCircle
                  size={20}
                  className="mt-0.5 shrink-0"
                />

                <span>{error}</span>
              </div>
            )}

            {/* Test mode */}
            <div className="mx-6 mb-5 flex items-center gap-3 rounded-xl border border-amber-400/20 bg-amber-400/5 p-4 text-sm text-amber-300 sm:mx-10">
              <Shield
                size={19}
                className="shrink-0"
              />

              <span>{t.testMode}</span>
            </div>

            {/* Checkout */}
            <div className="px-6 pb-8 sm:px-10">
              <button
                type="button"
                onClick={handleCheckout}
                disabled={
                  checkoutLoading ||
                  loadingPlan ||
                  !user
                }
                className="
                  flex w-full
                  items-center justify-center gap-2
                  rounded-xl
                  bg-cyan-500
                  px-6 py-4
                  font-bold
                  text-slate-950
                  transition
                  hover:bg-cyan-400
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {checkoutLoading ? (
                  <>
                    <Loader2
                      size={20}
                      className="animate-spin"
                    />

                    {t.processing}
                  </>
                ) : !user ? (
                  <>
                    <LogIn size={20} />
                    {t.login}
                  </>
                ) : (
                  <>
                    <Zap size={20} />
                    {t.continue}
                  </>
                )}
              </button>

              <p className="mt-3 text-center text-xs text-slate-500">
                {t.securePayment}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}