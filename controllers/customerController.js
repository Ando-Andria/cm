const Customer = require('../models/boutique/Customer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Créer un client
exports.createCustomer = async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lister tous les clients
exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
 exports.registerCustomer = async (req, res) => {
  try {
    const { name, email, password, phone, address, shopId } = req.body;

    // Vérifier si email existe déjà
    const existing = await Customer.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Email déjà utilisé' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const customer = await Customer.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      shopId
    });

    res.status(201).json({
      message: 'Client créé avec succès',
      customerId: customer._id
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= LOGIN =================
exports.loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(400).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Vérifier mot de passe
    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Créer token
    const token = jwt.sign(
      { id: customer._id, shopId: customer.shopId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Connexion réussie',
      token,
      userId: customer._id,
      shopId: customer.shopId
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCustomersByShop = async (req, res) => {
  try {
    const { shopId } = req.params;
    console.log('Fetching customers for shop ID:', shopId); 
    const customers = await Customer.find({ shopId });  // Filtre les clients de cette boutique
    res.status(200).json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Récupérer un client par id
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Client introuvable' });
    res.status(200).json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mettre à jour un client
exports.updateCustomer = async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedCustomer) return res.status(404).json({ error: 'Client introuvable' });
    res.status(200).json(updatedCustomer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Supprimer un client
exports.deleteCustomer = async (req, res) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
    if (!deletedCustomer) return res.status(404).json({ error: 'Client introuvable' });
    res.status(200).json({ message: 'Client supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
