// script.js (Corregido)

// --- Estado Simulado y Datos de Ejemplo ---
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null; // { username, email, fullname, role: 'user' | 'admin', favorites: [], recipes: [] }
let recipesData = [
    // Datos precargados o que simularían venir de una API
    { id: 1, owner: 'chef1', title: "Ensalada Mediterránea de Quinoa", time: 25, calories: 450, protein: 15, difficulty: 'facil', category: 'Vegano', image: 'https://source.unsplash.com/400x300/?quinoa-salad', description: "Ligera, fresca y llena de sabor.", ingredients: ["1 taza quinoa cocida", "1 pepino", "1 pimiento rojo", "Aceitunas negras", "Queso feta (opcional)", "Vinagreta"], instructions: "1. Cortar verduras.\n2. Mezclar todo.\n3. Aliñar." },
    { id: 2, owner: 'chef2', title: "Salmón al Horno con Verduras", time: 35, calories: 550, protein: 40, difficulty: 'media', category: 'Pescado', image: 'https://source.unsplash.com/400x300/?salmon-vegetables', description: "Una cena completa, nutritiva y deliciosa.", ingredients: ["2 filetes salmón", "1 brócoli", "2 zanahorias", "Aceite oliva", "Sal, pimienta"], instructions: "1. Preparar verduras.\n2. Hornear salmón y verduras a 200°C por 20 min." },
    { id: 3, owner: 'chef1', title: "Smoothie Bowl Verde Energético", time: 10, calories: 300, protein: 8, difficulty: 'facil', category: 'Batido', image: 'https://source.unsplash.com/400x300/?smoothie-bowl', description: "Empieza el día con energía.", ingredients: ["1 plátano congelado", "1 taza espinacas", "1/2 aguacate", "Leche vegetal", "Toppings (fruta, granola)"], instructions: "1. Batir ingredientes base.\n2. Servir y añadir toppings." },
    { id: 4, owner: 'admin', title: "Pollo al Limón con Brócoli", time: 30, calories: 380, protein: 45, difficulty: 'facil', category: 'Pollo', image: 'https://source.unsplash.com/400x300/?chicken-broccoli', description: "Rápido, saludable y lleno de sabor.", ingredients: ["2 pechugas pollo", "1 limón", "Brócoli", "Ajo", "Aceite oliva"], instructions: "1. Marinar pollo.\n2. Cocinar pollo.\n3. Cocer brócoli al vapor.\n4. Servir." },
    { id: 5, owner: 'chef2', title: "Lentejas Estofadas Veganas", time: 45, calories: 400, protein: 20, difficulty: 'media', category: 'Vegano', image: 'https://source.unsplash.com/400x300/?lentil-stew', description: "Un plato de cuchara reconfortante y nutritivo.", ingredients: ["1 taza lentejas pardinas", "1 cebolla", "2 zanahorias", "1 pimiento verde", "Caldo vegetal", "Pimentón"], instructions: "1. Sofreir verduras.\n2. Añadir lentejas y caldo.\n3. Cocer a fuego lento 30-40 min." }
];
let usersData = [
     { username: 'admin', email: 'admin@recipe.com', fullname: 'Admin User', role: 'admin', favorites: [2], recipes: [4] },
     { username: 'chef1', email: 'chef1@recipe.com', fullname: 'Chef Uno', role: 'user', favorites: [4, 5], recipes: [1, 3] },
     { username: 'chef2', email: 'chef2@recipe.com', fullname: 'Chef Dos', role: 'user', favorites: [], recipes: [2, 5] }
];
let categoriesData = ['Vegano', 'Vegetariano', 'Pollo', 'Pescado', 'Carne', 'Ensalada', 'Sopa', 'Postre', 'Batido', 'Rápido', 'Sin Gluten', 'Otro']; // Simulando categorías precargadas

// --- DOM Loaded Event ---
document.addEventListener('DOMContentLoaded', () => {
    updateUIBasedOnLoginState();
    setupCommonEventListeners();

    // --- Page Specific Initializations ---
    if (document.getElementById('featured-recipes-grid')) {
        loadFeaturedRecipes();
    }
    if (document.getElementById('login-form')) {
        setupLoginForm();
    }
    if (document.getElementById('register-form')) {
        setupRegisterForm();
    }
    if (document.getElementById('recipes-grid')) { // recipes.html
        populateCategoryFilters();
        loadAllRecipes(); // Carga inicial
        setupRecipeFilters();
    }
    if (document.getElementById('recipe-detail-container')) { // recipe-detail.html
        loadRecipeDetail();
    }
    if (document.getElementById('recipe-form')) { // add-recipe.html or edit
         populateCategoryDropdown();
         setupRecipeForm(); // Check if editing
    }
     if (document.getElementById('my-recipes-grid')) { // my-recipes.html
         loadMyRecipes();
     }
     if (document.getElementById('favorites-grid')) { // favorites.html
         loadFavorites();
     }
     if (document.getElementById('profile-form')) { // profile.html
         loadProfileData();
         setupProfileForm();
         setupPasswordChangeForm();
     }
      if (document.getElementById('users-table-body')) { // admin-users.html
          loadAdminUsers();
          setupAdminUserSearch();
      }
      if (document.getElementById('admin-recipes-table-body')) { // admin-recipes.html
           populateAdminCategoryFilter();
           loadAdminRecipes();
           setupAdminRecipeFilters();
      }
});

// --- UI Updates Based on Login State ---
function updateUIBasedOnLoginState() {
    const userOnlyElements = document.querySelectorAll('.user-only');
    const adminOnlyElements = document.querySelectorAll('.admin-only');
    const guestOnlyElements = document.querySelectorAll('.guest-only');
    const profileLink = document.getElementById('profile-link');
    const adminWelcome = document.getElementById('admin-welcome');

    if (currentUser) {
        guestOnlyElements.forEach(el => el.classList.add('hidden'));
        userOnlyElements.forEach(el => el.classList.remove('hidden'));
        if(profileLink) profileLink.innerHTML = `<i class="fas fa-user"></i> ${currentUser.username}`;

        if (currentUser.role === 'admin') {
            adminOnlyElements.forEach(el => el.classList.remove('hidden'));
            if(adminWelcome) adminWelcome.textContent = `Admin: ${currentUser.username}`;
            // Ocultar algunos elementos específicos de usuario normal si estamos en vista admin
            if(document.body.classList.contains('admin-only')){
                 document.querySelectorAll('.user-only:not(.admin-only)').forEach(el => {
                     // Keep logout visible for admin
                     if (el.id !== 'logout-btn' && el.id !== 'profile-link') { // profile link might be useful
                         el.classList.add('hidden');
                     }
                 });
            }
        } else {
            adminOnlyElements.forEach(el => el.classList.add('hidden'));
        }
        // Ocultar elementos admin si el body no tiene la clase (estamos en vista normal)
        if(!document.body.classList.contains('admin-only')){
             adminOnlyElements.forEach(el => el.classList.add('hidden'));
        }


    } else { // Not logged in
        guestOnlyElements.forEach(el => el.classList.remove('hidden'));
        userOnlyElements.forEach(el => el.classList.add('hidden'));
        adminOnlyElements.forEach(el => el.classList.add('hidden'));
    }
}

