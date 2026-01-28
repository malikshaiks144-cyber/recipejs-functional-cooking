// RecipeJS module - Part 3 enhancements (IIFE)
const RecipeApp = (function () {
    // --- Data: recipes now include steps and ingredients (nested steps supported) ---
    const recipes = [
        {
            id: 1,
            title: "Classic Spaghetti Carbonara",
            time: 25,
            difficulty: "easy",
            description: "A creamy Italian pasta dish made with eggs, cheese, pancetta, and black pepper.",
            category: "pasta",
            ingredients: ["200g spaghetti", "100g pancetta", "2 large eggs", "50g pecorino or parmesan", "Black pepper"],
            steps: [
                "Bring a large pot of salted water to a boil and cook the spaghetti until al dente.",
                { text: "While the pasta cooks:", substeps: [
                    "Fry the pancetta until crisp.",
                    "Whisk eggs and cheese together in a bowl."
                ]},
                "Drain pasta reserving some cooking water.",
                "Quickly toss pasta with pancetta and remove from heat.",
                "Add egg and cheese mixture off the heat, tossing quickly to create a creamy sauce."
            ]
        },
        {
            id: 2,
            title: "Chicken Tikka Masala",
            time: 45,
            difficulty: "medium",
            description: "Tender chicken pieces in a creamy, spiced tomato sauce.",
            category: "curry",
            ingredients: ["500g chicken", "200ml yogurt", "tomato puree", "garam masala", "cream"],
            steps: [
                "Marinate the chicken in yogurt and spices for 30 minutes.",
                "Grill or sear the chicken until browned.",
                { text: "Make the sauce:", substeps: [
                    "Sauté onions and garlic.",
                    { text: "Add spices:", substeps: [
                        "Garam masala",
                        "Turmeric",
                        "Chili powder"
                    ]},
                    "Stir in tomato puree and simmer." 
                ]},
                "Combine chicken with sauce and finish with cream."
            ]
        },
        {
            id: 3,
            title: "Homemade Croissants",
            time: 180,
            difficulty: "hard",
            description: "Buttery, flaky French pastries that require patience but deliver amazing results.",
            category: "baking",
            ingredients: ["500g flour", "300g butter", "300ml milk", "salt", "sugar"],
            steps: [
                "Prepare dough and chill.",
                "Laminate with butter and fold multiple times.",
                "Cut and shape croissants.",
                "Proof until doubled and bake until golden."
            ]
        },
        {
            id: 4,
            title: "Greek Salad",
            time: 15,
            difficulty: "easy",
            description: "Fresh vegetables, feta cheese, and olives tossed in olive oil and herbs.",
            category: "salad",
            ingredients: ["Tomatoes", "Cucumber", "Red onion", "Feta", "Kalamata olives", "Olive oil"],
            steps: [
                "Chop vegetables and arrange on a plate.",
                "Drizzle with olive oil and season with salt and oregano.",
                "Top with crumbled feta and olives."
            ]
        },
        {
            id: 5,
            title: "Beef Wellington",
            time: 120,
            difficulty: "hard",
            description: "Tender beef fillet coated with mushroom duxelles and wrapped in puff pastry.",
            category: "meat",
            ingredients: ["Beef fillet", "Mushrooms", "Prosciutto", "Puff pastry", "Egg wash"],
            steps: [
                "Sear the beef until browned.",
                "Prepare mushroom duxelles.",
                "Wrap beef with prosciutto and duxelles, then in pastry.",
                "Brush with egg wash and bake until golden."
            ]
        },
        {
            id: 6,
            title: "Vegetable Stir Fry",
            time: 20,
            difficulty: "easy",
            description: "Colorful mixed vegetables cooked quickly in a savory sauce.",
            category: "vegetarian",
            ingredients: ["Broccoli", "Carrots", "Bell peppers", "Soy sauce", "Garlic"],
            steps: [
                "Prep and slice all vegetables.",
                "Stir-fry on high heat with garlic and soy sauce.",
                "Serve over rice or noodles."
            ]
        },
        {
            id: 7,
            title: "Pad Thai",
            time: 30,
            difficulty: "medium",
            description: "Thai stir-fried rice noodles with shrimp, peanuts, and tangy tamarind sauce.",
            category: "noodles",
            ingredients: ["Rice noodles", "Shrimp", "Eggs", "Bean sprouts", "Peanuts"],
            steps: [
                "Soak rice noodles until pliable.",
                "Stir-fry shrimp and set aside.",
                "Cook noodles with tamarind sauce and mix in other ingredients." 
            ]
        },
        {
            id: 8,
            title: "Margherita Pizza",
            time: 60,
            difficulty: "medium",
            description: "Classic Italian pizza with fresh mozzarella, tomatoes, and basil.",
            category: "pizza",
            ingredients: ["Pizza dough", "Tomato sauce", "Mozzarella", "Basil"],
            steps: [
                "Preheat oven to highest setting.",
                "Stretch dough and top with sauce and cheese.",
                "Bake until crust is charred and cheese is bubbly."]
        }
    ];

    // --- Utilities ---
    const escapeHtml = (str) => {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    };

    // Render steps recursively. Accepts an array of strings or objects {text, substeps}
    const renderStepsHTML = (steps) => {
        if (!Array.isArray(steps) || steps.length === 0) return '<p>No steps provided.</p>';
        let html = '<ol class="steps-list">';
        steps.forEach(s => {
            if (typeof s === 'string') {
                html += `<li>${escapeHtml(s)}</li>`;
            } else if (s && typeof s === 'object' && s.text) {
                html += `<li>${escapeHtml(s.text)}`;
                if (s.substeps && s.substeps.length) {
                    html += renderStepsHTML(s.substeps);
                }
                html += `</li>`;
            }
        });
        html += '</ol>';
        return html;
    };

    const renderIngredientsHTML = (ings) => {
        if (!Array.isArray(ings) || ings.length === 0) return '<p>No ingredients listed.</p>';
        return '<ul class="ingredients-list">' + ings.map(i => `<li>${escapeHtml(i)}</li>`).join('') + '</ul>';
    };

    // --- DOM ---
    const recipeContainer = document.querySelector('#recipe-container');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sortButtons = document.querySelectorAll('.sort-btn');
    const searchInput = document.querySelector('#search-input');
    const favoritesOnlyBtn = document.querySelector('#favorites-only');
    const recipeCounter = document.querySelector('#recipe-counter');

    // --- Card template ---
    const createRecipeCard = (recipe, isFavorited) => {
        return `
        <div class="recipe-card" data-id="${recipe.id}">
            <button class="favorite-btn ${isFavorited ? 'favorited' : ''}" title="Toggle favorite">${isFavorited ? '♥' : '♡'}</button>
            <h3>${escapeHtml(recipe.title)}</h3>
            <div class="recipe-meta">
                <span>⏱️ ${recipe.time} min</span>
                <span class="difficulty ${recipe.difficulty}">${escapeHtml(recipe.difficulty)}</span>
            </div>
            <p>${escapeHtml(recipe.description)}</p>
            <div class="card-actions">
                <button class="toggle-btn toggle-steps">Show Steps</button>
                <button class="toggle-btn toggle-ingredients">Show Ingredients</button>
            </div>
            <div class="details details-steps" data-loaded="false"></div>
            <div class="details details-ingredients" data-loaded="false"></div>
        </div>`;
    };

    // --- Rendering ---
    // favorites are stored as an object map in localStorage under this key
    const STORAGE_KEY = 'recipe_favorites_v1';
    const loadFavorites = () => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch (e) {
            return {};
        }
    };

    const saveFavorites = (map) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
        } catch (e) {
            console.warn('Could not save favorites', e);
        }
    };

    let favoritesMap = loadFavorites();

    const renderRecipes = (list) => {
        recipeContainer.innerHTML = list.map(r => createRecipeCard(r, !!favoritesMap[r.id])).join('');
        // update counter
        if (recipeCounter) {
            recipeCounter.textContent = `Showing ${list.length} of ${recipes.length} recipes`;
        }
    };

    // -------------------------
    // Functional filter & sort
    // -------------------------
    const filterAll = (list) => list.filter(() => true);
    const filterByDifficulty = (difficulty) => (list) => list.filter(r => r.difficulty === difficulty);
    const filterQuick = (list) => list.filter(r => r.time < 30);

    const sortIdentity = (list) => [...list];
    const sortByName = (list) => [...list].sort((a, b) => a.title.localeCompare(b.title));
    const sortByTime = (list) => [...list].sort((a, b) => a.time - b.time);

    let currentFilterFn = filterAll;
    let currentSortFn = sortIdentity;
    let currentSearch = '';
    let favoritesOnly = false;

    const matchesSearch = (recipe, term) => {
        if (!term) return true;
        const t = term.toLowerCase();
        if (recipe.title.toLowerCase().includes(t)) return true;
        if (Array.isArray(recipe.ingredients)) {
            return recipe.ingredients.some(i => String(i).toLowerCase().includes(t));
        }
        return false;
    };

    const updateDisplay = () => {
        let list = currentFilterFn(recipes);
        // apply search
        list = list.filter(r => matchesSearch(r, currentSearch));
        // apply favorites-only
        if (favoritesOnly) {
            list = list.filter(r => !!favoritesMap[r.id]);
        }
        // apply sort
        list = currentSortFn(list);
        renderRecipes(list);
    };

    const setActiveFilterButton = (activeBtn) => {
        filterButtons.forEach(btn => btn.classList.toggle('active', btn === activeBtn));
    };

    const setActiveSortButton = (activeBtn) => {
        sortButtons.forEach(btn => btn.classList.toggle('active', btn === activeBtn));
    };

    // --- Event handling (delegation) ---
    const onContainerClick = (e) => {
        // favorite button
        const favBtn = e.target.closest('.favorite-btn');
        if (favBtn) {
            const card = favBtn.closest('.recipe-card');
            if (!card) return;
            const id = Number(card.dataset.id);
            if (favoritesMap[id]) {
                delete favoritesMap[id];
            } else {
                favoritesMap[id] = true;
            }
            saveFavorites(favoritesMap);
            // re-render current view to reflect changes
            updateDisplay();
            return;
        }

        const btn = e.target.closest('.toggle-btn');
        if (!btn) return;
        const card = btn.closest('.recipe-card');
        if (!card) return;
        const id = Number(card.dataset.id);
        const recipe = recipes.find(r => r.id === id);
        if (!recipe) return;

        if (btn.classList.contains('toggle-steps')) {
            const details = card.querySelector('.details-steps');
            const isOpen = details.classList.toggle('open');
            btn.textContent = isOpen ? 'Hide Steps' : 'Show Steps';
            if (isOpen && details.dataset.loaded === 'false') {
                details.innerHTML = renderStepsHTML(recipe.steps);
                details.dataset.loaded = 'true';
            }
        }

        if (btn.classList.contains('toggle-ingredients')) {
            const details = card.querySelector('.details-ingredients');
            const isOpen = details.classList.toggle('open');
            btn.textContent = isOpen ? 'Hide Ingredients' : 'Show Ingredients';
            if (isOpen && details.dataset.loaded === 'false') {
                details.innerHTML = renderIngredientsHTML(recipe.ingredients);
                details.dataset.loaded = 'true';
            }
        }
    };

    // --- Wire up controls ---
    const debounce = (fn, wait = 300) => {
        let t = null;
        return (...args) => {
            clearTimeout(t);
            t = setTimeout(() => fn.apply(this, args), wait);
        };
    };

    const wireControls = () => {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const key = btn.dataset.filter;
                switch (key) {
                    case 'easy': currentFilterFn = filterByDifficulty('easy'); break;
                    case 'medium': currentFilterFn = filterByDifficulty('medium'); break;
                    case 'hard': currentFilterFn = filterByDifficulty('hard'); break;
                    case 'quick': currentFilterFn = filterQuick; break;
                    default: currentFilterFn = filterAll; break;
                }
                setActiveFilterButton(btn);
                updateDisplay();
            });
        });

        sortButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const key = btn.dataset.sort;
                switch (key) {
                    case 'name': currentSortFn = sortByName; break;
                    case 'time': currentSortFn = sortByTime; break;
                    default: currentSortFn = sortIdentity; break;
                }
                setActiveSortButton(btn);
                updateDisplay();
            });
        });

        // search (debounced)
        if (searchInput) {
            const handleSearch = (e) => {
                currentSearch = e.target.value.trim();
                updateDisplay();
            };
            searchInput.addEventListener('input', debounce(handleSearch, 300));
        }

        // favorites-only toggle
        if (favoritesOnlyBtn) {
            favoritesOnlyBtn.addEventListener('click', () => {
                favoritesOnly = !favoritesOnly;
                favoritesOnlyBtn.classList.toggle('active', favoritesOnly);
                favoritesOnlyBtn.textContent = favoritesOnly ? 'Showing Favorites' : 'Show Favorites';
                updateDisplay();
            });
        }
    };

    // --- Public init ---
    const init = () => {
        wireControls();
        recipeContainer.addEventListener('click', onContainerClick);
        updateDisplay();
        console.log('RecipeApp initialized. Recipes:', recipes.length);
    };

    return { init };
})();

// Auto-initialize
RecipeApp.init();