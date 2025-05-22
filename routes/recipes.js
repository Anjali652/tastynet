const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;

// Mongoose model
const Recipe = mongoose.model("Recipe", new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  prepTime: Number,
  calories: Number,
  difficulty: String,
  ingredients: [String],
  imageUrl: String,
}));

// GET all recipes
router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
});

// GET recipe by ID
router.get("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch recipe" });
  }
});

// POST create a new recipe
router.post("/", async (req, res) => {
    try {
      const {
        title,
        category,
        prepTime,
        calories,
        difficulty,
        ingredients,
        image,
      } = req.body;
  
      if (!title || !category || !image) {
        return res.status(400).json({ error: "Missing required fields" });
      }
  
      // Upload image to Cloudinary
      const uploaded = await cloudinary.uploader.upload(image, {
        folder: "foodapp",
      });
  
      // Parse ingredients if necessary
      let parsedIngredients = ingredients;
      if (typeof ingredients === "string") {
        try {
          parsedIngredients = JSON.parse(ingredients);
        } catch {
          parsedIngredients = ingredients.split(",").map(i => i.trim());
        }
      }
  
      const newRecipe = new Recipe({
        title,
        category,
        prepTime: Number(prepTime),
        calories: Number(calories),
        difficulty,
        ingredients: parsedIngredients,
        imageUrl: uploaded.secure_url,
      });
  
      await newRecipe.save();
      res.status(201).json(newRecipe);
    } catch (err) {
      console.error("Error creating recipe:", err);
      res.status(500).json({ error: "Failed to create recipe" });
    }
  });
  
// PUT update recipe
router.put("/:id", async (req, res) => {
  try {
    const {
      title,
      category,
      prepTime,
      calories,
      difficulty,
      ingredients
    } = req.body;

    const updated = await Recipe.findByIdAndUpdate(
      req.params.id,
      {
        title,
        category,
        prepTime,
        calories,
        difficulty,
        ingredients: Array.isArray(ingredients)
          ? ingredients
          : JSON.parse(ingredients),
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Recipe not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update recipe" });
  }
});

// DELETE recipe
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Recipe.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Recipe not found" });
    res.json({ message: "Recipe deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete recipe" });
  }
});

module.exports = router;
