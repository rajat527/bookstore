const express = require('express');
const { createBook, updateBook, getBookById, getAllBooks, deleteBook } = require('../controllers/adminController');
const { authenticate } = require('../middlewares/authMiddleware');
const { logActivity } = require('../middlewares/activityLogger');
const router = express.Router();
const { authorizeRole } = require('../middlewares/roleMiddleware');

router.post('/books', authenticate, authorizeRole(['admin']), logActivity('CREATE_BOOK'), createBook);
router.post('/update-books/:id', authenticate, authorizeRole(['admin']), logActivity('UPDATE_BOOK'), updateBook);
router.get('/books-by-id/:id', authenticate, authorizeRole(['admin']), logActivity('Read_BOOK'), getBookById);
router.get('/my-books', authenticate, authorizeRole(['admin']), logActivity('Read_BOOK'), getAllBooks);

router.delete('/delete-books/:id', authenticate, authorizeRole(['admin']), logActivity('DELETE_BOOK'), deleteBook);

module.exports = router;
