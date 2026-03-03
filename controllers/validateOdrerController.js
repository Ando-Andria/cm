const Order = require('../models/boutique/Order');
const Product = require('../models/boutique/Products');
const Sale = require('../models/boutique/Sales');
const Promotion = require('../models/boutique/Promotion'); // nouveau
const { addNotification } = require('./NotificationController');

exports.validateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) return res.status(404).json({ message: 'Commande introuvable' });
    if (order.status !== 'pending') return res.status(400).json({ message: 'Commande déjà traitée' });

    // 🔎 Vérification stock global
    for (const item of order.products) {
      const product = await Product.findById(item.productId);

      if (!product || product.stock < item.quantity) {
        order.status = 'cancelled';
        order.notes = `Stock insuffisant pour produit ${product?.name || 'inconnu'}`;
        await order.save();

        addNotification({
          type: 'order_refused',
          message: `Commande refusée : stock insuffisant`,
          referenceId: order._id,
          shopId: order.shopId
        });

        return res.status(400).json({ message: 'Commande annulée : stock insuffisant' });
      }
    }

    // ✅ Vérifier les promotions actives pour chaque produit
    const productIds = order.products.map(p => p.productId);
    const activePromos = await Promotion.find({
      productId: { $in: productIds },
      shopId: order.shopId,
      status: 'approved',
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() }
    });

    // Calculer le prix final avec promo
    order.products = order.products.map(item => {
      const promo = activePromos.find(p => p.productId.equals(item.productId));
      if (promo) item.price = item.price * (1 - promo.discountPercent / 100);
      return item;
    });

    // 🔄 Décrémenter le stock
    for (const item of order.products) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
    }

    // 💰 Création Sale avec prix promo si applicable
    const sale = new Sale({
      shopId: order.shopId,
      customerId: order.customerId,
      products: order.products.map(p => ({
        productId: p.productId,
        quantity: p.quantity,
        salePrice: p.price
      }))
    });
    await sale.save();

    // 📦 Update commande
    order.status = 'validated';
    await order.save();

    // 🔔 Notification client
    addNotification({
      type: 'order_validated',
      message: `Votre commande a été validée`,
      referenceId: order._id,
      shopId: order.shopId
    });

    res.status(200).json({
      message: 'Commande validée avec succès',
      order
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
