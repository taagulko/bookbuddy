import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav style={navStyle}>
            <div style={logoStyle}>BookBuddy</div>
            <div style={linkContainerStyle}>
                <Link to="/" style={linkStyle}>Головна</Link>
                <Link to="/library" style={linkStyle}>Бібліотека</Link>
                <Link to="/quotes">Цитати</Link>
             </div>
        </nav>
    );
};

const navStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 50px',
    background: 'var(--card-bg)',
    boxShadow: 'var(--shadow-sm)',
    marginBottom: '20px'
};

const logoStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: 'var(--primary-color)'
};

const linkContainerStyle = { display: 'flex', gap: '20px' };

const linkStyle = {
    color: 'var(--text-main)',
    fontWeight: '500',
    fontSize: '1rem'
};

export default Navbar;