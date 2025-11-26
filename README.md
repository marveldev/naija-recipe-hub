Naija Recipes

Naija Recipes is a beautiful, responsive Nigerian food recipe web app featuring popular dishes, detailed step-by-step cooking instructions, and an integrated Shopping List. It is built by [Teda.dev](https://teda.dev), the AI app builder for everyday problems.

Highlights
- Built with React 18, Tailwind CSS (CDN), and jQuery 3.7.x
- Mobile-first with a fixed bottom navigation bar
- Recipe cards show description, servings, and cook time
- Detailed recipe pages include ingredients and instructions
- One-tap to add all ingredients to the Shopping List
- LocalStorage persistence so your list survives reloads
- Accessible, keyboard-friendly UI with thoughtful color and spacing

Project Structure
- index.html: Landing page with storytelling hero and CTA
- app.html: Main application shell hosting the React app
- styles/main.css: Custom styles and animations
- scripts/helpers.js: Storage utilities, seeds, and helper functions
- scripts/ui.js: React components and App.init/App.render
- scripts/main.js: Entry point ensuring proper initialization order
- assets/logo.svg: App logo

Development Notes
- Uses Tailwind Play CDN; utility classes are combined with small custom CSS in styles/main.css
- For shared Tailwind component classes via @apply, an inline block is included in the HTML pages as required by the CDN approach
- No build step is required; simply open index.html or app.html in a modern browser

Accessibility
- High-contrast colors and semantic markup
- Keyboard navigable and responsive touch targets
- Respects prefers-reduced-motion for users sensitive to motion

Data & Persistence
- Recipes are seeded on first load and stored in LocalStorage under the naija:recipes key
- Shopping list items persist in LocalStorage under the naija:shopping key

License
This project is provided as-is for demonstration and educational purposes.
