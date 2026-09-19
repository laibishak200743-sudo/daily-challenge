import React from 'react';
import {
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Crown,
} from 'lucide-react';

import { useLanguage } from '@/contexts/LanguageContext';

interface PaymentResultProps {
  type: 'success' | 'cancel';
  onBack: () => void;
  onPremium: () => void;
}

export default function PaymentResult({
  type,
  onBack,
  onPremium,
}: PaymentResultProps) {
  const { language } = useLanguage();

  const translations = {
    en: {
      successTitle: 'Payment completed',
      successText:
        'Your payment was completed successfully. Premium activation will be confirmed after payment verification.',
      cancelTitle: 'Payment cancelled',
      cancelText:
        'Your payment was cancelled. No Premium activation was made.',
      back: 'Back to WanderWise Pro',
      premium: 'View Premium',
      successNote:
        'Your Premium plan is activated only after the payment is verified.',
      cancelNote:
        'You can return to Premium and try again whenever you are ready.',
    },

    ar: {
      successTitle: 'تم الدفع بنجاح',
      successText:
        'تمت عملية الدفع بنجاح. سيتم تأكيد تفعيل Premium بعد التحقق من عملية الدفع.',
      cancelTitle: 'تم إلغاء الدفع',
      cancelText:
        'تم إلغاء عملية الدفع. لم يتم تفعيل Premium.',
      back: 'العودة إلى WanderWise Pro',
      premium: 'عرض Premium',
      successNote:
        'سيتم تفعيل Premium فقط بعد التحقق من عملية الدفع.',
      cancelNote:
        'يمكنك العودة إلى Premium والمحاولة مرة أخرى عندما تكون مستعدًا.',
    },

    fr: {
      successTitle: 'Paiement terminé',
      successText:
        'Votre paiement a été effectué. L’activation de Premium sera confirmée après vérification du paiement.',
      cancelTitle: 'Paiement annulé',
      cancelText:
        'Votre paiement a été annulé. Premium n’a pas été activé.',
      back: 'Retour à WanderWise Pro',
      premium: 'Voir Premium',
      successNote:
        'Votre forfait Premium sera activé uniquement après vérification du paiement.',
      cancelNote:
        'Vous pouvez revenir à Premium et réessayer lorsque vous êtes prêt.',
    },

    es: {
      successTitle: 'Pago completado',
      successText:
        'Tu pago se completó correctamente. La activación de Premium se confirmará después de verificar el pago.',
      cancelTitle: 'Pago cancelado',
      cancelText:
        'Tu pago fue cancelado. Premium no ha sido activado.',
      back: 'Volver a WanderWise Pro',
      premium: 'Ver Premium',
      successNote:
        'Premium se activará únicamente después de verificar el pago.',
      cancelNote:
        'Puedes volver a Premium e intentarlo de nuevo cuando quieras.',
    },
  };

  const t =
    translations[
      language as keyof typeof translations
    ] || translations.en;

  const isSuccess = type === 'success';
  const isRTL = language === 'ar';

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-white"
    >
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-slate-900 p-8 text-center shadow-2xl sm:p-10">
        <div
          className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full ${
            isSuccess
              ? 'bg-emerald-500/10 text-emerald-400'
              : 'bg-red-500/10 text-red-400'
          }`}
        >
          {isSuccess ? (
            <CheckCircle2 size={48} />
          ) : (
            <XCircle size={48} />
          )}
        </div>

        <h1 className="text-3xl font-bold sm:text-4xl">
          {isSuccess
            ? t.successTitle
            : t.cancelTitle}
        </h1>

        <p className="mt-4 text-base leading-7 text-slate-400">
          {isSuccess
            ? t.successText
            : t.cancelText}
        </p>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center justify-center gap-2 text-sm text-slate-300">
            <Crown
              size={18}
              className="text-cyan-400"
            />

            <span>
              {isSuccess
                ? t.successNote
                : t.cancelNote}
            </span>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={onBack}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-white/10
              bg-white/5
              px-6
              py-3
              font-semibold
              transition
              hover:bg-white/10
            "
          >
            <ArrowLeft size={18} />
            {t.back}
          </button>

          <button
            type="button"
            onClick={onPremium}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-cyan-500
              px-6
              py-3
              font-semibold
              text-slate-950
              transition
              hover:bg-cyan-400
            "
          >
            <Crown size={18} />
            {t.premium}
          </button>
        </div>
      </div>
    </div>
  );
}