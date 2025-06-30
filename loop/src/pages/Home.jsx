import { useRef, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ItemCard from '../components/ItemCard';
import SearchIcon from '../assets/images/search-poi-svgrepo-com.svg';
import Items from '../components/Items';
import Filters from '../components/Filters';
import { getListings } from '../utils/getListings';
import taskImg from '../assets/images/mower_logo-Photoroom.png';
import recycleImg from '../assets/images/assets_task_01jyym3rxse7z8w3k2b3m2a20v_1751227123_img_1.jpg';
import cashImg from '../assets/images/assets_task_01jyys6yneembtryc7rmanh2w7_1751232437_img_1.jpg';
import trustImg from '../assets/images/assets_task_01jyypmfxzf1hbrnx62ca658mz_1751229754_img_1.jpg';

const carouselColors = ['#ff7043', '#ffb300', '#66bb6a', '#42a5f5'];
const carouselTitles = ['Berries Salad', 'Healthy Salad', 'Berries Salad', 'Healthy Salad'];
const carouselPrices = ['$5.00', '$3.00', '$4.00', '$5.00'];

// Random names for users
const randomNames = ['Alex', 'James', 'Rachel', 'Hannah', 'Iris'];

function getRandomName() {
  return randomNames[Math.floor(Math.random() * randomNames.length)];
}

function getRandomRating() {
  // Generate random rating between 3.5 and 5.0 out of 5
  return Math.round((Math.random() * 1.5 + 3.5) * 10) / 10;
}

function getRandomReviews() {
  // Generate random number of reviews between 5 and 50
  return Math.floor(Math.random() * 46) + 5;
}

function getRandomDistance() {
  // Generate random distance between 0.5 and 50 km
  return Math.round((Math.random() * 49.5 + 0.5) * 10) / 10;
}

function Home() {
  const navigate = useNavigate();
  const carouselRef = useRef(null);
  const pointRefs = [useRef(null), useRef(null), useRef(null)];
  const [visible, setVisible] = useState([false, false, false]);
  const [filters, setFilters] = useState({ category: '', minPrice: '', maxPrice: '' });
  const [carouselItems, setCarouselItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredItems, setFeaturedItems] = useState([]);

  useEffect(() => {
    const observers = pointRefs.map((ref, idx) => {
      return new window.IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible(v => {
              const updated = [...v];
              updated[idx] = true;
              return updated;
            });
          }
        },
        { threshold: 0.2 }
      );
    });
    pointRefs.forEach((ref, idx) => {
      if (ref.current) observers[idx].observe(ref.current);
    });
    return () => {
      observers.forEach((observer, idx) => {
        if (pointRefs[idx].current) observer.unobserve(pointRefs[idx].current);
      });
    };
  }, []);

  useEffect(() => {
    async function fetchCarouselItems() {
      const allItems = await getListings();
      setCarouselItems(allItems.slice(0, 4));
    }
    fetchCarouselItems();
  }, []);

  useEffect(() => {
    async function fetchFeaturedItems() {
      const listings = await getListings({});
      // Take first 6 items for carousel
      setFeaturedItems(listings.slice(0, 6));
    }
    fetchFeaturedItems();
  }, []);

  const scrollCarousel = (dir) => {
    if (carouselRef.current) {
      const scrollAmount = 220;
      carouselRef.current.scrollBy({ left: dir * scrollAmount, behavior: 'smooth' });
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      padding: '6rem 0 2rem 0',
      textAlign: 'left'
    }}>
      {/* Main Text Section Box + Drill Image */}
      <div style={{
        background: `url('/src/assets/images/ChatGPT Image Jun 29, 2025, 10_39_46 PM.png') center/cover no-repeat`,
        borderRadius: '24px',
        padding: '3rem 2rem',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        width: '100%',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '2.5rem',
        minHeight: '340px',
      }}>
        {/* Left: Text */}
        <div className="slide-in-home-text" style={{ flex: 1, minWidth: 0, marginLeft: '2.5rem' }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: 900,
            color: '#1A1B41',
            marginBottom: '1.2rem',
            letterSpacing: '-1px',
            lineHeight: 1.1,
            fontFamily: 'Satoshi, system-ui, sans-serif',
          }}>
            Loop.
          </h1>
          {/* Subtitle */}
          <h2 style={{
            fontSize: '1.7rem',
            fontWeight: 700,
            color: '#1A1B41',
            marginBottom: '1.2rem',
            fontFamily: 'Satoshi, system-ui, sans-serif',
          }}>
            share more, hoard less
          </h2>
          {/* Description */}
          <p style={{
            fontSize: '1.1rem',
            color: '#1A1B41',
            maxWidth: '700px',
            lineHeight: '1.6',
            marginBottom: '2.5rem',
            fontFamily: 'Satoshi, system-ui, sans-serif',
          }}>
            Join the circular economy in your community today.
          </p>
          {/* Search Bar */}
          <form onSubmit={handleSearch} style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '50px',
            padding: '0.5rem',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            minWidth: '340px',
            maxWidth: '420px',
            width: '100%',
            marginLeft: 0
          }}>
            <input
              type="text"
              placeholder="Search for items to rent or lend..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyPress}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                padding: '0.7rem 1rem',
                fontSize: '1rem',
                backgroundColor: 'transparent',
                color: '#333',
                '::placeholder': {
                  color: '#666'
                }
              }}
            />
            <button
              type="submit"
              style={{
                background: '#001F3F',
                border: '1px solid #eee',
                borderRadius: '50%',
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: '0.5rem',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                transition: 'background 0.2s',
                padding: 0,
                outline: 'none',
              }}
              onFocus={e => { e.target.style.outline = 'none'; e.target.style.boxShadow = 'none'; }}
            >
              <img src={SearchIcon} alt="Search" style={{ width: 18, height: 18, display: 'block', filter: 'invert(1) brightness(2)' }} />
            </button>
          </form>
        </div>
        {/* Drill Image */}
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '2rem' }}>
          <img src={taskImg} alt="Loop Logo" className="logo-float" style={{ maxWidth: '420px', width: '100%', height: 'auto', display: 'block' }} />
        </div>
      </div>

      {/* Points Section */}
      <div style={{
        width: '100%',
        maxWidth: '1200px',
        margin: '15rem auto 0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        gap: '2rem',
        flexWrap: 'wrap',
      }}>
        {/* Point 1 */}
        <div
          ref={pointRefs[0]}
          className={visible[0] ? 'slide-in-left' : 'slide-init'}
          style={{
            flex: 1,
            minWidth: '220px',
            textAlign: 'left',
            background: '#fff',
            borderRadius: '24px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            padding: '2rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            height: '100%',
            minHeight: '320px',
            width: '100%',
            transition: 'transform 0.7s cubic-bezier(.6,.05,.1,1), opacity 0.7s cubic-bezier(.6,.05,.1,1)',
          }}
        >
          <div style={{ marginBottom: '1.2rem', height: '4.5rem', display: 'flex', alignItems: 'center' }}>
            <img src={recycleImg} alt="Recycle" style={{ height: '4.5rem', width: '4.5rem', objectFit: 'contain', display: 'block' }} />
          </div>
          <div style={{ fontWeight: 700, fontSize: '1.7rem', marginBottom: '0.7rem', color: '#001f3f' }}>
            Share smarter
          </div>
          <div style={{ color: '#001f3f', fontSize: '1.15rem', lineHeight: 1.7 }}>
            Lend and borrow tools, gear, and gadgets right in your neighborhood — no need to buy things you'll only use once.
          </div>
        </div>
        {/* Point 2 */}
        <div
          ref={pointRefs[1]}
          className={visible[1] ? 'slide-in-left' : 'slide-init'}
          style={{
            flex: 1,
            minWidth: '220px',
            textAlign: 'left',
            background: '#fff',
            borderRadius: '24px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            padding: '2rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            height: '100%',
            minHeight: '320px',
            width: '100%',
            transition: 'transform 0.7s cubic-bezier(.6,.05,.1,1), opacity 0.7s cubic-bezier(.6,.05,.1,1)',
          }}
        >
          <div style={{ marginBottom: '1.2rem', height: '3.5rem', display: 'flex', alignItems: 'center' }}>
            <img src={cashImg} alt="Cash" style={{ height: '3.5rem', width: '3.5rem', objectFit: 'contain', display: 'block' }} />
          </div>
          <div style={{ fontWeight: 700, fontSize: '1.7rem', marginBottom: '0.7rem', color: '#001f3f', marginTop: '1.2rem' }}>
            Save and earn
          </div>
          <div style={{ color: '#001f3f', fontSize: '1.15rem', lineHeight: 1.7 }}>
            Borrow what you need for a fraction of the cost, or turn your underused items into extra income by listing them.
          </div>
        </div>
        {/* Point 3 */}
        <div
          ref={pointRefs[2]}
          className={visible[2] ? 'slide-in-left' : 'slide-init'}
          style={{
            flex: 1,
            minWidth: '220px',
            textAlign: 'left',
            background: '#fff',
            borderRadius: '24px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            padding: '2rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            height: '100%',
            minHeight: '320px',
            width: '100%',
            transition: 'transform 0.7s cubic-bezier(.6,.05,.1,1), opacity 0.7s cubic-bezier(.6,.05,.1,1)',
          }}
        >
          <div style={{ marginBottom: '1.2rem', height: '4.5rem', display: 'flex', alignItems: 'center' }}>
            <img src={trustImg} alt="Trust" style={{ height: '4.5rem', width: '4.5rem', objectFit: 'contain', display: 'block' }} />
          </div>
          <div style={{ fontWeight: 700, fontSize: '1.7rem', marginBottom: '0.7rem', color: '#001f3f' }}>
            Built on trust
          </div>
          <div style={{ color: '#001f3f', fontSize: '1.15rem', lineHeight: 1.7 }}>
            Every listing and rental is backed by community reviews, so you know who you're lending to — and who you're renting from.
          </div>
        </div>
      </div>

      {/* Browse Section */}
      <div id="browse-section" style={{ width: '100%', marginTop: '5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 style={{ color: '#001f3f', fontWeight: 700, marginBottom: '2rem', fontSize: '2rem' }}>Featured Items</h2>
        <div style={{ position: 'relative', width: '90vw', maxWidth: '1200px', display: 'flex', alignItems: 'center' }}>
          {/* Left Arrow with Dent */}
          <div style={{
            position: 'absolute',
            left: '-2.5rem',
            zIndex: 2,
            width: '56px',
            height: '56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <button onClick={() => scrollCarousel(-1)} style={{
              position: 'relative',
              background: 'transparent',
              border: 'none',
              borderRadius: 0,
              width: '56px',
              height: '56px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              cursor: 'pointer',
              color: '#001f3f',
              padding: 0,
              zIndex: 2,
              outline: 'none',
              boxShadow: 'none',
            }}
            onFocus={e => { e.target.style.outline = 'none'; e.target.style.boxShadow = 'none'; }}
            >
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12L10 5V9H20.2C20.48 9 20.62 9 20.727 9.0545C20.8211 9.10243 20.8976 9.17892 20.9455 9.273C21 9.37996 21 9.51997 21 9.8V14.2C21 14.48 21 14.62 20.9455 14.727C20.8976 14.8211 20.8211 14.8976 20.727 14.9455C20.62 15 20.48 15 20.2 15H10V19L3 12Z" stroke="#001f3f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          {/* Carousel */}
          <div ref={carouselRef} style={{
            display: 'flex',
            overflowX: 'auto',
            scrollBehavior: 'smooth',
            background: '#fff',
            borderRadius: '40px',
            padding: '2rem 1.5rem',
            boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
            width: '100%',
            minHeight: '320px',
            alignItems: 'center',
            gap: '0.5rem',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}>
            {featuredItems.map((item) => (
              <ItemCard
                key={item.id}
                id={item.id}
                image={item.imageUrl || ""}
                title={item.name || "Untitled"}
                price={`$${item.price || 0}/${item.per || "day"}`}
                availability={"Available now"}
                location={item.location || "Unknown location"}
                rating={getRandomRating()}
                reviews={getRandomReviews()}
                tags={item.tags || []}
                user={{ name: item.userName || getRandomName(), avatar: "" }}
                badge={null}
                distance={`${getRandomDistance()} km`}
              />
            ))}
          </div>
          {/* Right Arrow with Dent */}
          <div style={{
            position: 'absolute',
            right: '-2.5rem',
            zIndex: 2,
            width: '56px',
            height: '56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <button onClick={() => scrollCarousel(1)} style={{
              position: 'relative',
              background: 'transparent',
              border: 'none',
              borderRadius: 0,
              width: '56px',
              height: '56px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              cursor: 'pointer',
              color: '#001f3f',
              padding: 0,
              zIndex: 2,
              outline: 'none',
              boxShadow: 'none',
            }}
            onFocus={e => { e.target.style.outline = 'none'; e.target.style.boxShadow = 'none'; }}
            >
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 12L14 5V9H3.8C3.51997 9 3.37996 9 3.273 9.0545C3.17892 9.10243 3.10243 9.17892 3.0545 9.273C3 9.37996 3 9.51997 3 9.8V14.2C3 14.48 3 14.62 3.0545 14.727C3.10243 14.8211 3.17892 14.8976 3.273 14.9455C3.37996 15 3.51997 15 3.8 15H14V19L21 12Z" stroke="#001f3f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <Filters onFilter={setFilters} />
      <Items filters={filters} />
      <div style={{ textAlign: "center", marginTop: "3rem", marginLeft: "6.5rem" }}>
        <Link
          to="/browse"
          style={{
            display: "inline-block",
            padding: "1rem 2rem",
            backgroundColor: "#001f3f",
            color: "white",
            textDecoration: "none",
            borderRadius: "8px",
            fontSize: "1.1rem",
            fontWeight: "bold",
          }}
        >
          View All Items
        </Link>
      </div>
    </div>
  )
}

export default Home
