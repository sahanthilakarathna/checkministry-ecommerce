const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

async function handleRes(res) {
  const text = await res.text();
  try {
    const data = text ? JSON.parse(text) : null;
    if (!res.ok) {
      const msg = (data && data.error) || res.statusText || 'API error';
      throw new Error(msg);
    }
    return data;
  } catch (err) {
    if (!res.ok) throw new Error(res.statusText+err || 'API error');
    return null;
  }
}

export async function fetchOrders() {
  const res = await fetch(`${API_BASE}/orders`);
  return handleRes(res);
}

export async function fetchOrder(id) {
  const res = await fetch(`${API_BASE}/orders/${id}`);
  return handleRes(res);
}

export async function fetchProducts() {
  const res = await fetch(`${API_BASE}/products`);
  return handleRes(res);
}

export async function createOrder(payload) {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handleRes(res);
}

export async function updateOrder(id, payload) {
  const res = await fetch(`${API_BASE}/orders/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handleRes(res);
}

export async function deleteOrder(id) {
  const res = await fetch(`${API_BASE}/orders/${id}`, { method: 'DELETE' });
  return handleRes(res);
}
