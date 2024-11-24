import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // Import cors
import connectDB from './config/db.js';
import recipeRoutes from './routes/recipeRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();
connectDB(); // Optional if you use a database

const app = express();

// Middleware
app.use(cors()); // Enable CORS
// Middleware to parse JSON bodies in requests
app.use(express.json());

// CORS configuration
const corsOptions = {
    origin: ['http://localhost:8081', "http://localhost:3000"],
    credentials: true, // Allow credentials such as cookies or authorization headers
};
app.use(cors(corsOptions)); // Use CORS middleware with options

// Routes
app.use('/recipes', recipeRoutes);
app.use('/users', userRoutes);

// Default route for the health check
app.get('/', (req, res) => {
    res.status(200).json({ status: 'API is Running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 4000;
// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// Export the app for Vercel
export default app;