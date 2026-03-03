const mongoose = require('mongoose');

const factureSchema = new mongoose.Schema({
  contratId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contrat',
    required: true
  },
  periode: {
    type: String, 
    required: true
  },
  montantTotal: {
    type: Number,
    required: true
  },
  dateEmission: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Facture', factureSchema);