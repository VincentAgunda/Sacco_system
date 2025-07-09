import { db } from '../firebase/firebaseInit';
import { 
  doc, 
  setDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  serverTimestamp 
} from 'firebase/firestore';

export async function savePaymentToFirestore(paymentData) {
  try {
    const paymentRef = doc(collection(db, 'payments'));
    await setDoc(paymentRef, {
      ...paymentData,
      date: serverTimestamp()  // Use server timestamp
    });
    return paymentRef.id;
  } catch (error) {
    console.error("Error saving payment:", error);
    throw error;
  }
}

export async function getUserPayments(userId) {
  try {
    const paymentsRef = collection(db, 'payments');
    const q = query(paymentsRef, where('userId', '==', userId));
    
    const querySnapshot = await getDocs(q);
    const payments = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate?.()
    }));
    
    // Sort by date descending
    return payments.sort((a, b) => b.date - a.date);
  } catch (error) {
    console.error("Error fetching user payments:", error);
    return [];
  }
}

export async function getAllPayments() {
  try {
    const paymentsRef = collection(db, 'payments');
    const querySnapshot = await getDocs(paymentsRef);
    const payments = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate?.()
    }));
    
    // Sort by date descending
    return payments.sort((a, b) => b.date - a.date);
  } catch (error) {
    console.error("Error fetching all payments:", error);
    return [];
  }
}

export async function getUsers() {
  try {
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersRef);
    const users = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()
    }));
    
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}