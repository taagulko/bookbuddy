import React, { useState, useEffect } from 'react';
import { bookAPI } from '../services/api';

const QuotesBoard = () => {
    const [booksWithQuotes, setBooksWithQuotes] = useState([]);

    useEffect(() => {
        const fetchQuotes = async () => {
    const allBooks = await bookAPI.getAllBooks();
    console.log("Всі книги:", allBooks); // <--- ДОДАЙ ЦЕ
    
    const filtered = allBooks.filter(b => b.quotes && b.quotes.length > 0);
    console.log("Книги з цитатами:", filtered); // <--- ДОДАЙ ЦЕ
    
    setBooksWithQuotes(filtered);
};
        fetchQuotes();
    }, []);

    return (
        <div className="main-content">
            <h1>Цитати спільноти</h1>
            <div className="quotes-grid">
                {booksWithQuotes.map(book => (
                    <div key={book.id} className="quote-card" style={{ background: 'var(--card-bg)', padding: '20px', borderRadius: '15px', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                            <img src={book.coverImage} alt={book.title} style={{ width: '80px', borderRadius: '5px' }} />
                            <h2>{book.title}</h2>
                        </div>
                        <ul style={{ marginTop: '15px' }}>
                            {book.quotes.map((q, index) => (
                                <li key={index} style={{ fontStyle: 'italic', marginBottom: '10px', borderLeft: '3px solid var(--primary-color)', paddingLeft: '10px' }}>
                                    "{q.text}" — <strong>{q.author}</strong>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuotesBoard;