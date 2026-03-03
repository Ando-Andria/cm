const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'validated', 'preparing', 'shipped', 'delivered', 'cancelled'], 
    default: 'pending' 
  },
  paymentStatus: { 
    type: String, 
    enum: ['unpaid', 'paid', 'refunded'], 
    default: 'unpaid' 
  },
  deliveryStatus: { 
    type: String, 
    enum: ['not_started', 'in_progress', 'delivered'], 
    default: 'not_started' 
  },
  notes: { type: String } ,
  delivery: {
  status: { 
    type: String, 
    enum: ['not_started', 'in_progress', 'delivered'], 
    default: 'not_started' 
  },
  scheduledDate: Date, 
  actualDate: Date  
}

}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
