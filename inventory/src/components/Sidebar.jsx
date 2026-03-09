import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getUserRole } from '../services/api';

const Sidebar = () => {
    const navigate = useNavigate();
    const role = getUserRole();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const isManagement = role === 'ADMIN' || role === 'MANAGER';

    return (
        <aside className="sidebar glass-card">
            <div className="logo">
                <span style={{ fontSize: '32px' }}>📦</span>
                <span>InvManager</span>
            </div>

            <nav className="nav-links">
                <NavLink
                    to="/"
                    className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                >
                    <span>📊</span> Dashboard
                </NavLink>

                {isManagement && (
                    <NavLink
                        to="/add"
                        className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                    >
                        <span>➕</span> Add Product
                    </NavLink>
                )}
            </nav>

            <div style={{ marginTop: 'auto', padding: '10px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                Signed in as: <span style={{ color: 'var(--accent-blue)', fontWeight: 'bold' }}>{role}</span>
            </div>

            <button onClick={handleLogout} className="nav-item logout">
                <span>🚪</span> Logout
            </button>
        </aside>
    );
};

export default Sidebar;
