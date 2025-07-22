import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductDetailsPage.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const API_BASE = process.env.REACT_APP_API_BASE_URL;
  const navigate = useNavigate();

  // Decode token to get user ID
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

  const token = localStorage.getItem('token');
  const userId = decodeToken(token)?.id || 'guest';

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error('Failed to fetch product', err));
  }, [id, API_BASE]);

  // Fetch random product suggestions
  useEffect(() => {
    axios
      .get(`${API_BASE}/api/products`)
      .then((res) => {
        const otherProducts = res.data.filter((p) => p._id !== id);
        setSuggestions(otherProducts.slice(0, 6)); // pick first 6
      })
      .catch((err) => console.error('Failed to load suggestions', err));
  }, [id, API_BASE]);

  const addToCart = () => {
    const cartKey = `skinitupCart_${userId}`;
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    const existing = cart.find((item) => item._id === product._id);

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }

    localStorage.setItem(cartKey, JSON.stringify(cart));
    toast.success(`${product.name} added to cart`, {
      position: 'top-right',
      autoClose: 2000,
    });
  };

  const buyNow = () => {
    addToCart();
    navigate('/cart');
  };

  if (!product) return <div className="loading">Loading...</div>;

  return (
    <div className="product-details-page">
      <ToastContainer />
      
      <div className="product-main">
        <div className="image-section">
          <img src={product.image || 'https://via.placeholder.com/400'} alt={product.name} />
        </div>
        <div className="info-section">
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p><strong>Price:</strong> ₹{product.price}</p>
          <p><strong>In Stock:</strong> {product.countInStock}</p>

          <div className="button-group">
            <button onClick={addToCart} className="btn-cart">Add to Cart</button>
            <button onClick={buyNow} className="btn-buy">Buy Now</button>
          </div>
        </div>
      </div>

      {/* Review Section (Frontend Only for Now) */}
      <div className="review-section">
        <h3>Customer Reviews</h3>
        <p>(Coming Soon...)</p>
      </div>

      {/* Suggestions Section */}
      <div className="suggestion-section">
        <h3>You may also like</h3>
        <div className="suggestion-grid">
          {suggestions.map((item) => (
            <div
              key={item._id}
              className="suggestion-card"
              onClick={() => navigate(`/product/${item._id}`)}
            >
              <img src={item.image || 'https://via.placeholder.com/200'} alt={item.name} />
              <p>{item.name}</p>
              <strong>₹{item.price}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
