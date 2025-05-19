const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');

router.get('/', async (req, res) => {
  const recipes = await Recipe.find();
  res.json(recipes);
});

router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Receta no encontrada' });
    res.json(recipe);
  } catch {
    res.status(400).json({ message: 'ID inválido' });
  }
});

router.post('/cart', async (req, res) => {
  const ids = req.body.map(i => i.recipeId);
  try {
    const recipes = await Recipe.find({ _id: { $in: ids } });
    res.json(recipes);
  } catch {
    res.status(400).json({ message: 'Error al buscar recetas' });
  }
});

module.exports = router;