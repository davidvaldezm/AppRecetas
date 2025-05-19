// server.js

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const recipesRoutes = require('./app/routes/recipes');
const adminRecipesRoutes = require('./app/routes/adminRecipes');
const usersRoutes = require('./app/routes/users');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MongoDB Atlas
const MONGO_URI = 'mongodb://receta_user:receta123@ac-xobdjfc-shard-00-00.mf8qxx2.mongodb.net:27017,ac-xobdjfc-shard-00-01.mf8qxx2.mongodb.net:27017,ac-xobdjfc-shard-00-02.mf8qxx2.mongodb.net:27017/?ssl=true&replicaSet=atlas-s9i7wj-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado a MongoDB Atlas'))
.catch(err => console.error('❌ Error al conectar a MongoDB Atlas:', err));

// Ruta base
app.get('/', (req, res) => res.send('Recetario Healthy Recipes - Backend listo'));

// Rutas API
app.use('/recipes', recipesRoutes);
app.use('/admin/recipes', adminRecipesRoutes);
app.use('/users', usersRoutes);

// Levantar servidor
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
