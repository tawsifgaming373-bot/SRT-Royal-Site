const express = require('express');
const { signup, login } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', (req, res) => res.json({ message: 'Logged out successfully.' }));

module.exports = router;
