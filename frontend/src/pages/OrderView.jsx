import React, { useEffect, useState, useCallback } from 'react';
import { fetchOrder, updateOrder } from '../api';
import { useParams, useNavigate } from 'react-router-dom';
import ProductList from '../components/ProductList';
import '../assets/css/OrderView.css';

export default function OrderView() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [desc, setDesc] = useState('');
  const [selected, setSelected] = useState(new Set());
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    const loadOrder = async () => {
      setLoading(true);
      try {
        const data = await fetchOrder(id, { signal: controller.signal });
        setOrder(data);
        setDesc(data.orderdescription ?? data.orderDescription);
        setSelected(new Set((data.products || []).map(p => p.id)));
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error(err);
          alert('Failed to load order');
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    loadOrder();

    return () => controller.abort();
  }, [id]);

  const toggle = useCallback((pid) => {
    setSelected(prev => {
      const s = new Set(prev);
      s.has(pid) ? s.delete(pid) : s.add(pid);
      return s;
    });
  }, []);

  const onSave = async () => {
    setError('');

    if (!desc.trim()) {
      setError('Order description is required');
      return;
    }

    if (selected.size === 0) {
      setError('Select at least one product');
      return;
    }

    try {
      const payload = {
        orderdescription: desc.trim(),
        productIds: Array.from(selected)
      };
      await updateOrder(id, payload);
      const updatedOrder = await fetchOrder(id);
      setOrder(updatedOrder);
      setEditMode(false);
    } catch (err) {
      console.error(err);
      setError('Failed to update order');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!order) return <div className="not-found">Order not found</div>;

  return (
    <div className="order-view-container">
      <h2>Order #{order.id}</h2>

      {error && (
        <div className="error-message">
          {error}
          <span className="close" onClick={() => setError('')}>&times;</span>
        </div>
      )}

      <p>
        <strong>Description: </strong>
        {editMode ? (
          <textarea
            value={desc}
            onChange={e => setDesc(e.target.value)}
            rows={3}
            style={{ width: '100%', marginTop: '8px' }}
          />
        ) : (
          order.orderdescription ?? order.orderDescription
        )}
      </p>

      <p><strong>Created: </strong>{new Date(order.createdat ?? order.createdAt).toLocaleString()}</p>

      <h3>Products</h3>
      <ProductList
        products={order.products}
        selected={selected}
        toggle={toggle}
        editMode={editMode}
      />

      <div className="actions">
        {editMode ? (
          <>
            <button className="btn-create" onClick={onSave}>Save</button>
            <button className="btn-cancel" onClick={() => setEditMode(false)}>Cancel</button>
          </>
        ) : (
          <>
            <button className="btn-create" onClick={() => setEditMode(true)}>Edit</button>
            <button className="btn-cancel" onClick={() => navigate('/orders')}>Back</button>
          </>
        )}
      </div>
    </div>
  );
}
