# Backend Recetario Healthy Recipes

Este proyecto es el backend simulado para la app Healthy Recipes. Proporciona una REST API básica para manejar recetas y usuarios.

## 🚀 Instalación

```bash
npm install
```

## 💻 Levantar el servidor

```bash
npm run dev   # para desarrollo (con nodemon)
npm start     # para producción
```

El servidor se levanta en `http://localhost:3000`

## 📋 Endpoints disponibles

### Público

- `GET /recipes` → obtener todas las recetas.
- `GET /recipes/:id` → obtener una receta por ID.

### Admin (`x-auth: admin` requerido)

- `POST /admin/recipes` → crear receta.
- `PUT /admin/recipes/:id` → editar receta.
- `DELETE /admin/recipes/:id` → eliminar receta.

### Usuarios

- `POST /users/register` → registrar usuario.
- `POST /users/login` → login de usuario.

## 🛠 Ejemplo de colección Postman

1. **GET /recipes**
2. **POST /admin/recipes** (poner en headers: `x-auth: admin`)
3. **POST /users/register**
4. **POST /users/login**

## 📝 Notas

- Los datos se guardan en archivos `recipes.json` y `users.json` dentro de `/app/data`
- Es un backend simulado para fines educativos.

---

Tu backend ya está listo para ser integrado con tu frontend actual.
