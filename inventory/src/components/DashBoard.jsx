import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getUserRole } from '../services/api';

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const role = getUserRole();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            setProducts(response.data);
        } catch (err) {
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/products/${id}`);
                setProducts(products.filter(p => p.id !== id));
            } catch (err) {
                alert('Failed to delete product');
            }
        }
    };

    const handleExport = async () => {
        try {
            const response = await api.get('/reports/export', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'inventory_report.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            alert('Failed to export report');
        }
    };

    const isManagement = role === 'ADMIN' || role === 'MANAGER';
    const lowStockCount = products.filter(p => p.quantity < 5).length;

    if (loading) return <div style={{ padding: '40px' }}>Loading application...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '32px' }}>Inventory Overview</h1>
                <button onClick={handleExport} className="btn-primary" style={{ width: 'auto' }}>
                    🚢 Export CSV
                </button>
            </div>

            {lowStockCount > 0 && (
                <div style={{
                    background: '#fff1f2',
                    border: '1px solid #fda4af',
                    borderRadius: '12px',
                    padding: '16px 24px',
                    marginBottom: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    color: '#e11d48',
                    fontWeight: '600'
                }}>
                    <span style={{ fontSize: '20px' }}>⚠️</span>
                    <span>System Alert: {lowStockCount} items are running low on stock. Please review the inventory.</span>
                </div>
            )}

            <div className="stats-grid">

                <div className="stat-card glass-card">
                    <span className="stat-label">Total Products</span>
                    <span className="stat-value">{products.length}</span>
                </div>
                <div className="stat-card glass-card" style={{ borderLeft: '4px solid var(--accent-red)' }}>
                    <span className="stat-label">Low Stock Alert</span>
                    <span className="stat-value" style={{ color: 'var(--accent-red)' }}>{lowStockCount}</span>
                </div>
                <div className="stat-card glass-card" style={{ borderLeft: '4px solid var(--accent-green)' }}>
                    <span className="stat-label">Total Value</span>
                    <span className="stat-value">
                        ${products.reduce((acc, p) => acc + (p.price * p.quantity), 0).toFixed(2)}
                    </span>
                </div>
            </div>

            <div className="table-container glass-card">
                <h3>Current Inventory</h3>
                <table style={{ marginTop: '20px' }}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Status</th>
                            {isManagement && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id}>
                                <td style={{ fontWeight: '500' }}>{product.name}</td>
                                <td style={{ color: product.quantity < 5 ? 'var(--accent-red)' : 'inherit' }}>
                                    {product.quantity}
                                    {product.quantity < 5 && (
                                        <div style={{ fontSize: '11px', color: 'var(--accent-red)', marginTop: '4px' }}>
                                            ⚠️ Low Stock - Reorder Required
                                        </div>
                                    )}
                                </td>
                                <td>${product.price.toFixed(2)}</td>
                                <td>
                                    <span className={`badge ${product.quantity < 5 ? 'badge-warning' : 'badge-success'}`}>
                                        {product.quantity < 5 ? 'Risk' : 'Optimal'}
                                    </span>
                                </td>
                                {isManagement && (
                                    <td>
                                        <button
                                            onClick={() => navigate(`/edit/${product.id}`)}
                                            style={{ background: 'transparent', color: 'var(--accent-blue)', marginRight: '15px' }}
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            style={{ background: 'transparent', color: 'var(--accent-red)' }}
                                        >
                                            🗑️ Delete
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;
