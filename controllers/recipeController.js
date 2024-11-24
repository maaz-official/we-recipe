import Recipe from '../models/Recipe.js';
import User from '../models/User.js'; // Assuming you have a User model
import multer from 'multer';
import path from 'path';

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the folder to store files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Ensure unique filenames
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/; // Acceptable file types
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (extName && mimeType) {
      cb(null, true);
    } else {
      cb(new Error('Images only!'));
    }
  },
});

// Get all recipes
export const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single recipe by ID
export const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new recipe with image upload
export const createRecipe = [
  upload.single('image'), // Middleware for handling single file upload
  async (req, res) => {
    try {
      const { title, description, ingredients, cookingTime, servings, createdBy } = req.body;

      if (!title || !description || !ingredients || !cookingTime || !servings) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      const newRecipe = new Recipe({
        title,
        description,
        ingredients: JSON.parse(ingredients), // Ensure ingredients is parsed if sent as a stringified array
        cookingTime,
        servings,
        image: req.file ? `/uploads/${req.file.filename}` : null, // Store image path
        createdBy: req.user?._id || null, // Ensure createdBy is optional or handled correctly
      });

      const savedRecipe = await newRecipe.save();
      res.status(201).json(savedRecipe);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
];

// Update an existing recipe
export const updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, ingredients, cookingTime, servings, image } = req.body;

    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // Check if the authenticated user is the owner of the recipe
    if (recipe.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You are not authorized to update this recipe' });
    }

    // Update fields
    recipe.title = title || recipe.title;
    recipe.description = description || recipe.description;
    recipe.ingredients = ingredients || recipe.ingredients;
    recipe.cookingTime = cookingTime || recipe.cookingTime;
    recipe.servings = servings || recipe.servings;
    recipe.image = image || recipe.image;

    const updatedRecipe = await recipe.save();
    res.json(updatedRecipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a recipe
export const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // Check if the authenticated user is the owner of the recipe
    if (recipe.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You are not authorized to delete this recipe' });
    }

    await recipe.remove();
    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
