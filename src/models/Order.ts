import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  menu_item_id: string;
  quantity: number;
  price: number;
  special_instructions?: string;
}

export interface IOrder extends Document {
  _id: string;
  foodie_id: mongoose.Types.ObjectId;
  mom_id: mongoose.Types.ObjectId;
  delivery_partner_id?: mongoose.Types.ObjectId;
  items: IOrderItem[];
  total_amount: number;
  status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'picked_up' | 'delivered' | 'cancelled';
  delivery_address: string;
  delivery_instructions?: string;
  estimated_delivery_time?: Date;
  created_at: Date;
  updated_at: Date;
}

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

const OrderSchema = new Schema<IOrder>({
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

export const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);