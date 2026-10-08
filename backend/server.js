const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API Dashboard TT en ligne !');
});

const reclamationsRoutes = require('./routes/reclamations');
app.use('/api/reclamations', reclamationsRoutes);

const statsRoutes = require('./routes/stats');
app.use('/api/stats', statsRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
const iaRoutes = require('./routes/ia');
app.use('/api/ia', iaRoutes);