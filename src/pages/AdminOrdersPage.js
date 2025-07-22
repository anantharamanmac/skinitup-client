import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminOrdersPage.css';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all | pending | delivered | canceled
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const keyword = encodeURIComponent(search.trim());
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/orders?pageNumber=${page}&keyword=${keyword}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const fetched = Array.isArray(res.data.orders) ? res.data.orders : [];
      setOrders(fetched);
      setTotalPages(res.data.pages || 1);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, [page, search]);

  const applyFilterStatus = (ordersList) => {
    if (filterStatus === 'pending') {
      return ordersList.filter((o) => !o.isDelivered && !o.isCanceled);
    } else if (filterStatus === 'delivered') {
      return ordersList.filter((o) => o.isDelivered);
    } else if (filterStatus === 'canceled') {
      return ordersList.filter((o) => o.isCanceled);
    }
    return ordersList;
  };

  const markAsDelivered = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/api/orders/${orderId}/deliver`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch (err) {
      alert('Failed to mark as delivered');
    }
  };

  const cancelOrder = async (orderId) => {
    const confirmCancel = window.confirm('Are you sure you want to cancel this order?');
    if (!confirmCancel) return;

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/api/orders/${orderId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch (err) {
      alert('Failed to cancel order');
    }
  };

  const filteredOrders = applyFilterStatus(orders);

  return (
    <div className="order-list-wrapper">
      {/* Sidebar */}
      <aside className="order-sidebar">
        <h4>Filters</h4>
        {['all', 'pending', 'delivered', 'canceled'].map((status) => (
          <button
            key={status}
            className={filterStatus === status ? 'active' : ''}
            onClick={() => setFilterStatus(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)} Orders
          </button>
        ))}
      </aside>

      {/* Main Order Panel */}
      <main className="order-list-container">
        <h2>Admin Order Dashboard</h2>

        <input
          type="text"
          placeholder="Search by Order ID, Name or Email"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="search-box"
        />

        {filteredOrders.length === 0 ? (
          <p className="no-orders">No orders found.</p>
        ) : (
          filteredOrders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <h3>Order #{order._id.slice(-6).toUpperCase()}</h3>
                <span
                  className={
                    order.isCanceled
                      ? 'canceled'
                      : order.isDelivered
                      ? 'shipped'
                      : 'pending'
                  }
                >
                  {order.isCanceled ? 'Canceled' : order.isDelivered ? 'Delivered' : 'Pending'}
                </span>
              </div>
              <p>
                <strong>Placed on:</strong>{' '}
                {new Date(order.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>User:</strong> {order.user?.name || 'N/A'} (
                {order.user?.email || 'N/A'})
              </p>
              <ul>
                {order.orderItems?.map((item, idx) => (
                  <li key={idx}>
                    {item.name} × {item.qty}
                  </li>
                ))}
              </ul>
              <p>
                <strong>Total:</strong> ₹{order.totalPrice}
              </p>
              <p>
                <strong>Shipping:</strong> {order.shippingAddress?.city},{' '}
                {order.shippingAddress?.country}
              </p>

              {!order.isDelivered && !order.isCanceled && (
                <>
                  <button className="ship-btn" onClick={() => markAsDelivered(order._id)}>
                    Mark as Delivered
                  </button>
                  <button className="cancel-btn" onClick={() => cancelOrder(order._id)}>
                    Cancel Order
                  </button>
                </>
              )}
            </div>
          ))
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={page === i + 1 ? 'active' : ''}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminOrdersPage;