// --- Common Event Listeners (Logout, Main Search, Category Clicks) ---
function setupCommonEventListeners() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    const mainSearchButton = document.getElementById('main-search-button');
    const mainSearchBar = document.getElementById('main-search-bar');
    if (mainSearchButton && mainSearchBar) {
        mainSearchButton.addEventListener('click', () => {
            const searchTerm = mainSearchBar.value;
            window.location.href = `recipes.html?search=${encodeURIComponent(searchTerm)}`;
        });
        mainSearchBar.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const searchTerm = mainSearchBar.value;
                window.location.href = `recipes.html?search=${encodeURIComponent(searchTerm)}`;
            }
        });
    }

     // Category card clicks
     document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            if (category) {
                window.location.href = `recipes.html?category=${encodeURIComponent(category)}`;
            }
        });
     });
}

// --- Authentication Logic (Simulated) ---
function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUIBasedOnLoginState();
    // Redirect to home or login page after logout
    window.location.href = 'index.html';
    console.log("User logged out (simulated).");
}

function setupLoginForm() {
    const form = document.getElementById('login-form');
    const feedback = document.getElementById('form-feedback');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        feedback.style.display = 'none';
        feedback.className = 'form-feedback';
        const email = form.email.value;
        const password = form.password.value; // En una app real, no se compara la contraseña directamente aquí

        // Simulación de búsqueda de usuario
        const foundUser = usersData.find(user => user.email === email); // Añadir chequeo de contraseña en backend

        if (foundUser) { // Simular éxito si el usuario existe
            currentUser = foundUser;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            console.log(`Login successful for ${currentUser.username} (simulated).`);
            // Redirigir al index o dashboard
            window.location.href = 'index.html';
        } else {
             feedback.textContent = 'Correo o contraseña incorrectos.';
             feedback.className = 'form-feedback error';
             feedback.style.display = 'block';
        }
    });
}

function setupRegisterForm() {
    const form = document.getElementById('register-form');
    const feedback = document.getElementById('form-feedback');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        feedback.style.display = 'none';
        feedback.className = 'form-feedback';

        // Validación simple
        let isValid = true;
        const username = form.username.value.trim();
        const email = form.email.value.trim();
        const fullname = form['full-name'].value.trim();
        const password = form.password.value;
        const confirmPassword = form['confirm-password'].value;

        // Reset validation messages
        form.querySelectorAll('.validation-message').forEach(msg => msg.style.display = 'none');
        form.querySelectorAll('input').forEach(input => input.style.borderColor = '');

        if (!username) {
            isValid = false;
            showValidationError(form.username, 'Nombre de usuario requerido.');
        }
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
             isValid = false;
             showValidationError(form.email, 'Correo inválido.');
        } else if (usersData.some(user => user.email === email)) { // Check if email exists
             isValid = false;
             showValidationError(form.email, 'Este correo ya está registrado.');
        }
        if (!fullname) {
            isValid = false;
            showValidationError(form['full-name'], 'Nombre completo requerido.');
        }
        if (password.length < 6) {
             isValid = false;
             showValidationError(form.password, 'La contraseña debe tener al menos 6 caracteres.');
        }
        if (password !== confirmPassword) {
             isValid = false;
             showValidationError(form['confirm-password'], 'Las contraseñas no coinciden.');
        }

        if (isValid) {
            // Simulación de registro exitoso
            const newUser = {
                username: username,
                email: email,
                fullname: fullname,
                role: 'user', // Por defecto 'user'
                favorites: [],
                recipes: []
                // En una app real, la contraseña se hashearía en el backend
            };
            usersData.push(newUser); // Añadir al array simulado
            console.log(`User registered: ${username} (simulated). Data:`, newUser);

            // Simular autologin después del registro
            currentUser = newUser;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));

            // Mostrar mensaje de éxito y redirigir
             feedback.textContent = '¡Registro exitoso! Redirigiendo...';
             feedback.className = 'form-feedback success';
             feedback.style.display = 'block';
             setTimeout(() => { window.location.href = 'index.html'; }, 1500);

        } else {
              feedback.textContent = 'Por favor, corrige los errores en el formulario.';
              feedback.className = 'form-feedback error';
              feedback.style.display = 'block';
        }
    });
}


// --- Recipe Loading and Display ---
function createRecipeCard(recipe, isFavorite = false) {
    const isOwner = currentUser && recipe.owner === currentUser.username;
    const isAdmin = currentUser && currentUser.role === 'admin';
    const card = document.createElement('article');
    card.className = 'recipe-card';
    card.dataset.id = recipe.id; // Store id for actions

    // Favorite button logic
    let favBtnClass = 'favorite-btn';
    let favIconClass = 'far fa-heart'; // Default empty heart
    if (currentUser && currentUser.favorites.includes(recipe.id)) {
        favBtnClass += ' active';
        favIconClass = 'fas fa-heart'; // Solid heart if favorite
    }

    card.innerHTML = `
        ${currentUser ? `<button class="${favBtnClass}" title="Guardar Favorito"><i class="${favIconClass}"></i></button>` : ''}
        <a href="recipe-detail.html?id=${recipe.id}">
             <img src="${recipe.image || 'https://source.unsplash.com/400x300/?food'}" alt="${recipe.title}">
        </a>
        <div class="recipe-card-content">
            <h3><a href="recipe-detail.html?id=${recipe.id}">${recipe.title}</a></h3>
            <p class="description">${recipe.description || 'Deliciosa receta.'}</p>
            <div class="details">
                <span><i class="fas fa-clock"></i> ${recipe.time || '?'} min</span>
                <span><i class="fas fa-fire-alt"></i> ${recipe.calories || '?'} kcal</span>
                <span class="rating"><i class="fas fa-star"></i> ${recipe.rating || 'N/A'}</span>
            </div>
             ${(isOwner || isAdmin) && (window.location.pathname.includes('my-recipes.html') || window.location.pathname.includes('admin-recipes.html')) ? `
                <div class="card-actions" style="margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--border-color); display: flex; gap: 5px;">
                     <a href="add-recipe.html?edit=${recipe.id}" class="btn btn-secondary btn-sm"><i class="fas fa-edit"></i> Editar</a>
                     <button class="btn btn-danger btn-sm delete-recipe-btn"><i class="fas fa-trash"></i> Eliminar</button>
                </div>
            ` : ''}
        </div>
    `;

    // Add event listener for favorite button AFTER adding to DOM
    const favButton = card.querySelector('.favorite-btn');
    if (favButton) {
        favButton.addEventListener('click', (e) => {
             e.stopPropagation(); // Prevent link navigation
            toggleFavorite(recipe.id, favButton);
        });
    }
     // Add event listener for delete button
    const deleteButton = card.querySelector('.delete-recipe-btn');
    if (deleteButton) {
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm(`¿Estás seguro de que quieres eliminar la receta "${recipe.title}"?`)) {
                deleteRecipe(recipe.id, card);
            }
        });
    }

    return card;
}

