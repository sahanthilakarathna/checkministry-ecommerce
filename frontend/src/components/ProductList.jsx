import React from 'react';
import '../assets/css/OrderView.css';

export default function ProductList({ products, selected, toggle, editMode,loading }) {
  if (loading) return <ul className="product-list"><li>Loading products...</li></ul>;
  if (!products || products.length === 0) return <ul className="product-list"><li>No products</li></ul>;

  return (
    <ul className="product-list">
      {products.map(p => {
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
    </ul>
  );
}
