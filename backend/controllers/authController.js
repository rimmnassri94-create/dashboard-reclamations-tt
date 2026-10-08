const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Identifiant et mot de passe requis' });
  }

  if (username !== process.env.ADMIN_USERNAME) {
    return res.status(401).json({ error: 'Identifiants incorrects' });
  }

  const motDePasseValide = bcrypt.compareSync(password, process.env.ADMIN_PASSWORD_HASH);

  if (!motDePasseValide) {
    return res.status(401).json({ error: 'Identifiants incorrects' });
  }

  const token = jwt.sign(
    { username: username },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.json({ token });
};

module.exports = { login };