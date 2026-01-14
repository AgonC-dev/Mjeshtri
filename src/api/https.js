import { collection, query, where, getDocs, limit, orderBy } from "firebase/firestore";
import { db } from "./firebase";

// const delay = (ms) => new Promise(res => setTimeout(res, ms));
// your firebase config


export async function fetchUsers(city, category) {
  try {
    const normalizedCategory =
      !category?.trim() || category === 'Të gjitha'
        ? null
        : category

    const workersRef = collection(db, "workers")
    let constraints = [where("isActive", "==", true)]

    if (city && city !== 'Të gjitha') {
      constraints.push(where("city", "==", city))
    }

    if (normalizedCategory) {
      constraints.push(where("category", "==", normalizedCategory))
    }

    constraints.push(orderBy("fullName", "asc"))
    constraints.push(limit(100))

    const q = query(workersRef, ...constraints)
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error("Firebase Fetch Error:", error)
    return []
  }
}


// export async function fetchWorkerDetails(id) {
//     const docRef = doc(db, "workers", id);
//     const docSnap = await getDoc(docRef);
//     return { id: docSnap.id, ...docSnap.data() };
// }