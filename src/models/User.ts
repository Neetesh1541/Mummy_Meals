import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  role: 'foodie' | 'mom' | 'delivery';
  address?: string;
  avatar_url?: string;
  is_verified: boolean;
  created_at: Date;
  updated_at: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IMom extends Document {
  user_id: mongoose.Types.ObjectId;
  kitchen_name: string;
  specialties: string[];
  rating: number;
  total_orders: number;
  is_available: boolean;
  delivery_radius: number;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  created_at: Date;
  updated_at: Date;
}

export interface IDeliveryPartner extends Document {
  user_id: mongoose.Types.ObjectId;
  vehicle_type: 'bike' | 'scooter' | 'bicycle';
  license_number: string;
  is_online: boolean;
  current_location?: {
    lat: number;
    lng: number;
  };
  total_deliveries: number;
  rating: number;
  created_at: Date;
  updated_at: Date;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    required: true,
    enum: ['foodie', 'mom', 'delivery']
  },
  address: {
    type: String,
    trim: true
  },
  avatar_url: {
    type: String
  },
  is_verified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const MomSchema = new Schema<IMom>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  kitchen_name: {
    type: String,
    required: true,
    default: 'Home Kitchen'
  },
  specialties: [{
    type: String
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  total_orders: {
    type: Number,
    default: 0
  },
  is_available: {
    type: Boolean,
    default: true
  },
  delivery_radius: {
    type: Number,
    default: 5
  },
  location: {
    lat: Number,
    lng: Number,
    address: String
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const DeliveryPartnerSchema = new Schema<IDeliveryPartner>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vehicle_type: {
    type: String,
    required: true,
    enum: ['bike', 'scooter', 'bicycle'],
    default: 'bike'
  },
  license_number: {
    type: String
  },
  is_online: {
    type: Boolean,
    default: false
  },
  current_location: {
    lat: Number,
    lng: Number
  },
  total_deliveries: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export const Mom = mongoose.models.Mom || mongoose.model<IMom>('Mom', MomSchema);
export const DeliveryPartner = mongoose.models.DeliveryPartner || mongoose.model<IDeliveryPartner>('DeliveryPartner', DeliveryPartnerSchema);