const ProductRating = require('../models/client/Rating');
const Product = require('../models/boutique/Products');

exports.rateProduct = async (req, res) => {
  try {
    const { productId, customerId, rating } = req.body;

    if (!productId || !customerId || !rating) return res.status(400).json({ error: 'Données manquantes' });

    if (rating < 1 || rating > 5) return res.status(400).json({ error: 'Note invalide' });

    // Vérifie si l'utilisateur a déjà voté
    let existing = await ProductRating.findOne({ productId, customerId });

    if (existing) {
      existing.rating = rating;
      existing.date = new Date();
      await existing.save();
    } else {
      await ProductRating.create({ productId, customerId, rating });
    }

    // Calculer la note moyenne
    const ratings = await ProductRating.find({ productId });
    const avgRating = ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length;

    res.status(200).json({ avgRating, totalVotes: ratings.length });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};