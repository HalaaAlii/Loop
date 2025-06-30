import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ItemCard({
  id,
  image = '',
  title = 'Power Washer',
  price = '$10/day',
  availability = 'Available now',
  location = '2.1 km away',
  rating = 4.8,
  reviews = 12,
  tags = ['#DIY', '#Outdoor'],
  user = { name: 'Alex', avatar: '' },
  distance = '2.1 km',
  badge = 'Featured',
  onTagClick,
}) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (id) {
      navigate(`/item/${id}`);
    }
  };

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '30px',
        padding: '1.5rem 1rem',
        minWidth: '220px',
        maxWidth: '240px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        margin: '0 1rem',
        color: '#222',
        position: 'relative',
        transition: 'transform 0.2s',
        cursor: 'pointer',
      }}
      onClick={handleCardClick}
      onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'}
      onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      {/* Badge */}
      {badge && (
        <div style={{
          position: 'absolute',
          top: 12,
          left: 12,
          background: '#FCF6EB',
          color: '#051914',
          fontWeight: 700,
          fontSize: '0.85rem',
          borderRadius: '12px',
          padding: '0.2rem 0.7rem',
          zIndex: 2,
        }}>{badge}</div>
      )}
      {/* Item Image */}
      <div style={{
        width: '90px',
        height: '90px',
        borderRadius: '18px',
        background: '#f3f3f3',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1rem',
        overflow: 'hidden',
      }}>
        {image ? (
          <img src={image} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span role="img" aria-label="item" style={{ fontSize: '2.5rem' }}>🧰</span>
        )}
      </div>
      {/* Title */}
      <div style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: '0.3rem', textAlign: 'center' }}>{title}</div>
      {/* Price & Availability */}
      <div style={{ fontWeight: 500, fontSize: '1rem', marginBottom: '0.2rem', color: '#001f3f' }}>{price}</div>
      <div style={{ fontSize: '0.95rem', marginBottom: '0.2rem', color: '#001f3f' }}>{availability}</div>
      {/* Location & Distance */}
      <div style={{ fontSize: '0.92rem', color: '#888', marginBottom: '0.2rem' }}>{location} {distance && <span>· {distance}</span>}</div>
      {/* Rating/Reviews */}
      <div style={{ fontSize: '0.95rem', color: '#fbc02d', marginBottom: '0.2rem' }}>
        {'★'.repeat(Math.floor(rating))}
        {rating % 1 ? '½' : ''}
        <span style={{ color: '#222', marginLeft: 4 }}>({rating} / {reviews})</span>
      </div>
      {/* Tags */}
      <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', margin: '0.3rem 0 0.5rem 0' }}>
        {tags && tags.map((tag, i) => (
          <span
            key={i}
            style={{
              background: '#f3f3f3',
              color: '#666',
              borderRadius: '8px',
              padding: '0.1rem 0.5rem',
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onClick={e => {
              e.stopPropagation();
              if (onTagClick) onTagClick(tag);
            }}
            onMouseOver={e => e.currentTarget.style.background = '#e0e0e0'}
            onMouseOut={e => e.currentTarget.style.background = '#f3f3f3'}
          >
            {tag}
          </span>
        ))}
      </div>
      {/* User Avatar/Name */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', marginTop: '0.2rem' }}>
        {user.avatar ? (
          <img src={user.avatar} alt={user.name} style={{ width: 28, height: 28, borderRadius: '50%', marginRight: 8 }} />
        ) : (
          <span role="img" aria-label="user" style={{ fontSize: '1.3rem', marginRight: 8 }}>👤</span>
        )}
        <span style={{ fontSize: '0.98rem', color: '#333' }}>{user.name}</span>
      </div>
    </div>
  );
}

export default ItemCard;
