const jwt = require('jsonwebtoken');
const Utilisateur = require('../models/utilisateur/utilisateur');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await Utilisateur.findById(decoded.id).select('-password');
      next();
    } catch (err) {
      res.status(401).json({ message: 'Token invalide' });
    }
  } else {
    res.status(401).json({ message: 'Pas de token, accès refusé' });
  }
};

module.exports = { protect };
