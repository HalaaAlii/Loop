import { useState } from 'react';

function Filters({ onFilter }) {
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onFilter) {
      onFilter({
        category: category || null,
        minPrice: minPrice ? Number(minPrice) : null,
        maxPrice: maxPrice ? Number(maxPrice) : null,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{
      display: 'flex',
      gap: '1rem',
      alignItems: 'center',
      margin: '2rem 0 1.5rem 0',
      flexWrap: 'wrap',
      maxWidth: '1200px',
      marginLeft: 'auto',
      marginRight: 'auto',
    }}>
      <select value={category} onChange={e => setCategory(e.target.value)} style={{
        padding: '0.5rem 1rem',
        borderRadius: '8px',
        border: '1.5px solid #ddd',
        fontSize: '1rem',
        minWidth: '120px',
        background: '#fff',
        color: '#222',
        boxSizing: 'border-box',
      }}>
        <option value="">All Categories</option>
        <option value="tools">Tools</option>
        <option value="outdoor">Outdoor</option>
        <option value="electronics">Electronics</option>
        <option value="furniture">Furniture</option>
        <option value="sports">Sports</option>
      </select>
      <input
        type="number"
        placeholder="Min Price"
        value={minPrice}
        onChange={e => setMinPrice(e.target.value)}
        style={{
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          border: '1.5px solid #ddd',
          fontSize: '1rem',
          width: '100px',
          background: '#fff',
          color: '#222',
          boxSizing: 'border-box',
        }}
      />
      <input
        type="number"
        placeholder="Max Price"
        value={maxPrice}
        onChange={e => setMaxPrice(e.target.value)}
        style={{
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          border: '1.5px solid #ddd',
          fontSize: '1rem',
          width: '100px',
          background: '#fff',
          color: '#222',
          boxSizing: 'border-box',
        }}
      />
      <button type="submit" style={{
        background: '#1A1B41',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        padding: '0.5rem 1.5rem',
        fontWeight: 700,
        fontSize: '1rem',
        cursor: 'pointer',
      }}>
        Search
      </button>
    </form>
  );
}

export default Filters;
