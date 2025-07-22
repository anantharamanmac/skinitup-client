import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './MyOrdersPage.css';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_BASE = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`${API_BASE}/api/orders/myorders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(sorted);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [API_BASE]);

  const getStatusBadge = (order) => {
    if (order.isCanceled) return <span className="status canceled">Canceled</span>;
    if (order.isDelivered) return <span className="status delivered">Delivered</span>;
    return <span className="status pending">Pending</span>;
  };

  return (
    <div className="myorders-container">
      <h2>🧾 My Orders</h2>

      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      ) : orders.length === 0 ? (
        <p>You haven’t placed any orders yet.</p>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div><strong>Order ID:</strong> {order._id}</div>
              <div><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</div>
              <div><strong>Total:</strong> ₹{order.totalPrice}</div>
              <div><strong>Status:</strong> {getStatusBadge(order)}</div>
              <button onClick={() => navigate(`/order/${order._id}`)}>View Details</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
