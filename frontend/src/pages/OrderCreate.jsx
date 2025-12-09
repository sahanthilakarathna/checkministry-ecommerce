import React, { useEffect, useState } from 'react';
import { fetchProducts, createOrder } from '../api';
import { useNavigate } from 'react-router-dom';
import '../assets/css/OrderCreate.css'; // import the CSS

export default function OrderCreate() {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [desc, setDesc] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(err => {
        console.error(err);
        setError('Failed to load products');
      });
  }, []);

  const toggle = (id) => {
    setSelected(prev => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id);
      else s.add(id);
      return s;
    });
  };

  const onCreate = async () => {
    // Clear previous errors
    setError('');

    // Validate order description
    if (!desc.trim()) {
      setError('Order description is required');
      return;
    }

    // Validate at least one product selected
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
      <ul className="product-list">
        {products.map(p => (
          <li
            key={p.id}
            className={selected.has(p.id) ? 'selected' : ''}
            onClick={() => toggle(p.id)}
          >
            <label>
              <input
                type="checkbox"
                checked={selected.has(p.id)}
                onChange={() => toggle(p.id)}
              />
              <span className="product-name">{p.productname}</span>
              <span className="product-desc">{p.productdescription}</span>
            </label>
          </li>
        ))}
      </ul>

      <div className="actions">
        <button className="btn-create" onClick={onCreate}>Create Order</button>
        <button className="btn-cancel" onClick={() => navigate('/orders')}>Cancel</button>
      </div>
    </div>
  );
}
