// createUser.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const User = require('./models/boutique/User');

dotenv.config();

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/centrecommercial')
  .then(() => console.log('MongoDB connecté'))
  .catch(err => console.error('Erreur MongoDB :', err));

async function createShopAndUser() {
  try {
    // 2️⃣ Hasher le mot de passe de l'utilisateur
    const password = '123456';
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Créer l'utilisateur et lier au shop via shopId
    const newUser = new User({
      email: 'shop@mail.com',
      password: hashedPassword,
      shop: '698b04d85bfcbccb80e5e06a'  // 🔹 ici on met le shopId pour lier l'utilisateur à la boutique
    });
    await newUser.save();

    console.log('Utilisateur créé avec id :', newUser._id);

  } catch (err) {
    console.error('Erreur création shop/user :', err);
  } finally {
    mongoose.connection.close(); // ferme la connexion proprement
  }
}

// Appel de la fonction
createShopAndUser();