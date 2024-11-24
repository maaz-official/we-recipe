import Recipe from "../models/Recipe.js";
import multer from "multer";
import path from "path";

// Configure Multer for Image Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the folder to store files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Ensure unique filenames
  },
});

const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif/; // Acceptable file types
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileTypes.test(file.mimetype);

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(new Error("Images only!"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
});

// Get all recipes
export const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recipes." });
  }
};

// Get a single recipe by ID
export const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch the recipe." });
  }
};

// Create a new recipe with image upload
export const createRecipe = [
  upload.single("image"), // Middleware for handling single file upload
  async (req, res) => {
    try {
      const { title, description, ingredients, cookingTime, servings, imageUrl } = req.body;

      // Validate required fields
      if (!title || !description || !ingredients || !cookingTime || !servings) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // Parse ingredients if sent as a JSON string
      let parsedIngredients = [];
      try {
        parsedIngredients = JSON.parse(ingredients);
      } catch {
        parsedIngredients = ingredients.split(",").map((item) => item.trim());
      }

      const newRecipe = new Recipe({
        title,
        description,
        ingredients: parsedIngredients,
        cookingTime,
        servings,
        image: req.file ? `/uploads/${req.file.filename}` : imageUrl || null, // Store uploaded image or provided URL
      });

      const savedRecipe = await newRecipe.save();
      res.status(201).json(savedRecipe);
    } catch (error) {
      res.status(500).json({ error: "Failed to create the recipe." });
    }
  },
];

// Update an existing recipe
export const updateRecipe = [
  upload.single("image"), // Middleware for handling optional file upload
  async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, ingredients, cookingTime, servings, imageUrl } = req.body;

      const recipe = await Recipe.findById(id);
      if (!recipe) {
        return res.status(404).json({ error: "Recipe not found" });
      }

      // Update fields
      recipe.title = title || recipe.title;
      recipe.description = description || recipe.description;
      recipe.ingredients = ingredients
        ? JSON.parse(ingredients) || ingredients.split(",").map((item) => item.trim())
        : recipe.ingredients;
      recipe.cookingTime = cookingTime || recipe.cookingTime;
      recipe.servings = servings || recipe.servings;

      // Update image if provided
      recipe.image = req.file ? `/uploads/${req.file.filename}` : imageUrl || recipe.image;

      const updatedRecipe = await recipe.save();
      res.json(updatedRecipe);
    } catch (error) {
      res.status(500).json({ error: "Failed to update the recipe." });
    }
  },
];

// Delete a recipe
export const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    await recipe.remove();
    res.json({ message: "Recipe deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete the recipe." });
  }
};
