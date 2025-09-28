const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// Public routes (no authentication required)
router.post('/signup', userController.signup);
router.post('/login', userController.login);

// Protected routes (authentication required)
router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);
router.delete('/account', auth, userController.deleteAccount);

module.exports = router;
