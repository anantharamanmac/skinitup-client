import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout'; // new
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import PaymentPage from './pages/PaymentPage';
import PlaceOrderPage from './pages/PlaceOrderPage';
import AdminDashboard from './pages/AdminDashboard';
import ShippingPage from './pages/ShippingPage';
import AdminProductPage from './pages/AdminProductPage';
import AdminLandingPage from './pages/AdminLandingPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import MyOrdersPage from './pages/MyOrdersPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import ScratchCard from './pages/ScratchCard';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Routes with NavBar */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/shipping" element={<ShippingPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/placeorder" element={<PlaceOrderPage />} />
          <Route path="/order/:id" element={<OrderDetailsPage />} />
          <Route path="/myorders" element={<MyOrdersPage />} />
          <Route path="/admin" element={<AdminLandingPage />} />
          <Route path="/admin/user" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProductPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/scratchcard" element={<ScratchCard />} />
        </Route>

        {/* Routes WITHOUT NavBar */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
};

export default App;