function loadFeaturedRecipes() {
    const grid = document.getElementById('featured-recipes-grid');
    if (!grid) return;
    grid.innerHTML = ''; // Clear previous
    // Simular "destacadas" (primeras 3)
    recipesData.slice(0, 3).forEach(recipe => {
        const isFav = currentUser ? currentUser.favorites.includes(recipe.id) : false;
        grid.appendChild(createRecipeCard(recipe, isFav));
    });
}

function loadAllRecipes(filteredRecipes = recipesData) {
     const grid = document.getElementById('recipes-grid'); // recipes.html grid
     const noResults = document.getElementById('no-results-message');
     if (!grid || !noResults) return;
     grid.innerHTML = ''; // Clear previous

     if (filteredRecipes.length === 0) {
         noResults.style.display = 'block';
     } else {
         noResults.style.display = 'none';
         filteredRecipes.forEach(recipe => {
              const isFav = currentUser ? currentUser.favorites.includes(recipe.id) : false;
             grid.appendChild(createRecipeCard(recipe, isFav));
         });
     }
}

function loadRecipeDetail() {
    const container = document.getElementById('recipe-detail-container');
    if (!container) return;

    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = parseInt(urlParams.get('id'), 10);
    const recipe = recipesData.find(r => r.id === recipeId);

    if (recipe) {
        const isFav = currentUser ? currentUser.favorites.includes(recipe.id) : false;
        let favBtnClass = 'favorite-btn btn btn-light';
        let favIconClass = 'far fa-heart';
         if (isFav) {
            favBtnClass += ' active'; // Needs styling in CSS
            favIconClass = 'fas fa-heart';
        }

         const isOwner = currentUser && recipe.owner === currentUser.username;
         const isAdmin = currentUser && currentUser.role === 'admin';

        container.innerHTML = `
             <header class="recipe-detail-header">
                <img src="${recipe.image || 'https://source.unsplash.com/800x400/?food'}" alt="${recipe.title}">
             </header>
             <div class="recipe-detail-content">
                <h1>${recipe.title}</h1>
                <div class="recipe-meta">
                    <span><i class="fas fa-clock"></i> ${recipe.time || '?'} min</span>
                    <span><i class="fas fa-fire-alt"></i> ${recipe.calories || '?'} kcal</span>
                     <span><i class="fas fa-dumbbell"></i> ${recipe.protein || '?'} g Prot.</span>
                    <span><i class="fas fa-utensils"></i> ${recipe.category || 'General'}</span>
                    <span><i class="fas fa-tachometer-alt"></i> ${recipe.difficulty ? recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1) : '?'}</span>
                    <span class="rating"><i class="fas fa-star"></i> ${recipe.rating || 'N/A'}</span>
                 </div>
                 <p style="margin-bottom: 1.5rem; color: var(--light-text-color);">${recipe.description || ''}</p>

                <div class="recipe-detail-actions">
                    ${currentUser ? `<button class="${favBtnClass}" id="detail-fav-btn" data-recipe-id="${recipe.id}"><i class="${favIconClass}"></i> ${isFav ? 'Quitar Favorito' : 'Guardar Favorito'}</button>` : ''}
                     ${(isOwner || isAdmin) ? `<a href="add-recipe.html?edit=${recipe.id}" class="btn btn-secondary"><i class="fas fa-edit"></i> Editar Receta</a>` : ''}
                     ${(isAdmin || isOwner) ? `<button id="detail-delete-btn" class="btn btn-danger"><i class="fas fa-trash"></i> Eliminar Receta</button>` : ''}
                 </div>


                 <div class="tabs" style="margin-top: 2rem;">
                    <div class="tab active" data-tab="ingredients-detail">Ingredientes</div>
                    <div class="tab" data-tab="instructions-detail">Instrucciones</div>
                 </div>

                <div id="ingredients-detail" class="tab-content active">
                    <h3>Ingredientes</h3>
                    <ul>${(typeof recipe.ingredients === 'string' ? recipe.ingredients.split('\n') : recipe.ingredients || []).map(ing => `<li>${ing}</li>`).join('')}</ul>
                </div>
                <div id="instructions-detail" class="tab-content">
                    <h3>Instrucciones</h3>
                    <ol>${(recipe.instructions || '').split('\n').map(step => step.trim() ? `<li>${step.replace(/^\d+\.\s*/, '')}</li>` : '').join('')}</ol>
                </div>
             </div>
        `;
        // Re-setup tabs and add listeners for new buttons
        setupTabs('#recipe-detail-container');
         const detailFavBtn = document.getElementById('detail-fav-btn');
         if (detailFavBtn) {
             detailFavBtn.addEventListener('click', () => {
                 toggleFavorite(recipe.id, detailFavBtn, true); // Pass true to update text
             });
         }
          const detailDeleteBtn = document.getElementById('detail-delete-btn');
          if (detailDeleteBtn) {
                detailDeleteBtn.addEventListener('click', () => {
                    if (confirm(`¿Estás seguro de que quieres eliminar la receta "${recipe.title}"?`)) {
                        deleteRecipe(recipe.id, null, true); // Pass true to redirect after delete
                    }
                });
          }

    } else {
        container.innerHTML = '<p style="text-align: center; padding: 2rem;">Receta no encontrada.</p>';
    }
}


