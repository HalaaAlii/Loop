import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { createListing } from "../utils/createListing.js";
import { auth, storage } from "../firebase";

// Random names for users
const randomNames = ['Alex', 'James', 'Rachel', 'Hannah', 'Iris'];

function getRandomName() {
  return randomNames[Math.floor(Math.random() * randomNames.length)];
}

function PostListing() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // Form state
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [tags, setTags] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  
  // UI state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showLogin, setShowLogin] = useState(false);
  const [useImageUrl, setUseImageUrl] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, image: 'Please select an image file' }));
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Image must be less than 5MB' }));
        return;
      }

      setImageFile(file);
      setErrors(prev => ({ ...prev, image: '' }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return null;
    
    setIsUploading(true);
    try {
      const storageRef = ref(storage, `listings/${Date.now()}_${imageFile.name}`);
      const snapshot = await uploadBytes(storageRef, imageFile);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) newErrors.name = 'Item name is required';
    if (!price || price <= 0) newErrors.price = 'Valid price is required';
    if (!location.trim()) newErrors.location = 'Location is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!category) newErrors.category = 'Category is required';
    if (!condition) newErrors.condition = 'Condition is required';
    
    // Check for either file upload or image URL
    if (!imageFile && (!imageUrl || !imageUrl.trim())) {
      newErrors.image = 'Either upload an image file or provide an image URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!auth.currentUser) {
      setShowLogin(true);
      return;
    }
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      let finalImageUrl = imageUrl;
      
      // If using file upload, upload the file first
      if (imageFile && !useImageUrl) {
        finalImageUrl = await uploadImage();
      }
      
      // Prepare listing data
      const listingData = {
        name: name.trim(),
        price: Number(price),
        per: 'day',
        location: location.trim(),
        description: description.trim(),
        category: category,
        condition: condition,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        imageUrl: finalImageUrl,
        userId: auth.currentUser.uid,
        userName: getRandomName(),
        timestamp: new Date()
      };
      
      // Create listing
      const listingId = await createListing(listingData);
      
      // Success - redirect to the new listing
      navigate(`/item/${listingId}`);
    } catch (error) {
      console.error('Error creating listing:', error);
      alert('Failed to create listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ 
          fontSize: "2.5rem", 
          fontWeight: 700, 
          color: "#051914",
          marginBottom: "0.5rem"
        }}>
          Post Your Item
        </h1>
        <p style={{ 
          fontSize: "1.1rem", 
          color: "#666",
          lineHeight: 1.6
        }}>
          Share your items with the community and start earning today.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{
        background: '#fff',
        borderRadius: '20px',
        padding: '2.5rem',
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
      }}>
        {/* Image Upload Section */}
        <div style={{ marginBottom: "2rem" }}>
          <h3 style={{ 
            fontSize: "1.3rem", 
            fontWeight: 600, 
            marginBottom: "1rem",
            color: "#051914"
          }}>
            Item Image *
          </h3>
          
          {/* Toggle between file upload and URL */}
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            marginBottom: '1rem',
            borderBottom: '1px solid #eee',
            paddingBottom: '1rem'
          }}>
            <button
              type="button"
              onClick={() => setUseImageUrl(false)}
              style={{
                background: useImageUrl ? 'none' : '#051914',
                color: useImageUrl ? '#051914' : '#fff',
                border: '1px solid #051914',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Upload File
            </button>
            <button
              type="button"
              onClick={() => setUseImageUrl(true)}
              style={{
                background: useImageUrl ? '#051914' : 'none',
                color: useImageUrl ? '#fff' : '#051914',
                border: '1px solid #051914',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Image URL
            </button>
          </div>
          
          {!useImageUrl ? (
            /* File Upload */
            <div style={{
              border: '2px dashed #ddd',
              borderRadius: '12px',
              padding: '2rem',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: imagePreview ? 'none' : '#f9f9f9'
            }}
            onClick={() => fileInputRef.current?.click()}
            onMouseOver={e => e.currentTarget.style.borderColor = '#051914'}
            onMouseOut={e => e.currentTarget.style.borderColor = '#ddd'}
            >
              {imagePreview ? (
                <div>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    style={{
                      maxWidth: '100%',
                      maxHeight: '200px',
                      borderRadius: '8px',
                      marginBottom: '1rem'
                    }}
                  />
                  <p style={{ color: '#666', margin: 0 }}>Click to change image</p>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📷</div>
                  <p style={{ color: '#666', margin: 0 }}>Click to upload an image</p>
                  <p style={{ color: '#999', fontSize: '0.9rem', margin: '0.5rem 0 0 0' }}>
                    Max 5MB • JPG, PNG, GIF
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Image URL Input */
            <div>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setImagePreview(e.target.value);
                  setErrors(prev => ({ ...prev, image: '' }));
                }}
                placeholder="https://example.com/image.jpg"
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  borderRadius: '8px',
                  border: errors.image ? '1px solid #e74c3c' : '1px solid #ddd',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
              {imageUrl && (
                <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                  <img 
                    src={imageUrl} 
                    alt="Preview" 
                    style={{
                      maxWidth: '100%',
                      maxHeight: '200px',
                      borderRadius: '8px',
                      border: '1px solid #ddd'
                    }}
                    onError={() => {
                      setErrors(prev => ({ ...prev, image: 'Invalid image URL' }));
                      setImagePreview('');
                    }}
                  />
                </div>
              )}
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
          
          {errors.image && (
            <p style={{ color: '#e74c3c', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              {errors.image}
            </p>
          )}
        </div>

        {/* Basic Information Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ textAlign: 'center', fontWeight: 700, fontSize: '1.5rem', marginBottom: '2rem', color: '#051914' }}>Basic Information</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>Item Name *</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g., Power Drill, Camping Tent"
                style={{
                  width: '100%',
                  padding: '0.9rem 1.2rem',
                  borderRadius: '8px 0 0 8px',
                  border: errors.name ? '1.5px solid #e74c3c' : '1.5px solid #ddd',
                  fontSize: '1rem',
                  outline: 'none',
                  background: '#fff',
                  color: '#222',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>Price per Day *</label>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{
                  background: '#f7f7f7',
                  border: errors.price ? '1.5px solid #e74c3c' : '1.5px solid #ddd',
                  borderRight: 'none',
                  borderRadius: '8px 0 0 8px',
                  padding: '0.9rem 0.8rem',
                  color: '#666',
                  fontSize: '1rem',
                  minWidth: 32,
                  textAlign: 'center',
                  height: '100%'
                }}>$</span>
                <input
                  type="number"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  placeholder="25"
                  min="0"
                  step="0.01"
                  style={{
                    width: '100%',
                    padding: '0.9rem 1.2rem',
                    borderRadius: '0 8px 8px 0',
                    border: errors.price ? '1.5px solid #e74c3c' : '1.5px solid #ddd',
                    borderLeft: 'none',
                    fontSize: '1rem',
                    outline: 'none',
                    background: '#fff',
                    color: '#222',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              {errors.price && (
                <p style={{ color: '#e74c3c', fontSize: '0.9rem', marginTop: '0.5rem' }}>{errors.price}</p>
              )}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>Location (Zip Code) *</label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g., 10001"
                style={{
                  width: '100%',
                  padding: '0.9rem 1.2rem',
                  borderRadius: '8px 0 0 8px',
                  border: errors.location ? '1.5px solid #e74c3c' : '1.5px solid #ddd',
                  fontSize: '1rem',
                  outline: 'none',
                  background: '#fff',
                  color: '#222',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>Category *</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.9rem 1.2rem',
                  borderRadius: '0 8px 8px 0',
                  border: errors.category ? '1.5px solid #e74c3c' : '1.5px solid #ddd',
                  fontSize: '1rem',
                  outline: 'none',
                  background: '#fff',
                  color: '#222',
                  boxSizing: 'border-box',
                }}
              >
                <option value="">Select a category</option>
                <option value="tools">Tools</option>
                <option value="outdoor">Outdoor & Recreation</option>
                <option value="electronics">Electronics</option>
                <option value="furniture">Furniture</option>
                <option value="sports">Sports Equipment</option>
                <option value="party">Party & Events</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>Condition *</label>
          <select
            value={condition}
              onChange={e => setCondition(e.target.value)}
            style={{
              width: '100%',
                padding: '0.9rem 1.2rem',
              borderRadius: '8px',
                border: errors.condition ? '1.5px solid #e74c3c' : '1.5px solid #ddd',
              fontSize: '1rem',
              outline: 'none',
                background: '#fff',
                color: '#222',
                boxSizing: 'border-box',
            }}
          >
            <option value="">Select condition</option>
            <option value="New">New</option>
            <option value="Like New">Like New</option>
            <option value="Used">Used - Good</option>
            <option value="Fair">Used - Fair</option>
          </select>
        </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>Description *</label>
          <textarea
            value={description}
              onChange={e => setDescription(e.target.value)}
            placeholder="Describe your item in detail. What makes it special? Any specific features or instructions?"
            style={{
              width: '100%',
                padding: '0.9rem 1.2rem',
              borderRadius: '8px',
                border: errors.description ? '1.5px solid #e74c3c' : '1.5px solid #ddd',
              fontSize: '1rem',
              outline: 'none',
                background: '#fff',
                color: '#222',
                minHeight: '90px',
                boxSizing: 'border-box',
              resize: 'vertical',
            }}
          />
          </div>
        </div>

        {/* Tags */}
        <div style={{ marginBottom: "2rem" }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem', 
            fontWeight: 600,
            color: '#333'
          }}>
            Tags (Optional)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g., DIY, Outdoor, Professional, Easy to use"
            style={{
              width: '100%',
              padding: '0.9rem 1.2rem',
              borderRadius: '8px',
              border: '1.5px solid #ddd',
              fontSize: '1rem',
              outline: 'none',
              background: '#fff',
              color: '#222',
              boxSizing: 'border-box',
              marginBottom: 0
            }}
          />
          <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Separate tags with commas
          </p>
        </div>

        {/* Submit Button */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={() => navigate('/browse')}
            style={{
              background: 'none',
              border: '1px solid #ddd',
              borderRadius: '12px',
              padding: '1rem 2rem',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
              color: '#666'
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            style={{
              background: isSubmitting || isUploading ? '#ccc' : '#051914',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              padding: '1rem 2rem',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: isSubmitting || isUploading ? 'not-allowed' : 'pointer',
              minWidth: '120px'
            }}
          >
            {isSubmitting ? 'Posting...' : isUploading ? 'Uploading...' : 'Post Item'}
          </button>
        </div>
      </form>

      {/* Login Modal */}
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
            <h2 style={{ marginBottom: '1.5rem', color: '#1A1B41', fontWeight: 700 }}>Login Required</h2>
            <p style={{ marginBottom: '1.5rem', color: '#666', textAlign: 'center', fontSize: '1rem' }}>
              You need to be logged in to post items. Please login or sign up to continue.
            </p>
            {/* Placeholder for login/signup form - you can integrate Firebase here later */}
            <input type="email" placeholder="Email" style={{ marginBottom: '1rem', padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid #ddd', width: '100%' }} />
            <input type="password" placeholder="Password" style={{ marginBottom: '1.5rem', padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid #ddd', width: '100%' }} />
            <button style={{ background: '#1A1B41', color: '#fff', border: 'none', borderRadius: '10px', padding: '0.7rem 2rem', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', width: '100%' }}>Login</button>
            <button style={{ background: '#CEF17B', color: '#1A1B41', border: 'none', borderRadius: '10px', padding: '0.7rem 2rem', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', width: '100%', marginTop: '1rem' }}>Sign Up</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostListing;
