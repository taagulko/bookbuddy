import React, { useState } from 'react';

const QABox = ({ sessionId, onAsk }) => {
    const [question, setQuestion] = useState('');

    const handleSubmit = () => {
        if (!question.trim()) return;
        onAsk(sessionId, question);
        setQuestion('');
    };

    return (
        <div style={boxStyle}>
            <textarea 
                placeholder="Задайте питання автору..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                style={inputStyle}
            />
            <button onClick={handleSubmit} style={btnStyle}>Надіслати</button>
        </div>
    );
};

const boxStyle = {
    background: 'var(--bg-color)',
    padding: '20px',
    borderRadius: 'var(--radius-md)',
    marginTop: '15px'
};

const inputStyle = {
    width: '100%',
    padding: '10px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-color)',
    marginBottom: '10px',
    fontFamily: 'inherit',
    resize: 'vertical'
};

const btnStyle = {
    width: '100%',
    padding: '10px',
    background: 'var(--primary-color)',
    color: 'white',
    borderRadius: 'var(--radius-md)',
    fontWeight: 'bold'
};

export default QABox;