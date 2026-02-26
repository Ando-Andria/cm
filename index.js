const express = require('express');
const authRoutes = require('./routes/authRoutes');
const lotRoutes = require("./routes/lotRoutes");
const boutiqueRoutes = require("./routes/boutiqueRoutes");

const app = express();

// Middleware pour parser JSON
app.use(express.json());

// Route test
app.get('/', (req, res) => {
  res.send('Hello MEAN backend!');
});

// Routes boutique
app.use('/api/auth', authRoutes);
app.use("/api/lots", lotRoutes);
app.use("/api/boutiques", boutiqueRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Serveur démarré sur http://localhost:${PORT}`));
