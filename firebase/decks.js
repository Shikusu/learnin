import {
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "./config";

export async function saveDeck(userId, deckData) {
  const decksRef = collection(db, "users", userId, "decks");
  const docRef = await addDoc(decksRef, {
    topic: deckData.topic,
    questions: deckData.questions,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getDeck(uid, deckId) {
  const ref = doc(db, "users", uid, "decks", deckId);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function getDecks(userId) {
  const decksRef = collection(db, "users", userId, "decks");
  const q = query(decksRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() ?? new Date(),
  }));
}

export async function deleteDeck(userId, deckId) {
  const ref = doc(db, "users", userId, "decks", deckId);
  await deleteDoc(ref);
}

/**
 * Saves (overwrites) the last score for a deck.
 * Stored at: users/{uid}/scores/{deckId}
 */
export async function saveScore(userId, deckId, { pct, correct, total }) {
  const ref = doc(db, "users", userId, "scores", deckId);
  await setDoc(ref, { pct, correct, total, playedAt: serverTimestamp() });
}

/**
 * Fetches all scores for a user, keyed by deckId.
 * Returns: { [deckId]: { pct, correct, total, playedAt } }
 */
export async function getScores(userId) {
  const scoresRef = collection(db, "users", userId, "scores");
  const snapshot = await getDocs(scoresRef);
  const result = {};
  snapshot.docs.forEach((d) => {
    result[d.id] = {
      ...d.data(),
      playedAt: d.data().playedAt?.toDate() ?? null,
    };
  });
  return result;
}