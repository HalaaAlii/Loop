import { collection, addDoc } from "firebase/firestore"
import { db } from "../firebase"

async function createListing(data) {
  const docRef = await addDoc(collection(db, "listings"), data)
  return docRef.id
}
