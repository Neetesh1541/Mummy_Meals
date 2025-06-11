import mongoose, { Document, Schema } from 'mongoose';

export interface IMenuItem extends Document {
  _id: string;
  mom_id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  is_veg: boolean;
  is_jain: boolean;
  is_healthy: boolean;
  tags: string[];
  preparation_time: number;
  is_available: boolean;
  created_at: Date;
  updated_at: Date;
}

const MenuItemSchema = new Schema<IMenuItem>({
  mom_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image_url: {
    type: String
  },
  category: {
    type: String,
    default: 'main'
  },
  is_veg: {
    type: Boolean,
    default: true
  },
  is_jain: {
    type: Boolean,
    default: false
  },
  is_healthy: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String
  }],
  preparation_time: {
    type: Number,
    default: 30
  },
  is_available: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

export const MenuItem = mongoose.models.MenuItem || mongoose.model<IMenuItem>('MenuItem', MenuItemSchema);