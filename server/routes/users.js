import express from 'express';
import { User, Mom, DeliveryPartner } from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get all moms (home chefs)
router.get('/moms', async (req, res) => {
  try {
    const moms = await Mom.find({ is_available: true })
      .populate('user_id', 'name email phone avatar_url is_verified')
      .sort({ rating: -1, total_orders: -1 });

    res.json({
      success: true,
      moms
    });

  } catch (error) {
    console.error('Fetch moms error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch home chefs',
      error: error.message
    });
  }
});

// Get mom profile by ID
router.get('/moms/:id', async (req, res) => {
  try {
    const mom = await Mom.findOne({ user_id: req.params.id })
      .populate('user_id', 'name email phone avatar_url is_verified');

    if (!mom) {
      return res.status(404).json({
        success: false,
        message: 'Home chef not found'
      });
    }

    res.json({
      success: true,
      mom
    });

  } catch (error) {
    console.error('Fetch mom profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch home chef profile',
      error: error.message
    });
  }
});

// Update mom profile
router.put('/moms/profile', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'mom') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only home chefs can update this profile.'
      });
    }

    const { kitchen_name, specialties, delivery_radius, location, is_available } = req.body;

    const mom = await Mom.findOneAndUpdate(
      { user_id: req.userId },
      {
        ...(kitchen_name && { kitchen_name }),
        ...(specialties && { specialties }),
        ...(delivery_radius && { delivery_radius }),
        ...(location && { location }),
        ...(typeof is_available === 'boolean' && { is_available })
      },
      { new: true, runValidators: true }
    ).populate('user_id', 'name email phone avatar_url is_verified');

    if (!mom) {
      return res.status(404).json({
        success: false,
        message: 'Home chef profile not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      mom
    });

  } catch (error) {
    console.error('Update mom profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
});

// Get all delivery partners
router.get('/delivery-partners', async (req, res) => {
  try {
    const partners = await DeliveryPartner.find({ is_online: true })
      .populate('user_id', 'name email phone avatar_url is_verified')
      .sort({ rating: -1, total_deliveries: -1 });

    res.json({
      success: true,
      partners
    });

  } catch (error) {
    console.error('Fetch delivery partners error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch delivery partners',
      error: error.message
    });
  }
});

export default router;