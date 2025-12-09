import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import OrderList from './pages/OrderList';
import OrderCreate from './pages/OrderCreate';
import OrderView from './pages/OrderView';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/orders" replace />} />
        <Route path="/orders" element={<OrderList />} />
        <Route path="/orders/create" element={<OrderCreate />} />
        <Route path="/orders/:id" element={<OrderView />} />
      </Routes>
    </BrowserRouter>
  );
}
