import Recipe from "../models/Recipe.js";

// Get all recipes
export const getAllRecipes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const recipes = await Recipe.find().skip(skip).limit(limit);
    const total = await Recipe.countDocuments();

    res.json({ recipes, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("Error fetching recipes:", error);
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
    console.error("Error fetching recipe:", error);
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

    // Validate types and ranges
    if (typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({ error: "Title must be a non-empty string." });
    }

    if (!Array.isArray(ingredients) && typeof ingredients !== "string") {
      return res.status(400).json({ error: "Ingredients must be a comma-separated string or an array." });
    }

    if (isNaN(cookingTime) || cookingTime <= 0) {
      return res.status(400).json({ error: "Cooking time must be a positive number." });
    }

    // Parse ingredients
    const parsedIngredients = Array.isArray(ingredients)
      ? ingredients
      : ingredients.split(",").map((item) => item.trim());

    const newRecipe = new Recipe({
      title,
      description,
      ingredients: parsedIngredients,
      cookingTime,
      servings,
      image: imageUrl,
    });

    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (error) {
    console.error("Error creating recipe:", error);
    res.status(500).json({ error: error.message || "Failed to create the recipe." });
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
      ? (Array.isArray(ingredients)
          ? ingredients
          : ingredients.split(",").map((item) => item.trim()))
      : recipe.ingredients;
    recipe.cookingTime = cookingTime || recipe.cookingTime;
    recipe.servings = servings || recipe.servings;
    recipe.image = imageUrl || recipe.image;

    const updatedRecipe = await recipe.save();
    res.json(updatedRecipe);
  } catch (error) {
    console.error("Error updating recipe:", error);
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
    console.error("Error deleting recipe:", error);
    res.status(500).json({ error: "Failed to delete the recipe." });
  }
};
