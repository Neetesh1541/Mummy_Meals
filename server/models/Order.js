import mongoose, {  Schema } from 'mongoose';

const OrderItemSchema = new Schema({
  menu_item_id: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  special_instructions: {
    type: String
  }
}, { _id: false });

const OrderSchema = new Schema({
  foodie_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mom_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  delivery_partner_id: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  items: [OrderItemSchema],
  total_amount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'accepted', 'preparing', 'ready', 'picked_up', 'delivered', 'cancelled'],
    default: 'pending'
  },
  delivery_address: {
    type: String,
    required: true
  },
  delivery_instructions: {
    type: String
  },
  estimated_delivery_time: {
    type: Date
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

export const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);