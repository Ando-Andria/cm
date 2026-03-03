const Cart = require('../models/client/Cart');
const Product = require('../models/boutique/Products');
const Order = require('../models/boutique/Order');
const { addNotification } = require('./notificationController');

// Ajouter un produit au panier
exports.addToCart = async (req, res) => {
  console.log('j suis dans la methode addCart');
  try {
    const { clientId, shopId, productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Produit introuvable' });
    if (quantity > product.stock) return res.status(400).json({ error: 'Stock insuffisant' });

    let cart = await Cart.findOne({ clientId, shopId });

    if (!cart) {
      cart = new Cart({ clientId, shopId, products: [] });
    }

    // Vérifier si produit déjà dans le panier
    const index = cart.products.findIndex(p => p.productId.toString() === productId);
    if (index >= 0) {
      cart.products[index].quantity += quantity;
    } else {
      cart.products.push({ productId, quantity, price: product.price });
    }

    await cart.save();
    res.status(200).json(cart);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getCart = async (req, res) => {
  try {
    const { clientId } = req.params;

    // Récupère tous les paniers du client
    const carts = await Cart.find({ clientId })
      .populate('shopId', 'name address') // infos boutique
      .populate('products.productId', 'name price imageUrl categoryId stock'); // infos produit

    if (!carts || carts.length === 0) {
      return res.status(200).json({ carts: [] });
    }

    // Formater les données pour le frontend
    const formattedCarts = carts.map(cart => ({
      cartId: cart._id,
      shop: cart.shopId,
      products: cart.products.map(p => ({
        productId: p.productId._id,
        name: p.productId.name,
        category: p.productId.categoryId?.name || null,
        imageUrl: p.productId.imageUrl || null,
        quantity: p.quantity,
        price: p.price
      })),
      totalItems: cart.products.reduce((sum, p) => sum + p.quantity, 0),
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt
    }));

    res.status(200).json({ carts: formattedCarts });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Supprimer un produit du panier
exports.removeFromCart = async (req, res) => {
  try {
    const { cartId, productId } = req.body;

    const cart = await Cart.findById(cartId); // <-- chercher par cartId
    if (!cart) return res.status(404).json({ error: 'Panier introuvable' });

    cart.products = cart.products.filter(p => p.productId.toString() !== productId);
    await cart.save();

    res.status(200).json(cart);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// cartController.js
exports.updateQuantity = async (req, res) => {
  try {
    const { cartId, productId, quantity } = req.body;

    const cart = await Cart.findById(cartId);
    if (!cart) return res.status(404).json({ error: 'Panier introuvable' });

    const index = cart.products.findIndex(p => p.productId.toString() === productId);
    if (index < 0) return res.status(404).json({ error: 'Produit non trouvé dans le panier' });

    cart.products[index].quantity = quantity; // ou += quantity si tu veux ajouter
    await cart.save();

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.checkoutCart = async (req, res) => {
  try {
    const { cartId } = req.body;

    const cart = await Cart.findById(cartId).populate('products.productId');
    if (!cart || !cart.products.length) return res.status(400).json({ error: 'Panier vide' });

    // Vérifier stock
    for (const item of cart.products) {
      if (item.quantity > item.productId.stock) {
        return res.status(400).json({ error: `Stock insuffisant pour ${item.productId.name}` });
      }
    }

    const totalAmount = cart.products.reduce((sum, p) => sum + p.quantity * p.price, 0);

    const order = new Order({
      shopId: cart.shopId,
      customerId: cart.clientId,
      products: cart.products.map(p => ({
        productId: p.productId._id,
        quantity: p.quantity,
        price: p.price
      })),
      totalAmount,
      status: 'pending'
    });

    await order.save();

    addNotification({
      type: 'new_order',
      message: `📦 Nouvelle commande reçue (ID: ${order._id})`,
      referenceId: order._id,
      shopId: cart.shopId
    });

    cart.products = [];
    await cart.save();

    res.status(201).json({ message: 'Commande créée', order });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ----------------------
// Créer une notification de nouvelle commande côté client
// ----------------------
exports.notifyNewCart = async (req, res) => {
  try {
    const { shopId, customerId, products } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ error: 'Le panier est vide' });
    }

    // Calcul du total (optionnel, pour info dans la notif)
    let totalAmount = 0;
    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ error: `Produit introuvable: ${item.productId}` });
      totalAmount += item.quantity * item.price;
    }

    // Crée la notification
    const notif = await addNotification({
      type: 'new_cart',
      message: `🛒 Nouveau panier soumis par le client ${customerId}. Total: ${totalAmount}€`,
      shopId,
      referenceId: null, // pas encore d'objet Order
      date: new Date()
    });

    res.status(201).json({
      message: 'Notification créée pour le propriétaire de la boutique',
      notification: notif
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
