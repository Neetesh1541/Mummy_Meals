import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { connectDB } from './lib/mongodb.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import menuRoutes from './routes/menu.js';
import orderRoutes from './routes/orders.js';
import { authMiddleware } from './middleware/auth.js';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:5173', 
      'http://localhost:3000', 
      'https://mummy-meals.vercel.app',
      'https://mummymeals.netlify.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000
});

const PORT = process.env.PORT || 3001;

// Socket.IO middleware for authentication
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    socket.userId = decoded.userId;
    socket.userRole = decoded.role;
    console.log(`🔐 Socket authenticated: ${socket.userId} (${socket.userRole})`);
    next();
  } catch (error) {
    console.error('Socket authentication error:', error.message);
    next(new Error('Authentication error: Invalid token'));
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`👤 User connected: ${socket.userId} (${socket.userRole})`);
  
  // Join user to their role-specific room
  socket.join(socket.userRole);
  socket.join(`user_${socket.userId}`);
  
  // Join moms to their specific room for receiving orders
  if (socket.userRole === 'mom') {
    socket.join(`mom_${socket.userId}`);
    console.log(`👩‍🍳 Mom joined room: mom_${socket.userId}`);
  }

  // Join delivery partners to their specific room
  if (socket.userRole === 'delivery') {
    socket.join(`delivery_${socket.userId}`);
    console.log(`🚚 Delivery partner joined room: delivery_${socket.userId}`);
  }

  // Handle location updates for delivery partners
  socket.on('update_location', (data) => {
    if (socket.userRole === 'delivery') {
      console.log(`📍 Location update from delivery partner ${socket.userId}:`, data);
      // Broadcast location to relevant orders
      socket.broadcast.emit('delivery_location_update', {
        delivery_partner_id: socket.userId,
        location: data.location,
        timestamp: new Date().toISOString()
      });
    }
  });

  // Handle delivery partner going online/offline
  socket.on('toggle_online_status', (data) => {
    if (socket.userRole === 'delivery') {
      console.log(`🔄 Delivery partner ${socket.userId} status: ${data.isOnline ? 'online' : 'offline'}`);
      // Update database and notify relevant parties
      socket.broadcast.emit('delivery_partner_status_update', {
        delivery_partner_id: socket.userId,
        isOnline: data.isOnline,
        timestamp: new Date().toISOString()
      });
    }
  });

  // Handle mom availability updates
  socket.on('toggle_availability', (data) => {
    if (socket.userRole === 'mom') {
      console.log(`👩‍🍳 Mom ${socket.userId} availability: ${data.isAvailable ? 'available' : 'unavailable'}`);
      // Broadcast availability to customers
      socket.broadcast.emit('chef_availability_update', {
        chef_id: socket.userId,
        isAvailable: data.isAvailable,
        timestamp: new Date().toISOString()
      });
    }
  });

  // Handle real-time cooking updates
  socket.on('cooking_update', (data) => {
    if (socket.userRole === 'mom') {
      console.log(`👩‍🍳 Cooking update from ${socket.userId}:`, data);
      // Notify the customer about cooking progress
      if (data.order_id && data.customer_id) {
        io.to(`user_${data.customer_id}`).emit('cooking_progress', {
          order_id: data.order_id,
          message: data.message,
          progress: data.progress,
          timestamp: new Date().toISOString()
        });
      }
    }
  });

  // Handle order feedback
  socket.on('order_feedback', (data) => {
    console.log(`⭐ Feedback received for order ${data.order_id}:`, data);
    // Notify the chef about the feedback
    if (data.chef_id) {
      io.to(`user_${data.chef_id}`).emit('feedback_received', {
        order_id: data.order_id,
        rating: data.rating,
        comment: data.comment,
        timestamp: new Date().toISOString()
      });
    }
  });

  socket.on('disconnect', (reason) => {
    console.log(`👤 User disconnected: ${socket.userId} (${reason})`);
  });

  socket.on('error', (error) => {
    console.error(`❌ Socket error for user ${socket.userId}:`, error);
  });
});

// Make io accessible to routes
app.set('io', io);

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:3000', 
    'https://mummy-meals.vercel.app',
    'https://mummymeals.netlify.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Connect to MongoDB
connectDB().then(() => {
  console.log('✅ Connected to MongoDB');
}).catch((error) => {
  console.error('❌ MongoDB connection error:', error);
  process.exit(1);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'MummyMeals API is running!',
    timestamp: new Date().toISOString(),
    socketConnections: io.engine.clientsCount
  });
});

// Socket.IO status endpoint
app.get('/api/socket-status', (req, res) => {
  res.json({
    success: true,
    connectedClients: io.engine.clientsCount,
    rooms: Array.from(io.sockets.adapter.rooms.keys()),
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 API URL: http://localhost:${PORT}/api`);
  console.log(`🔌 Socket.IO ready for real-time communication`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
