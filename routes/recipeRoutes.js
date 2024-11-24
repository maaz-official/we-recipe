import express from "express";
import {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from "../controllers/recipeController.js";
import { upload } from "../controllers/recipeController.js"; // Import multer configuration

const router = express.Router();

// CRUD Operations for Recipes
router.get("/", getAllRecipes); // Get all recipes
router.get("/:id", getRecipeById); // Get recipe by ID

// Apply `upload.single('image')` middleware to handle image uploads for both create and update operations
router.post("/", upload.single("image"), createRecipe); // Create a new recipe with image upload
router.put("/:id", upload.single("image"), updateRecipe); // Update an existing recipe with optional image upload

router.delete("/:id", deleteRecipe); // Delete a recipe

export default router;
