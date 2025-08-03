import express from "express";
import dotenv from "dotenv";
import cors from "cors"; 


//routes imports
import productRoutes from './routes/product.js'
import authRoutes from './routes/auth.js'
import cartRoutes from './routes/cart.js'
import orderRoutes from './routes/order.js'
import userRoutes from './routes/user.js'

import db from "./config/db.js";

dotenv.config();

const app=express();

db.connect();

//middleware
app.use(cors());
app.use(express.json());



//Mount routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);

// Basic route (optional)
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error handling middleware (optional but recommended)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({ message: err.message || 'Server Error' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});