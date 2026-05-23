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

export const quoteAPI = {
    getAllQuotes: () => fetch('/api/quotes').then(res => res.json()),
    addQuote: (bookId, text) => fetch('/api/quotes/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId, text })
    }).then(res => res.json())
};