import {
  useRef,
  useState,
  type FormEvent,
} from 'react';

import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  X,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

import ReCAPTCHA from 'react-google-recaptcha';

import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: unknown) => void;
}

type Language = 'ar' | 'en' | 'fr' | 'es';

const translations = {
  ar: {
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    name: 'الاسم',
    yourName: 'اسمك',

    loginDescription:
      'سجل الدخول إلى حسابك في WanderWise Pro',

    registerDescription:
      'أنشئ حسابك وابدأ رحلتك مع WanderWise Pro',

    noAccount: 'ليس لديك حساب؟',
    alreadyAccount: 'لديك حساب بالفعل؟',

    emailRequired:
      'يرجى إدخال البريد الإلكتروني.',

    emailVerification:
      'تحقق من بريدك الإلكتروني',

    verificationSent:
      'أرسلنا رابط تحقق إلى:',

    checkVerification:
      'تحققت من البريد',

    checking: 'جارٍ التحقق...',

    resendVerification:
      'إعادة إرسال رسالة التحقق',

    backToLogin:
      'العودة إلى تسجيل الدخول',

    spamMessage:
      'إذا لم تجد الرسالة، تحقق من مجلد الرسائل غير المرغوب فيها.',

    processing: 'جارٍ المعالجة...',

    createAccount: 'إنشاء الحساب',

    captchaRequired:
      'يرجى تأكيد أنك لست برنامج روبوت.',

    captchaError:
      'تعذر تحميل reCAPTCHA. تحقق من اتصال الإنترنت وحاول مرة أخرى.',

    invalidEmail:
      'البريد الإلكتروني غير صالح.',

    userNotFound:
      'لا يوجد حساب بهذا البريد الإلكتروني.',

    wrongPassword:
      'كلمة المرور غير صحيحة.',

    invalidCredential:
      'البريد الإلكتروني أو كلمة المرور غير صحيحة.',

    emailAlreadyUsed:
      'هذا البريد الإلكتروني مستخدم بالفعل.',

    weakPassword:
      'كلمة المرور ضعيفة. استخدم 6 أحرف على الأقل.',

    missingPassword:
      'يرجى إدخال كلمة المرور.',

    networkError:
      'تعذر الاتصال بالإنترنت. حاول مرة أخرى.',

    tooManyRequests:
      'تم إجراء محاولات كثيرة. انتظر قليلًا ثم حاول مرة أخرى.',

    operationNotAllowed:
      'تسجيل الدخول بالبريد وكلمة المرور غير مفعل في Firebase.',

    genericError:
      'حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى.',

    nameRequired:
      'يرجى إدخال اسمك.',

    passwordMin:
      'كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل.',

    passwordsMismatch:
      'كلمتا المرور غير متطابقتين.',

    verificationCreated:
      'تم إنشاء الحساب وإرسال رسالة تحقق إلى',

    verificationResent:
      'تم إرسال رسالة التحقق مرة أخرى. تحقق من صندوق البريد الإلكتروني ومن مجلد الرسائل غير المرغوب فيها.',

    verificationSuccess:
      'تم التحقق من بريدك الإلكتروني بنجاح. يمكنك الآن تسجيل الدخول.',

    verificationPending:
      'لم يتم التحقق من البريد الإلكتروني بعد. افتح رسالة التحقق واضغط على الرابط الموجود فيها، ثم حاول مرة أخرى.',

    verificationCheckError:
      'تعذر فحص حالة البريد الإلكتروني. حاول مرة أخرى.',

    verificationRequired:
      'هذا البريد الإلكتروني لم يتم التحقق منه بعد. تحقق من بريدك الإلكتروني أولًا.',

    resendError:
      'تعذر إرسال رسالة التحقق. حاول مرة أخرى بعد قليل.',

    noUser:
      'لا يوجد مستخدم حالي.',

    openVerification:
      'فتح صفحة التحقق',

    close: 'إغلاق',
  },

  en: {
    login: 'Sign In',
    register: 'Create Account',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    name: 'Name',
    yourName: 'Your name',

    loginDescription:
      'Sign in to your WanderWise Pro account',

    registerDescription:
      'Create your account and start your journey with WanderWise Pro',

    noAccount: "Don't have an account?",
    alreadyAccount: 'Already have an account?',

    emailRequired:
      'Please enter your email address.',

    emailVerification:
      'Verify Your Email',

    verificationSent:
      'We sent a verification link to:',

    checkVerification:
      'I verified my email',

    checking: 'Checking...',

    resendVerification:
      'Resend verification email',

    backToLogin:
      'Back to sign in',

    spamMessage:
      "If you don't see the email, check your spam folder.",

    processing: 'Processing...',

    createAccount: 'Create Account',

    captchaRequired:
      "Please confirm that you're not a robot.",

    captchaError:
      'Unable to load reCAPTCHA. Check your internet connection and try again.',

    invalidEmail:
      'The email address is invalid.',

    userNotFound:
      'No account was found with this email address.',

    wrongPassword:
      'The password is incorrect.',

    invalidCredential:
      'The email or password is incorrect.',

    emailAlreadyUsed:
      'This email address is already in use.',

    weakPassword:
      'The password is too weak. Use at least 6 characters.',

    missingPassword:
      'Please enter your password.',

    networkError:
      'Unable to connect to the internet. Please try again.',

    tooManyRequests:
      'Too many attempts. Please wait a moment and try again.',

    operationNotAllowed:
      'Email/password sign-in is not enabled in Firebase.',

    genericError:
      'An error occurred during sign in. Please try again.',

    nameRequired:
      'Please enter your name.',

    passwordMin:
      'The password must contain at least 6 characters.',

    passwordsMismatch:
      'The passwords do not match.',

    verificationCreated:
      'Account created and verification email sent to',

    verificationResent:
      'The verification email was sent again. Check your inbox and spam folder.',

    verificationSuccess:
      'Your email has been verified successfully. You can now sign in.',

    verificationPending:
      'Your email has not been verified yet. Open the verification email, click the link, then try again.',

    verificationCheckError:
      'Unable to check email verification status. Please try again.',

    verificationRequired:
      'This email has not been verified yet. Please verify your email first.',

    resendError:
      'Unable to send the verification email. Please try again later.',

    noUser:
      'There is no current user.',

    openVerification:
      'Open verification',

    close: 'Close',
  },

  fr: {
    login: 'Connexion',
    register: 'Créer un compte',
    email: 'Adresse e-mail',
    password: 'Mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    name: 'Nom',
    yourName: 'Votre nom',

    loginDescription:
      'Connectez-vous à votre compte WanderWise Pro',

    registerDescription:
      'Créez votre compte et commencez votre voyage avec WanderWise Pro',

    noAccount: "Vous n'avez pas de compte ?",
    alreadyAccount: 'Vous avez déjà un compte ?',

    emailRequired:
      'Veuillez saisir votre adresse e-mail.',

    emailVerification:
      'Vérifiez votre adresse e-mail',

    verificationSent:
      'Nous avons envoyé un lien de vérification à :',

    checkVerification:
      "J'ai vérifié mon e-mail",

    checking: 'Vérification...',

    resendVerification:
      "Renvoyer l'e-mail de vérification",

    backToLogin:
      'Retour à la connexion',

    spamMessage:
      "Si vous ne trouvez pas l'e-mail, vérifiez votre dossier spam.",

    processing: 'Traitement...',

    createAccount: 'Créer le compte',

    captchaRequired:
      'Veuillez confirmer que vous n’êtes pas un robot.',

    captchaError:
      'Impossible de charger reCAPTCHA. Vérifiez votre connexion Internet et réessayez.',

    invalidEmail:
      "L'adresse e-mail n'est pas valide.",

    userNotFound:
      'Aucun compte ne correspond à cette adresse e-mail.',

    wrongPassword:
      'Le mot de passe est incorrect.',

    invalidCredential:
      "L'e-mail ou le mot de passe est incorrect.",

    emailAlreadyUsed:
      'Cette adresse e-mail est déjà utilisée.',

    weakPassword:
      'Le mot de passe est trop faible. Utilisez au moins 6 caractères.',

    missingPassword:
      'Veuillez saisir votre mot de passe.',

    networkError:
      'Impossible de se connecter à Internet. Réessayez.',

    tooManyRequests:
      'Trop de tentatives. Attendez un moment puis réessayez.',

    operationNotAllowed:
      "La connexion par e-mail et mot de passe n'est pas activée dans Firebase.",

    genericError:
      'Une erreur est survenue lors de la connexion. Réessayez.',

    nameRequired:
      'Veuillez saisir votre nom.',

    passwordMin:
      'Le mot de passe doit contenir au moins 6 caractères.',

    passwordsMismatch:
      'Les mots de passe ne correspondent pas.',

    verificationCreated:
      'Compte créé et e-mail de vérification envoyé à',

    verificationResent:
      "L'e-mail de vérification a été renvoyé. Vérifiez votre boîte de réception et votre dossier spam.",

    verificationSuccess:
      'Votre e-mail a été vérifié avec succès. Vous pouvez maintenant vous connecter.',

    verificationPending:
      "Votre e-mail n'a pas encore été vérifié. Ouvrez l'e-mail de vérification, cliquez sur le lien, puis réessayez.",

    verificationCheckError:
      "Impossible de vérifier l'état de votre e-mail. Réessayez.",

    verificationRequired:
      "Cette adresse e-mail n'a pas encore été vérifiée. Veuillez d'abord vérifier votre e-mail.",

    resendError:
      "Impossible d'envoyer l'e-mail de vérification. Réessayez plus tard.",

    noUser:
      "Aucun utilisateur n'est actuellement connecté.",

    openVerification:
      'Ouvrir la vérification',

    close: 'Fermer',
  },

  es: {
    login: 'Iniciar sesión',
    register: 'Crear cuenta',
    email: 'Correo electrónico',
    password: 'Contraseña',
    confirmPassword: 'Confirmar contraseña',
    name: 'Nombre',
    yourName: 'Tu nombre',

    loginDescription:
      'Inicia sesión en tu cuenta de WanderWise Pro',

    registerDescription:
      'Crea tu cuenta y comienza tu viaje con WanderWise Pro',

    noAccount: '¿No tienes una cuenta?',
    alreadyAccount: '¿Ya tienes una cuenta?',

    emailRequired:
      'Introduce tu correo electrónico.',

    emailVerification:
      'Verifica tu correo electrónico',

    verificationSent:
      'Enviamos un enlace de verificación a:',

    checkVerification:
      'He verificado mi correo',

    checking: 'Verificando...',

    resendVerification:
      'Reenviar correo de verificación',

    backToLogin:
      'Volver a iniciar sesión',

    spamMessage:
      'Si no encuentras el correo, revisa tu carpeta de spam.',

    processing: 'Procesando...',

    createAccount: 'Crear cuenta',

    captchaRequired:
      'Confirma que no eres un robot.',

    captchaError:
      'No se pudo cargar reCAPTCHA. Comprueba tu conexión a Internet e inténtalo de nuevo.',

    invalidEmail:
      'El correo electrónico no es válido.',

    userNotFound:
      'No existe ninguna cuenta con este correo electrónico.',

    wrongPassword:
      'La contraseña es incorrecta.',

    invalidCredential:
      'El correo electrónico o la contraseña son incorrectos.',

    emailAlreadyUsed:
      'Este correo electrónico ya está en uso.',

    weakPassword:
      'La contraseña es demasiado débil. Usa al menos 6 caracteres.',

    missingPassword:
      'Introduce tu contraseña.',

    networkError:
      'No se puede conectar a Internet. Inténtalo de nuevo.',

    tooManyRequests:
      'Demasiados intentos. Espera un momento y vuelve a intentarlo.',

    operationNotAllowed:
      'El inicio de sesión con correo y contraseña no está habilitado en Firebase.',

    genericError:
      'Se produjo un error al iniciar sesión. Inténtalo de nuevo.',

    nameRequired:
      'Introduce tu nombre.',

    passwordMin:
      'La contraseña debe tener al menos 6 caracteres.',

    passwordsMismatch:
      'Las contraseñas no coinciden.',

    verificationCreated:
      'Cuenta creada y correo de verificación enviado a',

    verificationResent:
      'El correo de verificación se ha enviado de nuevo. Revisa tu bandeja de entrada y la carpeta de spam.',

    verificationSuccess:
      'Tu correo electrónico ha sido verificado correctamente. Ahora puedes iniciar sesión.',

    verificationPending:
      'Tu correo todavía no ha sido verificado. Abre el correo de verificación, haz clic en el enlace y vuelve a intentarlo.',

    verificationCheckError:
      'No se pudo comprobar el estado de verificación. Inténtalo de nuevo.',

    verificationRequired:
      'Este correo todavía no ha sido verificado. Verifica tu correo primero.',

    resendError:
      'No se pudo enviar el correo de verificación. Inténtalo de nuevo más tarde.',

    noUser:
      'No hay ningún usuario actual.',

    openVerification:
      'Abrir verificación',

    close: 'Cerrar',
  },
} as const;

