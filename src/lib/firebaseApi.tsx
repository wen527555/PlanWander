import { doc, setDoc } from 'firebase/firestore';

import { db } from '../lib/firebaseConfig';

interface UserInfo {
  uid: string;
  displayName?: string | null;
  email: string;
  photoURL?: string | null;
}

export const saveUserData = async (userInfo: UserInfo | null): Promise<void> => {
  if (!userInfo || !userInfo.uid) {
    console.error('User info is invalid:', userInfo);
    return;
  }
  console.log('userInfo', userInfo);
  const userData = {
    uid: userInfo.uid,
    userName: userInfo.displayName ?? '',
    email: userInfo.email,
    photoURL: userInfo.photoURL ?? '',
    createAt: new Date(),
  };

  try {
    await setDoc(doc(db, 'users', userInfo.uid), userData, { merge: true });
  } catch (error) {
    console.log('error', error);
  }
};
