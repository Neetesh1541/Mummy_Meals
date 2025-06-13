import express from 'express';
import { Order } from '../models/Order.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Create new order (foodies only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'foodie') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only food buddies can create orders.'
      });
    }

    const orderData = {
      ...req.body,
      foodie_id: req.userId
    };

    const order = new Order(orderData);
    await order.save();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
});

// Get user orders
router.get('/my-orders', authMiddleware, async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === 'foodie') {
      filter.foodie_id = req.userId;
    } else if (req.user.role === 'mom') {
      filter.mom_id = req.userId;
    } else if (req.user.role === 'delivery') {
      filter.delivery_partner_id = req.userId;
    }

    const orders = await Order.find(filter)
      .populate('foodie_id', 'name phone address')
      .populate('mom_id', 'name phone')
      .populate('delivery_partner_id', 'name phone')
      .sort({ created_at: -1 });

    res.json({
      success: true,
      orders
    });

  } catch (error) {
    console.error('Fetch orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
});

// Update order status
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    let filter = { _id: orderId };

    // Only allow relevant users to update order status
    if (req.user.role === 'mom') {
      filter.mom_id = req.userId;
    } else if (req.user.role === 'delivery') {
      filter.delivery_partner_id = req.userId;
    } else {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const order = await Order.findOneAndUpdate(
      filter,
      { status, updated_at: new Date() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      order
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
});

export default router;