const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function protect(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Members only. Please sign in.' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id);
    if (!user) {
      return res.status(401).json({ message: 'Account no longer exists.' });
    }
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'Session expired. Sign in again.' });
  }
}

module.exports = { protect };