// --- Filtering Logic (Simulated) ---
function populateCategoryFilters() {
    const container = document.getElementById('filter-categories-list');
    if (!container) return;
    container.innerHTML = ''; // Clear existing
    categoriesData.forEach(cat => {
        const label = document.createElement('label');
        label.innerHTML = `<input type="checkbox" name="category" value="${cat.toLowerCase()}"> ${cat}`;
        container.appendChild(label);
    });
}

function setupRecipeFilters() {
    const applyBtn = document.getElementById('apply-filters-btn');
    const searchInput = document.getElementById('filter-search');
    const timeInput = document.getElementById('filter-time');
    const timeValueSpan = document.getElementById('time-value');
    const caloriesInput = document.getElementById('filter-calories');
    const proteinInput = document.getElementById('filter-protein');
    const difficultySelect = document.getElementById('filter-difficulty');
    const categoryCheckboxes = document.querySelectorAll('#filter-categories-list input[name="category"]');

     // Update time value label
     if (timeInput && timeValueSpan) {
        timeInput.addEventListener('input', () => { timeValueSpan.textContent = timeInput.value; });
        timeValueSpan.textContent = timeInput.value; // Initial value
     }


    // Check for URL params and apply initial filters
    const urlParams = new URLSearchParams(window.location.search);
    const initialSearch = urlParams.get('search');
    const initialCategory = urlParams.get('category');
    if(initialSearch && searchInput) searchInput.value = initialSearch;
    if(initialCategory && categoryCheckboxes) {
         const matchingCheckbox = document.querySelector(`#filter-categories-list input[value="${initialCategory.toLowerCase()}"]`);
         if(matchingCheckbox) matchingCheckbox.checked = true;
    }
    // Apply initial filter if params exist
    if(initialSearch || initialCategory) applyFilters();


    if (applyBtn) {
        applyBtn.addEventListener('click', applyFilters);
    }
}

function applyFilters() {
    const searchInput = document.getElementById('filter-search');
    const timeInput = document.getElementById('filter-time');
    const caloriesInput = document.getElementById('filter-calories');
    const proteinInput = document.getElementById('filter-protein');
    const difficultySelect = document.getElementById('filter-difficulty');
    const categoryCheckboxes = document.querySelectorAll('#filter-categories-list input[name="category"]:checked');

    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const maxTime = timeInput ? parseInt(timeInput.value, 10) : 9999; // Increased default max time
    const maxCalories = caloriesInput && caloriesInput.value ? parseInt(caloriesInput.value, 10) : 9999;
    const minProtein = proteinInput && proteinInput.value ? parseInt(proteinInput.value, 10) : 0;
    const selectedDifficulty = difficultySelect ? difficultySelect.value : '';
    const selectedCategories = categoryCheckboxes ? Array.from(categoryCheckboxes).map(cb => cb.value) : [];

    const filtered = recipesData.filter(recipe => {
        const titleMatch = !searchTerm || (recipe.title && recipe.title.toLowerCase().includes(searchTerm));
        // Ensure properties exist before comparing
        const timeMatch = recipe.time === undefined || recipe.time === null || recipe.time <= maxTime;
        const caloriesMatch = recipe.calories === undefined || recipe.calories === null || recipe.calories <= maxCalories;
        const proteinMatch = recipe.protein === undefined || recipe.protein === null || recipe.protein >= minProtein;
        const difficultyMatch = !selectedDifficulty || (recipe.difficulty && recipe.difficulty === selectedDifficulty);
        const categoryMatch = selectedCategories.length === 0 || (recipe.category && selectedCategories.includes(recipe.category.toLowerCase()));

        return titleMatch && timeMatch && caloriesMatch && proteinMatch && difficultyMatch && categoryMatch;
    });

    loadAllRecipes(filtered); // Reload grid with filtered data
}

// --- Favorite Logic (Simulated) ---
function toggleFavorite(recipeId, buttonElement, updateText = false) {
    if (!currentUser) {
        alert("Debes iniciar sesión para guardar favoritos.");
        return;
    }

    const recipeIndex = currentUser.favorites.indexOf(recipeId);
    const icon = buttonElement.querySelector('i');

    if (recipeIndex > -1) { // Is favorite, remove it
        currentUser.favorites.splice(recipeIndex, 1);
        buttonElement.classList.remove('active');
        if(icon) icon.className = 'far fa-heart';
         if (updateText) buttonElement.innerHTML = `<i class="far fa-heart"></i> Guardar Favorito`;
         console.log(`Recipe ${recipeId} removed from favorites (simulated).`);
         // If on favorites page, remove the card
         if (window.location.pathname.includes('favorites.html')) {
             const cardToRemove = document.querySelector(`.recipe-card[data-id="${recipeId}"]`);
             if (cardToRemove) cardToRemove.remove();
              checkIfFavoritesEmpty(); // Update message if needed
         }
    } else { // Not favorite, add it
        currentUser.favorites.push(recipeId);
        buttonElement.classList.add('active');
        if(icon) icon.className = 'fas fa-heart';
         if (updateText) buttonElement.innerHTML = `<i class="fas fa-heart"></i> Quitar Favorito`;
         console.log(`Recipe ${recipeId} added to favorites (simulated).`);
    }

    // Update localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    // Update the user data in the main array (important for consistency if page reloads)
    const userIndex = usersData.findIndex(u => u.username === currentUser.username);
    if (userIndex > -1) {
        usersData[userIndex].favorites = currentUser.favorites;
    }
}

function loadFavorites() {
    const grid = document.getElementById('favorites-grid');
    const noResults = document.getElementById('no-results-message');
    if (!grid || !noResults) return;
    grid.innerHTML = '';

    if (!currentUser) {
        grid.innerHTML = '<p>Debes iniciar sesión para ver tus favoritos.</p>';
        noResults.style.display = 'none';
        return;
    }

    const favoriteRecipes = recipesData.filter(recipe => currentUser.favorites.includes(recipe.id));

    if (favoriteRecipes.length === 0) {
        noResults.style.display = 'block';
    } else {
        noResults.style.display = 'none';
        favoriteRecipes.forEach(recipe => {
            grid.appendChild(createRecipeCard(recipe, true)); // Mark as favorite
        });
    }
}

function checkIfFavoritesEmpty() {
     const grid = document.getElementById('favorites-grid');
     const noResults = document.getElementById('no-results-message');
     if (grid && noResults && grid.children.length === 0) {
         noResults.style.display = 'block';
     }
}


// --- Recipe Form Logic (Add/Edit) ---
function populateCategoryDropdown() {
    const select = document.getElementById('recipe-category');
    if (!select) return;
     select.innerHTML = '<option value="">Selecciona...</option>'; // Reset
    categoriesData.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat; // Use original case for value consistency
        option.textContent = cat;
        select.appendChild(option);
    });
}

function setupRecipeForm() {
    const form = document.getElementById('recipe-form');
    const feedback = document.getElementById('form-feedback');
    const formTitle = document.getElementById('form-title');
    const recipeIdInput = document.getElementById('recipe-id');
    if (!form) return;

    // Check if editing
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('edit');

    if (editId) {
        const recipeToEdit = recipesData.find(r => r.id === parseInt(editId, 10));
        // Check ownership or admin role
        if (recipeToEdit && (currentUser && (recipeToEdit.owner === currentUser.username || currentUser.role === 'admin'))) {
            formTitle.textContent = "Editar Receta";
            recipeIdInput.value = recipeToEdit.id;
            form.title.value = recipeToEdit.title || '';
            form.description.value = recipeToEdit.description || '';
            form.image.value = recipeToEdit.image || '';
            form.time.value = recipeToEdit.time || '';
            form.calories.value = recipeToEdit.calories || '';
            form.protein.value = recipeToEdit.protein || '';
            form.difficulty.value = recipeToEdit.difficulty || '';
            form.category.value = recipeToEdit.category || '';
            // Handle ingredients array properly
            form.ingredients.value = Array.isArray(recipeToEdit.ingredients) ? recipeToEdit.ingredients.join('\n') : (recipeToEdit.ingredients || '');
            form.instructions.value = recipeToEdit.instructions || '';
        } else {
             alert("No puedes editar esta receta o la receta no existe.");
             window.location.href = 'index.html'; // Redirect if not allowed
             return; // Stop form setup
        }
    } else {
         formTitle.textContent = "Añadir Nueva Receta";
    }


    form.addEventListener('submit', (e) => {
        e.preventDefault();
        feedback.style.display = 'none';
        feedback.className = 'form-feedback';
        let isValid = true;

        // Simple validation
        form.querySelectorAll('[required]').forEach(field => {
             const validationMessage = field.parentElement.querySelector('.validation-message') || field.closest('.form-group')?.querySelector('.validation-message');
             field.style.borderColor = ''; // Reset border color initially
             if(validationMessage) validationMessage.style.display = 'none';

            if (!field.value.trim()) {
                isValid = false;
                field.style.borderColor = 'var(--danger-color)'; // **CORRECTED SYNTAX**
                if (validationMessage) validationMessage.style.display = 'block';
            } else if (field.type === 'url' && !isValidUrl(field.value.trim())) {
                isValid = false;
                field.style.borderColor = 'var(--danger-color)'; // **CORRECTED SYNTAX**
                if (validationMessage) {
                     validationMessage.textContent = 'URL inválida.';
                     validationMessage.style.display = 'block';
                }
            } else if (field.type === 'number' && field.value < (parseInt(field.min, 10) || 0)) {
                 isValid = false;
                 field.style.borderColor = 'var(--danger-color)'; // **CORRECTED SYNTAX**
                 if (validationMessage) {
                      validationMessage.textContent = `Valor debe ser mayor o igual a ${field.min || 0}.`;
                      validationMessage.style.display = 'block';
                 }
            }
        });

        if (isValid && currentUser) {
            const formData = new FormData(form);
            const recipeData = {
                id: recipeIdInput.value ? parseInt(recipeIdInput.value, 10) : Date.now(), // Use existing ID or generate new timestamp ID
                owner: recipeIdInput.value ? recipesData.find(r=>r.id === parseInt(recipeIdInput.value))?.owner : currentUser.username, // Preserve owner on edit
                title: formData.get('title'),
                description: formData.get('description'),
                image: formData.get('image'),
                time: parseInt(formData.get('time'), 10),
                calories: parseInt(formData.get('calories'), 10),
                protein: parseInt(formData.get('protein'), 10),
                difficulty: formData.get('difficulty'),
                category: formData.get('category'),
                ingredients: formData.get('ingredients').split('\n').map(i => i.trim()).filter(i => i),
                instructions: formData.get('instructions'),
                rating: recipeIdInput.value ? recipesData.find(r=>r.id === parseInt(recipeIdInput.value))?.rating : 'N/A' // Preserve rating on edit
            };

            if (recipeIdInput.value) { // Editing
                 const index = recipesData.findIndex(r => r.id === recipeData.id);
                 if (index > -1) {
                     recipesData[index] = recipeData;
                     console.log("Recipe updated (simulated):", recipeData);
                     feedback.textContent = '¡Receta actualizada con éxito!';
                 }
            } else { // Adding new
                recipesData.push(recipeData);
                 // Add recipe ID to user's recipes if user exists
                 if (currentUser) {
                     currentUser.recipes.push(recipeData.id);
                     localStorage.setItem('currentUser', JSON.stringify(currentUser));
                     const userIndex = usersData.findIndex(u => u.username === currentUser.username);
                     if (userIndex > -1) usersData[userIndex].recipes = currentUser.recipes;
                 }
                 console.log("Recipe added (simulated):", recipeData);
                 feedback.textContent = '¡Receta añadida con éxito!';
                 form.reset(); // Clear form after adding new
            }
            feedback.className = 'form-feedback success';
            feedback.style.display = 'block';
             // Optional: Redirect after success
             setTimeout(() => {
                 window.location.href = recipeIdInput.value ? `recipe-detail.html?id=${recipeData.id}` : 'my-recipes.html';
             }, 1500);

        } else if (!currentUser) {
             feedback.textContent = 'Debes iniciar sesión para añadir/editar recetas.';
             feedback.className = 'form-feedback error';
             feedback.style.display = 'block';
        } else {
             feedback.textContent = 'Por favor, corrige los errores.';
             feedback.className = 'form-feedback error';
             feedback.style.display = 'block';
        }
    });
}


// --- My Recipes Logic ---
function loadMyRecipes() {
     const grid = document.getElementById('my-recipes-grid');
     const noResults = document.getElementById('no-results-message');
     if (!grid || !noResults) return;
     grid.innerHTML = '';

     if (!currentUser) {
        grid.innerHTML = '<p>Debes iniciar sesión para ver tus recetas.</p>';
         noResults.style.display = 'none';
         return;
     }

     const myRecipes = recipesData.filter(recipe => recipe.owner === currentUser.username);

     if (myRecipes.length === 0) {
        noResults.style.display = 'block';
     } else {
         noResults.style.display = 'none';
         myRecipes.forEach(recipe => {
             const isFav = currentUser.favorites.includes(recipe.id);
             grid.appendChild(createRecipeCard(recipe, isFav)); // Pass isFav status
         });
     }
}

function deleteRecipe(recipeId, cardElement = null, redirectAfter = false) {
     // Find index in main data
     const recipeIndex = recipesData.findIndex(r => r.id === recipeId);
     if (recipeIndex > -1) {
         const recipeOwner = recipesData[recipeIndex].owner;
         recipesData.splice(recipeIndex, 1); // Remove from main data
         console.log(`Recipe ${recipeId} deleted from main data (simulated).`);

         // Remove from owner's recipe list in usersData
         const ownerIndex = usersData.findIndex(u => u.username === recipeOwner);
         if(ownerIndex > -1){
            const userRecipeIndex = usersData[ownerIndex].recipes.indexOf(recipeId);
            if(userRecipeIndex > -1) {
                usersData[ownerIndex].recipes.splice(userRecipeIndex, 1);
                 console.log(`Recipe ${recipeId} removed from owner ${recipeOwner}'s list (simulated).`);
                 // If current user is the owner, update local storage
                 if(currentUser && currentUser.username === recipeOwner){
                     currentUser.recipes = usersData[ownerIndex].recipes;
                     localStorage.setItem('currentUser', JSON.stringify(currentUser));
                 }
            }
         }


         // Remove from all users' favorites
         usersData.forEach(user => {
             const favIndex = user.favorites.indexOf(recipeId);
             if (favIndex > -1) {
                 user.favorites.splice(favIndex, 1);
                 console.log(`Recipe ${recipeId} removed from user ${user.username}'s favorites (simulated).`);
                  // If current user, update local storage
                 if(currentUser && currentUser.username === user.username){
                     currentUser.favorites = user.favorites;
                     localStorage.setItem('currentUser', JSON.stringify(currentUser));
                 }
             }
         });

         // Remove card from UI if provided
         if (cardElement) {
             cardElement.remove();
              // Check if grid is now empty (e.g., on my-recipes page)
              const grid = cardElement.parentElement;
               // Check both potential parent grids
              const myRecipesGrid = document.getElementById('my-recipes-grid');
              const adminRecipesTable = document.getElementById('admin-recipes-table-body');
              const noResultsMsg = document.getElementById('no-results-message');

               if (grid && noResultsMsg && grid.children.length === 0) {
                  noResultsMsg.style.display = 'block';
              } else if (adminRecipesTable && noResultsMsg && adminRecipesTable.children.length === 0) {
                   // Handle empty table case for admin view if needed
                   noResultsMsg.style.display = 'block';
              }
         }

          if (redirectAfter) {
             // Redirect to a relevant page, e.g., the main recipe list or user's recipe list
             alert("Receta eliminada.");
             window.location.href = currentUser?.role === 'admin' ? 'admin-recipes.html' : 'my-recipes.html';
         } else if (window.location.pathname.includes('admin-recipes.html')) {
             // Refresh admin table if deleted from there without redirect
             loadAdminRecipes();
         }


     } else {
         console.error(`Recipe with ID ${recipeId} not found for deletion.`);
     }
}



// --- Profile Logic ---
function loadProfileData() {
     if (!currentUser) return;
     const usernameInput = document.getElementById('profile-username');
     const emailInput = document.getElementById('profile-email');
     const fullnameInput = document.getElementById('profile-fullname');

     if(usernameInput) usernameInput.value = currentUser.username;
     if(emailInput) emailInput.value = currentUser.email;
     if(fullnameInput) fullnameInput.value = currentUser.fullname;
}

function setupProfileForm() {
     const form = document.getElementById('profile-form');
     const feedback = document.getElementById('profile-feedback');
     if (!form || !currentUser) return;

     form.addEventListener('submit', (e) => {
         e.preventDefault();
         feedback.style.display = 'none';
         feedback.className = 'form-feedback';

         const email = form.email.value.trim();
         const fullname = form.fullname.value.trim();
         let isValid = true;

         // Validation
         if (!email || !/\S+@\S+\.\S+/.test(email)) {
             isValid = false;
             showValidationError(form.email, 'Correo inválido.');
         } else if (usersData.some(user => user.email === email && user.username !== currentUser.username)) {
             isValid = false;
             showValidationError(form.email, 'Este correo ya está en uso por otro usuario.');
         } else {
             hideValidationError(form.email);
         }

          if (!fullname) {
             isValid = false;
             showValidationError(form.fullname, 'Nombre completo requerido.');
         } else {
              hideValidationError(form.fullname);
         }


         if (isValid) {
             // Update simulated data
             currentUser.email = email;
             currentUser.fullname = fullname;
             localStorage.setItem('currentUser', JSON.stringify(currentUser));
             const userIndex = usersData.findIndex(u => u.username === currentUser.username);
             if(userIndex > -1) {
                 usersData[userIndex].email = email;
                 usersData[userIndex].fullname = fullname;
             }
             console.log("Profile updated (simulated):", currentUser);
             feedback.textContent = 'Perfil actualizado con éxito.';
             feedback.className = 'form-feedback success';
             feedback.style.display = 'block';
         } else {
              feedback.textContent = 'Error al actualizar. Revisa los campos.';
              feedback.className = 'form-feedback error';
              feedback.style.display = 'block';
         }
     });
}

function setupPasswordChangeForm() {
      const form = document.getElementById('password-change-form');
      const feedback = document.getElementById('password-feedback');
      if (!form || !currentUser) return;

      form.addEventListener('submit', (e) => {
         e.preventDefault();
         feedback.style.display = 'none';
         feedback.className = 'form-feedback';
         let isValid = true;

         const currentPassword = form['current-password'].value;
         const newPassword = form['new-password'].value;
         const confirmNewPassword = form['confirm-new-password'].value;

         // Reset validation
         form.querySelectorAll('.validation-message').forEach(msg => msg.style.display = 'none');
         form.querySelectorAll('input').forEach(input => input.style.borderColor = '');

         // Simulate checking current password (in real app, this happens server-side)
         if (!currentPassword) { // Basic check - needs backend validation
             isValid = false;
             showValidationError(form['current-password'], 'Contraseña actual requerida.');
         } else {
             // Simulate incorrect password - REPLACE WITH ACTUAL BACKEND CHECK
             // if (currentPassword !== 'real_current_password_from_backend') {
             //     isValid = false;
             //     showValidationError(form['current-password'], 'Contraseña actual incorrecta.');
             // }
             hideValidationError(form['current-password']);
         }


         if (newPassword.length < 6) {
              isValid = false;
              showValidationError(form['new-password'], 'La nueva contraseña debe tener al menos 6 caracteres.');
         } else {
              hideValidationError(form['new-password']);
         }

         if (newPassword !== confirmNewPassword) {
              isValid = false;
              showValidationError(form['confirm-new-password'], 'Las contraseñas no coinciden.');
         } else {
              hideValidationError(form['confirm-new-password']);
         }


         if (isValid) {
              // Simulate successful password change (in real app, send to backend)
              console.log("Password change requested (simulated). New password:", newPassword);
              feedback.textContent = 'Contraseña cambiada con éxito (Simulación).';
              feedback.className = 'form-feedback success';
              feedback.style.display = 'block';
              form.reset(); // Clear form
         } else {
               feedback.textContent = 'Error al cambiar contraseña. Revisa los campos.';
               feedback.className = 'form-feedback error';
               feedback.style.display = 'block';
         }
      });
}

// --- Admin Logic ---
function loadAdminUsers(filteredUsers = usersData) {
     const tableBody = document.getElementById('users-table-body');
     const noResults = document.getElementById('no-results-message');
     if (!tableBody || !noResults) return;
     tableBody.innerHTML = '';

     // Check if admin before proceeding
     if (!currentUser || currentUser.role !== 'admin') {
         // Redirect or show access denied message
          const mainContainer = document.querySelector('main.container');
          if (mainContainer) {
              mainContainer.innerHTML = '<h1 class="page-title">Acceso Denegado</h1><p>Necesitas ser administrador para ver esta página.</p><a href="index.html" class="btn btn-primary" style="margin-top: 1rem;">Ir al Inicio</a>';
          }
         return;
     }


     if (filteredUsers.length === 0) {
         noResults.style.display = 'block';
     } else {
          noResults.style.display = 'none';
         filteredUsers.forEach(user => {
             const row = document.createElement('tr');
             row.innerHTML = `
                 <td>${user.username}</td>
                 <td>${user.email}</td>
                 <td>${user.fullname}</td>
                 <td>
                     <select class="user-role-select" data-username="${user.username}" ${user.username === currentUser.username ? 'disabled' : ''}>
                         <option value="user" ${user.role === 'user' ? 'selected' : ''}>Usuario</option>
                         <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                     </select>
                 </td>
                 <td class="table-actions">
                     <button class="btn btn-danger btn-sm delete-user-btn" data-username="${user.username}" ${user.username === currentUser.username ? 'disabled' : ''}>
                         <i class="fas fa-trash"></i> Eliminar
                     </button>
                 </td>
             `;
             tableBody.appendChild(row);
         });

          // Add event listeners after rows are in the DOM
          setupAdminUserActions();
     }
}

function setupAdminUserActions() {
     document.querySelectorAll('.user-role-select').forEach(select => {
         select.addEventListener('change', (e) => {
             const username = e.target.dataset.username;
             const newRole = e.target.value;
              if (confirm(`¿Cambiar el rol de ${username} a ${newRole}?`)) {
                  changeUserRole(username, newRole);
             } else {
                 // Revert select if cancelled
                 const userIndex = usersData.findIndex(u => u.username === username);
                 if(userIndex > -1) e.target.value = usersData[userIndex].role;
             }
         });
     });

      document.querySelectorAll('.delete-user-btn').forEach(button => {
         button.addEventListener('click', (e) => {
             const username = e.target.closest('button').dataset.username;
             if (confirm(`¿Estás seguro de eliminar al usuario ${username}? Esta acción no se puede deshacer.`)) {
                  deleteUser(username);
             }
         });
     });
}

function changeUserRole(username, newRole) {
    const userIndex = usersData.findIndex(u => u.username === username);
    if (userIndex > -1) {
        usersData[userIndex].role = newRole;
        console.log(`User ${username} role changed to ${newRole} (simulated).`);
        // Potentially update currentUser if admin changes their own role, though UI might prevent this
         if(currentUser && currentUser.username === username) {
             currentUser.role = newRole;
             localStorage.setItem('currentUser', JSON.stringify(currentUser));
             updateUIBasedOnLoginState(); // Re-render UI potentially
         }
         loadAdminUsers(); // Refresh table view
    }
}

function deleteUser(username) {
     const userIndex = usersData.findIndex(u => u.username === username);
     if (userIndex > -1) {
         // Optional: Decide what to do with the user's recipes (delete them, reassign, mark as orphaned)
         // Simple approach: delete recipes owned by the user
         const userRecipes = usersData[userIndex].recipes || [];
         userRecipes.forEach(recipeId => {
            // Need a robust way to delete recipes and handle cascade (remove from favorites etc.)
            // For simulation, just log it
            console.log(`Recipe ${recipeId} owned by deleted user ${username} should be handled.`);
            // Find and remove the recipe from the main list (could call deleteRecipe)
             const recipeIdx = recipesData.findIndex(r => r.id === recipeId);
             if (recipeIdx > -1) {
                 console.log(`Deleting recipe ${recipeId} owned by ${username}`);
                 // Call deleteRecipe which handles favorites etc.
                 deleteRecipe(recipeId); // Let deleteRecipe handle the cascading
             }
         });


         usersData.splice(userIndex, 1); // Remove user
         console.log(`User ${username} deleted (simulated).`);
         loadAdminUsers(); // Refresh table view
     }
}


function setupAdminUserSearch() {
    const searchInput = document.getElementById('user-search');
    if (!searchInput) return;

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filtered = usersData.filter(user =>
            user.username.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm) ||
            user.fullname.toLowerCase().includes(searchTerm)
        );
        loadAdminUsers(filtered);
    });
}


function populateAdminCategoryFilter() {
     const select = document.getElementById('admin-filter-category');
     if (!select) return;
     select.innerHTML = '<option value="">Todas</option>'; // Reset
     categoriesData.forEach(cat => {
         const option = document.createElement('option');
         option.value = cat; // Use original case or lowercase consistently
         option.textContent = cat;
         select.appendChild(option);
     });
}


function loadAdminRecipes(filteredRecipes = recipesData) {
     const tableBody = document.getElementById('admin-recipes-table-body');
     const noResults = document.getElementById('no-results-message');
     if (!tableBody || !noResults) return;
     tableBody.innerHTML = '';

     // Check if admin before proceeding
     if (!currentUser || currentUser.role !== 'admin') {
          const mainContainer = document.querySelector('main.container');
          if (mainContainer) {
              mainContainer.innerHTML = '<h1 class="page-title">Acceso Denegado</h1><p>Necesitas ser administrador para ver esta página.</p><a href="index.html" class="btn btn-primary" style="margin-top: 1rem;">Ir al Inicio</a>';
          }
          noResults.style.display = 'none';
          return;
     }


      if (filteredRecipes.length === 0) {
         noResults.style.display = 'block';
     } else {
          noResults.style.display = 'none';
         filteredRecipes.forEach(recipe => {
             const row = document.createElement('tr');
             row.innerHTML = `
                 <td><a href="recipe-detail.html?id=${recipe.id}">${recipe.title}</a></td>
                 <td>${recipe.category || '-'}</td>
                 <td>${recipe.time || '?'} min</td>
                 <td>${recipe.calories || '?'} kcal</td>
                 <td>${recipe.difficulty ? recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1) : '?'}</td>
                 <td class="table-actions">
                     <a href="add-recipe.html?edit=${recipe.id}" class="btn btn-secondary btn-sm"><i class="fas fa-edit"></i> Editar</a>
                     <button class="btn btn-danger btn-sm delete-recipe-btn-admin" data-recipe-id="${recipe.id}"><i class="fas fa-trash"></i> Eliminar</button>
                 </td>
             `;
             tableBody.appendChild(row);
         });
         setupAdminRecipeActions(); // Add listeners for delete buttons
     }
}

function setupAdminRecipeActions() {
      document.querySelectorAll('.delete-recipe-btn-admin').forEach(button => {
         button.addEventListener('click', (e) => {
             const recipeId = parseInt(e.target.closest('button').dataset.recipeId, 10);
             const recipe = recipesData.find(r => r.id === recipeId);
             if (recipe && confirm(`¿Estás seguro de eliminar la receta "${recipe.title}"?`)) {
                  deleteRecipe(recipeId); // Use the existing delete function
                  loadAdminRecipes(); // Refresh the admin table
             }
         });
     });
}

function setupAdminRecipeFilters() {
     const applyBtn = document.getElementById('admin-apply-filters-btn');
     if (!applyBtn) return;

     applyBtn.addEventListener('click', () => {
         const searchInput = document.getElementById('admin-filter-search');
         const categorySelect = document.getElementById('admin-filter-category');
         const difficultySelect = document.getElementById('admin-filter-difficulty');
         const sortBySelect = document.getElementById('admin-sort-by');

         const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
         const selectedCategory = categorySelect ? categorySelect.value : '';
         const selectedDifficulty = difficultySelect ? difficultySelect.value : '';
         const sortBy = sortBySelect ? sortBySelect.value : 'title';

         let filtered = recipesData.filter(recipe => {
            const titleMatch = !searchTerm || (recipe.title && recipe.title.toLowerCase().includes(searchTerm));
            const categoryMatch = !selectedCategory || (recipe.category && recipe.category === selectedCategory);
            const difficultyMatch = !selectedDifficulty || recipe.difficulty === selectedDifficulty;
            return titleMatch && categoryMatch && difficultyMatch;
        });

         // Sorting
         filtered.sort((a, b) => {
             let valA = a[sortBy];
             let valB = b[sortBy];

              // Handle potential missing values for sorting
              if (valA === undefined || valA === null) valA = (typeof valB === 'string' ? '' : 0);
              if (valB === undefined || valB === null) valB = (typeof valA === 'string' ? '' : 0);

             if (typeof valA === 'string') {
                 return valA.localeCompare(valB);
             } else if (typeof valA === 'number') { // Assume number
                 return valA - valB;
             } else {
                 // Fallback for other types or mixed types
                 return String(valA).localeCompare(String(valB));
             }
         });


         loadAdminRecipes(filtered);
     });
}


// --- Helper Functions ---
function showValidationError(inputElement, message) {
     const formGroup = inputElement.closest('.form-group');
     if (!formGroup) return;
     const validationMessage = formGroup.querySelector('.validation-message');
     inputElement.style.borderColor = 'var(--danger-color)'; // **CORRECTED SYNTAX**
     if (validationMessage) {
         validationMessage.textContent = message;
         validationMessage.style.display = 'block';
     }
}
function hideValidationError(inputElement) {
     const formGroup = inputElement.closest('.form-group');
     if (!formGroup) return;
     const validationMessage = formGroup.querySelector('.validation-message');
     inputElement.style.borderColor = ''; // Reset border
     if (validationMessage) {
          validationMessage.style.display = 'none';
     }
}

function isValidUrl(string) {
    // Basic check for common protocols
    if (!string || typeof string !== 'string') return false;
    return string.startsWith('http://') || string.startsWith('https://');
    // More robust validation might be needed depending on requirements
    /* try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    } */
}


// --- Tab Setup (Generic, from previous version) ---
function setupTabs(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const tabs = container.querySelectorAll('.tab');
    const tabContents = container.querySelectorAll('.tab-content');

    // Ensure at least one tab is active by default if none are
     if (tabs.length > 0 && container.querySelector('.tab.active') === null) {
        tabs[0].classList.add('active');
     }
      if (tabContents.length > 0 && container.querySelector('.tab-content.active') === null) {
         const firstTabTargetId = tabs[0]?.getAttribute('data-tab');
         if (firstTabTargetId) {
            const firstTabContent = document.getElementById(firstTabTargetId);
            if (firstTabContent) firstTabContent.classList.add('active');
         }
     }


    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.getAttribute('data-tab');
            const targetContent = document.getElementById(targetId);

            tabContents.forEach(content => content.classList.remove('active'));
            tabs.forEach(t => t.classList.remove('active'));

            if (targetContent) {
                targetContent.classList.add('active');
                tab.classList.add('active');
            }
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("add-recipe-form");

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const newRecipe = {
                title: formData.get("title"),
                description: formData.get("description"),
                image: formData.get("image"),          // URL de imagen
                time: parseInt(formData.get("time")),
                calories: parseInt(formData.get("calories")),
                protein: parseInt(formData.get("protein")),
                difficulty: formData.get("difficulty"),
                category: formData.get("category"),
                ingredients: formData.get("ingredients").split(",").map(item => item.trim()), // Asume ingredientes separados por coma
                instructions: formData.get("instructions")
            };

            try {
                const response = await fetch("http://localhost:3000/admin/recipes", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-auth": "admin"
                    },
                    body: JSON.stringify(newRecipe)
                });

                if (response.ok) {
                    alert("Receta añadida correctamente al backend ✅");
                    form.reset();
                } else {
                    const error = await response.json();
                    alert("Error al añadir receta: " + (error.message || response.statusText));
                }
            } catch (err) {
                alert("Error al conectar con backend: " + err.message);
            }
        });
    }
});
