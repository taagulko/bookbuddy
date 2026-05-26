import React, { useState, useEffect } from 'react';
import { bookAPI } from '../services/api';
import { Link } from 'react-router-dom';
import ReadingHeatmap from '../components/ReadingHeatmap/ReadingHeatmap'; // НОВИЙ ІМПОРТ

const Home = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [totalPagesInput, setTotalPagesInput] = useState('');
    const [pagesReadToday, setPagesReadToday] = useState('');

    const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
    const [selectedPlanBookId, setSelectedPlanBookId] = useState('');

    const [isReadModalOpen, setIsReadModalOpen] = useState(false);
    const [selectedReadBookId, setSelectedReadBookId] = useState('');

    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const data = await bookAPI.getAllBooks();
                setBooks(data);
                const active = data.find(b => b.status === 'Читаю');
                if (active) setTotalPagesInput(active.totalPages || '');
            } catch (error) {
                console.error("Помилка:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, []);

    const activeBook = books.find(b => b.status === 'Читаю');
    const wantToRead = books.filter(b => b.status === 'В планах');
    const availableForPlans = books.filter(b => b.status !== 'В планах' && b.status !== 'Читаю');
    const availableForReading = books.filter(b => b.status !== 'Читаю');

    const handleUpdateTotalPages = async () => {
        if (!activeBook) return;
        const total = Number(totalPagesInput);
        if (total >= 0) {
            await bookAPI.updateBook(activeBook.id, { totalPages: total });
            setBooks(books.map(b => b.id === activeBook.id ? { ...b, totalPages: total } : b));
        }
    };

    const handleAddProgress = async () => {
        if (!activeBook) return;
        const addedPages = Number(pagesReadToday);
        if (!addedPages || addedPages <= 0) return;

        const newTotalRead = Math.min((activeBook.readPages || 0) + addedPages, activeBook.totalPages || Infinity);
        const today = new Date().toLocaleDateString('uk-UA'); 
        const newLogEntry = { date: today, pages: addedPages };
        const updatedLog = [newLogEntry, ...(activeBook.readingLog || [])]; 

        try {
            await bookAPI.updateBook(activeBook.id, { readPages: newTotalRead, readingLog: updatedLog });
            setBooks(books.map(b => b.id === activeBook.id ? { ...b, readPages: newTotalRead, readingLog: updatedLog } : b));
            setPagesReadToday(''); 
        } catch (error) {
            console.error(error);
        }
    };

    const changeStatus = async (bookId, newStatus) => {
        try {
            await bookAPI.updateBook(bookId, { status: newStatus });
            setBooks(books.map(b => b.id === bookId ? { ...b, status: newStatus } : b));
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddBookToPlans = async () => {
        if (!selectedPlanBookId) return alert("Оберіть книгу!");
        await changeStatus(selectedPlanBookId, 'В планах');
        setIsPlanModalOpen(false);
        setSelectedPlanBookId('');
    };

    const handleStartReading = async () => {
        if (!selectedReadBookId) return alert("Оберіть книгу!");
        try {
            if (activeBook) await bookAPI.updateBook(activeBook.id, { status: 'Призупинено' });
            await bookAPI.updateBook(selectedReadBookId, { status: 'Читаю' });

            setBooks(books.map(b => {
                if (activeBook && b.id === activeBook.id) return { ...b, status: 'Призупинено' };
                if (b.id === selectedReadBookId) return { ...b, status: 'Читаю' };
                return b;
            }));

            const newActive = books.find(b => b.id === selectedReadBookId);
            setTotalPagesInput(newActive?.totalPages || '');
            setIsReadModalOpen(false);
            setSelectedReadBookId('');
        } catch (error) {
            console.error(error);
        }
    };

    const logMap = React.useMemo(() => {
        const map = {};
        books.forEach(b => {
            if (b.readingLog) {
                b.readingLog.forEach(log => {
                    if (!map[log.date]) {
                        map[log.date] = b.coverImage; 
                    }
                });
            }
        });
        return map;
    }, [books]);

    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    let firstDayIndex = new Date(year, month, 1).getDay() - 1;
    if (firstDayIndex === -1) firstDayIndex = 6; 

    const monthNames = ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"];

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Завантаження дашборду... ⏳</div>;

    const progressPercent = activeBook && activeBook.totalPages > 0 ? Math.round(((activeBook.readPages || 0) / activeBook.totalPages) * 100) : 0;

    return (
        <div className="main-content">
            
            <section className="dash-section">
                <div className="dash-section-title">
                    <span>Зараз читаю 📖</span>
                    <button className="details-btn" onClick={() => setIsReadModalOpen(true)}>➕ Почати книгу</button>
                </div>
                
                {activeBook ? (
                    <div className="currently-reading-card">
                        <Link to={`/book/${activeBook.id}`}>
                            <img src={activeBook.coverImage} alt={activeBook.title} className="dash-book-cover" />
                        </Link>
                        
                        <div className="dash-book-info">
                            <h3 style={{fontSize: '1.8rem', marginBottom: '5px'}}>{activeBook.title}</h3>
                            <h4 style={{color: 'var(--text-muted)', fontWeight: 'normal'}}>{activeBook.author}</h4>
                            
                            <div className="dash-actions">
                                <button className="action-btn" onClick={() => changeStatus(activeBook.id, 'Призупинено')}>⏸️ Призупинити</button>
                                <button className="action-btn" onClick={() => changeStatus(activeBook.id, 'Покинуто')}>🛑 Покинути</button>
                            </div>

                            <div className="progress-container">
                                <div className="progress-inputs">
                                    <span style={{ fontSize: '0.95rem' }}>Всього сторінок:</span>
                                    <input type="number" value={totalPagesInput} onChange={(e) => setTotalPagesInput(e.target.value)} className="small-input" />
                                    <button onClick={handleUpdateTotalPages} className="details-btn" style={{ padding: '6px 12px' }}>Зберегти</button>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                    <span>Прочитано: {activeBook.readPages || 0} стор.</span>
                                    <span>{progressPercent}%</span>
                                </div>
                                <div className="progress-bar-bg">
                                    <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
                                </div>

                                <div className="progress-inputs" style={{ marginTop: '15px' }}>
                                    <span style={{ fontSize: '0.95rem' }}>Прочитано сьогодні:</span>
                                    <input type="number" value={pagesReadToday} onChange={(e) => setPagesReadToday(e.target.value)} className="small-input" placeholder="+ стор." />
                                    <button onClick={handleAddProgress} className="details-btn" style={{ padding: '6px 12px', background: '#28a745' }}>Додати прогрес</button>
                                </div>

                                {activeBook.readingLog && activeBook.readingLog.length > 0 && (
                                    <div style={{ marginTop: '15px', maxHeight: '100px', overflowY: 'auto' }}>
                                        {activeBook.readingLog.map((log, index) => (
                                            <div key={index} className="session-item">
                                                <span style={{ color: 'var(--text-muted)' }}>{log.date}</span>
                                                <strong style={{ color: 'var(--text-main)' }}>+{log.pages} стор.</strong>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div style={{ padding: '40px', textAlign: 'center', background: 'var(--card-bg)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
                        <p style={{fontStyle: 'italic', color: 'var(--text-muted)', marginBottom: '15px'}}>Зараз ви нічого не читаєте.</p>
                        <button className="details-btn" onClick={() => setIsReadModalOpen(true)}>Почати нову книгу</button>
                    </div>
                )}
            </section>

            {/* ВСТАВКА ТЕПЛОВОЇ КАРТИ */}
            <ReadingHeatmap books={books} />

            <section className="dash-section">
                <div className="calendar-full">
                    <div className="calendar-header-actions">
                        <button className="cal-nav-btn" onClick={prevMonth}>← Минулий</button>
                        <div className="cal-month-title">{monthNames[month]} {year}</div>
                        <button className="cal-nav-btn" onClick={nextMonth}>Наступний →</button>
                    </div>

                    <div className="calendar-grid-full">
                        <div className="calendar-day-header">ПН</div><div className="calendar-day-header">ВТ</div>
                        <div className="calendar-day-header">СР</div><div className="calendar-day-header">ЧТ</div>
                        <div className="calendar-day-header">ПТ</div><div className="calendar-day-header">СБ</div>
                        <div className="calendar-day-header">НД</div>
                        
                        {[...Array(firstDayIndex)].map((_, i) => <div key={`empty-${i}`}></div>)}
                        
                        {[...Array(daysInMonth)].map((_, i) => {
                            const day = i + 1;
                            const dateStr = `${String(day).padStart(2, '0')}.${String(month + 1).padStart(2, '0')}.${year}`;
                            const coverImage = logMap[dateStr]; 

                            return (
                                <div key={day} className={`cal-day ${coverImage ? 'active' : ''}`}>
                                    {coverImage && <img src={coverImage} alt="cover" />}
                                    <span>{day}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="dash-section">
                <div className="dash-section-title">
                    <span>Хочу прочитати 📌</span>
                    <button className="details-btn" onClick={() => setIsPlanModalOpen(true)}>➕ Додати книгу</button>
                </div>
                
                <div className="board-grid">
                    {wantToRead.length > 0 ? (
                        wantToRead.map(book => (
                            <div key={book.id} className="board-card">
                                <button className="board-remove-btn" onClick={() => changeStatus(book.id, '')} title="Прибрати з дошки">✕</button>
                                <Link to={`/book/${book.id}`}>
                                    <img src={book.coverImage} alt={book.title} className="board-img" />
                                </Link>
                                <div className="board-title" title={book.title}>{book.title}</div>
                            </div>
                        ))
                    ) : (
                        <p style={{fontStyle: 'italic', color: 'var(--text-muted)'}}>Ваша дошка планів порожня.</p>
                    )}
                </div>
            </section>

            {isPlanModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 style={{ marginBottom: '20px' }}>Додати на дошку планів</h2>
                        <div className="modal-form-group">
                            <label>Оберіть книгу з бібліотеки:</label>
                            <select className="details-select" style={{ width: '100%', padding: '10px' }} value={selectedPlanBookId} onChange={(e) => setSelectedPlanBookId(e.target.value)}>
                                <option value="">-- Виберіть книгу --</option>
                                {availableForPlans.map(b => <option key={b.id} value={b.id}>{b.title} ({b.author})</option>)}
                            </select>
                        </div>
                        <div className="modal-actions">
                            <button onClick={() => setIsPlanModalOpen(false)} style={{ color: '#dc3545', fontWeight: 'bold' }}>Скасувати</button>
                            <button onClick={handleAddBookToPlans} className="details-btn" disabled={!selectedPlanBookId} style={{ opacity: selectedPlanBookId ? 1 : 0.5 }}>Додати в плани</button>
                        </div>
                    </div>
                </div>
            )}

            {isReadModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 style={{ marginBottom: '20px' }}>Почати читати книгу</h2>
                        <div className="modal-form-group">
                            <label>Оберіть книгу:</label>
                            <select className="details-select" style={{ width: '100%', padding: '10px' }} value={selectedReadBookId} onChange={(e) => setSelectedReadBookId(e.target.value)}>
                                <option value="">-- Виберіть книгу --</option>
                                {availableForReading.map(b => <option key={b.id} value={b.id}>{b.title} ({b.author})</option>)}
                            </select>
                        </div>
                        <div className="modal-actions">
                            <button onClick={() => setIsReadModalOpen(false)} style={{ color: '#dc3545', fontWeight: 'bold' }}>Скасувати</button>
                            <button onClick={handleStartReading} className="details-btn" disabled={!selectedReadBookId} style={{ background: '#28a745', opacity: selectedReadBookId ? 1 : 0.5 }}>Почати!</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Home;