import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // Import cors
import connectDB from './config/db.js';
import recipeRoutes from './routes/recipeRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();
connectDB(); // Optional if you use a database

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json());

// Routes
app.use('/recipes', recipeRoutes);
app.use('/users', userRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
