import express from 'express';
import { MenuItem } from '../models/MenuItem.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get all menu items
router.get('/', async (req, res) => {
  try {
    const { category, chef_id, search, is_veg, is_jain, is_healthy } = req.query;
    
    let filter = { is_available: true };

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (chef_id && chef_id !== 'all') {
      filter.mom_id = chef_id;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    if (is_veg === 'true') filter.is_veg = true;
    if (is_jain === 'true') filter.is_jain = true;
    if (is_healthy === 'true') filter.is_healthy = true;

    const menuItems = await MenuItem.find(filter)
      .populate('mom_id', 'name kitchen_name rating')
      .sort({ created_at: -1 });

    res.json({
      success: true,
      items: menuItems
    });

  } catch (error) {
    console.error('Fetch menu items error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch menu items',
      error: error.message
    });
  }
});

// Get menu items by mom ID
router.get('/mom/:momId', async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ 
      mom_id: req.params.momId,
      is_available: true 
    }).sort({ created_at: -1 });

    res.json({
      success: true,
      items: menuItems
    });

  } catch (error) {
    console.error('Fetch mom menu items error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch menu items',
      error: error.message
    });
  }
});

// Add new menu item (moms only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'mom') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only home chefs can add menu items.'
      });
    }

    const menuItemData = {
      ...req.body,
      mom_id: req.userId
    };

    const menuItem = new MenuItem(menuItemData);
    await menuItem.save();

    res.status(201).json({
      success: true,
      message: 'Menu item added successfully',
      item: menuItem
    });

  } catch (error) {
    console.error('Add menu item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add menu item',
      error: error.message
    });
  }
});

// Update menu item (moms only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'mom') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only home chefs can update menu items.'
      });
    }

    const menuItem = await MenuItem.findOneAndUpdate(
      { _id: req.params.id, mom_id: req.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    res.json({
      success: true,
      message: 'Menu item updated successfully',
      item: menuItem
    });

  } catch (error) {
    console.error('Update menu item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update menu item',
      error: error.message
    });
  }
});

// Delete menu item (moms only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'mom') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only home chefs can delete menu items.'
      });
    }

    const menuItem = await MenuItem.findOneAndDelete({
      _id: req.params.id,
      mom_id: req.userId
    });

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    res.json({
      success: true,
      message: 'Menu item deleted successfully'
    });

  } catch (error) {
    console.error('Delete menu item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete menu item',
      error: error.message
    });
  }
});

export default router;