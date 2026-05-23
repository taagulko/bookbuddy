const express = require('express');
const cors = require('cors');
const booksRoutes = require('./routes/booksRoutes');
const forumRoutes = require('./routes/forumRoutes');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Дозволяємо запити з фронтенду
app.use(express.json()); // Дозволяємо серверу розуміти JSON формат

// Підключення маршрутів
app.use('/api/books', booksRoutes);
app.use('/api/forum', forumRoutes);

// Базовий маршрут
app.get('/', (req, res) => {
    res.send('API для BookBuddy працює!');
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущено на порту ${PORT}`);
    console.log(`Для перевірки книг перейдіть: http://localhost:${PORT}/api/books`);
});