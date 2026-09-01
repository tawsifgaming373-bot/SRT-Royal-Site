const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { isValidEmail, requireString } = require('../middleware/validation');

function sanitizeUser(user) {
  const doc = user.toObject ? user.toObject() : user;
  const { passwordHash, __v, ...safeUser } = doc;
  return safeUser;
}

function signToken(user) {
  return jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET || 'development-secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

async function signup(req, res, next) {
  try {
    const { name, email, password, role = 'client', company } = req.body;

    if (!name || !email || !password || !isValidEmail(email)) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    }

    const normalizedEmail = requireString(email, 'Email', { max: 254 }).toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    const validRoles = ['client', 'designer', 'admin'];
    const requestedRole = String(role).toLowerCase();
    const assignedRole = requestedRole === 'admin' && process.env.NODE_ENV !== 'test'
      ? 'client'
      : (validRoles.includes(requestedRole) ? requestedRole : 'client');

    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      passwordHash: await bcrypt.hash(password, 12),
      role: assignedRole,
      company: company ? String(company).trim() : '',
    });

    const token = signToken(user);
    return res.status(201).json({ token, user: sanitizeUser(user) });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: String(email).trim().toLowerCase() });
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = signToken(user);
    return res.json({ token, user: sanitizeUser(user) });
  } catch (error) {
    return next(error);
  }
}

module.exports = { signup, login, sanitizeUser, signToken };
