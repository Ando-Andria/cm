const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  type: { type: String, required: true },        // ex: 'new_order', 'low_stock'
  message: { type: String, required: true },
  referenceId: { type: mongoose.Schema.Types.ObjectId },
  
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  date: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
