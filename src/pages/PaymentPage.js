import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './PaymentPage.css';

const PaymentPage = () => {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState('guest');
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [upiId, setUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  const navigate = useNavigate();

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
    if (token) {
      const decodedUser = decodeToken(token);
      setUser(decodedUser);
      setUserId(decodedUser?.id || decodedUser?._id || 'guest');
    }
  }, []);

  const placeOrderHandler = () => {
    if (!user) {
      toast.error('Please login first');
      return;
    }

    const cartKey = `skinitupCart_${userId}`;
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    if (!cart.length) {
      toast.error('Cart is empty');
      return;
    }

    if (selectedPayment === 'card') {
      const { cardNumber, name, expiry, cvv } = cardDetails;
      if (!cardNumber || !name || !expiry || !cvv) {
        toast.error('Please fill all card details');
        return;
      }
    }

    if (selectedPayment === 'upi' && !upiId) {
      toast.error('Please enter a valid UPI ID');
      return;
    }

    localStorage.setItem('paymentMethod', selectedPayment);
    toast.success('Payment method selected!');
    setTimeout(() => navigate('/placeorder'), 800); // delay to show toast
  };

  return (
    <div className="payment-container">
      <ToastContainer />
      <div className="payment-box">
        <h2>Choose Payment Method</h2>

        <div className="payment-options">
          <label className="payment-option">
            <input
              type="radio"
              value="card"
              checked={selectedPayment === 'card'}
              onChange={() => setSelectedPayment('card')}
            />
            Credit / Debit Card
          </label>
          <label className="payment-option">
            <input
              type="radio"
              value="upi"
              checked={selectedPayment === 'upi'}
              onChange={() => setSelectedPayment('upi')}
            />
            UPI (Google Pay / Paytm / PhonePe)
          </label>
          <label className="payment-option">
            <input
              type="radio"
              value="cod"
              checked={selectedPayment === 'cod'}
              onChange={() => setSelectedPayment('cod')}
            />
            Cash on Delivery
          </label>
        </div>

        {selectedPayment === 'card' && (
          <div className="card-form">
            <input
              type="text"
              placeholder="Card Number"
              maxLength="16"
              value={cardDetails.cardNumber}
              onChange={(e) =>
                setCardDetails({ ...cardDetails, cardNumber: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Name on Card"
              value={cardDetails.name}
              onChange={(e) =>
                setCardDetails({ ...cardDetails, name: e.target.value })
              }
            />
            <div className="row">
              <input
                type="text"
                placeholder="MM/YY"
                maxLength="5"
                value={cardDetails.expiry}
                onChange={(e) =>
                  setCardDetails({ ...cardDetails, expiry: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="CVV"
                maxLength="3"
                value={cardDetails.cvv}
                onChange={(e) =>
                  setCardDetails({ ...cardDetails, cvv: e.target.value })
                }
              />
            </div>
          </div>
        )}

        {selectedPayment === 'upi' && (
          <div className="upi-form">
            <label>Enter UPI ID</label>
            <input
              type="text"
              placeholder="example@upi"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
            />
          </div>
        )}

        <button className="place-order-btn" onClick={placeOrderHandler}>
          Continue
        </button>
      </div>

      <div className="order-summary-box">
        <h3>Order Summary</h3>
        <p>(Display cart items or price summary here)</p>
      </div>
    </div>
  );
};

export default PaymentPage;
