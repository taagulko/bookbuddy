const express = require('express');
const router = express.Router();
const quoteController = require('../controllers/quoteController'); 

router.get('/', quoteController.getQuotesData);
router.post('/add', quoteController.addQuote);

module.exports = router;