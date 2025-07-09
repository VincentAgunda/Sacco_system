import { db } from '../firebase/firebaseInit';
import { doc, updateDoc } from 'firebase/firestore';

export async function makeUserAdmin(userId) {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { role: 'admin' });
    return true;
  } catch (error) {
    console.error("Error making user admin:", error);
    return false;
  }
}

export async function revokeAdmin(userId) {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { role: 'user' });
    return true;
  } catch (error) {
    console.error("Error revoking admin:", error);
    return false;
  }
}