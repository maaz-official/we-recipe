// controllers/recipeController.js
import Recipe from '../models/Recipe.js';
import User from '../models/User.js'; // Assuming you have a User model

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

// Function to create a new recipe
export const addRecipe = async (req, res) => {
  try {
    const { title, image, description, ingredients, cookingTime, servings } = req.body;

    const newRecipe = new Recipe({
      title,
      image,
      description,
      ingredients,
      cookingTime,
      servings,
    });

    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Function to update an existing recipe
export const updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedRecipe = await Recipe.findByIdAndUpdate(id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Ensure schema validation
    });

    if (!updatedRecipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.json(updatedRecipe);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Function to delete a recipe
export const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRecipe = await Recipe.findByIdAndDelete(id);

    if (!deletedRecipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.json({ message: "Recipe deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Favorite a recipe
export const favoriteRecipe = async (req, res) => {
    try {
      const { id } = req.params; // Recipe ID
      const { userId } = req.body; // User ID
  
      const recipe = await Recipe.findById(id);
      if (!recipe) {
        return res.status(404).json({ error: 'Recipe not found' });
      }
  
      if (!recipe.favoritedBy.includes(userId)) {
        recipe.favoritedBy.push(userId);
        await recipe.save();
      }
  
      res.json({ message: 'Recipe favorited successfully', recipe });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Unfavorite a recipe
  export const unfavoriteRecipe = async (req, res) => {
    try {
      const { id } = req.params; // Recipe ID
      const { userId } = req.body; // User ID
  
      const recipe = await Recipe.findById(id);
      if (!recipe) {
        return res.status(404).json({ error: 'Recipe not found' });
      }
  
      recipe.favoritedBy = recipe.favoritedBy.filter((favUserId) => favUserId.toString() !== userId);
      await recipe.save();
  
      res.json({ message: 'Recipe unfavorited successfully', recipe });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Get all recipes favorited by a user
  export const getFavoritedRecipes = async (req, res) => {
    try {
      const { userId } = req.params;
  
      const recipes = await Recipe.find({ favoritedBy: userId });
      res.json(recipes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };