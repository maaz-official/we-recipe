import Recipe from "../models/Recipe.js";

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

// Create a new recipe (only accepts image URL)
export const createRecipe = async (req, res) => {
  try {
    const { title, description, ingredients, cookingTime, servings, imageUrl } = req.body;

    // Validate required fields
    if (!title || !description || !ingredients || !cookingTime || !servings || !imageUrl) {
      return res.status(400).json({ error: "All fields, including an image URL, are required." });
    }

    // Parse ingredients if sent as a JSON string
    const parsedIngredients = ingredients.split(",").map((item) => item.trim());

    const newRecipe = new Recipe({
      title,
      description,
      ingredients: parsedIngredients,
      cookingTime,
      servings,
      image: imageUrl, // Use provided image URL
    });

    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (error) {
    res.status(500).json({ error: "Failed to create the recipe." });
  }
};

// Update an existing recipe (only accepts image URL)
export const updateRecipe = async (req, res) => {
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
      ? ingredients.split(",").map((item) => item.trim())
      : recipe.ingredients;
    recipe.cookingTime = cookingTime || recipe.cookingTime;
    recipe.servings = servings || recipe.servings;
    recipe.image = imageUrl || recipe.image; // Update image URL if provided

    const updatedRecipe = await recipe.save();
    res.json(updatedRecipe);
  } catch (error) {
    res.status(500).json({ error: "Failed to update the recipe." });
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

    await recipe.remove();
    res.json({ message: "Recipe deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete the recipe." });
  }
};
