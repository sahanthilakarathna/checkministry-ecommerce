import React, { useEffect, useState, useCallback } from 'react';
import { fetchProducts, createOrder } from '../api';
import { useNavigate } from 'react-router-dom';
import ProductList from '../components/ProductList';
import '../assets/css/OrderCreate.css';

export default function OrderCreate() {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [desc, setDesc] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await fetchProducts({ signal: controller.signal });
        setProducts(data);
        setLoading(false);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error(err);
          setError('Failed to load products');
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => controller.abort();
  }, []);

  const toggle = useCallback((id) => {
    setSelected(prev => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  }, []);

  const onCreate = async () => {
    setError('');

    if (!desc.trim()) {
      setError('Order description is required');
      return;
    }

    if (selected.size === 0) {
      setError('Select at least one product to create an order');
      return;
    }

    try {
      const payload = { orderdescription: desc.trim(), productIds: Array.from(selected) };
      await createOrder(payload);
      navigate('/orders');
    } catch (err) {
      console.error(err);
      setError('Failed to create order');
    }
  };

  return (
    <div className="order-create-container">
      <h2>Create Order</h2>

      {error && (
        <div className="error-message">
          {error}
          <span className="close" onClick={() => setError('')}>&times;</span>
        </div>
      )}

      <div className="order-desc">
        <textarea
          placeholder="Enter order description..."
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
      </div>

      <h3>Select Products</h3>
      <ProductList
        products={products}
        selected={selected}
        toggle={toggle}
        editMode={true}
        loading={loading}
      />

      <div className="actions">
        <button className="btn-create" onClick={onCreate}>Create Order</button>
        <button className="btn-cancel" onClick={() => navigate('/orders')}>Cancel</button>
      </div>
    </div>
  );
}
