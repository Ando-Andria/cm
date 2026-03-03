const Supplier = require('../models/boutique/Supplier');

// Créer un fournisseur
exports.createSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.create(req.body);
    res.status(201).json(supplier);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } 
};

// Lister tous les fournisseurs
exports.getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.status(200).json(suppliers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mettre à jour un fournisseur par ID
exports.updateSupplier = async (req, res) => {
  try {
    const updatedSupplier = await Supplier.findByIdAndUpdate(
      req.params.id,        
        req.body,   
        { new: true, runValidators: true }

    );

    if (!updatedSupplier) {
      return res.status(404).json({ error: 'Fournisseur non trouvé' });
    }   
    res.status(200).json(updatedSupplier);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }     
};