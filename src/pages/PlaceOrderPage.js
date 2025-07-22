import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PlaceOrderPage.css';

const PlaceOrderPage = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('guest');
  const [cartItems, setCartItems] = useState([]);
  const API_BASE = process.env.REACT_APP_API_BASE_URL;

  const shippingAddress = JSON.parse(localStorage.getItem('shippingAddress'));
  const paymentMethod = localStorage.getItem('paymentMethod') || 'Cash on Delivery';

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
    let uid = 'guest';
    if (token) {
      const decoded = decodeToken(token);
      uid = decoded?.id || decoded?._id || 'guest';
    }
    setUserId(uid);

    const storedCart = JSON.parse(localStorage.getItem(`skinitupCart_${uid}`)) || [];
    setCartItems(storedCart);
  }, []);

  useEffect(() => {
    if (
      !shippingAddress ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.postalCode ||
      !shippingAddress.country
    ) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  if (
    !shippingAddress ||
    !shippingAddress.address ||
    !shippingAddress.city ||
    !shippingAddress.postalCode ||
    !shippingAddress.country
  ) return null;

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  const shippingPrice = itemsPrice > 500 ? 0 : 40;
  const taxPrice = 0;
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const placeOrderHandler = async () => {
    try {
      const { data } = await axios.post(
        `${API_BASE}/api/orders`,
        {
          orderItems: cartItems.map((item) => ({
            name: item.name,
            qty: item.qty,
            image: item.image,
            price: item.price,
            product: item._id,
          })),
          shippingAddress,
          paymentMethod,
          taxPrice,
          shippingPrice,
          totalPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      localStorage.removeItem(`skinitupCart_${userId}`);
      navigate(`/order/${data._id}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Order Failed');
    }
  };

  return (
    <div className="placeorder-container">
      <h2 className="placeorder-title">Place Order</h2>
      <Row>
        <Col md={8}>
          <div className="placeorder-section">
            <h5>Shipping</h5>
            <p>{shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}</p>
          </div>

          <div className="placeorder-section">
            <h5>Payment</h5>
            <p>{paymentMethod}</p>
          </div>

          <div className="placeorder-section">
            <h5>Items</h5>
            {cartItems.length === 0 ? (
              <p>No items in cart.</p>
            ) : (
              cartItems.map((item, index) => (
                <div key={index} className="placeorder-item-row">
                  <img src={item.image} alt={item.name} />
                  <div className="item-name">{item.name}</div>
                  <div className="item-price">{item.qty} x ₹{item.price} = ₹{item.qty * item.price}</div>
                </div>
              ))
            )}
          </div>
        </Col>

        <Col md={4}>
          <div className="order-summary-card">
            <h5>Order Summary</h5>
            <div className="summary-line">
              <span>Items:</span>
              <span>₹{itemsPrice}</span>
            </div>
            <div className="summary-line">
              <span>Shipping:</span>
              <span>₹{shippingPrice}</span>
            </div>
            <div className="summary-line summary-total">
              <span>Total:</span>
              <span>₹{totalPrice}</span>
            </div>
            <button className="placeorder-button" onClick={placeOrderHandler}>
              Place Order
            </button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default PlaceOrderPage;
