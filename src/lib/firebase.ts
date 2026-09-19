import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyCvpFARO3O7QMFcrrvveSdAK4tVX9ZR14A',
  authDomain: 'wanderwisepro.firebaseapp.com',
  projectId: 'wanderwisepro',
  storageBucket: 'wanderwisepro.firebasestorage.app',
  messagingSenderId: '1024865443465',
  appId: '1:1024865443465:web:080c2d3846bce64fca7058',
  measurementId: 'G-F7XMFHX2QQ',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// Analytics اختياري ولا يجب أن يمنع تشغيل التطبيق
if (typeof window !== 'undefined') {
  isSupported()
    .then((supported) => {
      if (supported) {
        getAnalytics(app);
      }
    })
    .catch(() => {
      // تجاهل خطأ Analytics
    });
}

export default app;