const Utilisateur = require('../models/admin/utilisateur/utilisateur');
const jwt = require('jsonwebtoken');

// Génération du token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Register
exports.register = async (req, res, next) => {
  try {
    const { nom, prenom, email, password, role, boutiqueId } = req.body;

    const userExists = await Utilisateur.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email déjà utilisé' });

    const user = await Utilisateur.create({ nom, prenom, email, password, role, boutiqueId });

    res.status(201).json({
      _id: user._id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role,
      boutiqueId: user.boutiqueId,
      token: generateToken(user._id)
    });
  } catch (err) {
    next(err);
  }
};

// Login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await Utilisateur.findOne({ email });

    if (user && await user.matchPassword(password)) {
      res.json({
        _id: user._id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role,
        boutiqueId: user.boutiqueId,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Email ou mot de passe invalide' });
    }
  } catch (err) {
    next(err);
  }
};
