import React, { useState, useEffect } from 'react';
import { bookAPI, quoteAPI } from '../services/api';

const QuotesBoard = () => {
    const [booksWithQuotes, setBooksWithQuotes] = useState([]);
    
    // Змінили bookId на bookTitle
    const [formData, setFormData] = useState({ bookTitle: '', text: '', author: '' });

    useEffect(() => {
        loadQuotes();
    }, []);

    const loadQuotes = async () => {
        try {
            const allBooks = await bookAPI.getAllBooks();
            const filtered = allBooks.filter(b => b.quotes && b.quotes.length > 0);
            setBooksWithQuotes(filtered);
        } catch (error) {
            console.error("Помилка при завантаженні цитат:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await quoteAPI.addQuote(formData.bookTitle, formData.text, formData.author);
            // Очищення форми після успішного додавання
            setFormData({ bookTitle: '', text: '', author: '' }); 
            loadQuotes(); 
        } catch (error) {
            alert("Помилка при додаванні цитати. Перевірте правильність назви книги!");
        }
    };

    return (
        <div className="main-content quotes-container">
            <h1>Цитати спільноти</h1>

            <form className="quote-form" onSubmit={handleSubmit}>
                <h3>Додати нову цитату</h3>
                
                <input 
                    className="quote-input"
                    placeholder="Назва книги" 
                    value={formData.bookTitle} 
                    onChange={e => setFormData({...formData, bookTitle: e.target.value})} 
                    required 
                />
                <input 
                    className="quote-input"
                    placeholder="Текст цитати" 
                    value={formData.text} 
                    onChange={e => setFormData({...formData, text: e.target.value})} 
                    required 
                />
                <input 
                    className="quote-input"
                    placeholder="Ваше ім'я" 
                    value={formData.author} 
                    onChange={e => setFormData({...formData, author: e.target.value})} 
                />
                <button type="submit" className="quote-submit-btn">
                    Додати цитату
                </button>
            </form>

            <div className="quotes-grid">
                {booksWithQuotes.map(book => (
                    <div key={book.id} className="quote-card">
                        <div className="quote-card-header">
                            <img src={book.coverImage} alt={book.title} />
                            <h2>{book.title}</h2>
                        </div>
                        <ul className="quote-list">
                            {book.quotes.map((q, index) => (
                                <li key={index} className="quote-item">
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