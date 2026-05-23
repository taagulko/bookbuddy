import React, { useState, useEffect } from 'react';
import { forumAPI } from '../services/api';

const Forum = () => {
    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [commentInputs, setCommentInputs] = useState({}); // Зберігає текст для кожного інпута окремо

    // Завантажуємо форум при відкритті сторінки
    useEffect(() => {
        loadForumData();
    }, []);

    const loadForumData = async () => {
        try {
            const data = await forumAPI.getForumData();
            setThreads(data.threads || []);
        } catch (error) {
            console.error("Помилка завантаження форуму:", error);
        } finally {
            setLoading(false);
        }
    };

    // Відправка коментаря
    const handleAddComment = async (threadId) => {
        const text = commentInputs[threadId];
        if (!text || text.trim() === '') return;

        try {
            await forumAPI.addComment(threadId, text);
            setCommentInputs(prev => ({ ...prev, [threadId]: '' })); // Очищаємо інпут
            loadForumData(); // Перезавантажуємо форум, щоб побачити свій комент
        } catch (error) {
            console.error("Помилка відправки коментаря:", error);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Завантаження обговорень... ⏳</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <h1 style={{ color: 'var(--primary-color)', marginBottom: '30px', textAlign: 'center', fontSize: '2.2rem' }}>Книжковий форум 💬</h1>
            
            {threads.map(thread => (
                <div key={thread.id} style={{ background: 'var(--card-bg)', padding: '25px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', marginBottom: '30px' }}>
                    
                    {/* Шапка обговорення */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                        <img src={thread.avatar} alt="avatar" style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--bg-color)' }} />
                        <div>
                            <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '4px' }}>{thread.title}</h2>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Автор: <strong>{thread.author}</strong> | Тег: <span style={{ color: 'var(--primary-color)' }}>#{thread.bookTag}</span></span>
                        </div>
                    </div>
                    
                    {/* Текст поста */}
                    <p style={{ fontSize: '1.1rem', marginBottom: '25px', lineHeight: '1.6' }}>{thread.content}</p>
                    
                    {/* Секція коментарів */}
                    <div style={{ background: 'var(--bg-color)', padding: '20px', borderRadius: 'var(--radius-md)' }}>
                        <h4 style={{ marginBottom: '20px', color: 'var(--text-main)' }}>Коментарі ({thread.comments.length})</h4>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
                            {thread.comments.map(comment => (
                                <div key={comment.id} style={{ display: 'flex', gap: '12px', background: 'var(--card-bg)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                                    <img src={comment.avatar} alt="avatar" style={{ width: '35px', height: '35px', borderRadius: '50%', background: 'var(--bg-color)' }} />
                                    <div>
                                        <strong style={{ fontSize: '0.95rem', color: 'var(--primary-color)' }}>{comment.author}</strong>
                                        <p style={{ fontSize: '0.95rem', marginTop: '4px', color: 'var(--text-main)' }}>{comment.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Поле для нового коментаря */}
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input 
                                type="text" 
                                placeholder="Написати коментар..." 
                                value={commentInputs[thread.id] || ''}
                                onChange={(e) => setCommentInputs(prev => ({ ...prev, [thread.id]: e.target.value }))}
                                style={{ flex: 1, padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', outline: 'none', fontFamily: 'inherit' }}
                            />
                            <button 
                                onClick={() => handleAddComment(thread.id)}
                                style={{ padding: '0 24px', backgroundColor: 'var(--primary-color)', color: 'white', borderRadius: 'var(--radius-md)', fontWeight: 'bold' }}
                            >
                                Відправити
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Forum;