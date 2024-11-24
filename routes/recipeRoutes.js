import express from 'express';
import {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from '../controllers/recipeController.js';

const router = express.Router();

// CRUD Operations for Recipes
router.get('/', getAllRecipes);        // Get all recipes
router.get('/:id', getRecipeById);    // Get recipe by ID
router.post('/', createRecipe);          // Create a new recipe
router.put('/:id', updateRecipe);     // Update an existing recipe
router.delete('/:id', deleteRecipe);  // Delete a recipe
// Route to favorite a recipe
// router.post('/:id/favorite', favoriteRecipe);
// // Route to unfavorite a recipe
// router.post('/:id/unfavorite', unfavoriteRecipe);
// // Route to get all recipes favorited by a user
// router.get('/favorites/:userId', getFavoritedRecipes);

export default router;
