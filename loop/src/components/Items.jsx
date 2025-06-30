import { useState, useEffect, useRef } from "react";
import ItemCard from "./ItemCard";
import { getListings } from "../utils/getListings";

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

function Items({ filters = {}, onTagClick }) {
  const [items, setItems] = useState([]);
  const [visibleCards, setVisibleCards] = useState([]);
  const cardRefs = useRef([]);

  useEffect(() => {
    async function fetchData() {
      const listings = await getListings(filters);
      setItems(listings);
    }
    fetchData();
  }, [filters]);

  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, items.length);
    const observers = cardRefs.current.map((ref, idx) => {
      return new window.IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleCards((prev) => {
              const updated = [...prev];
              updated[idx] = true;
              return updated;
            });
            observers[idx].disconnect();
          }
        },
        { threshold: 0.2 }
      );
    });
    cardRefs.current.forEach((ref, idx) => {
      if (ref) observers[idx].observe(ref);
    });
    return () => observers.forEach((observer) => observer.disconnect());
  }, [items]);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1200px",
        margin: "2.5rem auto 0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "2rem",
        alignItems: "stretch",
      }}
    >
      {items.length === 0 ? (
        <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "2rem" }}>
          <p>No items found.</p>
        </div>
      ) : (
        items.map((item, idx) => (
          <div
            key={item.id}
            ref={el => cardRefs.current[idx] = el}
            className={`item-card-animate${visibleCards[idx] ? ' visible' : ''}`}
          >
            <ItemCard
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
              onTagClick={onTagClick}
            />
          </div>
        ))
      )}
    </div>
  );
}

export default Items;
