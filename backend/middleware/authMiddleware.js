const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifierToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: 'Aucun jeton fourni' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Format du jeton invalide' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Jeton invalide ou expiré' });
    }

    req.user = decoded;
    next();
  });
};

module.exports = verifierToken;