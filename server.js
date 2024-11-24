import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import recipeRoutes from './routes/recipeRoutes.js';
import userRoutes from './routes/userRoutes.js';
import path from 'path';

dotenv.config();
connectDB(); // Connect to the database

const app = express();

// Serve static files (e.g., images) from the "uploads" directory
app.use('/uploads', express.static(path.resolve('uploads')));

// Middleware to parse JSON bodies in requests
app.use(express.json());

// CORS configuration
const corsOptions = {
  origin: ["http://localhost:8081", "http://localhost:3000"], // Add allowed origins
  methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
  credentials: true, // Allow credentials such as cookies or authorization headers
};
app.use(cors(corsOptions)); // Use CORS middleware with configured options

// Routes
app.use('/recipes', recipeRoutes); // Recipe-related routes
app.use('/users', userRoutes);     // User-related routes

// Default route for health check
app.get('/', (req, res) => {
  res.status(200).json({ status: 'API is Running' });
});

// Catch-all route for undefined endpoints
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`[Error] ${err.message}`);
  res.status(500).json({ message: 'An internal server error occurred.' });
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// Export the app for external use or Vercel deployment
export default app;
