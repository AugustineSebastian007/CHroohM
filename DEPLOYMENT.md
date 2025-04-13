# Deploying to Vercel

This guide explains how to deploy your Organic Mind app to Vercel.

## Option 1: Using Vercel CLI (Recommended for Development)

1. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy from your project directory:
   ```bash
   vercel
   ```

4. For production deployments:
   ```bash
   vercel --prod
   ```

## Option 2: Connecting to GitHub Repository (Recommended for Production)

1. Push your code to a GitHub repository
2. Login to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Add New" > "Project"
4. Import your GitHub repository
5. Configure the project settings:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Click "Deploy"

## Troubleshooting CSS Issues

If your CSS is not being properly applied in the Vercel deployment:

1. Make sure your `tailwind.config.cjs` file is correctly set up:
   ```js
   module.exports = {
     content: [
       "./index.html",
       "./src/**/*.{js,ts,jsx,tsx,css}",
     ],
     // rest of the configuration...
   }
   ```

2. Ensure that `postcss.config.cjs` correctly references the Tailwind config:
   ```js
   module.exports = {
     plugins: {
       'tailwindcss/nesting': {},
       tailwindcss: require('./tailwind.config.cjs'),
       autoprefixer: {},
     },
   }
   ```

3. Verify that `vite.config.js` has the correct CSS setup:
   ```js
   css: {
     postcss: true, // Use the postcss.config.cjs in the root directory
   }
   ```

4. Check that `vercel.json` has the correct configuration:
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ``` 