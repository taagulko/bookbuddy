const fs = require('fs');
const path = require('path');

const booksFilePath = path.join(__dirname, '../data/books.json');

const getQuotesData = (req, res) => {
    try {
        const data = fs.readFileSync(booksFilePath, 'utf8');
        const books = JSON.parse(data);
        res.status(200).json(books);
    } catch (error) {
        console.error('Помилка читання books.json:', error);
        res.status(500).json({ message: 'Помилка сервера при завантаженні цитат' });
    }
};

const addQuote = (req, res) => {
    try {
        const { bookId, text } = req.body;
        const data = fs.readFileSync(booksFilePath, 'utf8');
        const books = JSON.parse(data);

        const bookIndex = books.findIndex(b => String(b.id) === String(bookId));

        if (bookIndex === -1) {
            return res.status(404).json({ message: 'Книгу не знайдено' });
        }

        const newQuote = {
            id: Date.now().toString(),
            author: "Taisiia", 
            text: text,
            date: new Date().toISOString()
        };

        if (!books[bookIndex].quotes) {
            books[bookIndex].quotes = [];
        }

        books[bookIndex].quotes.push(newQuote);
        fs.writeFileSync(booksFilePath, JSON.stringify(books, null, 2), 'utf8');

        res.status(201).json(newQuote);
    } catch (error) {
        console.error('Помилка додавання цитати:', error);
        res.status(500).json({ message: 'Помилка сервера при збереженні цитати' });
    }
};

module.exports = {
    getQuotesData,
    addQuote
};