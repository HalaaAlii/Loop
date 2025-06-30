import { createListing } from "../utils/createListing";

// Random names for users
const randomNames = ['Alex', 'James', 'Rachel', 'Hannah', 'Iris'];

function getRandomName() {
  return randomNames[Math.floor(Math.random() * randomNames.length)];
}

function SeedData() {
  const handleSeed = async () => {
    await createListing({
      name: "Lawn Mower",
      category: "outdoor",
      condition: "Used",
      price: 25,
      per: "day",
      location: "Midtown",
      imageUrl: "https://example.com/lawnmower.jpg",
      description: "Perfect for small yards.",
      userId: "abc123xyz",
      userName: getRandomName(),
    });

    await createListing({
      name: "Power Washer",
      condition: "Used",
      category: "tools",
      price: 25,
      per: "day",
      location: "Midtown",
      imageUrl: "https://example.com/lawnmower.jpg",
      description: "Power washer. good for removing stains, carpets, etc..",
      userId: "abc123xyz",
      userName: getRandomName(),
    });


    await createListing({
      name: "Camping Tent",
      condition: "Used",
      category: "outdoor",
      price: 15,
      per: "day",
      location: "Uptown",
      imageUrl: "https://example.com/campingtent.jpg",
      description: "Spacious 4-person tent for weekend camping trips.",
      userId: "abc123xyz",
      userName: getRandomName(),
    });

    await createListing({
      name: "Tile Cutter",
      condition: "New",
      category: "tools",
      price: 20,
      per: "day",
      location: "Midtown",
      imageUrl: "https://example.com/tilecutter.jpg",
      description: "Ideal for DIY kitchen and bathroom renovations.",
      userId: "abc123xyz",
      userName: getRandomName(),
    });

    await createListing({
      name: "Folding Table",
      condition: "New",
      category: "furniture",
      price: 10,
      per: "day",
      location: "Uptown",
      imageUrl: "https://example.com/table.jpg",
      description: "Seats 6 people.",
      userId: "abc123xyz",
      userName: getRandomName(),
    });

    await createListing({
      name: "Projector",
      condition: "Used",
      category: "electronics",
      price: 40,
      per: "day",
      location: "Downtown",
      imageUrl: "https://example.com/projector.jpg",
      description: "Perfect for movie nights, presentations, or events.",
      userId: "abc123xyz",
      userName: getRandomName(),
    });
    
    await createListing({
      name: "Snow Blower",
      condition: "Used",
      category: "outdoor",
      price: 35,
      per: "day",
      location: "Uptown",
      imageUrl: "https://example.com/snowblower.jpg",
      description: "Clear driveways and sidewalks quickly during winter.",
      userId: "abc123xyz",
      userName: getRandomName(),
    });

    await createListing({
      name: "Carpet Cleaner",
      condition: "Used",
      category: "tools",
      price: 20,
      per: "day",
      location: "Downtown",
      imageUrl: "https://example.com/cleaner.jpg",
      description: "Deep cleans carpets and upholstery.",
      userId: "abc123xyz",
      userName: getRandomName(),
    });

    alert("Seed data added!");
  };

  return (
    <div className="p-8">
      <button
        onClick={handleSeed}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Seed Listings
      </button>
    </div>
  );
}

export default SeedData;
