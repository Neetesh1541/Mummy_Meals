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

    // Populate order details for real-time notification
    const populatedOrder = await Order.findById(order._id)
      .populate('foodie_id', 'name phone address')
      .populate('mom_id', 'name phone');

    // Get Socket.IO instance and emit real-time notification to the mom
    const io = req.app.get('io');
    if (io && populatedOrder.mom_id) {
      io.to(`mom_${populatedOrder.mom_id._id}`).emit('new_order', {
        order: populatedOrder,
        message: 'You have a new order!',
        timestamp: new Date().toISOString()
      });
      
      console.log(`📱 New order notification sent to mom: ${populatedOrder.mom_id._id}`);
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: populatedOrder
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
    ).populate('foodie_id', 'name phone address')
     .populate('mom_id', 'name phone')
     .populate('delivery_partner_id', 'name phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Get Socket.IO instance and emit real-time status updates
    const io = req.app.get('io');
    if (io) {
      // Notify the foodie about status update
      io.to(`user_${order.foodie_id._id}`).emit('order_status_update', {
        orderId: order._id,
        status: order.status,
        order: order,
        message: `Order status updated to: ${status}`,
        timestamp: new Date().toISOString()
      });

      // Notify all parties involved
      io.to(`user_${order.mom_id._id}`).emit('order_status_update', {
        orderId: order._id,
        status: order.status,
        order: order,
        message: `Order status updated to: ${status}`,
        timestamp: new Date().toISOString()
      });

      if (order.delivery_partner_id) {
        io.to(`user_${order.delivery_partner_id._id}`).emit('order_status_update', {
          orderId: order._id,
          status: order.status,
          order: order,
          message: `Order status updated to: ${status}`,
          timestamp: new Date().toISOString()
        });
      }

      console.log(`📱 Order status update sent for order: ${order._id} (${status})`);
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