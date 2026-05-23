import React from 'react';

const ForumThread = ({ thread }) => {
    return (
        <div style={threadStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                <img src={thread.avatar} alt="avatar" style={{ width: '45px', height: '45px', borderRadius: '50%' }} />
                <div>
                    <h3 style={{ color: 'var(--text-main)' }}>{thread.title}</h3>
                    <small style={{ color: 'var(--text-muted)' }}>Автор: {thread.author}</small>
                </div>
            </div>
            <p style={{ lineHeight: '1.6' }}>{thread.content}</p>
            <div style={{ marginTop: '15px', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                Коментарів: {thread.comments.length}
            </div>
        </div>
    );
};

const threadStyle = {
    background: 'var(--card-bg)',
    padding: '20px',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-sm)',
    marginBottom: '20px'
};

export default ForumThread;