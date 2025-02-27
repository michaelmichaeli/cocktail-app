# 🍸 Cocktail App

A modern cocktail recipe application for discovering and creating your own cocktail recipes.

[Screenshot to be added]

## 🚀 Live Demo

[Link to deployed app]

## ✨ Features

- **Search & Discovery**
  - Search from extensive cocktail database
  - Advanced filtering system (by category, glass, ingredients)
  - View detailed recipes with ingredients and instructions
  - Note: API returns maximum 25 results per search query

- **Custom Cocktails**
  - Create your own cocktail recipes
  - Add ingredients with amounts and units
  - Upload custom images
  - Set categories and tags
  - Track modifications with timestamps

- **Rich UI/UX**
  - Responsive design for all devices
  - Dark/light theme support
  - Toast notifications with status colors
  - Image preview modal
  - Scroll-to-top functionality
  - Form validation and error handling

## 🛠️ Built with

- [React + TypeScript](https://react.dev/) - Frontend framework
- [Vite](https://vitejs.dev/) - Build tool
- [TailwindCSS](https://tailwindcss.com/) - Styling
- [daisyUI](https://daisyui.com/) - UI components
- [React Query](https://tanstack.com/query/latest) - Data fetching
- [React Router](https://reactrouter.com/) - Navigation
- [Zustand](https://zustand-demo.pmnd.rs/) - State management

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build
```

## 📱 Usage Guide

1. **Search Cocktails**
   - Use the search bar to find cocktails
   - Apply filters to refine results
   - View detailed recipes with ingredients and instructions

2. **Create Custom Cocktails**
   - Click "Add Cocktail" in navigation
   - Fill in recipe details and ingredients
   - Upload an image (optional)
   - Save to your collection

3. **Filter & Browse**
   - Browse by category, glass type, or ingredients
   - Toggle alcoholic/non-alcoholic
   - Save filters for quick access

## ⚠️ Known Limitations

- The external cocktail API has a limit of 25 results per search query
- Image uploads are stored locally and may not persist across sessions
- Custom cocktails are stored in browser localStorage

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.