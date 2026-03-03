const Purchase = require('../models/boutique/Purchase');
const Product = require('../models/boutique/Products');
const Shop = require('../models/boutique/Shop');
const Supplier = require('../models/boutique/Supplier');
const notifications = require('../models/general/Notification');

// =======================
// Créer un achat / réappro
// =======================
exports.createPurchase = async (req, res) => {
  try {
    const { shopId, productId, quantity, purchasePrice, supplierId } = req.body;

    // Vérification champs obligatoires
    if (!shopId || !productId || !quantity || !purchasePrice) {
      return res.status(400).json({ message: 'shopId, productId, quantity et purchasePrice sont requis' });
    }

    // Vérifier boutique
    const shop = await Shop.findById(shopId);
    if (!shop) return res.status(404).json({ message: 'Boutique introuvable' });

    // Vérifier produit
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Produit introuvable' });

    // Vérifier fournisseur (optionnel)
    if (supplierId) {
      const supplier = await Supplier.findById(supplierId);
      if (!supplier) return res.status(404).json({ message: 'Fournisseur introuvable' });
    }

    // Créer l'achat
    const purchase = await Purchase.create({ shopId, productId, quantity, purchasePrice, supplierId });

    // Mettre à jour stock
    await Product.findByIdAndUpdate(productId, { $inc: { stock: quantity } });

    res.status(201).json(purchase);

  } catch (error) {
    console.error('Erreur création achat:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// =======================
// Lister tous les achats
// =======================
exports.getPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .sort({ date: -1 }) // 🔥 plus récent en premier
      .populate('shopId', 'name')
      .populate('productId', 'name')
      .populate('supplierId', 'name');

    res.status(200).json(purchases);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// =======================
// Lister achats par boutique
// =======================
exports.getPurchasesByShop = async (req, res) => {
  try {
    const { shopId } = req.params;
    const purchases = await Purchase.find({ shopId })
      .sort({ date : -1 })
      .populate('productId', 'name')
      .populate('supplierId', 'name email phone');
    res.status(200).json(purchases);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// =======================
// Mettre à jour un achat (rare, mais possible)
// =======================
exports.updatePurchase = async (req, res) => {
  try {
    const updatedPurchase = await Purchase.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedPurchase) return res.status(404).json({ message: 'Achat introuvable' });

    res.status(200).json(updatedPurchase);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// =======================
// Supprimer un achat
// =======================
exports.deletePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findByIdAndDelete(req.params.id);
    if (!purchase) return res.status(404).json({ message: 'Achat introuvable' });

    // Décrémenter le stock si tu veux annuler l'achat
    await Product.findByIdAndUpdate(purchase.productId, { $inc: { stock: -purchase.quantity } });

    res.status(200).json({ message: 'Achat supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
