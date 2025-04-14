# Card Simulator

A TypeScript project deployed to GitHub Pages.

## Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Building for Production

To create a production build:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Deployment

This project is automatically deployed to GitHub Pages when changes are pushed to the `main` branch. The deployment is handled by GitHub Actions.

## Project Structure

- `src/` - Source files
  - `main.ts` - Main application entry point
  - `style.css` - Global styles
- `index.html` - HTML entry point
- `tsconfig.json` - TypeScript configuration
- `package.json` - Project dependencies and scripts 