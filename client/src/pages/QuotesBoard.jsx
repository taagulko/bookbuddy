import React, { useState, useEffect } from 'react';
import { quoteAPI, bookAPI } from '../services/api';

const QuotesBoard = () => {
    const [quotes, setQuotes] = useState([]);
    const [books, setBooks] = useState([]); // Стейт для списку книг у випадаючому меню
    const [activeTab, setActiveTab] = useState('community');
    const [newQuote, setNewQuote] = useState({ bookTitle: '', text: '' });
    const [loading, setLoading] = useState(true);

    const CURRENT_USER = 'baryromms';

    // Функція завантаження книг та цитат із бази даних
    const loadData = async () => {
        try {
            setLoading(true);

            // 1. Завантажуємо книги для випадаючого списку
            const booksData = await bookAPI.getAllBooks();
            setBooks(booksData || []);

            // 2. Завантажуємо дані з ендпоінту цитат
            const quotesData = await quoteAPI.getAllQuotes();
            
            let extractedQuotes = [];
            if (Array.isArray(quotesData)) {
                // Перевіряємо, чи сервер повернув масив книг із вкладеними цитатами
                const isBooksArray = quotesData.some(item => item.quotes && Array.isArray(item.quotes));
                
                if (isBooksArray) {
                    // Якщо прийшли книги — дістаємо цитати з кожної книги з файлу books.json
                    quotesData.forEach(book => {
                        if (book.quotes && Array.isArray(book.quotes)) {
                            book.quotes.forEach(q => {
                                extractedQuotes.push({
                                    id: q.id,
                                    text: q.text,
                                    author: q.author, // Автор цитати (хто додав)
                                    date: q.date,
                                    bookTitle: book.title
                                });
                            });
                        }
                    });
                } else {
                    // Якщо сервер раптом сам віддав уже готовий плоский масив цитат
                    extractedQuotes = quotesData;
                }
            }
            
            // Свіжі цитати показуємо зверху
            setQuotes(extractedQuotes.reverse());
        } catch (error) {
            console.error("Помилка при отриманні даних із бази:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Надсилаємо нову цитату на сервер
    const handleAddQuote = async (e) => {
        e.preventDefault();
        if (!newQuote.bookTitle || !newQuote.text) return;
        
        try {
            // Відправляємо точну назву книги, текст та поточного юзера
            await quoteAPI.addQuote(newQuote.bookTitle, newQuote.text, CURRENT_USER);
            
            setNewQuote({ bookTitle: '', text: '' });
            setActiveTab('mine'); // Перемикаємо на власні збереження
            await loadData(); // Перезавантажуємо сторінку зі свіжими даними з файлу
            
        } catch (error) {
            console.error("Помилка під час запису цитати в базу:", error);
            alert("Не вдалося зберегти цитату в базу даних. Перевір консоль сервера.");
        }
    };

    const filteredQuotes = activeTab === 'mine' 
        ? quotes.filter(q => q.author === CURRENT_USER) 
        : quotes;

    return (
        <div className="main-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px 0 30px' }}>
                <h1 style={{ color: 'var(--text-main)' }}>Цитати спільноти ✍️</h1>
            </div>

            {/* Форма створення посту */}
            <form className="social-quote-form" onSubmit={handleAddQuote}>
                <div className="form-header">
                    <img 
                        src={`https://api.dicebear.com/7.x/notionists/svg?seed=${CURRENT_USER}&backgroundColor=e2dcd0`} 
                        alt="My Avatar" 
                        className="quote-avatar" 
                    />
                    {/* ТЕПЕР ТУТ СЕЛЕКТ: Назва книги обирається з бази, тому помилки бути не може */}
                    <select 
                        className="quote-input ghost-input"
                        value={newQuote.bookTitle}
                        onChange={(e) => setNewQuote({ ...newQuote, bookTitle: e.target.value })}
                        style={{ cursor: 'pointer', id: 'book-select' }}
                    >
                        <option value="">Оберіть книгу з вашої бібліотеки...</option>
                        {books.map(book => (
                            <option key={book.id} value={book.title}>{book.title}</option>
                        ))}
                    </select>
                </div>
                <textarea 
                    placeholder="Поділіться улюбленою цитатою з іншими..." 
                    className="details-textarea social-textarea"
                    value={newQuote.text}
                    onChange={(e) => setNewQuote({ ...newQuote, text: e.target.value })}
                />
                <div className="form-actions">
                    <button type="submit" className="details-btn">Опублікувати</button>
                </div>
            </form>

            {/* Вкладки навігації */}
            <div className="quote-tabs">
                <button 
                    className={`quote-tab ${activeTab === 'community' ? 'active' : ''}`}
                    onClick={() => setActiveTab('community')}
                >
                    Стрічка спільноти
                </button>
                <button 
                    className={`quote-tab ${activeTab === 'mine' ? 'active' : ''}`}
                    onClick={() => setActiveTab('mine')}
                >
                    Мої збереження
                </button>
            </div>

            {/* Виведення цитат із бази */}
            <div className="quote-feed">
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Оновлення стрічки... ⏳</div>
                ) : filteredQuotes.length > 0 ? (
                    filteredQuotes.map((quote, index) => (
                        <div key={quote.id || index} className="social-quote-card">
                            <div className="quote-header">
                                <div className="quote-user-info">
                                    <img 
                                        src={`https://api.dicebear.com/7.x/notionists/svg?seed=${quote.author || 'User'}&backgroundColor=e2dcd0`} 
                                        alt={quote.author} 
                                        className="quote-avatar" 
                                    />
                                    <div>
                                        <div className="quote-username">{quote.author || 'Користувач'}</div>
                                        <div className="quote-date">Нещодавно</div>
                                    </div>
                                </div>
                                <div className="quote-book-tag">📖 {quote.bookTitle || 'Книга'}</div>
                            </div>
                            <div className="quote-body">
                                "{quote.text}"
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                        Тут поки порожньо. Оберіть книгу та додайте першу цитату!
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuotesBoard;