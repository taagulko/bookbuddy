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
        res.status(500).json({ message: 'Помилка сервера при завантаженні даних' });
    }
};

const addQuote = (req, res) => {
    try {
        const { bookTitle, text, author } = req.body;
        
        if (!bookTitle || !text) {
            return res.status(400).json({ message: 'Необхідно вказати назву книги та текст цитати' });
        }

        const data = fs.readFileSync(booksFilePath, 'utf8');
        const books = JSON.parse(data);

        const bookIndex = books.findIndex(b => 
            b.title.toLowerCase().includes(bookTitle.toLowerCase().trim())
        );

        if (bookIndex === -1) {
            return res.status(404).json({ message: 'Книгу з такою назвою не знайдено' });
        }

        const newQuote = {
            id: Date.now().toString(),
            author: author || "Анонім", 
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