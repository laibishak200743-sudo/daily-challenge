import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  reload,
  sendEmailVerification,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth';

import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';

import { auth, db } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;

  signIn: (
    email: string,
    password: string
  ) => Promise<User>;

  signUp: (
    email: string,
    password: string,
    name: string
  ) => Promise<User>;

  resendEmailVerification: () => Promise<void>;

  refreshEmailVerification: () => Promise<boolean>;

  logout: () => Promise<void>;
}

const AuthContext =
  createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * إنشاء ملف المستخدم في Firestore إذا لم يكن موجودًا.
   *
   * الخطة الافتراضية دائمًا free.
   * المستخدم لا يستطيع اختيار Premium من الواجهة.
   */
  const ensureUserProfile = async (
    firebaseUser: User
  ): Promise<void> => {
    const userRef = doc(
      db,
      'users',
      firebaseUser.uid
    );

    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
      await setDoc(userRef, {
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || '',
        plan: 'free',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  };

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initializeAuth = async () => {
      try {
        await setPersistence(
          auth,
          browserLocalPersistence
        );

        unsubscribe = onAuthStateChanged(
          auth,
          async (currentUser) => {
            try {
              if (
                currentUser &&
                currentUser.emailVerified
              ) {
                await ensureUserProfile(currentUser);
                setUser(currentUser);
              } else {
                setUser(null);
              }
            } catch (error) {
              console.error(
                'Error loading user profile:',
                error
              );

              setUser(null);
            } finally {
              setLoading(false);
            }
          }
        );
      } catch (error) {
        console.error(
          'Firebase authentication initialization error:',
          error
        );

        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  /**
   * تسجيل الدخول
   */
  const signIn = async (
    email: string,
    password: string
  ): Promise<User> => {
    const result =
      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

    await reload(result.user);

    if (!result.user.emailVerified) {
      setUser(null);

      throw new Error(
        'EMAIL_NOT_VERIFIED'
      );
    }

    await ensureUserProfile(result.user);

    setUser(result.user);

    return result.user;
  };

  /**
   * إنشاء حساب جديد
   */
  const signUp = async (
    email: string,
    password: string,
    name: string
  ): Promise<User> => {
    const result =
      await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

    const displayName =
      name.trim();

    if (displayName) {
      await updateProfile(result.user, {
        displayName,
      });
    }

    /**
     * إنشاء ملف المستخدم في Firestore.
     *
     * الخطة تبدأ دائمًا بـ free.
     */
    await setDoc(
      doc(
        db,
        'users',
        result.user.uid
      ),
      {
        email:
          result.user.email ||
          email.trim(),

        displayName,

        plan: 'free',

        createdAt:
          serverTimestamp(),

        updatedAt:
          serverTimestamp(),
      }
    );

    /**
     * إرسال رسالة التحقق بالبريد.
     */
    await sendEmailVerification(
      result.user
    );

    /**
     * الحساب غير متحقق بعد،
     * لذلك لا نضعه كمستخدم نشط داخل التطبيق.
     */
    setUser(null);

    return result.user;
  };

  /**
   * إعادة إرسال رسالة التحقق
   */
  const resendEmailVerification =
    async (): Promise<void> => {
      const currentUser =
        auth.currentUser;

      if (!currentUser) {
        throw new Error(
          'NO_USER'
        );
      }

      await sendEmailVerification(
        currentUser
      );
    };

  /**
   * تحديث حالة التحقق من البريد
   */
  const refreshEmailVerification =
    async (): Promise<boolean> => {
      const currentUser =
        auth.currentUser;

      if (!currentUser) {
        return false;
      }

      await reload(currentUser);

      if (currentUser.emailVerified) {
        await ensureUserProfile(
          currentUser
        );

        setUser(currentUser);

        return true;
      }

      return false;
    };

  /**
   * تسجيل الخروج
   */
  const logout =
    async (): Promise<void> => {
      await signOut(auth);
      setUser(null);
    };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        resendEmailVerification,
        refreshEmailVerification,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used inside an AuthProvider'
    );
  }

  return context;
}

export default AuthContext;