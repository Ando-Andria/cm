const Order = require('../models/boutique/Order');

// ----------------------
// Planifier / mettre à jour la livraison (côté boutique)
// ----------------------
exports.updateDeliveryByShop = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { scheduledDate, status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Commande introuvable' });
    if (order.status !== 'validated') return res.status(400).json({ error: 'Commande non validée' });

    order.delivery.scheduledDate = scheduledDate || order.delivery.scheduledDate;
    order.delivery.status = status || order.delivery.status;

    await order.save();
    res.status(200).json({ message: 'Livraison mise à jour', order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ----------------------
// Confirmer la livraison (côté client)
// ----------------------
exports.confirmDeliveryByClient = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { actualDate } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Commande introuvable' });
    if (order.status !== 'validated') return res.status(400).json({ error: 'Commande non validée' });

    order.delivery.actualDate = actualDate || new Date();
    order.delivery.status = 'delivered';

    await order.save();
    res.status(200).json({ message: 'Livraison confirmée', order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ----------------------
// Lister les livraisons d'une boutique
// ----------------------
exports.getDeliveriesByShop = async (req, res) => {
  try {
    const { shopId } = req.params;
    const orders = await Order.find({ shopId, status: 'validated' })
                              .select('delivery customerId totalAmount status')
                              .populate('customerId', 'name email phone');
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.markAsDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: 'Commande non trouvée' });

    if (order.paymentStatus !== 'paid') {
      return res.status(400).json({ message: 'Paiement requis avant livraison' });
    }

    if (order.status === 'delivered') {
      return res.status(400).json({ message: 'Commande déjà livrée' });
    }

    order.deliveryStatus = 'in_progress';
    order.deliveryDate = new Date();

    await order.save();

    res.status(200).json({ message: 'Commande marquée comme livrée' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};