import { collection, query, where, getDocs, limit, orderBy } from "firebase/firestore";
import { db } from "./firebase";

// const delay = (ms) => new Promise(res => setTimeout(res, ms));
// your firebase config


export async function fetchUsers(city, category, searchQuery) { // Added searchQuery here
  try {
    const workersRef = collection(db, "workers");
    let constraints = [where("isActive", "==", true)];

    if (city && city !== 'Të gjitha') {
      constraints.push(where("city", "==", city));
    }

    if (category && category !== 'Të gjitha') {
      constraints.push(where("category", "==", category));
    }

    // NEW: Search Filter in Backend
    if (searchQuery && searchQuery.trim() !== '') {
      // This is the Firestore trick for "Starts With"
      constraints.push(where("fullName", ">=", searchQuery));
      constraints.push(where("fullName", "<=", searchQuery + '\uf8ff'));
    }

    constraints.push(orderBy("fullName", "asc"));
    constraints.push(limit(40));

    const q = query(workersRef, ...constraints);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Firebase Search Error:", error);
    return []; 
  }
}

export async function fetchWorkerDetails(id) {
    const docRef = doc(db, "workers", id);
    const docSnap = await getDoc(docRef);
    return { id: docSnap.id, ...docSnap.data() };
}