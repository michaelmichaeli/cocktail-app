# 🍸 Cocktail App

A modern cocktail recipe application for discovering and creating your own cocktail recipes.

![image](https://github.com/user-attachments/assets/ac52a8b9-8af0-4da4-85d8-e0675eac0ebe)
![image](https://github.com/user-attachments/assets/0edc662d-ae55-4304-af64-cc1f6df96ac7)

## 🚀 Live Demo

[Live Demo](https://cocktail-ov8y78vna-michaelmichaelis-projects.vercel.app)

## 📦 Deployment

### Deploying to Vercel

1. **GitHub Integration (Recommended)**

   - Fork this repository
   - Go to [Vercel](https://vercel.com)
   - Create a new project
   - Import your forked repository
   - Vercel will automatically detect it as a Vite project
   - Click "Deploy"

2. **Using Vercel CLI**

   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Login to Vercel
   vercel login

   # Deploy to Vercel
   vercel
   ```

The project includes a `vercel.json` configuration file that handles:

- SPA routing (all routes redirect to index.html)
- Build settings for Vite
- Caching headers for optimal performance

## ✨ Features

- **Modern UI Components**

  - Built with Radix UI for accessibility
  - Toast notifications for user feedback
  - Modal dialogs for detailed views
  - Form validation with React Hook Form and Zod
  - Beautiful icons from Lucide React
  - Responsive design for all devices
  - Dark/light theme support

- **Search & Discovery**

  - Search from extensive cocktail database
  - Advanced filtering system (by category, glass, ingredients)
  - View detailed recipes with ingredients and instructions
  - Real-time search with React Query
  - Optimized API calls with caching
  - Note: API returns maximum 25 results per search query

- **Custom Cocktails**

  - Create and edit your own cocktail recipes
  - Rich form handling with validation
  - Add ingredients with amounts and units
  - Upload and preview custom images
  - Set categories and tags
  - Track modifications with timestamps

- **Performance & Developer Experience**
  - Built with Vite for fast development and builds
  - TypeScript for type safety
  - ESLint configuration for code quality
  - Optimized production builds
  - Vercel deployment ready

## 🛠️ Built with

- [React 19 + TypeScript](https://react.dev/) - Frontend framework
- [Vite 6](https://vitejs.dev/) - Build tool
- [TailwindCSS 3.4](https://tailwindcss.com/) - Styling
- [daisyUI 4](https://daisyui.com/) - UI components
- [React Query v5](https://tanstack.com/query/latest) - Data fetching
- [React Router v7](https://reactrouter.com/) - Navigation
- [Zustand v5](https://zustand-demo.pmnd.rs/) - State management
- [Radix UI](https://www.radix-ui.com/) - Accessible UI components
- [React Hook Form](https://react-hook-form.com/) - Form handling
- [Zod](https://zod.dev/) - Schema validation
- [Lucide React](https://lucide.dev/) - Icons

## 🚀 Quick Start

```bash
# Install dependencies (make sure you have pnpm installed)
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Run linting
pnpm lint

# Preview production build
pnpm preview
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
