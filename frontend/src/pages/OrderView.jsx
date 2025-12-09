import React, { useEffect, useState } from 'react';
import { fetchOrder, updateOrder } from '../api';
import { useParams, useNavigate } from 'react-router-dom';
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
    let isMounted = true;

    const loadOrder = async () => {
      try {
        setLoading(true);
        const data = await fetchOrder(id);
        if (isMounted) {
          setOrder(data);
          setDesc(data.orderdescription ?? data.orderDescription);
          setSelected(new Set((data.products || []).map(p => p.id)));
        }
      } catch (err) {
        console.error(err);
        if (isMounted) alert("Failed to load order");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadOrder();
    return () => { isMounted = false; };
  }, [id]);

  const toggle = (pid) => {
    setSelected(prev => {
      const s = new Set(prev);
      if (s.has(pid)) s.delete(pid);
      else s.add(pid);
      return s;
    });
  };

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
      <ul className="product-list">
        {(order.products || []).map(p => {
          const pid = p.id;
          return (
            <li
              key={pid}
              className={selected.has(pid) ? 'selected' : ''}
              onClick={() => editMode && toggle(pid)}
            >
              <label>
                {editMode && (
                  <input
                    type="checkbox"
                    checked={selected.has(pid)}
                    onChange={() => toggle(pid)}
                  />
                )}
                <span className="product-name">{p.productName ?? p.productname}</span>
                <span className="product-desc">{p.productDescription ?? p.productdescription}</span>
              </label>
            </li>
          );
        })}
        {(!order.products || order.products.length === 0) && <li>No products</li>}
      </ul>

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
