const express = require('express');
const { addUser, approveReject } = require('../controllers/superAdminController');
const { authenticate } = require('../middlewares/authMiddleware');
const { authorizeRole } = require('../middlewares/roleMiddleware');

const router = express.Router();

router.post('/add-user', authenticate, authorizeRole(['superadmin']), addUser);
router.put('/approve-reject/:id', authenticate, authorizeRole(['superadmin']), approveReject);


module.exports = router;