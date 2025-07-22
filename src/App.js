import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Layout from './components/Layout'; // For NavBar wrapping
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import PaymentPage from './pages/PaymentPage';
import PlaceOrderPage from './pages/PlaceOrderPage';
import ShippingPage from './pages/ShippingPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import MyOrdersPage from './pages/MyOrdersPage';
import ScratchCard from './pages/ScratchCard';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminProductPage from './pages/AdminProductPage';
import AdminLandingPage from './pages/AdminLandingPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminRoute from './components/AdminRoute'; // Protect admin pages

const App = () => {
  return (
    <Router>
      <Routes>
        {/* ✅ Public pages with NavBar */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/shipping" element={<ShippingPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/placeorder" element={<PlaceOrderPage />} />
          <Route path="/order/:id" element={<OrderDetailsPage />} />
          <Route path="/myorders" element={<MyOrdersPage />} />
          <Route path="/scratchcard" element={<ScratchCard />} />

          {/* ✅ Protected Admin Routes */}
          <Route path="/admin" element={<AdminRoute />}>
            <Route index element={<AdminLandingPage />} />
            <Route path="user" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProductPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
          </Route>
        </Route>

        {/* ❌ Public pages WITHOUT NavBar */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
};

export default App;
