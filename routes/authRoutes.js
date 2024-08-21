const express = require('express');
const { loginUser, forgotPassword,resetPassword } = require('../controllers/authController');
const router = express.Router();

router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
