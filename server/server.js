const express = require('express');
const cors = require('cors');
const booksRoutes = require('./routes/booksRoutes');
const quoteRoutes = require('./routes/quoteRoutes'); 

const app = express();
const PORT = 5000;

app.use(cors()); 
app.use(express.json()); 

app.use('/api/books', booksRoutes);
app.use('/api/quotes', quoteRoutes); 
app.get('/', (req, res) => {
    res.send('API для BookBuddy працює!');
});

app.listen(PORT, () => {
    console.log(`Сервер запущено на порту ${PORT}`);
    console.log(`Для перевірки книг перейдіть: http://localhost:${PORT}/api/books`);
});