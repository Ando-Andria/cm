// controllers/promotionController.js
const Promotion = require('../models/boutique/Promotion');

exports.createPromotion = async (req, res) => {
  try {
    const { productId, shopId, title, description, discountPercent, startDate, endDate } = req.body;

    // Validation simple
    if (!productId || !shopId || !title || !discountPercent || !startDate || !endDate) {
      return res.status(400).json({ error: 'Tous les champs obligatoires doivent être remplis' });
    }

    const promotion = await Promotion.create({
      productId,
      shopId,
      title,
      description,
      discountPercent,
      startDate,
      endDate
    });

    res.status(201).json(promotion);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPromotionsByShop = async (req, res) => {
  try {
    const { shopId } = req.params;
    const promotions = await Promotion.find({ shopId }).populate('productId', 'name price');
    res.status(200).json(promotions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPromotions = async (req, res) => {
  try {
    // Récupération uniquement des promotions actives
    const promotions = await Promotion.find({ status: 'active' })
      .populate({
        path: 'productId',
        select: 'name price description shopId',
        populate: {
          path: 'shopId',
          select: 'name email website unitNumber floor'
        }
      });

    // On transforme la réponse pour ne renvoyer que l'essentiel
    const result = promotions.map(promo => ({
      _id: promo._id,
      title: promo.title,
      description: promo.description,
      discountPercent: promo.discountPercent,
      startDate: promo.startDate,
      endDate: promo.endDate,
      product: promo.productId
        ? {
            _id: promo.productId._id,
            name: promo.productId.name,
            price: promo.productId.price,
            description: promo.productId.description,
            shop: promo.productId.shopId
              ? {
                  _id: promo.productId.shopId._id,
                  name: promo.productId.shopId.name,
                  email: promo.productId.shopId.email,
                  website: promo.productId.shopId.website,
                  unitNumber: promo.productId.shopId.unitNumber,
                  floor: promo.productId.shopId.floor
                }
              : null
          }
        : null
    }));

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePromotion = async (req, res) => {
  try {
    const { id } = req.params;
    const promotion = await Promotion.findByIdAndDelete(id);
    if (!promotion) return res.status(404).json({ error: 'Promotion not found' });
    res.status(200).json({ message: 'Promotion deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePromotion = async (req, res) => {
  try {
    const { id } = req.params;
    const promotion = await Promotion.findByIdAndUpdate
      (id, req.body, { new: true, runValidators: true });
    if (!promotion) return res.status(404).json({ error: 'Promotion not found' });
    res.status(200).json(promotion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }   
};