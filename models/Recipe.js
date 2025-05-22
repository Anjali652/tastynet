const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: String,
  prepTime: Number,
  calories: Number,
  difficulty: String,
  ingredients: [String],
  imageUrl: String,
});

module.exports = mongoose.model("Recipe", recipeSchema);
