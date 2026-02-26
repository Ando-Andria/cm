const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const lotRoutes = require("./routes/lotRoutes");
const boutiqueRoutes = require("./routes/boutiqueRoutes");



console.log('Démarrage du serveur...');
// Charger les variables d'environnement
dotenv.config();


console.log('Mongo URI:', process.env.MONGO_URI);

// Connecter à la base de données
connectDB();

console.log('Démarrage du serveur...');
console.log('Mongo URI ;', process.env.MONGO_URI);

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use("/api/lots", lotRoutes);
app.use("/api/boutiques", boutiqueRoutes);
app.use("/api/contrats", require('./routes/contratRoutes'));
app.use(notFound);
app.use(errorHandler);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});