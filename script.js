// fixCategoryIds.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Shop = require('./models/boutique/Shop'); // ton modèle Shop

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connecté'))
  .catch(err => console.error('Erreur de connexion :', err));

const fixCategoryIds = async () => {
  try {
    console.log('--- Début fixCategoryIds ---');

    const ObjectId = mongoose.Types.ObjectId;

    // Récupérer tous les shops
    const shops = await Shop.find();
    console.log(`Nombre de shops trouvés : ${shops.length}`);

    for (const shop of shops) {
      // Vérifier si categoryId est un string
      if (shop.categoryId && typeof shop.categoryId === 'string') {
        console.log(`Conversion shop ${shop.name} : ${shop.categoryId} => ObjectId`);
        shop.categoryId = new ObjectId(shop.categoryId);
        await shop.save();
      }
    }

    console.log('✅ Tous les categoryId ont été corrigés.');
    console.log('--- Fin fixCategoryIds ---');
  } catch (err) {
    console.error('❌ Erreur :', err);
  } finally {
    mongoose.disconnect();
  }
};

fixCategoryIds();