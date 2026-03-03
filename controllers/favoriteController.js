const Favorite = require('../models/client/Favorite'); // ton modèle Favorite

// controllers/toggleFavorite.js
const mongoose = require('mongoose');

const toggleFavorite = async (req, res) => {
  console.log('--- toggleFavorite appelé ---');
  console.log('Body reçu :', req.body);

  try {
    const { userId, shopId, productId } = req.body;

    if (!userId || !shopId || !productId) {
      console.warn('Paramètres manquants !', { userId, shopId, productId });
      return res.status(400).json({ message: 'Missing parameters' });
    }

    const userObjId = new mongoose.Types.ObjectId(userId);
    const shopObjId = new mongoose.Types.ObjectId(shopId);
    const productObjId = new mongoose.Types.ObjectId(productId);

    // Cherche le document Favorite existant
    let favoriteDoc = await Favorite.findOne({ userId: userObjId, shopId: shopObjId });

    if (!favoriteDoc) {
      console.log('Aucun document existant, création d’un nouveau...');
      favoriteDoc = new Favorite({
        userId: userObjId,
        shopId: shopObjId,
        products: [{ productId: productObjId }]
      });
      console.log('Nouveau document Favorite créé :', favoriteDoc);
    } else {
      console.log('Document existant trouvé :', favoriteDoc);

      const index = favoriteDoc.products.findIndex(
        (p) => p.productId.toString() === productId
      );

      if (index === -1) {
        console.log(`Produit ${productId} non présent → ajout`);
        favoriteDoc.products.push({ productId: productObjId });
      } else {
        console.log(`Produit ${productId} déjà présent → suppression`);
        favoriteDoc.products.splice(index, 1);
      }
    }

    await favoriteDoc.save();
    console.log('Document sauvegardé avec succès :', favoriteDoc);

    // 🔹 Réponse au frontend
    return res.json({
      message: 'Favorite updated successfully',
      favoriteProducts: favoriteDoc.products // tous les produits favoris pour cet user + boutique
    });
    
  } catch (err) {
    console.error('Erreur dans toggleFavorite :', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Récupérer tous les favoris pour un utilisateur (optionnel: filtrer par boutique)
const getFavorites = async (req, res) => {
  const { userId } = req.params;   // pris depuis l’URL
  const { shopId } = req.query;    // optionnel

  if (!userId) return res.status(400).json({ message: 'Missing userId parameter' });

  try {
    const userObjId = new mongoose.Types.ObjectId(userId);
    let filter = { userId: userObjId };

    if (shopId) filter.shopId = new mongoose.Types.ObjectId(shopId);

    // Recherche les favoris et populate shop + products
    const favoriteDocs = await Favorite.find(filter)
      .populate('shopId')                // récupère tous les détails du shop
      .populate('products.productId');   // récupère tous les détails des produits

    // Formatage pour le front
    const favoritesResponse = favoriteDocs.map(doc => ({
      shop: doc.shopId,                  // toutes les infos du shop
      products: doc.products.map(p => ({
        ...p.productId.toObject(),       // toutes les infos du produit
        addedAt: p.addedAt               // conserve la date ajout
      }))
    }));

    return res.json({
      message: 'Favorites fetched successfully',
      favorites: favoritesResponse
    });

  } catch (err) {
    console.error('Erreur getFavorites :', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { toggleFavorite, getFavorites };
