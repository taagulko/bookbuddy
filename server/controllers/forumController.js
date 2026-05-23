const fs = require('fs');
const path = require('path');

// Шлях до бази даних форуму та QA
const forumFilePath = path.join(__dirname, '../data/forum.json');

// Отримати всі гілки обговорень та QA-сесії
const getForumData = (req, res) => {
    try {
        const data = fs.readFileSync(forumFilePath, 'utf8');
        const forum = JSON.parse(data);
        res.status(200).json(forum);
    } catch (error) {
        console.error('Помилка читання forum.json:', error);
        res.status(500).json({ message: 'Помилка сервера при завантаженні форуму' });
    }
};

// Додати новий коментар у гілку форуму
const addComment = (req, res) => {
    try {
        const { threadId, text } = req.body;
        const data = fs.readFileSync(forumFilePath, 'utf8');
        const forum = JSON.parse(data);

        // Шукаємо потрібну гілку обговорення
        const threadIndex = forum.threads.findIndex(t => String(t.id) === String(threadId));

        if (threadIndex === -1) {
            return res.status(404).json({ message: 'Гілку обговорення не знайдено' });
        }

        // Створюємо новий коментар із захардкодженим профілем
        const newComment = {
            id: Date.now().toString(),
            author: "Taisiia",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Taisiia&backgroundColor=f4f1ea",
            text: text,
            date: new Date().toISOString()
        };

        // Додаємо коментар і перезаписуємо файл
        forum.threads[threadIndex].comments.push(newComment);
        fs.writeFileSync(forumFilePath, JSON.stringify(forum, null, 2), 'utf8');

        res.status(201).json(newComment);
    } catch (error) {
        console.error('Помилка додавання коментаря:', error);
        res.status(500).json({ message: 'Помилка сервера при збереженні коментаря' });
    }
};

// Додати питання автору на QA-сесію
const addQuestion = (req, res) => {
    try {
        const { sessionId, question } = req.body;
        const data = fs.readFileSync(forumFilePath, 'utf8');
        const forum = JSON.parse(data);

        const sessionIndex = forum.qaSessions.findIndex(s => String(s.id) === String(sessionId));

        if (sessionIndex === -1) {
            return res.status(404).json({ message: 'QA сесію не знайдено' });
        }

        const newQuestion = {
            id: Date.now().toString(),
            author: "Taisiia",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Taisiia&backgroundColor=f4f1ea",
            text: question,
            upvotes: 0 // Початкова кількість лайків
        };

        forum.qaSessions[sessionIndex].questions.push(newQuestion);
        fs.writeFileSync(forumFilePath, JSON.stringify(forum, null, 2), 'utf8');

        res.status(201).json(newQuestion);
    } catch (error) {
        console.error('Помилка додавання питання:', error);
        res.status(500).json({ message: 'Помилка сервера при збереженні питання' });
    }
};

module.exports = {
    getForumData,
    addComment,
    addQuestion
};