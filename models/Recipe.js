// models/Recipe.js
import mongoose from 'mongoose';

const recipeSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  ingredients: {
    type: [String],
    required: true,
  },
  cookingTime: {
    type: String,
    required: true,
  },
  servings: {
    type: String,
    required: true,
  },
  favoritedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ], // Array of users who favorited this recipe
});

const Recipe = mongoose.model('Recipe', recipeSchema);

export default Recipe;
