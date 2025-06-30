import { collection, addDoc } from "firebase/firestore"
import { db } from "../firebase"

export async function createListing(data) {
  const docRef = await addDoc(collection(db, "listings"), data)
  return docRef.id
}
