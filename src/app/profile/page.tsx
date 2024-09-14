'use client';

import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { auth } from '../../lib/firebaseConfig';

const ProfilePage = () => {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/');
      }
    });
    return () => unsubscribe();
  }, [router]);

  return <div>歡迎來到個人資料頁面！</div>;
};

export default ProfilePage;
