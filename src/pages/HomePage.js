import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useLocation, useOutletContext } from 'react-router-dom';
import ScratchCard from './ScratchCard';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [userId, setUserId] = useState('guest');
  const [showScratchModal, setShowScratchModal] = useState(false);
  const location = useLocation();
  const { search, setSearch } = useOutletContext();

  const API_BASE = process.env.REACT_APP_API_BASE_URL;

  const decodeToken = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const decoded = decodeToken(token);
    const id = decoded?.id || decoded?._id || 'guest';
    setUserId(id);
  }, [location]);

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/products`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error('Error fetching products', err));
  }, [API_BASE]);

  const addToCart = (product) => {
    const cartKey = `skinitupCart_${userId}`;
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    const existing = cart.find((item) => item._id === product._id);

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }

    localStorage.setItem(cartKey, JSON.stringify(cart));
    toast.success(`${product.name} added to cart!`, {
      position: 'top-right',
      autoClose: 2000,
      pauseOnHover: false,
    });
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="homepage">
      <ToastContainer />

      {/* CATEGORY BAR ONLY WHEN NOT SEARCHING */}
      {search.trim() === '' && (
        <nav className="category-bar open">
          <span>Stickers</span>
          <span>Skins</span>
          <span>Wallpapers</span>
          <span>Accessories</span>
        </nav>
      )}

      {/* HERO SECTION ONLY WHEN NOT SEARCHING */}
      {search.trim() === '' && (
        <section className="hero-banner">
          <div className="hero-text">
            <h1>Stylish Skins & Stickers</h1>
            <p>Up to 50% Off on Launch Week!</p>
            <button>Shop Now</button>
          </div>
          <img src="/banner.jpg" alt="Hero" className="hero-img" />
        </section>
      )}

      {/* PROMO SECTION ONLY WHEN NOT SEARCHING */}
      {search.trim() === '' && (
        <section className="promo-section">
          <div className="promo-box" onClick={() => setShowScratchModal(true)}>🔥 Offers</div>
          <div className="promo-box">🚚 Free Shipping</div>
          <div className="promo-box">🎁 Discounts</div>
          <div className="promo-box">🔐 Secure</div>
        </section>
      )}

      {/* SCRATCH MODAL */}
      {showScratchModal && (
        <div className="scratch-modal-overlay" onClick={() => setShowScratchModal(false)}>
          <div className="scratch-modal" onClick={(e) => e.stopPropagation()}>
            <ScratchCard />
            <button onClick={() => setShowScratchModal(false)} className="close-btn">Close</button>
          </div>
        </div>
      )}

      {/* PRODUCTS */}
            <section className="product-grid">
        <h2>{search.trim() ? `Results for "${search}"` : 'New Arrivals'}</h2>
        <div className="grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product._id} className="product-card">
                <Link to={`/product/${product._id}`} className="product-link">
                  <img src={product.image || 'https://via.placeholder.com/300'} alt={product.name} />
                  <h4>{product.name}</h4>
                </Link>
                <p>₹{product.price}</p>
                <button onClick={() => addToCart(product)}>Add to Cart</button>
              </div>
            ))
          ) : (
          <p>No products found.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
