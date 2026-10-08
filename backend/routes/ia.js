const express = require('express');
const router = express.Router();
const { analyserDescription } = require('../controllers/iaController');
const verifierToken = require('../middleware/authMiddleware');

router.post('/analyser', verifierToken, analyserDescription);

module.exports = router;