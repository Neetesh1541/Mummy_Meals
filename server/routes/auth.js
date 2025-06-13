import express from 'express';
import jwt from 'jsonwebtoken';
import { User, Mom, DeliveryPartner } from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '7d'
  });
};

// Register new user
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, phone, role, address, additionalData } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, and role are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create new user
    const userData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone: phone?.trim(),
      role,
      address: address?.trim()
    };

    const user = new User(userData);
    await user.save();

    // Create role-specific profile
    if (role === 'mom') {
      const momData = {
        user_id: user._id,
        kitchen_name: additionalData?.kitchen_name || `${name}'s Kitchen`,
        specialties: additionalData?.specialties || [],
        delivery_radius: additionalData?.delivery_radius || 5,
        location: additionalData?.location || null
      };
      
      const mom = new Mom(momData);
      await mom.save();
    } else if (role === 'delivery') {
      const deliveryData = {
        user_id: user._id,
        vehicle_type: additionalData?.vehicle_type || 'bike',
        license_number: additionalData?.license_number || ''
      };
      
      const deliveryPartner = new DeliveryPartner(deliveryData);
      await deliveryPartner.save();
    }

    // Generate token
    const token = generateToken(user._id);

    // Return user data (excluding password)
    const userResponse = {
      _id: user._id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      address: user.address,
      avatar_url: user.avatar_url,
      is_verified: user.is_verified,
      created_at: user.created_at,
      updated_at: user.updated_at
    };

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create account',
      error: error.message
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Return user data (excluding password)
    const userResponse = {
      _id: user._id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      address: user.address,
      avatar_url: user.avatar_url,
      is_verified: user.is_verified,
      created_at: user.created_at,
      updated_at: user.updated_at
    };

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
});

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, phone, address, avatar_url } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        ...(name && { name: name.trim() }),
        ...(phone && { phone: phone.trim() }),
        ...(address && { address: address.trim() }),
        ...(avatar_url && { avatar_url })
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
});

export default router;