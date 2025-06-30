import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from '../firebase';
import ItemCard from '../components/ItemCard';

const reviewAnimStyle = `
.review-card-animate {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.7s cubic-bezier(.6,.05,.1,1), transform 0.7s cubic-bezier(.6,.05,.1,1);
}
.review-card-animate.visible {
  opacity: 1;
  transform: translateY(0);
}
`;

if (typeof document !== 'undefined' && !document.getElementById('review-anim-style')) {
  const style = document.createElement('style');
  style.id = 'review-anim-style';
  style.innerHTML = reviewAnimStyle;
  document.head.appendChild(style);
}

function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [similarItems, setSimilarItems] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showBookingCalendar, setShowBookingCalendar] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [selectedDates, setSelectedDates] = useState({ from: '', to: '' });

  useEffect(() => {
    async function fetchItem() {
      try {
        const docRef = doc(db, "listings", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const itemData = { id: docSnap.id, ...docSnap.data() };
          setItem(itemData);
          
          // Fetch similar items after getting the current item
          await fetchSimilarItems(itemData);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching item:", error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchItem();
    }
  }, [id]);

  const fetchSimilarItems = async (currentItem) => {
    try {
      let q = collection(db, "listings");
      const filters = [];
      
      // Filter by same category if available
      if (currentItem.category) {
        filters.push(where("category", "==", currentItem.category));
      }
      
      if (filters.length > 0) {
        q = query(q, ...filters, limit(8));
      } else {
        q = query(q, limit(8));
      }
      
      const querySnapshot = await getDocs(q);
      let results = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter(item => item.id !== id) // Exclude current item
        .slice(0, 4); // Limit to 4 items
      
      // If we don't have enough similar items, fetch some from other categories
      if (results.length < 4 && currentItem.category) {
        const additionalQuery = query(
          collection(db, "listings"),
          where("category", "!=", currentItem.category),
          limit(8)
        );
        const additionalSnapshot = await getDocs(additionalQuery);
        const additionalResults = additionalSnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter(item => item.id !== id)
          .slice(0, 4 - results.length);
        
        results = [...results, ...additionalResults];
      }
      
      setSimilarItems(results);
    } catch (error) {
      console.error("Error fetching similar items:", error);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p></p>
      </div>
    );
  }

  if (!item) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Item not found</p>
        <button 
          onClick={() => navigate('/browse')}
          style={{
            background: '#051914',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            padding: '0.6rem 1.5rem',
            fontWeight: 700,
            fontSize: '1rem',
            cursor: 'pointer',
            marginTop: '1rem'
          }}
        >
          Back to Browse
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "1rem 2rem" }}>
      {/* Back Button */}
      <button 
        onClick={() => navigate('/browse')}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '1.2rem',
          cursor: 'pointer',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: '#001f3f',
          fontWeight: 700
        }}
      >
        ← Back to Browse
      </button>

      {/* Item Details */}
      <div style={{
        background: '#fff',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        marginBottom: '3rem',
        maxWidth: 1100,
        marginLeft: 'auto',
        marginRight: 'auto',
        display: 'flex',
        flexDirection: 'row',
        gap: '2.5rem',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
      }}>
        {/* Left: Image, Description, Listed by */}
        <div style={{ flex: 2, minWidth: 320 }}>
          {/* Image */}
          <div style={{
            width: '100%',
            height: '320px',
            borderRadius: '18px',
            background: '#f3f3f3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            marginBottom: '1.5rem',
          }}>
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span role="img" aria-label="item" style={{ fontSize: '4rem' }}>🧰</span>
            )}
          </div>
          {/* Description */}
          {item.description && (
            <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', fontWeight: 700, textAlign: 'left', color: '#001f3f' }}>Description</h3>
              <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#001f3f', textAlign: 'left', fontWeight: 700 }}>{item.description}</p>
            </div>
          )}
          {/* Listed by */}
          <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', fontWeight: 700, textAlign: 'left', color: '#001f3f' }}>Listed by</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'left' }}>
              <span role="img" aria-label="user" style={{ fontSize: '2rem' }}>👤</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#001f3f' }}>{item.userName || 'Unknown User'}</span>
            </div>
          </div>
        </div>
        {/* Right: Booking Card */}
        <div style={{
          flex: 1,
          minWidth: 300,
          minHeight: 420,
          background: '#fff',
          borderRadius: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          border: '1px solid #f0f0f0',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#051914', marginBottom: '0.5rem', textAlign: 'center' }}>{item.name}</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 600, color: '#4caf50', marginBottom: '1rem', textAlign: 'center' }}>
            ${item.price}/{item.per || 'day'}
          </div>
          <div style={{ width: '100%', marginBottom: '1rem', display: 'flex', gap: '1rem', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '1rem', color: '#666', textAlign: 'left' }}>Location: {item.location || 'Unknown location'}</div>
            <div style={{ fontSize: '1rem', color: '#666', textAlign: 'left' }}>Condition: {item.condition || 'Not specified'}</div>
          </div>
          <div style={{ width: '100%', marginBottom: '1.5rem', fontSize: '1rem', color: '#666', textAlign: 'left' }}>Category: {item.category || 'Uncategorized'}</div>
          <button
            onClick={() => setShowBookingCalendar(true)}
            style={{
              background: '#001f3f',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            padding: '1rem 2rem',
            fontWeight: 700,
            fontSize: '1.1rem',
            cursor: 'pointer',
              width: '100%'
            }}
          >
            Book Now
          </button>
          <div style={{ width: '100%', marginTop: '1.5rem', fontSize: '0.92rem', color: '#888', textAlign: 'left', lineHeight: 1.5 }}>
            <strong>Terms & Services:</strong><br/>
            • Please return the item in the same condition.<br/>
            • Late returns may incur additional fees.<br/>
            • You are responsible for any damage or loss.<br/>
            • Contact the owner for any questions before booking.
          </div>
        </div>
      </div>

      {/* Similar Items Section */}
      {similarItems.length > 0 && (
        <div style={{ marginTop: '3rem' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '2rem'
          }}>
            <h2 style={{ 
              fontSize: '1.8rem', 
              fontWeight: 700, 
              color: '#051914',
              margin: 0
            }}>
              Similar Items
            </h2>
            {item.category && (
              <button 
                onClick={() => navigate(`/browse?category=${item.category}`)}
                style={{
                  background: 'none',
                  border: '1px solid #051914',
                  borderRadius: 8,
                  padding: '0.5rem 1rem',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  color: '#051914',
                  transition: 'all 0.2s'
                }}
                onMouseOver={e => {
                  e.target.style.background = '#051914';
                  e.target.style.color = '#fff';
                }}
                onMouseOut={e => {
                  e.target.style.background = 'none';
                  e.target.style.color = '#051914';
                }}
              >
                View All {item.category}
              </button>
            )}
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2rem',
            alignItems: 'stretch',
          }}>
            {similarItems.map((similarItem) => (
              <ItemCard
                key={similarItem.id}
                id={similarItem.id}
                image={similarItem.imageUrl || ""}
                title={similarItem.name || "Untitled"}
                price={`$${similarItem.price || 0}/${similarItem.per || "day"}`}
                availability={"Available now"}
                location={similarItem.location || "Unknown location"}
                rating={4.8}
                reviews={12}
                tags={similarItem.tags || []}
                user={{ name: similarItem.userName || "Alex", avatar: "" }}
                badge={null}
              />
            ))}
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div style={{ marginTop: '3rem' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h2 style={{ 
            fontSize: '1.8rem', 
            fontWeight: 700, 
            color: '#051914',
            margin: 0
          }}>
            Customer Reviews
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 600, color: '#4caf50' }}>4.8</span>
            <div style={{ display: 'flex', gap: '2px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} style={{ color: '#ffd700', fontSize: '1.2rem' }}>★</span>
              ))}
            </div>
            <span style={{ fontSize: '0.9rem', color: '#666', marginLeft: '0.5rem' }}>(24 reviews)</span>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gap: '1.5rem'
        }}>
          {/* Animate each review card */}
          {[0,1,2].map((idx) => (
            <div key={idx} className={`review-card-animate${showAllReviews || idx < 3 ? ' visible' : ''}`} style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              border: '1px solid #f0f0f0',
              marginBottom: 0
            }}>
              {/* The original review content for each card goes here, copy from the static reviews below */}
              {idx === 0 && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{
                        width: '48px', height: '48px', borderRadius: '50%', background: '#4caf50', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: '1.1rem'
                      }}>SM</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '1rem', color: '#051914' }}>Sarah Mitchell</div>
                        <div style={{ fontSize: '0.9rem', color: '#666' }}>Verified Renter</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '2px' }}>{[1,2,3,4,5].map(star => <span key={star} style={{ color: '#ffd700', fontSize: '1rem' }}>★</span>)}</div>
                  </div>
                  <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#333', marginBottom: '0.5rem' }}>
                    "Excellent experience renting this tool! The owner was very responsive and the equipment was in perfect condition. Saved me a lot of money compared to buying. Highly recommend!"
                  </p>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>Rented on March 15, 2024</div>
                </>
              )}
              {idx === 1 && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{
                        width: '48px', height: '48px', borderRadius: '50%', background: '#2196f3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: '1.1rem'
                      }}>MJ</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '1rem', color: '#051914' }}>Mike Johnson</div>
                        <div style={{ fontSize: '0.9rem', color: '#666' }}>Verified Renter</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '2px' }}>{[1,2,3,4,5].map(star => <span key={star} style={{ color: '#ffd700', fontSize: '1rem' }}>★</span>)}</div>
                  </div>
                  <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#333', marginBottom: '0.5rem' }}>
                    "Great service and the tool worked exactly as described. The pickup and return process was smooth. Will definitely use this service again for future projects."
                  </p>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>Rented on February 28, 2024</div>
                </>
              )}
              {idx === 2 && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{
                        width: '48px', height: '48px', borderRadius: '50%', background: '#ff9800', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: '1.1rem'
                      }}>EL</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '1rem', color: '#051914' }}>Emma Lopez</div>
                        <div style={{ fontSize: '0.9rem', color: '#666' }}>Verified Renter</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '2px' }}>{[1,2,3,4].map(star => <span key={star} style={{ color: '#ffd700', fontSize: '1rem' }}>★</span>)}<span style={{ color: '#ddd', fontSize: '1rem' }}>★</span></div>
                  </div>
                  <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#333', marginBottom: '0.5rem' }}>
                    "Good experience overall. The tool was clean and functional. The owner was friendly and helpful. Only minor issue was a slight delay in pickup time, but everything else was perfect."
                  </p>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>Rented on January 12, 2024</div>
                </>
              )}
            </div>
          ))}
          {/* Review 4 - Shows when "View All Reviews" is clicked */}
          {showAllReviews && (
            <div className="review-card-animate visible" style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              border: '1px solid #f0f0f0'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: '#9c27b0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '1.1rem'
                  }}>
                    DC
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '1rem', color: '#051914' }}>David Chen</div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>Verified Renter</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} style={{ color: '#ffd700', fontSize: '1rem' }}>★</span>
                  ))}
                </div>
              </div>
              <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#333', marginBottom: '0.5rem' }}>
                "Absolutely fantastic rental experience! The tool was professionally maintained and the owner provided 
                excellent instructions. The pricing was fair and the whole process was seamless. Will definitely 
                rent from this owner again!"
              </p>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>Rented on December 8, 2023</div>
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button 
            onClick={() => setShowAllReviews(!showAllReviews)}
            style={{
              background: 'none',
              border: '1px solid #051914',
              borderRadius: 8,
              padding: '0.8rem 2rem',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
              color: '#051914',
              transition: 'all 0.2s'
            }}
            onMouseOver={e => {
              e.target.style.background = '#051914';
              e.target.style.color = '#fff';
            }}
            onMouseOut={e => {
              e.target.style.background = 'none';
              e.target.style.color = '#051914';
            }}>
            {showAllReviews ? 'Show Less Reviews' : 'View All Reviews'}
          </button>
        </div>
      </div>

      {/* Booking Calendar Popup */}
      {showBookingCalendar && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '20px',
            padding: '2rem',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#051914', margin: 0 }}>Select Rental Dates</h2>
              <button 
                onClick={() => setShowBookingCalendar(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#051914' }}>
                    From Date
                  </label>
                  <input
                    type="date"
                    value={selectedDates.from}
                    onChange={(e) => setSelectedDates({ ...selectedDates, from: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.9rem 1.2rem',
                      border: '1.5px solid #ddd',
                      borderRadius: '8px 0 0 8px',
                      fontSize: '1rem',
                      background: '#fff',
                      color: '#222',
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#051914' }}>
                    To Date
                  </label>
                  <input
                    type="date"
                    value={selectedDates.to}
                    onChange={(e) => setSelectedDates({ ...selectedDates, to: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.9rem 1.2rem',
                      border: '1.5px solid #ddd',
                      borderRadius: '0 8px 8px 0',
                      fontSize: '1rem',
                      background: '#fff',
                      color: '#222',
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                    min={selectedDates.from || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              {selectedDates.from && selectedDates.to && (
                <div style={{
                  background: '#f8f9fa',
                  padding: '1rem',
                  borderRadius: '8px',
                  marginBottom: '1rem'
                }}>
                  <div style={{ fontWeight: 600, color: '#051914', marginBottom: '0.5rem' }}>Rental Summary</div>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>
                    <div>From: {new Date(selectedDates.from).toLocaleDateString()}</div>
                    <div>To: {new Date(selectedDates.to).toLocaleDateString()}</div>
                    <div style={{ marginTop: '0.5rem', fontWeight: 600, color: '#4caf50' }}>
                      Total: ${item?.price || 0} per {item?.per || 'day'}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => setShowBookingCalendar(false)}
                style={{
                  background: '#f3f3f3',
                  color: '#333',
                  border: 'none',
                  borderRadius: 8,
                  padding: '0.8rem 1.5rem',
                  fontWeight: 600,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  flex: 1
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (selectedDates.from && selectedDates.to) {
                    setShowBookingCalendar(false);
                    setShowLoginPopup(true);
                  }
                }}
                disabled={!selectedDates.from || !selectedDates.to}
                style={{
                  background: selectedDates.from && selectedDates.to ? '#051914' : '#ccc',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '0.8rem 1.5rem',
                  fontWeight: 600,
                  fontSize: '1rem',
                  cursor: selectedDates.from && selectedDates.to ? 'pointer' : 'not-allowed',
                  flex: 1
                }}
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login/Signup Popup */}
      {showLoginPopup && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '20px',
            padding: '2rem',
            maxWidth: '400px',
            width: '90%'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#051914', margin: 0 }}>Login Required</h2>
              <button 
                onClick={() => setShowLoginPopup(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                ×
              </button>
            </div>

            <p style={{ fontSize: '1rem', color: '#666', marginBottom: '2rem', lineHeight: '1.6' }}>
              Please log in or create an account to complete your booking for <strong>{item?.name}</strong>.
            </p>

            <div style={{ marginBottom: '2rem' }}>
              <input
                type="email"
                placeholder="Email"
                style={{
                  width: '100%',
                  marginBottom: '1rem',
                  padding: '0.9rem 1.2rem',
                  borderRadius: '8px',
                  border: '1.5px solid #ddd',
                  fontSize: '1rem',
                  background: '#fff',
                  color: '#222',
                  boxSizing: 'border-box',
                  outline: 'none',
                  display: 'block',
                }}
              />
              <input
                type="password"
                placeholder="Password"
                style={{
                  width: '100%',
                  marginBottom: '1.5rem',
                  padding: '0.9rem 1.2rem',
                  borderRadius: '8px',
                  border: '1.5px solid #ddd',
                  fontSize: '1rem',
                  background: '#fff',
                  color: '#222',
                  boxSizing: 'border-box',
                  outline: 'none',
                  display: 'block',
                }}
              />
              <button
                style={{
                  background: '#1A1B41',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0.9rem 2rem',
                  fontWeight: 700,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  width: '100%',
                  marginBottom: '1rem',
                }}
              >
                Login
              </button>
              <button
                style={{
                  background: '#CEF17B',
                  color: '#1A1B41',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0.9rem 2rem',
                  fontWeight: 700,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ItemDetail; 