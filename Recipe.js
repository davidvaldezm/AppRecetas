// app/models/Recipe.js

const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  time: Number,
  calories: Number,
  protein: Number,
  difficulty: String,
  category: String,
  ingredients: [String],
  instructions: String
});

module.exports = mongoose.model('Recipe', recipeSchema);
