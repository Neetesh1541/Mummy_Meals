import express from 'express';
import { Order } from '../models/Order.js';
import { User } from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Helper function to find nearby delivery partners
const findNearbyDeliveryPartners = async (location) => {
  try {
    // In a real app, you'd use geospatial queries
    // For now, we'll return available delivery partners
    const deliveryPartners = await User.find({ 
      role: 'delivery'
      // Add location-based filtering here in production
    }).limit(5);
    
    return deliveryPartners.length > 0 ? deliveryPartners[0] : null;
  } catch (error) {
    console.error('Error finding delivery partners:', error);
    return null;
  }
};

// Create new order (foodies only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'foodie') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only food buddies can create orders.'
      });
    }

    const { mom_id, items, total_amount, delivery_address, delivery_instructions, payment_method } = req.body;

    // Validate required fields
    if (!mom_id || !items || !Array.isArray(items) || items.length === 0 || !total_amount || !delivery_address) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: mom_id, items, total_amount, delivery_address'
      });
    }

    // Verify the mom exists
    const mom = await User.findById(mom_id);
    if (!mom || mom.role !== 'mom') {
      return res.status(404).json({
        success: false,
        message: 'Chef not found'
      });
    }

    const orderData = {
      foodie_id: req.userId,
      mom_id,
      items,
      total_amount,
      delivery_address,
      delivery_instructions: delivery_instructions || '',
      payment_method: payment_method || 'cod',
      status: 'pending',
      estimated_delivery_time: new Date(Date.now() + 45 * 60 * 1000) // 45 minutes from now
    };

    const order = new Order(orderData);
    await order.save();

    // Populate order details for real-time notification
    const populatedOrder = await Order.findById(order._id)
      .populate('foodie_id', 'name phone address email')
      .populate('mom_id', 'name phone email');

    console.log('📦 Order created:', {
      orderId: populatedOrder._id,
      customer: populatedOrder.foodie_id.name,
      chef: populatedOrder.mom_id.name,
      amount: populatedOrder.total_amount
    });

    // Get Socket.IO instance and emit real-time notification to the mom
    const io = req.app.get('io');
    if (io && populatedOrder.mom_id) {
      // Emit to specific mom
      const momNotification = {
        order: populatedOrder,
        message: `New order from ${populatedOrder.foodie_id.name} - ₹${populatedOrder.total_amount}`,
        timestamp: new Date().toISOString(),
        type: 'new_order'
      };

      io.to(`mom_${populatedOrder.mom_id._id}`).emit('new_order', momNotification);
      io.to(`user_${populatedOrder.mom_id._id}`).emit('new_order', momNotification);
      
      // Also emit to user's own room for confirmation
      io.to(`user_${populatedOrder.foodie_id._id}`).emit('order_created', {
        order: populatedOrder,
        message: 'Your order has been placed successfully! Chef will be notified instantly.',
        timestamp: new Date().toISOString()
      });
      
      console.log(`🔔 Real-time notification sent to mom: ${populatedOrder.mom_id._id}`);
      console.log(`✅ Order confirmation sent to customer: ${populatedOrder.foodie_id._id}`);
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully and chef notified instantly!',
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
      .populate('foodie_id', 'name phone address email')
      .populate('mom_id', 'name phone email')
      .populate('delivery_partner_id', 'name phone email')
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

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

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

    const order = await Order.findOne(filter)
      .populate('foodie_id', 'name phone address email')
      .populate('mom_id', 'name phone email')
      .populate('delivery_partner_id', 'name phone email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or access denied'
      });
    }

    // Auto-assign delivery partner when order is ready
    if (status === 'ready' && !order.delivery_partner_id) {
      const deliveryPartner = await findNearbyDeliveryPartners(order.delivery_address);
      if (deliveryPartner) {
        order.delivery_partner_id = deliveryPartner._id;
        
        // Notify delivery partner
        const io = req.app.get('io');
        if (io) {
          const deliveryNotification = {
            order: order,
            message: `New delivery assigned! Order #${order._id.toString().slice(-6)} - ₹${order.total_amount}`,
            timestamp: new Date().toISOString()
          };

          io.to(`user_${deliveryPartner._id}`).emit('delivery_assigned', deliveryNotification);
          io.to(`delivery_${deliveryPartner._id}`).emit('delivery_assigned', deliveryNotification);
          
          console.log(`🚚 Delivery partner ${deliveryPartner._id} assigned to order ${order._id}`);
        }
      }
    }

    // Update order status
    const oldStatus = order.status;
    order.status = status;
    order.updated_at = new Date();

    await order.save();

    // Populate the updated order
    await order.populate('delivery_partner_id', 'name phone email');

    console.log(`📋 Order ${order._id} status updated: ${oldStatus} → ${status}`);

    // Get Socket.IO instance and emit real-time status updates
    const io = req.app.get('io');
    if (io) {
      const updateData = {
        orderId: order._id,
        status: order.status,
        order: order,
        message: getStatusMessage(status, req.user.role),
        timestamp: new Date().toISOString(),
        updatedBy: req.user.role
      };

      // Notify the foodie about status update
      io.to(`user_${order.foodie_id._id}`).emit('order_status_update', updateData);

      // Notify the mom
      io.to(`user_${order.mom_id._id}`).emit('order_status_update', updateData);

      // Notify delivery partner if assigned
      if (order.delivery_partner_id) {
        io.to(`user_${order.delivery_partner_id._id}`).emit('order_status_update', updateData);
      }

      // Special handling for rejected orders
      if (status === 'cancelled' && req.user.role === 'mom') {
        io.to(`user_${order.foodie_id._id}`).emit('order_rejected', {
          orderId: order._id,
          message: `Your order has been cancelled by ${order.mom_id.name}. You will receive a full refund.`,
          timestamp: new Date().toISOString()
        });
      }

      console.log(`🔔 Real-time status update sent for order: ${order._id} (${status})`);
    }

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
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

// Get order details by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const orderId = req.params.id;
    
    const order = await Order.findById(orderId)
      .populate('foodie_id', 'name phone address email')
      .populate('mom_id', 'name phone email')
      .populate('delivery_partner_id', 'name phone email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user has permission to view this order
    const hasPermission = 
      order.foodie_id._id.toString() === req.userId.toString() ||
      order.mom_id._id.toString() === req.userId.toString() ||
      (order.delivery_partner_id && order.delivery_partner_id._id.toString() === req.userId.toString());

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      order
    });

  } catch (error) {
    console.error('Fetch order details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order details',
      error: error.message
    });
  }
});

// Helper function to get status message
function getStatusMessage(status, updatedBy) {
  const messages = {
    pending: 'Order is waiting for chef confirmation',
    accepted: 'Chef has accepted your order and will start cooking soon! 👩‍🍳',
    preparing: 'Your delicious meal is being prepared with love ❤️',
    ready: 'Your order is ready! Delivery partner will pick it up soon 📦',
    picked_up: 'Your order is on the way to you! 🚚',
    delivered: 'Order delivered successfully! Enjoy your meal! 🎉',
    cancelled: updatedBy === 'mom' ? 'Order has been cancelled by the chef' : 'Order has been cancelled'
  };
  return messages[status] || 'Order status updated';
}

export default router;