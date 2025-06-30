import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Filters from "../components/Filters";
import Items from "../components/Items";

function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({ category: '', minPrice: '', maxPrice: '', search: '', maxDistance: '' });

  // Initialize filters from URL parameters
  useEffect(() => {
    const category = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';
    const maxDistance = searchParams.get('maxDistance') || '';
    setFilters({ category, minPrice: '', maxPrice: '', search, maxDistance });
  }, [searchParams]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // Update URL parameters
    const params = new URLSearchParams();
    if (newFilters.category) params.set('category', newFilters.category);
    if (newFilters.minPrice) params.set('minPrice', newFilters.minPrice);
    if (newFilters.maxPrice) params.set('maxPrice', newFilters.maxPrice);
    if (newFilters.search) params.set('search', newFilters.search);
    if (newFilters.maxDistance) params.set('maxDistance', newFilters.maxDistance);
    setSearchParams(params);
  };

  // Handler for clicking a tag
  const handleTagClick = (tag) => {
    // Remove # if present and lowercase
    const cleanTag = tag.replace(/^#/, '').toLowerCase();
    const newFilters = { ...filters, category: cleanTag };
    setFilters(newFilters);
    
    // Update URL parameters
    const params = new URLSearchParams();
    params.set('category', cleanTag);
    if (filters.search) params.set('search', filters.search);
    if (filters.maxDistance) params.set('maxDistance', filters.maxDistance);
    setSearchParams(params);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1.5rem", color: "#001f3f" }}>
        Browse Listings
        {filters.search && (
          <span style={{ fontSize: "1.2rem", color: "#666", fontWeight: "normal" }}>
            {" "}for "{filters.search}"
          </span>
        )}
      </h1>
      <Filters onFilter={handleFilterChange} />
      <Items filters={filters} onTagClick={handleTagClick} />
    </div>
  );
}

export default Browse;
