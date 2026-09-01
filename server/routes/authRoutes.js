const express = require('express');
const { signup, login, forgotPassword, resetPassword } = require('../controllers/authController');
const { googleAuth, googleCallback, githubAuth, githubCallback } = require('../controllers/oauthController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', (req, res) => res.json({ message: 'Logged out successfully.' }));
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);
router.get('/github', githubAuth);
router.get('/github/callback', githubCallback);

module.exports = router;
