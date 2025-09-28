const express = require('express');
const router = express.Router();
const forgotpasswordController = require('../controllers/forgotpasswordController');
const authMiddleware = require('../middleware/auth');


router.post('/resetpassword/:id',forgotpasswordController.resetpassword);
router.post('/', forgotpasswordController.forgotpassword);

module.exports = router;