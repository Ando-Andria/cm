const express = require('express');
const shopRoutes = require('./routes/shopRoutes'); // assure-toi que le chemin est correct

const app = express();

// Middleware pour parser JSON
app.use(express.json());

// Route test
app.get('/', (req, res) => {
  res.send('Hello MEAN backend!');
});

// Routes boutique
app.use('/api/shops', shopRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Serveur démarré sur http://localhost:${PORT}`));
