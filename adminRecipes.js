const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const validateAdmin = require('../controllers/authMiddleware');

router.use(validateAdmin);

router.post('/', async (req, res) => {
  try {
    const recipe = await Recipe.create(req.body);
    res.status(201).json(recipe);
  } catch (err) {
    res.status(400).json({ message: 'Error al crear receta' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Receta no encontrada' });
    res.json(updated);
  } catch {
    res.status(400).json({ message: 'Error al actualizar receta' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await Recipe.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Receta no encontrada' });
    res.json({ message: 'Receta eliminada' });
  } catch {
    res.status(400).json({ message: 'Error al eliminar receta' });
  }
});

module.exports = router;
