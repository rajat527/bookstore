// routes/userRoutes.js
const express = require('express');
const { purchaseBook,getAllBooks } = require('../controllers/userController');
const { authenticate } = require('../middlewares/authMiddleware');
const { logActivity } = require('../middlewares/activityLogger');
const router = express.Router();

router.post('/purchase', authenticate, logActivity('PURCHASE_BOOK'), purchaseBook);
router.get('/get-all-approved-book-deatils', authenticate, logActivity('READ_BOOK_DETAILS'), getAllBooks);


module.exports = router;
