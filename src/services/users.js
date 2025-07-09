import { db } from '../firebase/firebaseInit';
import { collection, getDocs } from 'firebase/firestore';

export async function getUsers() {
  const usersCollection = collection(db, 'users');
  const usersSnapshot = await getDocs(usersCollection);
  return usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}