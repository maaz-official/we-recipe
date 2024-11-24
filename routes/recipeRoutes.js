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
router.get('/:id', getRecipeById);     // Get recipe by ID
router.post('/', createRecipe);        // Create a new recipe with image URL
router.put('/:id', updateRecipe);      // Update an existing recipe with image URL
router.delete('/:id', deleteRecipe);   // Delete a recipe

export default router;
