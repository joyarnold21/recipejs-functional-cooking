// Part 3: IIFE module with expandable steps & ingredients
const RecipeApp = (function () {
    console.log('RecipeApp initializing...');

    // Enhanced recipe data with steps and ingredients (nested steps included)
    const recipes = [
        {
            id: 1,
            title: 'Classic Spaghetti Carbonara',
            time: 25,
            difficulty: 'easy',
            description: 'A creamy Italian pasta dish made with eggs, cheese, pancetta, and black pepper.',
            category: 'pasta',
            ingredients: ['Spaghetti', 'Eggs', 'Pancetta', 'Pecorino Romano', 'Black pepper'],
            steps: [
                'Boil water and salt it',
                'Cook spaghetti until al dente',
                {
                    text: 'Prepare sauce',
                    substeps: ['Whisk eggs and cheese', 'Cook pancetta until crisp']
                },
                'Combine pasta with pancetta and remove from heat',
                'Quickly stir in egg mixture and serve'
            ]
        },
        {
            id: 2,
            title: 'Chicken Tikka Masala',
            time: 45,
            difficulty: 'medium',
            description: 'Tender chicken pieces in a creamy, spiced tomato sauce.',
            category: 'curry',
            ingredients: ['Chicken', 'Yogurt', 'Tomatoes', 'Garam masala', 'Cream'],
            steps: [
                'Marinate chicken in yogurt and spices',
                'Grill or sear chicken until browned',
                'Prepare sauce with tomatoes and cream',
                'Combine chicken with sauce and simmer'
            ]
        },
        {
            id: 3,
            title: 'Homemade Croissants',
            time: 180,
            difficulty: 'hard',
            description: 'Buttery, flaky French pastries that require patience but deliver amazing results.',
            category: 'baking',
            ingredients: ['Flour', 'Butter', 'Milk', 'Sugar', 'Yeast', 'Salt'],
            steps: [
                'Make dough and chill',
                {
                    text: 'Laminate dough',
                    substeps: [
                        'Roll out dough',
                        'Layer with butter',
                        {
                            text: 'Fold and roll several times',
                            substeps: ['Fold 1', 'Fold 2', 'Fold 3']
                        }
                    ]
                },
                'Shape croissants',
                'Proof until doubled',
                'Bake until golden'
            ]
        },
        {
            id: 4,
            title: 'Greek Salad',
            time: 15,
            difficulty: 'easy',
            description: 'Fresh vegetables, feta cheese, and olives tossed in olive oil and herbs.',
            category: 'salad',
            ingredients: ['Tomatoes', 'Cucumber', 'Red onion', 'Feta', 'Olives', 'Olive oil'],
            steps: ['Chop vegetables', 'Toss with olive oil and herbs', 'Top with feta and olives']
        },
        {
            id: 5,
            title: 'Beef Wellington',
            time: 120,
            difficulty: 'hard',
            description: 'Tender beef fillet coated with mushroom duxelles and wrapped in puff pastry.',
            category: 'meat',
            ingredients: ['Beef fillet', 'Mushrooms', 'Puff pastry', 'Prosciutto', 'Eggs'],
            steps: [
                'Season and sear beef',
                {
                    text: 'Make duxelles',
                    substeps: ['Chop mushrooms', 'Cook until moisture evaporates', 'Season well']
                },
                'Wrap beef with prosciutto and duxelles',
                'Encase in puff pastry and brush with egg wash',
                'Bake until pastry is golden and beef reaches desired doneness'
            ]
        },
        {
            id: 6,
            title: 'Vegetable Stir Fry',
            time: 20,
            difficulty: 'easy',
            description: 'Colorful mixed vegetables cooked quickly in a savory sauce.',
            category: 'vegetarian',
            ingredients: ['Broccoli', 'Carrots', 'Bell pepper', 'Soy sauce', 'Garlic'],
            steps: ['Prep vegetables', 'Heat wok', 'Stir-fry vegetables', 'Add sauce and serve']
        },
        {
            id: 7,
            title: 'Pad Thai',
            time: 30,
            difficulty: 'medium',
            description: 'Thai stir-fried rice noodles with shrimp, peanuts, and tangy tamarind sauce.',
            category: 'noodles',
            ingredients: ['Rice noodles', 'Shrimp', 'Eggs', 'Bean sprouts', 'Peanuts'],
            steps: ['Soak noodles', 'Stir-fry protein and aromatics', 'Add noodles and sauce', 'Toss with sprouts and peanuts']
        },
        {
            id: 8,
            title: 'Margherita Pizza',
            time: 60,
            difficulty: 'medium',
            description: 'Classic Italian pizza with fresh mozzarella, tomatoes, and basil.',
            category: 'pizza',
            ingredients: ['Pizza dough', 'Tomato sauce', 'Mozzarella', 'Basil'],
            steps: ['Prepare dough', 'Top with sauce and cheese', 'Bake until crust is crisp', 'Finish with fresh basil']
        }
    ];

    // State
    let currentFilter = 'all';
    let currentSort = 'none';
    let searchQuery = '';
    let debounceTimer = null;
    let favorites = [];

    // DOM refs (will be queried after DOM exists)
    const recipeContainer = document.querySelector('#recipe-container');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sortButtons = document.querySelectorAll('.sort-btn');
    const searchInput = document.querySelector('#search-input');
    const searchClear = document.querySelector('#search-clear');
    const recipeCounter = document.querySelector('#recipe-counter');

    // Utility
    const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

    // Recursive rendering of steps
    const renderSteps = (steps) => {
        const items = steps.map(step => {
            if (typeof step === 'string') {
                return `<li>${step}</li>`;
            }
            // object with text and substeps
            const sub = step.substeps ? renderSteps(step.substeps) : '';
            return `<li>${step.text}${sub ? `<div class="substeps">${sub}</div>` : ''}</li>`;
        });
        return `<ol class="step-list">${items.join('')}</ol>`;
    };

    const createIngredientsHTML = (ingredients) => {
        const items = ingredients.map(i => `<li>${i}</li>`).join('');
        return `<ul class="ingredient-list">${items}</ul>`;
    };

    // Create single recipe card HTML including toggles, favorite, and hidden containers
    const createRecipeCard = (recipe) => {
        const stepsHTML = renderSteps(recipe.steps || []);
        const ingredientsHTML = createIngredientsHTML(recipe.ingredients || []);
        const favActive = favorites.includes(recipe.id) ? 'active' : '';
        const heart = favorites.includes(recipe.id) ? '♥' : '♡';

        return `
            <div class="recipe-card" data-id="${recipe.id}">
                <h3>${recipe.title}</h3>
                <div class="recipe-meta">
                    <span>⏱️ ${recipe.time} min</span>
                    <span class="difficulty ${recipe.difficulty}">${recipe.difficulty}</span>
                    <button class="favorite-btn ${favActive}" data-favorite-id="${recipe.id}" aria-label="Toggle favorite">${heart}</button>
                </div>
                <p>${recipe.description}</p>
                <div class="card-controls">
                    <button class="toggle-btn" data-recipe-id="${recipe.id}" data-toggle="steps">Show Steps</button>
                    <button class="toggle-btn" data-recipe-id="${recipe.id}" data-toggle="ingredients">Show Ingredients</button>
                </div>
                <div id="steps-${recipe.id}" class="steps-container">${stepsHTML}</div>
                <div id="ingredients-${recipe.id}" class="ingredients-container">${ingredientsHTML}</div>
            </div>
        `;
    };

    // Render list
    const renderRecipes = (recipesToRender) => {
        const html = recipesToRender.map(createRecipeCard).join('');
        recipeContainer.innerHTML = html;
    };

    // Filters & sorts (pure)
    const filterByDifficulty = (recipesArr, difficulty) => recipesArr.filter(r => r.difficulty === difficulty);
    const filterByTime = (recipesArr, maxTime) => recipesArr.filter(r => r.time < maxTime);
    const applyFilter = (recipesArr, filterType) => {
        switch (filterType) {
            case 'easy': return filterByDifficulty(recipesArr, 'easy');
            case 'medium': return filterByDifficulty(recipesArr, 'medium');
            case 'hard': return filterByDifficulty(recipesArr, 'hard');
            case 'quick': return filterByTime(recipesArr, 30);
            case 'favorites': return recipesArr.filter(r => favorites.includes(r.id));
            case 'all':
            default: return recipesArr;
        }
    };

    const sortByName = (recipesArr) => [...recipesArr].sort((a,b) => a.title.localeCompare(b.title));
    const sortByTime = (recipesArr) => [...recipesArr].sort((a,b) => a.time - b.time);
    const applySort = (recipesArr, sortType) => {
        switch (sortType) {
            case 'name': return sortByName(recipesArr);
            case 'time': return sortByTime(recipesArr);
            case 'none':
            default: return recipesArr;
        }
    };

    // Update display orchestrator
    const updateCounter = (visibleCount) => {
        recipeCounter.textContent = `Showing ${visibleCount} of ${recipes.length} recipes`;
    };

    const applySearch = (recipesArr, query) => {
        if (!query) return recipesArr;
        const q = query.toLowerCase().trim();
        return recipesArr.filter(r => {
            const titleMatch = r.title.toLowerCase().includes(q);
            const descMatch = (r.description || '').toLowerCase().includes(q);
            const ingMatch = (r.ingredients || []).some(i => i.toLowerCase().includes(q));
            return titleMatch || descMatch || ingMatch;
        });
    };

    const updateDisplay = () => {
        let list = recipes;
        // Search first
        list = applySearch(list, searchQuery);
        // Then filter
        list = applyFilter(list, currentFilter);
        // Then sort
        list = applySort(list, currentSort);
        // Update counter and render
        updateCounter(list.length);
        renderRecipes(list);
        updateActiveButtons();
        console.log(`Displaying ${list.length} recipes (Filter: ${currentFilter}, Sort: ${currentSort}, Search: "${searchQuery}")`);
    };

    const updateActiveButtons = () => {
        filterButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.filter === currentFilter));
        sortButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.sort === currentSort));
    };

    // Event handlers for filter/sort
    const handleFilterClick = (e) => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;
        currentFilter = btn.dataset.filter;
        updateDisplay();
    };

    const handleSortClick = (e) => {
        const btn = e.target.closest('.sort-btn');
        if (!btn) return;
        currentSort = btn.dataset.sort;
        updateDisplay();
    };

    // Event delegation for toggle and favorite buttons inside recipeContainer
    const handleContainerClick = (e) => {
        // Favorite button
        const favBtn = e.target.closest('.favorite-btn');
        if (favBtn) {
            const id = Number(favBtn.dataset.favoriteId);
            toggleFavorite(id);
            updateDisplay();
            return;
        }

        // Toggle steps/ingredients
        const btn = e.target.closest('.toggle-btn');
        if (!btn) return;
        const recipeId = btn.dataset.recipeId;
        const toggleType = btn.dataset.toggle; // 'steps' or 'ingredients'
        const container = document.getElementById(`${toggleType}-${recipeId}`);
        if (!container) return;
        container.classList.toggle('visible');
        btn.textContent = container.classList.contains('visible') ? `Hide ${capitalize(toggleType)}` : `Show ${capitalize(toggleType)}`;
    };

    // Setup event listeners
    const loadFavorites = () => {
        try {
            const raw = localStorage.getItem('recipeFavorites');
            favorites = raw ? JSON.parse(raw) : [];
        } catch (e) {
            favorites = [];
        }
    };

    const saveFavorites = () => {
        try {
            localStorage.setItem('recipeFavorites', JSON.stringify(favorites));
        } catch (e) {
            console.warn('Failed to save favorites', e);
        }
    };

    const toggleFavorite = (id) => {
        const idx = favorites.indexOf(id);
        if (idx === -1) favorites.push(id);
        else favorites.splice(idx, 1);
        saveFavorites();
    };

    const setupEventListeners = () => {
        // Filter & sort buttons via document
        document.addEventListener('click', handleFilterClick);
        document.addEventListener('click', handleSortClick);

        // Container delegation for toggles and favorites
        recipeContainer.addEventListener('click', handleContainerClick);

        // Search input with debounce
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const value = e.target.value;
                searchClear.classList.toggle('hidden', value.trim() === '');
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    searchQuery = value;
                    updateDisplay();
                }, 300);
            });
        }

        if (searchClear) {
            searchClear.addEventListener('click', () => {
                if (!searchInput) return;
                searchInput.value = '';
                searchClear.classList.add('hidden');
                searchQuery = '';
                updateDisplay();
            });
        }

        console.log('Event listeners attached!');
    };

    // Public init
    const init = () => {
        setupEventListeners();
        updateDisplay();
        console.log('RecipeApp ready!');
    };

    // Expose public API
    return {
        init,
        updateDisplay
    };
})();

// Initialize the app
RecipeApp.init();
