const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },           
  email: { type: String, unique: true, sparse: true }, 
  phone: { type: String },
  address: { type: String },
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop',required: true },
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
