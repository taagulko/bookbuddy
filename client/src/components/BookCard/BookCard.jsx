import React from 'react';
import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
    return (
        <div style={cardStyle}>
            <img src={book.coverImage} alt={book.title} style={imageStyle} />
            <div style={{ padding: '15px' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '5px' }}>{book.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{book.author}</p>
                <Link to={`/book/${book.id}`} style={btnStyle}>Детальніше</Link>
            </div>
        </div>
    );
};

const cardStyle = {
    background: 'var(--card-bg)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-sm)',
    textAlign: 'center'
};

const imageStyle = { width: '100%', height: '250px', objectFit: 'cover' };

const btnStyle = {
    display: 'block',
    marginTop: '15px',
    padding: '8px',
    backgroundColor: 'var(--primary-color)',
    color: 'white',
    borderRadius: 'var(--radius-md)',
    fontSize: '0.85rem',
    fontWeight: 'bold'
};

export default BookCard;