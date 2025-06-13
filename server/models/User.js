import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new Schema({
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

const MomSchema = new Schema({
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

const DeliveryPartnerSchema = new Schema({
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
  } catch (error) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export const Mom = mongoose.models.Mom || mongoose.model('Mom', MomSchema);
export const DeliveryPartner = mongoose.models.DeliveryPartner || mongoose.model('DeliveryPartner', DeliveryPartnerSchema);