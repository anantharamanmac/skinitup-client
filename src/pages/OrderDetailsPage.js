import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './OrderDetailsPage.css';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
    const API_BASE = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`${API_BASE}/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrder(data);
      } catch (error) {
        console.error('Error fetching order:', error);
      }
    };

    fetchOrder();
  }, [id]);

  if (!order) return <div className="order-details-loading">Loading order details...</div>;

  return (
    <div className="order-details-container">
      <h2 className="order-title">Order Summary</h2>
      <div className="order-info-grid">
        <div className="order-section">
          <h4>Order Info</h4>
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
          <p><strong>Status:</strong>{' '}
            {order.isCanceled ? (
              <span className="badge badge-canceled">Canceled</span>
            ) : order.isDelivered ? (
              <span className="badge badge-delivered">Delivered</span>
            ) : (
              <span className="badge badge-pending">Pending</span>
            )}
          </p>
        </div>

        <div className="order-section">
          <h4>Shipping Address</h4>
          <p>{order.shippingAddress.address}</p>
          <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
          <p>{order.shippingAddress.country}</p>
        </div>

        <div className="order-section">
          <h4>Payment</h4>
          <p><strong>Method:</strong> {order.paymentMethod}</p>
          <p><strong>Total:</strong> ₹{order.totalPrice.toFixed(2)}</p>
        </div>
      </div>

      <div className="order-items">
        <h4>Items Ordered</h4>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.orderItems.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.qty}</td>
                <td>₹{item.price}</td>
                <td>₹{(item.qty * item.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
