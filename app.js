// Recipe data - Foundation for all 4 parts
const recipes = [
    {
        id: 1,
        title: "Classic Spaghetti Carbonara",
        time: 25,
        difficulty: "easy",
        description: "A creamy Italian pasta dish made with eggs, cheese, pancetta, and black pepper.",
        category: "pasta"
    },
    {
        id: 2,
        title: "Chicken Tikka Masala",
        time: 45,
        difficulty: "medium",
        description: "Tender chicken pieces in a creamy, spiced tomato sauce.",
        category: "curry"
    },
    {
        id: 3,
        title: "Homemade Croissants",
        time: 180,
        difficulty: "hard",
        description: "Buttery, flaky French pastries that require patience but deliver amazing results.",
        category: "baking"
    },
    {
        id: 4,
        title: "Greek Salad",
        time: 15,
        difficulty: "easy",
        description: "Fresh vegetables, feta cheese, and olives tossed in olive oil and herbs.",
        category: "salad"
    },
    {
        id: 5,
        title: "Beef Wellington",
        time: 120,
        difficulty: "hard",
        description: "Tender beef fillet coated with mushroom duxelles and wrapped in puff pastry.",
        category: "meat"
    },
    {
        id: 6,
        title: "Vegetable Stir Fry",
        time: 20,
        difficulty: "easy",
        description: "Colorful mixed vegetables cooked quickly in a savory sauce.",
        category: "vegetarian"
    },
    {
        id: 7,
        title: "Pad Thai",
        time: 30,
        difficulty: "medium",
        description: "Thai stir-fried rice noodles with shrimp, peanuts, and tangy tamarind sauce.",
        category: "noodles"
    },
    {
        id: 8,
        title: "Margherita Pizza",
        time: 60,
        difficulty: "medium",
        description: "Classic Italian pizza with fresh mozzarella, tomatoes, and basil.",
        category: "pizza"
    }
];

// DOM Selection - Get the container where recipes will be displayed
const recipeContainer = document.querySelector('#recipe-container');

// DOM References for buttons
const filterButtons = document.querySelectorAll('.filter-btn');
const sortButtons = document.querySelectorAll('.sort-btn');

// State Management - Track current filter and sort
let currentFilter = 'all';
let currentSort = 'none';

// Function to create HTML for a single recipe card
const createRecipeCard = (recipe) => {
    return `
        <div class="recipe-card" data-id="${recipe.id}">
            <h3>${recipe.title}</h3>
            <div class="recipe-meta">
                <span>⏱️ ${recipe.time} min</span>
                <span class="difficulty ${recipe.difficulty}">${recipe.difficulty}</span>
            </div>
            <p>${recipe.description}</p>
        </div>
    `;
};

// Function to render recipes to the DOM
const renderRecipes = (recipesToRender) => {
    const recipeCardsHTML = recipesToRender
        .map(createRecipeCard)
        .join('');
    
    recipeContainer.innerHTML = recipeCardsHTML;
};

// ===== FUNCTIONAL PROGRAMMING: PURE FILTER FUNCTIONS =====

// Filter recipes by difficulty
const filterByDifficulty = (recipes, difficulty) => {
    return recipes.filter(recipe => recipe.difficulty === difficulty);
};

// Filter recipes by time (quick recipes under 30 minutes)
const filterByTime = (recipes, maxTime) => {
    return recipes.filter(recipe => recipe.time < maxTime);
};

// Apply the appropriate filter based on filter type
const applyFilter = (recipes, filterType) => {
    switch(filterType) {
        case 'easy':
            return filterByDifficulty(recipes, 'easy');
        case 'medium':
            return filterByDifficulty(recipes, 'medium');
        case 'hard':
            return filterByDifficulty(recipes, 'hard');
        case 'quick':
            return filterByTime(recipes, 30);
        case 'all':
        default:
            return recipes;
    }
};

// ===== FUNCTIONAL PROGRAMMING: PURE SORT FUNCTIONS =====

// Sort recipes alphabetically by name
const sortByName = (recipes) => {
    return [...recipes].sort((a, b) => a.title.localeCompare(b.title));
};

// Sort recipes by cooking time (fastest first)
const sortByTime = (recipes) => {
    return [...recipes].sort((a, b) => a.time - b.time);
};

// Apply the appropriate sort based on sort type
const applySort = (recipes, sortType) => {
    switch(sortType) {
        case 'name':
            return sortByName(recipes);
        case 'time':
            return sortByTime(recipes);
        case 'none':
        default:
            return recipes;
    }
};

// ===== MAIN UPDATE FUNCTION: ORCHESTRATES FILTER + SORT + RENDER =====

const updateDisplay = () => {
    // Start with all recipes
    let recipesToDisplay = recipes;
    
    // Apply filter
    recipesToDisplay = applyFilter(recipesToDisplay, currentFilter);
    
    // Apply sort
    recipesToDisplay = applySort(recipesToDisplay, currentSort);
    
    // Render to DOM
    renderRecipes(recipesToDisplay);
    
    // Update button states
    updateActiveButtons();
    
    // Log for debugging
    console.log(`Displaying ${recipesToDisplay.length} recipes (Filter: ${currentFilter}, Sort: ${currentSort})`);
};

// ===== UI HELPER FUNCTION: UPDATE ACTIVE BUTTON STATES =====

const updateActiveButtons = () => {
    // Update filter button active states
    filterButtons.forEach(btn => {
        if (btn.dataset.filter === currentFilter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Update sort button active states
    sortButtons.forEach(btn => {
        if (btn.dataset.sort === currentSort) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
};

// ===== EVENT HANDLERS =====

const handleFilterClick = (event) => {
    currentFilter = event.target.dataset.filter;
    updateDisplay();
};

const handleSortClick = (event) => {
    currentSort = event.target.dataset.sort;
    updateDisplay();
};

// ===== EVENT LISTENER SETUP =====

const setupEventListeners = () => {
    filterButtons.forEach(btn => {
        btn.addEventListener('click', handleFilterClick);
    });
    
    sortButtons.forEach(btn => {
        btn.addEventListener('click', handleSortClick);
    });
};

// ===== INITIALIZATION =====

// Set up event listeners and render initial display
setupEventListeners();
updateDisplay();
