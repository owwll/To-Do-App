import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

const serializeUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
});

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ message: 'Name must be at least 2 characters' });
    }

    if (!email || !EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    const token = signToken(user._id.toString());
    return res.status(201).json({ token, user: serializeUser(user) });
  } catch {
    return res.status(500).json({ message: 'Something went wrong during registration' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = signToken(user._id.toString());
    return res.status(200).json({ token, user: serializeUser(user) });
  } catch {
    return res.status(500).json({ message: 'Something went wrong during login' });
  }
};

export const me = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ user: serializeUser(user) });
  } catch {
    return res.status(500).json({ message: 'Failed to fetch user profile' });
  }
};
