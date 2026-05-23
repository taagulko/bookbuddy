const fs = require('fs');
const path = require('path');

const booksFilePath = path.join(__dirname, '../data/books.json');

const getBooks = (req, res) => {
    try {
        const data = fs.readFileSync(booksFilePath, 'utf8');
        res.status(200).json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера' });
    }
};

const getBookById = (req, res) => {
    try {
        const data = fs.readFileSync(booksFilePath, 'utf8');
        const books = JSON.parse(data);
        const book = books.find(b => String(b.id) === req.params.id);
        if (!book) return res.status(404).json({ message: 'Книгу не знайдено' });
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера' });
    }
};

const addBook = (req, res) => {
    try {
        const { title, author, coverImage } = req.body;
        const data = fs.readFileSync(booksFilePath, 'utf8');
        let books = JSON.parse(data);

        const newBook = {
            id: Date.now().toString(),
            title,
            author,
            coverImage,
            status: '', // Спочатку без статусу
            rating: 0,
            notes: '',
            shelf: '',
            totalPages: 0,
            readPages: 0,
            readingLog: []
        };

        books.push(newBook);
        fs.writeFileSync(booksFilePath, JSON.stringify(books, null, 2), 'utf8');
        res.status(201).json(newBook);
    } catch (error) {
        console.error('Помилка додавання:', error);
        res.status(500).json({ message: 'Помилка при додаванні книги' });
    }
};

const updateBook = (req, res) => {
    try {
        const { status, rating, notes, shelf, totalPages, readPages, readingLog } = req.body; 
        const data = fs.readFileSync(booksFilePath, 'utf8');
        let books = JSON.parse(data);
        
        const bookIndex = books.findIndex(b => String(b.id) === req.params.id);
        if (bookIndex === -1) return res.status(404).json({ message: 'Книгу не знайдено' });

        // Дозволяємо скидання статусу (порожній рядок)
        if (status !== undefined) books[bookIndex].status = status;
        
        if (rating !== undefined) books[bookIndex].rating = Number(rating);
        if (notes !== undefined) books[bookIndex].notes = notes;
        if (shelf !== undefined) books[bookIndex].shelf = shelf;
        if (totalPages !== undefined) books[bookIndex].totalPages = Number(totalPages);
        if (readPages !== undefined) books[bookIndex].readPages = Number(readPages);
        if (readingLog !== undefined) books[bookIndex].readingLog = readingLog;

        fs.writeFileSync(booksFilePath, JSON.stringify(books, null, 2), 'utf8');
        res.status(200).json(books[bookIndex]);
    } catch (error) {
        console.error('Помилка оновлення:', error);
        res.status(500).json({ message: 'Помилка оновлення книги' });
    }
};
const deleteBook = (req, res) => {
    try {
        const data = fs.readFileSync(booksFilePath, 'utf8');
        let books = JSON.parse(data);
        
        const bookIndex = books.findIndex(b => String(b.id) === req.params.id);
        if (bookIndex === -1) return res.status(404).json({ message: 'Книгу не знайдено' });

        books.splice(bookIndex, 1);
        fs.writeFileSync(booksFilePath, JSON.stringify(books, null, 2), 'utf8');
        res.status(200).json({ message: 'Книгу успішно видалено' });
    } catch (error) {
        console.error('Помилка видалення:', error);
        res.status(500).json({ message: 'Помилка сервера при видаленні книги' });
    }
};

module.exports = {
    getBooks,
    getBookById,
    addBook,
    updateBook,
    deleteBook
};