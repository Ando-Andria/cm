const Sale = require('../models/boutique/Sales');
const Product = require('../models/boutique/Products');
const Promotion = require('../models/boutique/Promotion');

// exports.createSale = async (req, res) => {
//   try {
//     const { shopId, customerId, products, paymentMethod } = req.body;

//     if (!products || !products.length) {
//       return res.status(400).json({ message: 'Aucun produit dans la vente' });
//     }

//     // Vérifier le stock pour chaque produit
//     for (let item of products) {
//       const product = await Product.findById(item.productId);
//       if (!product) return res.status(404).json({ message: `Produit introuvable: ${item.productId}` });
//       if (product.stock < item.quantity) return res.status(400).json({ message: `Stock insuffisant pour ${product.name}` });
//     }

//     // Décrémenter le stock pour chaque produit
//     for (let item of products) {
//       await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
//     }

//     // Créer la vente
//     const sale = await Sale.create({ shopId, customerId, products, paymentMethod });
//     res.status(201).json(sale);

//   } catch (error) {
//     console.error('Erreur création vente:', error);
//     res.status(500).json({ message: 'Erreur serveur' });
//   }
// };

exports.createSale = async (req, res) => {
  try {
    const { shopId, customerId, products, paymentMethod } = req.body;

    if (!products || !products.length) {
      return res.status(400).json({ message: 'Aucun produit dans la vente' });
    }

    // Récupérer tous les produits de la vente pour vérifier le stock et les promos
    const allProducts = await Product.find({
      _id: { $in: products.map(p => p.productId) },
      shopId
    });

    if (allProducts.length !== products.length) {
      return res.status(404).json({ message: 'Un ou plusieurs produits introuvables dans cette boutique' });
    }

    // Vérifier le stock
    for (let item of products) {
      const product = allProducts.find(p => p._id.equals(item.productId));
      if (item.quantity > product.stock) {
        return res.status(400).json({ message: `Stock insuffisant pour ${product.name}` });
      }
    }

    // Vérifier les promotions actives
    const activePromos = await Promotion.find({
      productId: { $in: products.map(p => p.productId) },
      shopId,
      status: 'active',
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() }
    });

    // Construire le tableau des produits pour la vente avec le prix final
    const productsForSale = products.map(item => {
      const product = allProducts.find(p => p._id.equals(item.productId));
      const promo = activePromos.find(p => p.productId.equals(item.productId));
      const salePrice = promo 
        ? product.price * (1 - promo.discountPercent / 100)
        : product.price;

      return {
        productId: item.productId,
        quantity: item.quantity,
        salePrice
      };
    });

    // Décrémenter le stock pour chaque produit
    for (let item of productsForSale) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
    }

    // Créer la vente
    const sale = await Sale.create({
      shopId,
      customerId,
      products: productsForSale,
      paymentMethod
    });

    res.status(201).json(sale);

  } catch (error) {
    console.error('Erreur création vente:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};


exports.getSales = async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate('shopId', 'name')
      .populate('customerId', 'name email phone')
      .populate('products.productId', 'name');
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.getSalesByShop = async (req, res) => {
  try {
    const { shopId } = req.params;
    const sales = await Sale.find({ shopId })
      .sort({ date : -1 })
      .populate('customerId', 'name email phone')
      .populate('products.productId', 'name');
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.updateSale = async (req, res) => {
  try {
    const updatedSale = await Sale.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedSale) return res.status(404).json({ message: 'Vente introuvable' });
    res.status(200).json(updatedSale);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.deleteSale = async (req, res) => {
  try {
    const deletedSale = await Sale.findByIdAndDelete(req.params.id);
    if (!deletedSale) return res.status(404).json({ message: 'Vente introuvable' });

    // Restaurer le stock pour chaque produit
    for (let item of deletedSale.products) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { stock: item.quantity } });
    }

    res.status(200).json({ message: 'Vente supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
