import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bookAPI } from '../services/api';

const BookDetails = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Стейти для кастомних даних
    const [noteInput, setNoteInput] = useState('');
    const [shelfInput, setShelfInput] = useState(''); 
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const data = await bookAPI.getBookById(id);
                setBook(data);
                setNoteInput(data.notes || ''); 
                setShelfInput(data.shelf || '');
            } catch (error) {
                console.error("Помилка завантаження книги:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBook();
    }, [id]);

    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;
        setBook({ ...book, status: newStatus });
        await bookAPI.updateBook(id, { status: newStatus });
    };

    const handleRatingChange = async (e) => {
        const newRating = Number(e.target.value);
        setBook({ ...book, rating: newRating });
        await bookAPI.updateBook(id, { rating: newRating });
    };

    const handleSaveChanges = async () => {
        try {
            await bookAPI.updateBook(id, { notes: noteInput, shelf: shelfInput });
            setBook({ ...book, notes: noteInput, shelf: shelfInput });
            
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 2000); 
        } catch (error) {
            console.error("Помилка збереження даних:", error);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2rem' }}>Завантаження... ⏳</div>;
    if (!book) return <div style={{ textAlign: 'center', padding: '50px' }}>Книгу не знайдено 😢</div>;

    return (
        <div style={{ maxWidth: '850px', margin: '0 auto', padding: '20px' }}>
            <Link to="/library" style={{ color: 'var(--primary-color)', marginBottom: '20px', display: 'inline-block', fontWeight: 'bold' }}>
                ← Повернутися до бібліотеки
            </Link>
            
            <div style={{ display: 'flex', gap: '30px', background: 'var(--card-bg)', padding: '30px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', flexWrap: 'wrap' }}>
                <img
                    src={book.coverImage}
                    alt={book.title}
                    style={{ width: '220px', height: '330px', borderRadius: 'var(--radius-md)', objectFit: 'cover', boxShadow: 'var(--shadow-sm)' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: '300px' }}>
                    <h1 style={{ color: 'var(--text-main)', marginBottom: '5px', fontSize: '2rem' }}>{book.title}</h1>
                    <h2 style={{ color: 'var(--text-muted)', marginBottom: '25px', fontSize: '1.2rem', fontWeight: 'normal' }}>{book.author}</h2>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', background: 'var(--bg-color)', padding: '20px', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
                        <div style={{ fontSize: '1.05rem' }}>
                            <strong>Серія:</strong> {book.series || 'Одиночна книга'}
                        </div>

                        <div style={{ fontSize: '1.05rem' }}>
                            <strong>Жанр:</strong> {book.genre || 'Не вказано'}
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <strong style={{ fontSize: '1.05rem' }}>Статус:</strong>
                            <select value={book.status} onChange={handleStatusChange} className="details-select">
                                <option value="В планах">В планах</option>
                                <option value="Читаю">Читаю</option>
                                <option value="Прочитано">Прочитано</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <strong style={{ fontSize: '1.05rem' }}>Оцінка:</strong>
                            <select value={book.rating} onChange={handleRatingChange} className="details-select">
                                <option value="0">Немає оцінки</option>
                                <option value="1">⭐ (1)</option>
                                <option value="2">⭐⭐ (2)</option>
                                <option value="3">⭐⭐⭐ (3)</option>
                                <option value="4">⭐⭐⭐⭐ (4)</option>
                                <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                            </select>
                        </div>
                    </div>

                    {/* БЛОК "Про книгу" (ПЕРЕНЕСЕНО ВГОРУ) */}
                    {book.description && (
                        <div style={{ marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', color: 'var(--primary-color)' }}>Про книгу:</h3>
                            <p style={{ color: 'var(--text-main)', lineHeight: '1.7', fontSize: '1.05rem', textAlign: 'justify' }}>
                                {book.description}
                            </p>
                        </div>
                    )}

                    {/* (БЛОК Відслідковування прогресу ПОВНІСТЮ ВИДАЛЕНО) */}

                    {/* БЛОК "Мої дані" (preserved below description) */}
                    <div style={{ background: 'var(--bg-color)', padding: '20px', borderRadius: 'var(--radius-md)', marginTop: 'auto' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '15px', color: 'var(--text-main)' }}>Мої дані:</h3>
                        
                        {/* Кастомна група */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                            <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>Моя підбірка:</strong>
                            <input 
                                type="text"
                                value={shelfInput}
                                onChange={(e) => setShelfInput(e.target.value)}
                                placeholder="Наприклад: На літо, Улюблені..."
                                className="details-input"
                            />
                        </div>

                        {/* Нотатки */}
                        <textarea 
                            value={noteInput}
                            onChange={(e) => setNoteInput(e.target.value)}
                            placeholder="Напиши свої думки про цю книгу..."
                            className="details-textarea"
                        />
                        <button 
                            onClick={handleSaveChanges} 
                            className={`details-btn ${isSaved ? 'saved' : ''}`}
                        >
                            {isSaved ? '✓ Збережено!' : 'Зберегти зміни'}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default BookDetails;