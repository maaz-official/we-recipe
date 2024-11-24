import Recipe from "../models/Recipe.js";
import User from "../models/User.js"; // Assuming you have a User model

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
      return res.status(404).json({ error: "Recipe not found" });
    }
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new recipe with image URL
export const createRecipe = async (req, res) => {
  try {
    const { title, description, ingredients, cookingTime, servings, image, createdBy } = req.body;

    // Validate required fields
    if (!title || !description || !ingredients || !cookingTime || !servings || !image) {
      return res.status(400).json({ error: "All fields, including the image URL, are required." });
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
      image, // Directly store the image URL
      createdBy: req.user?._id || null, // Optional: Handle createdBy field
    });

    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an existing recipe with image URL
export const updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, ingredients, cookingTime, servings, image } = req.body;

    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    // Check if the authenticated user is the owner of the recipe
    if (req.user && recipe.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "You are not authorized to update this recipe." });
    }

    // Update fields
    recipe.title = title || recipe.title;
    recipe.description = description || recipe.description;
    recipe.ingredients =
      (ingredients && JSON.parse(ingredients)) || recipe.ingredients;
    recipe.cookingTime = cookingTime || recipe.cookingTime;
    recipe.servings = servings || recipe.servings;
    recipe.image = image || recipe.image; // Update the image URL if provided

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
      return res.status(404).json({ error: "Recipe not found" });
    }

    // Check if the authenticated user is the owner of the recipe
    if (req.user && recipe.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "You are not authorized to delete this recipe." });
    }

    await recipe.remove();
    res.json({ message: "Recipe deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
