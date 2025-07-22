import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminProductPage.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminProductPage = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    brand: '',
    category: '',
    countInStock: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');

  const token = localStorage.getItem('token');
  const API_BASE = process.env.REACT_APP_API_BASE_URL;

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/api/products`);
      setProducts(data);
      setFiltered(data);
    } catch (err) {
      toast.error('Failed to load products');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const keyword = search.toLowerCase();
    const result = products.filter(
      (p) =>
        p.name.toLowerCase().includes(keyword) ||
        p.category.toLowerCase().includes(keyword)
    );
    setFiltered(result);
  }, [search, products]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  const formData = new FormData();
  formData.append('image', file);

  try {
    const { data } = await axios.post(`${API_BASE}/api/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`, // ✅ make sure token is present
      },
    });
    setForm({ ...form, image: data.imageUrl });
    toast.success('Image uploaded successfully');
  } catch (err) {
    toast.error(err.response?.data?.message || 'Image upload failed');
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_BASE}/api/products/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Product updated');
      } else {
        await axios.post(`${API_BASE}/api/products`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Product created');
      }

      setForm({
        name: '',
        price: '',
        description: '',
        image: '',
        brand: '',
        category: '',
        countInStock: '',
      });
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (product) => {
    setForm(product);
    setEditingId(product._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${API_BASE}/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Product deleted');
        fetchProducts();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Delete failed');
      }
    }
  };

  return (
    <div className="admin-product-page">
      <ToastContainer position="top-right" autoClose={2000} />
      <h2>Product Management</h2>

      <input
        type="text"
        placeholder="Search by name or category..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      <form onSubmit={handleSubmit} className="product-form">
        {['name', 'price', 'description', 'brand', 'category', 'countInStock'].map((field) => (
          <input
            key={field}
            type={field === 'price' || field === 'countInStock' ? 'number' : 'text'}
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={form[field]}
            onChange={handleChange}
            required={field !== 'brand' && field !== 'description'}
          />
        ))}

        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          required={!editingId}
        />

        {form.image && (
          <div style={{ marginBottom: '1rem' }}>
            <img src={form.image} alt="Uploaded" width="100" />
          </div>
        )}

        <button type="submit">{editingId ? 'Update Product' : 'Create Product'}</button>
      </form>

      <table className="product-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price (₹)</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td>{p.category}</td>
              <td>{p.countInStock}</td>
              <td>
                <img src={p.image} alt={p.name} width="50" />
              </td>
              <td>
                <button onClick={() => handleEdit(p)}>Edit</button>
                <button onClick={() => handleDelete(p._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProductPage;
