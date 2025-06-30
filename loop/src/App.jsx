import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Browse from './pages/Browse'
import PostListing from './pages/PostListing'
import Profile from './pages/Profile'
import Login from './pages/Login'
import ItemDetail from './pages/ItemDetail'
import SeedData from './utils/SeedData'
import './App.css'

function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/item/:id" element={<ItemDetail />} />
          <Route path="/post-listing" element={<PostListing />} />
          <Route path="/my-listings" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/seed" element={<SeedData />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
