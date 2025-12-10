import React, { useEffect, useState } from 'react';
import { fetchOrders, deleteOrder } from '../api';
import { useNavigate } from 'react-router-dom';
import '../assets/css/OrderList.css';

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const loadOrders = async () => {
      try {
        setLoading(true);
        const data = await fetchOrders();
        if (isMounted) setOrders(data);
      } catch (err) {
        console.error(err);
        if (isMounted) alert('Failed to load orders');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadOrders();
    return () => { isMounted = false; };
  }, []);

  const filtered = q
  ? orders.filter(o => {
      const query = q.trim().toLowerCase();
      const description = (o.orderdescription ?? o.orderDescription ?? '').toLowerCase();
      return String(o.id).includes(query) || description.includes(query);
    })
  : orders;


  const onDelete = async (e, id) => {
    e.stopPropagation();
    if (!confirm('Delete this order?')) return;
    try {
      await deleteOrder(id);
      setOrders(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete');
    }
  };

  return (
    <div className="order-list-container">
      <h2>Order Management</h2>

      <div className="controls">
        <button className="btn-create" onClick={() => navigate('/orders/create')}>➕ Create Order</button>
        <input
          placeholder="Search by order id"
          value={q}
          onChange={e => setQ(e.target.value)}
          className="search-input"
        />
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <table className="order-grid">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Description</th>
              <th># Products</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan="5" style={{ textAlign: 'center' }}>No orders</td></tr>
            )}
            {filtered.map(o => (
              <tr key={o.id} className="row" onClick={() => navigate(`/orders/${o.id}`)}>
                <td>{o.id}</td>
                <td>{o.orderdescription ?? o.orderDescription}</td>
                <td>{o.productcount ?? o.productCount}</td>
                <td>{new Date(o.createdat ?? o.createdAt).toLocaleString()}</td>
                <td>
                  <button className="btn-view" onClick={(e) => { e.stopPropagation(); navigate(`/orders/${o.id}`); }}>View</button>
                  <button className="btn-delete" onClick={(e) => onDelete(e, o.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
