const express = require('express');
const router = express.Router();
// Обов'язково додаємо addBook у цей список імпорту:
const { getBooks, getBookById, addBook, updateBook, deleteBook } = require('../controllers/booksController');

router.get('/', getBooks);
router.get('/:id', getBookById);
router.post('/', addBook);    // Тепер функція відома, бо ми її імпортували вище
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);

module.exports = router;