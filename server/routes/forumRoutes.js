const express = require('express');
const router = express.Router();
const { getForumData, addComment, addQuestion } = require('../controllers/forumController');

// Отримати всі дані форуму (гілки та QA-сесії)
router.get('/', getForumData);

// Додати новий коментар у гілку
router.post('/comment', addComment);

// Додати нове питання для автора
router.post('/question', addQuestion);

module.exports = router;