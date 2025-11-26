(function(){
  'use strict';
  window.App = window.App || {};

  // Storage utilities with namespacing and safety
  window.App.Storage = {
    load: function(key, fallback){
      try {
        const raw = localStorage.getItem('naija:'+key);
        if (!raw) return fallback;
        return JSON.parse(raw);
      } catch (e) {
        console.error('Storage load failed', key, e);
        return fallback;
      }
    },
    save: function(key, value){
      try {
        localStorage.setItem('naija:'+key, JSON.stringify(value));
      } catch (e) {
        console.error('Storage save failed', key, e);
      }
    }
  };

  // Utilities
  window.App.Utils = {
    slug: function(str){
      return String(str || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    },
    uid: function(){ return 'id_'+Math.random().toString(36).slice(2,9); },
    minutes: function(n){ return n + ' min'; }
  };

  // Seed recipes (Nigerian dishes)
  const seeds = [
    {
      id: 'jollof-rice',
      name: 'Jollof Rice',
      description: 'Smoky, party-style rice simmered in rich tomato and pepper base.',
      servings: 6,
      time: 60,
      color: '#FFF2E7',
      ingredients: [
        { item: 'Parboiled rice', qty: 4, unit: 'cups' },
        { item: 'Tomatoes', qty: 6, unit: 'pcs' },
        { item: 'Red bell peppers', qty: 3, unit: 'pcs' },
        { item: 'Onions', qty: 2, unit: 'pcs' },
        { item: 'Tomato paste', qty: 2, unit: 'tbsp' },
        { item: 'Chicken stock', qty: 3, unit: 'cups' },
        { item: 'Vegetable oil', qty: 0.5, unit: 'cup' },
        { item: 'Bay leaf', qty: 2, unit: 'pcs' },
        { item: 'Salt', qty: 1, unit: 'to taste' }
      ],
      steps: [
        'Blend tomatoes, peppers, and one onion into a smooth puree.',
        'Fry tomato paste in oil until it darkens slightly and loses its raw taste.',
        'Add blended mix and cook down until thick and aromatic.',
        'Add stock, bay leaves, and seasonings. Stir in parboiled rice.',
        'Reduce heat, cover, and steam until rice is cooked and smoky.',
        'Fluff with a wooden spoon and serve hot.'
      ]
    },
    {
      id: 'egusi-soup',
      name: 'Egusi Soup',
      description: 'Melon seed soup with leafy greens and assorted proteins.',
      servings: 5,
      time: 55,
      color: '#E6F6EF',
      ingredients: [
        { item: 'Ground egusi', qty: 2, unit: 'cups' },
        { item: 'Palm oil', qty: 0.5, unit: 'cup' },
        { item: 'Stock fish', qty: 1, unit: 'cup' },
        { item: 'Beef or goat meat', qty: 500, unit: 'g' },
        { item: 'Spinach or ugu', qty: 3, unit: 'cups' },
        { item: 'Onion', qty: 1, unit: 'pc' },
        { item: 'Crayfish', qty: 2, unit: 'tbsp' },
        { item: 'Pepper mix', qty: 1, unit: 'cup' },
        { item: 'Seasoning and salt', qty: 1, unit: 'to taste' }
      ],
      steps: [
        'Heat palm oil, add onions and crayfish; sauté until fragrant.',
        'Stir in pepper mix, cook for a few minutes.',
        'Add ground egusi, stir and allow to fry slightly.',
        'Add meats, stock fish, and some stock; simmer.',
        'Add leafy greens and adjust seasoning.',
        'Serve with pounded yam, eba, or fufu.'
      ]
    },
    {
      id: 'suya',
      name: 'Suya',
      description: 'Spicy skewered beef with kuli-kuli spice rub grilled to perfection.',
      servings: 4,
      time: 30,
      color: '#FFF9F3',
      ingredients: [
        { item: 'Beef (thin strips)', qty: 600, unit: 'g' },
        { item: 'Suya spice (yaji)', qty: 4, unit: 'tbsp' },
        { item: 'Groundnut oil', qty: 2, unit: 'tbsp' },
        { item: 'Salt', qty: 1, unit: 'to taste' },
        { item: 'Onions (rings)', qty: 1, unit: 'pc' },
        { item: 'Cabbage', qty: 1, unit: 'cup' }
      ],
      steps: [
        'Toss beef in oil and suya spice; thread onto skewers.',
        'Grill on medium-high heat until cooked, basting with oil if needed.',
        'Serve with fresh onions, tomatoes, and cabbage.'
      ]
    },
    {
      id: 'puff-puff',
      name: 'Puff-Puff',
      description: 'Golden, airy fried dough balls dusted with sugar.',
      servings: 8,
      time: 90,
      color: '#FFF2E7',
      ingredients: [
        { item: 'Flour', qty: 3, unit: 'cups' },
        { item: 'Sugar', qty: 0.5, unit: 'cup' },
        { item: 'Yeast', qty: 2, unit: 'tsp' },
        { item: 'Warm water', qty: 2, unit: 'cups' },
        { item: 'Salt', qty: 0.5, unit: 'tsp' },
        { item: 'Oil for frying', qty: 1, unit: 'enough' }
      ],
      steps: [
        'Mix dry ingredients; add warm water to form a sticky batter.',
        'Allow to rise until doubled and airy.',
        'Scoop and fry in hot oil until golden; drain and dust with sugar.'
      ]
    },
    {
      id: 'efo-riro',
      name: 'Efo Riro',
      description: 'Rich spinach stew with peppers and assorted proteins.',
      servings: 5,
      time: 45,
      color: '#E6F6EF',
      ingredients: [
        { item: 'Spinach', qty: 5, unit: 'cups' },
        { item: 'Palm oil', qty: 0.25, unit: 'cup' },
        { item: 'Bell peppers', qty: 2, unit: 'pcs' },
        { item: 'Tomatoes', qty: 2, unit: 'pcs' },
        { item: 'Onion', qty: 1, unit: 'pc' },
        { item: 'Assorted meats', qty: 400, unit: 'g' },
        { item: 'Seasoning and salt', qty: 1, unit: 'to taste' }
      ],
      steps: [
        'Blend tomatoes, peppers, and onion.',
        'Heat palm oil, fry blend until reduced.',
        'Add meats and seasonings; simmer.',
        'Stir in spinach and cook briefly until vibrant.'
      ]
    }
  ];

  window.App.Data = {
    ensureSeeded: function(){
      const have = window.App.Storage.load('recipes', null);
      if (!have || !Array.isArray(have) || have.length === 0) {
        window.App.Storage.save('recipes', seeds);
        return seeds;
      }
      return have;
    },
    all: function(){ return window.App.Storage.load('recipes', []) || []; },
    byId: function(id){ return (window.App.Storage.load('recipes', []) || []).find(r => r.id === id) || null; }
  };
})();
