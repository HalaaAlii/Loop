import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { auth } from '../firebase'
import SearchIcon from '../assets/images/search-poi-svgrepo-com.svg'

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [maxDistance, setMaxDistance] = useState('50');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  const handleBrowseClick = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      const browseSection = document.getElementById('browse-section');
      if (browseSection) {
        browseSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.href = '/#browse-section';
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to browse page with search query and distance filter
      const params = new URLSearchParams();
      params.set('search', searchQuery.trim());
      if (maxDistance !== '50') {
        params.set('maxDistance', maxDistance);
      }
      navigate(`/browse?${params.toString()}`);
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <>
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        backgroundColor: 'rgba(255,255,255,0.08)',
        backdropFilter: 'blur(10px)',
        borderRadius: '24px',
        margin: '0',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
        border: 'none',
        position: 'sticky',
        top: '1rem',
        zIndex: 1000,
        width: '100%'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link to="/" style={{
            textDecoration: 'none',
            color: '#1A1B41',
            fontSize: '1.5rem',
            fontWeight: 700
          }}>
            Loop.
          </Link>
          
          <button onClick={handleBrowseClick} style={{
            background: 'none',
            border: 'none',
            textDecoration: 'none',
            color: '#1A1B41',
            fontSize: '1rem',
            fontWeight: 700,
            padding: '0.5rem 1rem',
            borderRadius: '10px',
            transition: 'all 0.2s ease',
            cursor: 'pointer',
            outline: 'none',
            boxShadow: 'none',
          }}>
            Browse
          </button>
          
          <Link 
            to="/post-listing" 
            style={{
              textDecoration: 'none',
              color: '#1A1B41',
              fontSize: '1rem',
              fontWeight: 700,
              padding: '0.5rem 1rem',
              borderRadius: '10px',
              transition: 'all 0.2s ease',
            }}
          >
            Post Item
          </Link>
        </div>
        
        <form onSubmit={handleSearch} style={{
          display: 'flex',
          alignItems: 'center',
          background: '#fff',
          borderRadius: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          border: '1px solid #ddd',
          overflow: 'hidden',
          padding: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              style={{
                border: 'none',
                outline: 'none',
                padding: '0.9rem 1.2rem',
                fontSize: '1rem',
                background: 'transparent',
                minWidth: '120px',
                maxWidth: '180px',
                flex: 1,
                color: '#1A1B41',
                fontWeight: 500,
              }}
            />
            <div style={{ width: 1, height: 32, background: '#eee', margin: '0 0.5rem' }} />
            <select
              value={maxDistance}
              onChange={(e) => setMaxDistance(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                padding: '0.9rem 1.2rem',
                fontSize: '1rem',
                background: 'transparent',
                minWidth: '80px',
                color: '#1A1B41',
                cursor: 'pointer',
                fontWeight: 500,
                appearance: 'none',
                boxShadow: 'none',
              }}
              onFocus={e => { e.target.style.outline = 'none'; e.target.style.boxShadow = 'none'; }}
            >
              <option value="5">5 km</option>
              <option value="10">10 km</option>
              <option value="25">25 km</option>
              <option value="50">50 km</option>
            </select>
          </div>
          <button
            type="submit"
            style={{
              border: 'none',
              background: '#001F3F',
              padding: 0,
              width: 36,
              height: 36,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 0.7rem 0 0.7rem',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              transition: 'background 0.2s',
            }}
          >
            <img src={SearchIcon} alt="Search" style={{ width: 18, height: 18, filter: 'invert(1) brightness(2)' }} />
          </button>
        </form>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ 
              fontSize: '0.9rem', 
              color: '#1A1B41',
              fontWeight: '500'
            }}>
              {user.displayName || user.email}
            </span>
            <button 
              onClick={() => auth.signOut()}
              style={{
                textDecoration: 'none',
                color: '#1A1B41',
                fontSize: '1rem',
                fontWeight: '500',
                padding: '0.5rem 1rem',
                borderRadius: '10px',
                transition: 'all 0.2s ease',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <button onClick={() => setShowLogin(true)} style={{
            textDecoration: 'none',
            color: '#1A1B41',
            fontSize: '1rem',
            fontWeight: 700,
            padding: '0.5rem 1rem',
            borderRadius: '10px',
            transition: 'all 0.2s ease',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}>
            Login / Signup
          </button>
        )}
      </nav>
      {showLogin && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
        }}
        onClick={() => setShowLogin(false)}
        >
          <div style={{
            background: '#fff',
            borderRadius: '20px',
            padding: '2.5rem 2rem',
            minWidth: '340px',
            maxWidth: '90vw',
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
          onClick={e => e.stopPropagation()}
          >
            <button onClick={() => setShowLogin(false)} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#1A1B41' }}>×</button>
            <h2 style={{ marginBottom: '1.5rem', color: '#1A1B41', fontWeight: 700 }}>Login or Signup</h2>
            <p style={{ marginBottom: '1.5rem', color: '#666', textAlign: 'center', fontSize: '0.9rem' }}>
              You need to be logged in to post items
            </p>
            {/* Placeholder for login/signup form - you can integrate Firebase here later */}
            <input type="email" placeholder="Email" style={{ marginBottom: '1rem', padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid #ddd', width: '100%' }} />
            <input type="password" placeholder="Password" style={{ marginBottom: '1.5rem', padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid #ddd', width: '100%' }} />
            <button style={{ background: '#1A1B41', color: '#fff', border: 'none', borderRadius: '10px', padding: '0.7rem 2rem', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', width: '100%' }}>Login</button>
            <button style={{ background: '#CEF17B', color: '#1A1B41', border: 'none', borderRadius: '10px', padding: '0.7rem 2rem', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', width: '100%', marginTop: '1rem' }}>Sign Up</button>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar
