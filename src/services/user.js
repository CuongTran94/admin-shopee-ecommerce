import request from '@/utils/request';
import { auth, firestore } from '../../config/firebase';

export async function getCurrentUser() {
  try {
    return new Promise((resolve, reject) => {
      const unsubscribe = auth.onAuthStateChanged(userAuth => {
        unsubscribe();
        resolve(userAuth);
      }, reject);
    });
  } catch (err) {
    throw err;
  }
}

export async function getUserProfile(userAuth) {
  try {
    if (!userAuth) return;
    const { uid } = userAuth;

    const userRef = await firestore.doc(`users/${uid}`);
    const userCurrent = await userRef.get();

    return userCurrent;

  } catch (err) {
    throw err;
  }
}

export async function queryNotices() {
  return request('/api/notices');
}
