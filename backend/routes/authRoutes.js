const express = require('express');
const router = express.Router();
const { syncUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/auth/sync
router.post('/sync', protect, syncUser);

module.exports = router;