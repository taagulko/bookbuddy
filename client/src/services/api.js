const BASE_URL = 'http://localhost:5000/api';

const fetchFromAPI = async (endpoint, options = {}) => {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, options);
        if (!response.ok) {
            throw new Error(`Помилка: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Помилка при запиті до API:', error);
        throw error;
    }
};

export const bookAPI = {
    getAllBooks: () => fetchFromAPI('/books'),
    getBookById: (id) => fetchFromAPI(`/books/${id}`),
    // НОВИЙ МЕТОД ДЛЯ ДОДАВАННЯ КНИГИ
    addBook: (newBook) => fetchFromAPI('/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBook)
    }),
    updateBook: (id, updates) => fetchFromAPI(`/books/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
    }),
    deleteBook: (id) => fetchFromAPI(`/books/${id}`, {
        method: 'DELETE'
    })
};

export const forumAPI = {
    getForumData: () => fetchFromAPI('/forum'),
    addComment: (threadId, text) => fetchFromAPI('/forum/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threadId, text })
    }),
    addQuestion: (sessionId, question) => fetchFromAPI('/forum/question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, question })
    })
};