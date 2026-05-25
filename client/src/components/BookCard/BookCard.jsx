import React from 'react';
import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
    return (
        <div className="book-card">
            <img src={book.coverImage} alt={book.title} className="book-img" />
            
            <div className="book-info-container">
                <div>
                    <h3 className="book-title">{book.title}</h3>
                    <p className="book-author">{book.author}</p>
                </div>
                
                <Link to={`/book/${book.id}`} className="details-btn" style={{ display: 'block', textAlign: 'center', width: '100%', marginTop: '15px' }}>
                    Детальніше
                </Link>
            </div>
        </div>
    );
};

export default BookCard;