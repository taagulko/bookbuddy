import React, { useState, useEffect } from 'react';
import { forumAPI } from '../services/api';

const QASessions = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [questionInputs, setQuestionInputs] = useState({});

    useEffect(() => {
        loadQA();
    }, []);

    const loadQA = async () => {
        try {
            const data = await forumAPI.getForumData();
            setSessions(data.qaSessions || []);
        } catch (error) {
            console.error("Помилка QA:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAsk = async (sessionId) => {
        const text = questionInputs[sessionId];
        if (!text || text.trim() === '') return;

        try {
            await forumAPI.addQuestion(sessionId, text);
            setQuestionInputs(prev => ({ ...prev, [sessionId]: '' }));
            loadQA(); // Оновлюємо список питань
        } catch (error) {
            console.error("Помилка відправки питання:", error);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Завантаження сесій... ⏳</div>;

    return (
        <div style={{ maxWidth: '850px', margin: '0 auto', padding: '20px' }}>
            <h1 style={{ color: 'var(--primary-color)', textAlign: 'center', marginBottom: '40px', fontSize: '2.2rem' }}>
                Зустрічі з авторами ✍️
            </h1>

            {sessions.map(session => (
                <div key={session.id} style={{ background: 'var(--card-bg)', padding: '30px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', marginBottom: '40px' }}>
                    <div style={{ borderBottom: '2px solid var(--bg-color)', paddingBottom: '15px', marginBottom: '20px' }}>
                        <h2 style={{ color: 'var(--primary-color)' }}>{session.authorName}</h2>
                        <p style={{ color: 'var(--text-muted)' }}>Тема: <strong>{session.bookFocus}</strong></p>
                        <p style={{ fontSize: '0.9rem', marginTop: '5px' }}>📅 Дата: {new Date(session.date).toLocaleDateString('uk-UA')}</p>
                    </div>

                    <div style={{ marginBottom: '25px' }}>
                        <h4 style={{ marginBottom: '15px' }}>Поставлене питання ({session.questions.length}):</h4>
                        {session.questions.map(q => (
                            <div key={q.id} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '10px', background: 'var(--bg-color)', borderRadius: 'var(--radius-md)', marginBottom: '10px' }}>
                                <img src={q.avatar} alt="user" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: '1rem' }}>{q.text}</p>
                                    <small style={{ color: 'var(--text-muted)' }}>Від: {q.author}</small>
                                </div>
                                <div style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>👍 {q.upvotes}</div>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input 
                            type="text" 
                            placeholder="Ваше запитання автору..."
                            value={questionInputs[session.id] || ''}
                            onChange={(e) => setQuestionInputs(prev => ({ ...prev, [session.id]: e.target.value }))}
                            style={{ flex: 1, padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontFamily: 'inherit' }}
                        />
                        <button 
                            onClick={() => handleAsk(session.id)}
                            style={{ padding: '0 25px', background: 'var(--primary-color)', color: 'white', borderRadius: 'var(--radius-md)', fontWeight: 'bold' }}
                        >
                            Запитати
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default QASessions;