export function AuthModal({
  isOpen,
  onClose,
  onSuccess,
}: AuthModalProps) {
  const {
    signIn,
    signUp,
    resendEmailVerification,
    refreshEmailVerification,
  } = useAuth();

  const { language } = useLanguage();

  const currentLanguage: Language =
    language === 'ar' ||
    language === 'fr' ||
    language === 'es'
      ? language
      : 'en';

  const t = translations[currentLanguage];
  const isRtl = currentLanguage === 'ar';

  const captchaRef =
    useRef<ReCAPTCHA | null>(null);

  const [mode, setMode] =
    useState<'login' | 'register'>('login');

  const [verificationMode, setVerificationMode] =
    useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] =
    useState('');
  const [confirmPassword, setConfirmPassword] =
    useState('');

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [captchaToken, setCaptchaToken] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  const [successMessage, setSuccessMessage] =
    useState('');

  if (!isOpen) {
    return null;
  }

  const resetCaptcha = () => {
    setCaptchaToken(null);
    captchaRef.current?.reset();
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');

    setShowPassword(false);
    setShowConfirmPassword(false);

    resetCaptcha();

    setError('');
    setSuccessMessage('');
    setLoading(false);
    setVerificationMode(false);
  };

  const switchMode = () => {
    setMode((current) =>
      current === 'login'
        ? 'register'
        : 'login'
    );

    setName('');
    setPassword('');
    setConfirmPassword('');

    setError('');
    setSuccessMessage('');
    setVerificationMode(false);

    resetCaptcha();
  };

  const getFirebaseError = (
    errorCode: string
  ) => {
    switch (errorCode) {
      case 'auth/invalid-email':
        return t.invalidEmail;

      case 'auth/user-not-found':
        return t.userNotFound;

      case 'auth/wrong-password':
        return t.wrongPassword;

      case 'auth/invalid-credential':
        return t.invalidCredential;

      case 'auth/email-already-in-use':
        return t.emailAlreadyUsed;

      case 'auth/weak-password':
        return t.weakPassword;

      case 'auth/missing-password':
        return t.missingPassword;

      case 'auth/network-request-failed':
        return t.networkError;

      case 'auth/too-many-requests':
        return t.tooManyRequests;

      case 'auth/operation-not-allowed':
        return t.operationNotAllowed;

      default:
        return t.genericError;
    }
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    setError('');
    setSuccessMessage('');

    const normalizedEmail =
      email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError(t.emailRequired);
      return;
    }

    if (!password) {
      setError(t.missingPassword);
      return;
    }

    if (mode === 'register') {
      if (!name.trim()) {
        setError(t.nameRequired);
        return;
      }

      if (password.length < 6) {
        setError(t.passwordMin);
        return;
      }

      if (password !== confirmPassword) {
        setError(t.passwordsMismatch);
        return;
      }
    }

    if (!captchaToken) {
      setError(t.captchaRequired);
      return;
    }

    setLoading(true);

    try {
      if (mode === 'login') {
        const user = await signIn(
          normalizedEmail,
          password
        );

        onSuccess?.(user);

        resetForm();
        onClose();

        return;
      }

      await signUp(
        normalizedEmail,
        password,
        name.trim()
      );

      setVerificationMode(true);

      setSuccessMessage(
        `${t.verificationCreated} ${normalizedEmail}`
      );

      setPassword('');
      setConfirmPassword('');

      resetCaptcha();
    } catch (err: unknown) {
      const errorCode =
        typeof err === 'object' &&
        err !== null &&
        'code' in err
          ? String(
              (err as { code?: unknown })
                .code ?? ''
            )
          : '';

      const customError =
        err instanceof Error
          ? err.message
          : '';

      if (
        customError ===
        'EMAIL_NOT_VERIFIED'
      ) {
        setVerificationMode(true);

        setError(
          t.verificationRequired
        );
      } else if (
        customError === 'NO_USER'
      ) {
        setError(t.noUser);
      } else {
        setError(
          getFirebaseError(errorCode)
        );
      }

      resetCaptcha();
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification =
    async () => {
      if (loading) {
        return;
      }

      setError('');
      setSuccessMessage('');
      setLoading(true);

      try {
        await resendEmailVerification();

        setSuccessMessage(
          t.verificationResent
        );
      } catch (err: unknown) {
        const errorCode =
          typeof err === 'object' &&
          err !== null &&
          'code' in err
            ? String(
                (err as { code?: unknown })
                  .code ?? ''
              )
            : '';

        if (
          errorCode ===
          'auth/too-many-requests'
        ) {
          setError(
            t.tooManyRequests
          );
        } else if (
          errorCode ===
          'auth/network-request-failed'
        ) {
          setError(t.networkError);
        } else if (
          err instanceof Error &&
          err.message === 'NO_USER'
        ) {
          setError(t.noUser);
        } else {
          setError(t.resendError);
        }
      } finally {
        setLoading(false);
      }
    };

  const handleCheckVerification =
    async () => {
      if (loading) {
        return;
      }

      setError('');
      setSuccessMessage('');
      setLoading(true);

      try {
        const verified =
          await refreshEmailVerification();

        if (verified) {
          setSuccessMessage(
            t.verificationSuccess
          );

          setVerificationMode(false);
          setMode('login');

          setPassword('');
          setConfirmPassword('');

          resetCaptcha();
        } else {
          setError(
            t.verificationPending
          );
        }
      } catch {
        setError(
          t.verificationCheckError
        );
      } finally {
        setLoading(false);
      }
    };

  const handleClose = () => {
    if (loading) {
      return;
    }

    resetForm();
    onClose();
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={handleClose}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <button
          type="button"
          onClick={handleClose}
          disabled={loading}
          className={`absolute top-4 z-10 rounded-full p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:opacity-50 ${
            isRtl
              ? 'left-4'
              : 'right-4'
          }`}
          aria-label={t.close}
          title={t.close}
        >
          <X size={20} />
        </button>

        <div className="p-6 sm:p-8">
          {verificationMode ? (
            <div className="text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
                <Mail size={32} />
              </div>

              <h2 className="text-2xl font-bold text-white">
                {t.emailVerification}
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                {t.verificationSent}
              </p>

              <p className="mt-1 break-all font-semibold text-cyan-400">
                {email}
              </p>

              {successMessage && (
                <div
                  className={`mt-5 flex items-start gap-3 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 text-sm leading-6 text-cyan-300 ${
                    isRtl
                      ? 'text-right'
                      : 'text-left'
                  }`}
                >
                  <CheckCircle2
                    size={20}
                    className="mt-0.5 shrink-0"
                  />

                  <span>
                    {successMessage}
                  </span>
                </div>
              )}

              {error && (
                <div
                  className={`mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-300 ${
                    isRtl
                      ? 'text-right'
                      : 'text-left'
                  }`}
                >
                  {error}
                </div>
              )}

              <div className="mt-6 space-y-3">
                <button
                  type="button"
                  onClick={
                    handleCheckVerification
                  }
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2
                        size={19}
                        className="animate-spin"
                      />
                      {t.checking}
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={19} />
                      {t.checkVerification}
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={
                    handleResendVerification
                  }
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 font-medium text-slate-300 transition hover:bg-slate-700 hover:text-white disabled:opacity-60"
                >
                  {t.resendVerification}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setVerificationMode(
                      false
                    );
                    setMode('login');
                    setError('');
                    setSuccessMessage('');
                    resetCaptcha();
                  }}
                  disabled={loading}
                  className="w-full py-2 text-sm text-slate-400 transition hover:text-white disabled:opacity-50"
                >
                  {t.backToLogin}
                </button>
              </div>

              <p className="mt-5 text-xs leading-5 text-slate-500">
                {t.spamMessage}
              </p>
            </div>
          ) : (
            <>
              <div className="mb-7 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
                  {mode === 'login' ? (
                    <Lock size={28} />
                  ) : (
                    <User size={28} />
                  )}
                </div>

                <h2 className="text-2xl font-bold text-white">
                  {mode === 'login'
                    ? t.login
                    : t.register}
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  {mode === 'login'
                    ? t.loginDescription
                    : t.registerDescription}
                </p>
              </div>

              {error && (
                <div
                  className={`mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-300 ${
                    isRtl
                      ? 'text-right'
                      : 'text-left'
                  }`}
                >
                  {error}

                  {error ===
                    t.verificationRequired && (
                    <button
                      type="button"
                      onClick={() =>
                        setVerificationMode(
                          true
                        )
                      }
                      className="mt-2 block font-semibold text-cyan-400 hover:text-cyan-300"
                    >
                      {t.openVerification}
                    </button>
                  )}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
                noValidate
              >
                {mode === 'register' && (
                  <div>
                    <label
                      htmlFor="auth-name"
                      className="mb-2 block text-sm font-medium text-slate-300"
                    >
                      {t.name}
                    </label>

                    <div className="relative">
                      <User
                        size={18}
                        className={`absolute top-1/2 -translate-y-1/2 text-slate-500 ${
                          isRtl
                            ? 'right-3'
                            : 'left-3'
                        }`}
                      />

                      <input
                        id="auth-name"
                        type="text"
                        value={name}
                        onChange={(event) =>
                          setName(
                            event.target.value
                          )
                        }
                        placeholder={
                          t.yourName
                        }
                        disabled={loading}
                        autoComplete="name"
                        className={`w-full rounded-xl border border-slate-700 bg-slate-800 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 ${
                          isRtl
                            ? 'pr-10 pl-4'
                            : 'pl-10 pr-4'
                        }`}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="auth-email"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    {t.email}
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className={`absolute top-1/2 -translate-y-1/2 text-slate-500 ${
                        isRtl
                          ? 'right-3'
                          : 'left-3'
                      }`}
                    />

                    <input
                      id="auth-email"
                      type="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(
                          event.target.value
                        )
                      }
                      placeholder="example@email.com"
                      disabled={loading}
                      autoComplete="email"
                      className={`w-full rounded-xl border border-slate-700 bg-slate-800 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 ${
                        isRtl
                          ? 'pr-10 pl-4'
                          : 'pl-10 pr-4'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="auth-password"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    {t.password}
                  </label>

                  <div className="relative">
                    <Lock
                      size={18}
                      className={`absolute top-1/2 -translate-y-1/2 text-slate-500 ${
                        isRtl
                          ? 'right-3'
                          : 'left-3'
                      }`}
                    />

                    <input
                      id="auth-password"
                      type={
                        showPassword
                          ? 'text'
                          : 'password'
                      }
                      value={password}
                      onChange={(event) =>
                        setPassword(
                          event.target.value
                        )
                      }
                      placeholder="••••••••"
                      disabled={loading}
                      autoComplete={
                        mode === 'login'
                          ? 'current-password'
                          : 'new-password'
                      }
                      className={`w-full rounded-xl border border-slate-700 bg-slate-800 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 ${
                        isRtl
                          ? 'pr-10 pl-12'
                          : 'pl-10 pr-12'
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (value) => !value
                        )
                      }
                      disabled={loading}
                      className={`absolute top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white ${
                        isRtl
                          ? 'left-3'
                          : 'right-3'
                      }`}
                      aria-label={
                        showPassword
                          ? 'Hide password'
                          : 'Show password'
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {mode === 'register' && (
                  <div>
                    <label
                      htmlFor="auth-confirm-password"
                      className="mb-2 block text-sm font-medium text-slate-300"
                    >
                      {t.confirmPassword}
                    </label>

                    <div className="relative">
                      <Lock
                        size={18}
                        className={`absolute top-1/2 -translate-y-1/2 text-slate-500 ${
                          isRtl
                            ? 'right-3'
                            : 'left-3'
                        }`}
                      />

                      <input
                        id="auth-confirm-password"
                        type={
                          showConfirmPassword
                            ? 'text'
                            : 'password'
                        }
                        value={confirmPassword}
                        onChange={(event) =>
                          setConfirmPassword(
                            event.target.value
                          )
                        }
                        placeholder="••••••••"
                        disabled={loading}
                        autoComplete="new-password"
                        className={`w-full rounded-xl border border-slate-700 bg-slate-800 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 ${
                          isRtl
                            ? 'pr-10 pl-12'
                            : 'pl-10 pr-12'
                        }`}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            (value) =>
                              !value
                          )
                        }
                        disabled={loading}
                        className={`absolute top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white ${
                          isRtl
                            ? 'left-3'
                            : 'right-3'
                        }`}
                        aria-label={
                          showConfirmPassword
                            ? 'Hide password'
                            : 'Show password'
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex justify-center overflow-hidden rounded-xl border border-slate-700 bg-slate-800/60 p-3">
                  <ReCAPTCHA
                    ref={captchaRef}
                    sitekey="6LdRTcQtAAAAAJ1189oaiSCtrNly3FTvz2O-9ppV"
                    onChange={(token) => {
                      setCaptchaToken(token);
                      setError('');
                    }}
                    onExpired={() => {
                      setCaptchaToken(null);
                    }}
                    onErrored={() => {
                      setCaptchaToken(null);
                      setError(
                        t.captchaError
                      );
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2
                        size={19}
                        className="animate-spin"
                      />
                      {t.processing}
                    </>
                  ) : mode === 'login' ? (
                    t.login
                  ) : (
                    t.createAccount
                  )}
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-slate-400">
                {mode === 'login'
                  ? t.noAccount
                  : t.alreadyAccount}

                <button
                  type="button"
                  onClick={switchMode}
                  disabled={loading}
                  className={`font-semibold text-cyan-400 hover:text-cyan-300 ${
                    isRtl
                      ? 'mr-2'
                      : 'ml-2'
                  }`}
                >
                  {mode === 'login'
                    ? t.register
                    : t.login}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthModal;