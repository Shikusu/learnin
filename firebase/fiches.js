import {
collection,
query,
orderBy,
doc,
getDoc,
getDocs,
deleteDoc,
addDoc,
serverTimestamp,
} from "firebase/firestore";
import { db } from "./config"; // adjust this import to match your firebase config path

/**
 * Save a sanitized fiche to Firestore under the user's fiches subcollection.
 *
 * Collection structure:
 *   users/{uid}/fiches/{ficheId}
 *
 * Returns the generated Firestore document ID.
 */
export async function getFiche(uid, ficheId) {
  const ref = doc(db, "users", uid, "fiches", ficheId);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function getFiches(uid) {
  const fichesRef = collection(db, "users", uid, "fiches");
  const q = query(fichesRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);  
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() ?? new Date(),
    }));
}

export const saveFiche = async (uid, fiche) => {
  const ref = collection(db, "users", uid, "fiches");
  const doc = await addDoc(ref, {
    ...fiche,
    createdAt: serverTimestamp(),
  });
  return doc.id;
};

export async function deleteFiche(userId, ficheId) {
  const ref = doc(db, "users", userId, "fiches", ficheId);
  await deleteDoc(ref);
}
