import React, { useState, useEffect } from 'react';
import { bookAPI } from '../services/api';
import BookCard from '../components/BookCard/BookCard';

const Library = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [groupBy, setGroupBy] = useState('none');

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const data = await bookAPI.getAllBooks();
                setBooks(data);
            } catch (error) {
                console.error("Помилка завантаження бібліотеки:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, []);

    const groupedBooks = React.useMemo(() => {
        if (groupBy === 'none') return { 'Всі книги': books };

        return books.reduce((acc, book) => {
            let key = 'Інше';
            
            if (groupBy === 'genre') {
                key = book.genre || 'Без жанру';
            } else if (groupBy === 'series') {
                if (book.series) {
                    key = book.series.split(' #')[0]; 
                } else {
                    key = 'Одиночні книги';
                }
            } else if (groupBy === 'shelf') {
                key = book.shelf && book.shelf.trim() !== '' ? book.shelf : 'Без підбірки';
            }

            if (!acc[key]) acc[key] = [];
            acc[key].push(book);
            return acc;
        }, {});
    }, [books, groupBy]);

    if (loading) return <div className="main-content" style={{ textAlign: 'center', padding: '50px' }}>Завантаження... ⏳</div>;

    return (
        <div className="main-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1>Моя бібліотека 📖</h1>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <strong style={{ color: 'var(--text-muted)' }}>Групувати за:</strong>
                    <select 
                        value={groupBy} 
                        onChange={(e) => setGroupBy(e.target.value)}
                        className="quote-input"
                        style={{ padding: '8px 15px', cursor: 'pointer', maxWidth: '200px' }}
                    >
                        <option value="none">Без групування (Всі)</option>
                        <option value="genre">Жанром</option>
                        <option value="series">Серією книг</option>
                        <option value="shelf">Моїми підбірками</option>
                    </select>
                </div>
            </div>

            {Object.entries(groupedBooks).map(([groupName, groupList]) => (
                <div key={groupName} style={{ marginBottom: '50px' }}>
                    {groupBy !== 'none' && (
                        <h2 style={{ borderBottom: '2px solid var(--primary-color)', paddingBottom: '10px', marginBottom: '20px' }}>
                            {groupName} <span style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>({groupList.length})</span>
                        </h2>
                    )}
                    
                    {/* ОСЬ ТУТ використовуємо клас з CSS замість інлайн-стилів */}
                    <div className="board-grid">
                        {groupList.map(book => (
                            <BookCard key={book.id} book={book} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Library;