import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ theme, toggleTheme }) => {
    return (
        <nav style={navStyle}>
            <div style={logoStyle}>BookBuddy</div>
            <div style={linkContainerStyle}>
                <Link to="/" style={linkStyle}>Головна</Link>
                <Link to="/library" style={linkStyle}>Бібліотека</Link>
                <Link to="/quotes" style={linkStyle}>Цитати</Link>
                
                {/* Кнопка перемикання теми */}
                <button onClick={toggleTheme} style={themeBtnStyle}>
                    {theme === 'light' ? '🌙 Ніч' : '☀️ День'}
                </button>
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
    marginBottom: '20px',
    transition: 'background-color var(--transition-speed), box-shadow var(--transition-speed)'
};

const logoStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: 'var(--primary-color)',
    transition: 'color var(--transition-speed)'
};

const linkContainerStyle = { 
    display: 'flex', 
    gap: '20px',
    alignItems: 'center' // Додано, щоб текст і кнопка стояли рівно по центру
};

const linkStyle = {
    color: 'var(--text-main)',
    fontWeight: '500',
    fontSize: '1rem',
    textDecoration: 'none',
    transition: 'color var(--transition-speed)'
};

const themeBtnStyle = {
    background: 'var(--bg-color)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-main)',
    padding: '8px 16px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    boxShadow: 'var(--shadow-sm)',
    transition: 'all 0.3s ease',
    marginLeft: '15px' // Невеликий відступ від текстових посилань
};

export default Navbar;