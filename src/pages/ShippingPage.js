import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ShippingPage.css';

function ShippingPage() {
  const navigate = useNavigate();

  const storedAddress = JSON.parse(localStorage.getItem('shippingAddress')) || {
    address: '',
    city: '',
    postalCode: '',
    country: '',
  };

  const [address, setAddress] = useState(storedAddress.address);
  const [city, setCity] = useState(storedAddress.city);
  const [postalCode, setPostalCode] = useState(storedAddress.postalCode);
  const [country, setCountry] = useState(storedAddress.country);

  const submitHandler = (e) => {
    e.preventDefault();
    localStorage.setItem(
      'shippingAddress',
      JSON.stringify({ address, city, postalCode, country })
    );
    navigate('/payment');
  };

  return (
    <div className="shipping-container">
      <h2 className="shipping-title">Shipping Address</h2>
      <form className="shipping-form" onSubmit={submitHandler}>
        <label>Address</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />

        <label>City</label>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />

        <label>Postal Code</label>
        <input
          type="text"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          required
        />

        <label>Country</label>
        <input
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
        />

        <button type="submit" className="shipping-btn">Continue</button>
      </form>
    </div>
  );
}

export default ShippingPage;
