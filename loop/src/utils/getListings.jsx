import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

export async function getListings({ category, minPrice, maxPrice, search, maxDistance } = {}) {
  let q = collection(db, "listings");
  const filters = [];
  
  // Filter by category if provided
  if (category && category !== "") {
    filters.push(where("category", "==", category));
  }
  
  // Filter by price range if provided
  if (minPrice) {
    filters.push(where("price", ">=", Number(minPrice)));
  }
  if (maxPrice) {
    filters.push(where("price", "<=", Number(maxPrice)));
  }
  
  if (filters.length > 0) {
    q = query(q, ...filters);
  }
  
  try {
    const querySnapshot = await getDocs(q);
    let results = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    
    // Apply search filter if provided
    if (search && search.trim() !== "") {
      const searchTerm = search.toLowerCase().trim();
      results = results.filter(item => {
        const name = (item.name || "").toLowerCase();
        const description = (item.description || "").toLowerCase();
        const category = (item.category || "").toLowerCase();
        const tags = (item.tags || []).join(" ").toLowerCase();
        
        return name.includes(searchTerm) || 
               description.includes(searchTerm) || 
               category.includes(searchTerm) || 
               tags.includes(searchTerm);
      });
    }
    
    // Apply distance filter if provided
    if (maxDistance && maxDistance !== "") {
      const maxDist = Number(maxDistance);
      results = results.filter(item => {
        // Since we're using random distances, we'll simulate distance filtering
        // In a real app, you'd have actual distance data from the item
        const itemDistance = Math.random() * 50; // Generate random distance for filtering
        return itemDistance <= maxDist;
      });
    }
    
    return results;
  } catch (error) {
    console.error("Error fetching listings:", error);
    return [];
  }
}
