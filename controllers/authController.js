const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AppDataSource = require('../utils/db');
const Session = require('../models/Session');
const User = require('../models/User');
require('dotenv').config();
const emailService = require('../services/emailService');


exports.loginUser = async (req, res) => {
    try{
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }
  const userRepository = AppDataSource.getRepository(User);
  const sessionRepository = AppDataSource.getRepository(Session);

  const user = await userRepository.findOne({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // Token is valid only for 12 hours
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '12h' });

  // Invalidate previous sessions
  await sessionRepository.delete({ userId: user.id });

  // Store new session
  const session = sessionRepository.create({ userId: user.id, token });
  await sessionRepository.save(session);

  res.status(200).json({ token });
 } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.forgotPassword = async (req, res) => {
  try{
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'email is required.' });

  }
  const userRepository = AppDataSource.getRepository(User);
  const sessionRepository = AppDataSource.getRepository(Session);

  const user = await userRepository.findOne({ where: { email } });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const token = crypto.randomBytes(32).toString('hex');

  const expiresIn = Date.now() + 3600000; // 1 hour expiry
  await sessionRepository.save({ userId: user.id, token, expiresIn });

  await emailService.resetPasswordMailService('Password Reset Request', { token }, email);

  res.json({ message: 'Reset password email sent' });
 } catch (error) {
    console.error('Error processing forgot password request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.resetPassword = async (req, res) => {
  try{
  const { token, newPassword } = req.body;
  if (!token ||  !newPassword) {
    return res.status(400).json({ message: 'Token and newPassword is required.' });

  }
  const userRepository = AppDataSource.getRepository(User);
  const sessionRepository = AppDataSource.getRepository(Session);

  const tokenRecord = await sessionRepository.findOne({ where: { token } });
  if (!tokenRecord || tokenRecord.expiresIn < Date.now()) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }

  const user = await userRepository.findOne({ where: { id: tokenRecord.userId } });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await userRepository.update(user.id, { password: hashedPassword });

  await sessionRepository.delete({ id: tokenRecord.id });

  res.json({ message: 'Password reset successfully' });
} catch (error) {
  console.error('Error resetting password:', error);
  res.status(500).json({ message: 'Internal server error' });
}
};

