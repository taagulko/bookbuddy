import React from 'react';

const Footer = () => {
    return (
        <footer style={{ padding: '40px 20px', textAlign: 'center', background: 'var(--card-bg)', marginTop: 'auto', borderTop: '1px solid var(--border-color)' }}>
            <p style={{ color: 'var(--text-muted)' }}>
                &copy; {new Date().getFullYear()} BookBuddy. Створено з любов'ю до книг.
            </p>
        </footer>
    );
};

export default Footer;