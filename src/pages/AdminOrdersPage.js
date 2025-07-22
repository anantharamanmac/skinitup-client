import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminOrdersPage.css';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const query = search.trim();

      const { data } = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/orders?pageNumber=${currentPage}&keyword=${encodeURIComponent(query)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(data.orders || []);
      setTotalPages(data.pages || 1);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const markAsDelivered = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/api/orders/${orderId}/deliver`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCurrentPage(1);
      fetchOrders();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const confirmed = window.confirm('Cancel this order?');
      if (!confirmed) return;

      const token = localStorage.getItem('token');
      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/api/orders/${orderId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCurrentPage(1);
      fetchOrders();
    } catch (err) {
      alert('Failed to cancel order');
    }
  };

  return (
    <div className="admin-orders-container">
      <h2>Admin Orders Dashboard</h2>

      <input
        type="text"
        placeholder="Search by order ID, name, or email"
        value={search}
        onChange={handleSearch}
        className="order-search"
      />

      <table className="orders-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Email</th>
            <th>Total</th>
            <th>Shipping</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="7">No orders found</td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id.slice(0, 8)}...</td>
                <td>{order.user?.name || 'N/A'}</td>
                <td>{order.user?.email || 'N/A'}</td>
                <td>₹{order.totalPrice}</td>
                <td>
                  {order.shippingAddress?.city}, {order.shippingAddress?.country}
                </td>
                <td>
                  {order.isCanceled ? (
                    <span className="canceled">Canceled</span>
                  ) : order.isDelivered ? (
                    <span className="delivered">Delivered</span>
                  ) : (
                    <span className="pending">Pending</span>
                  )}
                </td>
                <td>
                  {!order.isDelivered && !order.isCanceled && (
                    <>
                      <button
                        className="action-btn deliver-btn"
                        onClick={() => markAsDelivered(order._id)}
                      >
                        Mark Delivered
                      </button>
                      <button
                        className="action-btn cancel-btn"
                        onClick={() => cancelOrder(order._id)}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="pagination">
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentPage(idx + 1)}
            className={currentPage === idx + 1 ? 'active' : ''}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminOrdersPage;
