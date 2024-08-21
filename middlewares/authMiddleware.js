const jwt = require('jsonwebtoken');
require('dotenv').config();
const AppDataSource = require('../utils/db');
const Session = require('../models/Session');

exports.authenticate = async (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
  
      const sessionRepository = AppDataSource.getRepository(Session);
      const session = await sessionRepository.findOne({ where: { userId: decoded.id, token } });
  
      if (!session) {
        return res.status(403).json({ message: 'Session expired. Please login again.' });
      }
  
      next();
    } catch (ex) {
        console.log("== ex====",ex)
      res.status(400).json({ message: 'Invalid token.' });
    }
  };
  

