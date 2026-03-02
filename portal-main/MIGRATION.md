# Migration to Vite + TypeScript

This project has been successfully migrated from Create React App to Vite with TypeScript.

## What Changed

### Build Tool
- **Before**: Create React App (react-scripts)
- **After**: Vite

### Language
- **Before**: JavaScript (.js, .jsx)
- **After**: TypeScript (.ts, .tsx)

### Key Changes

1. **Entry Point**: Moved from `src/index.js` to `src/main.tsx`
2. **HTML Template**: Moved from `public/index.html` to root `index.html`
3. **Scripts**: Updated in package.json
   - `npm start` → `npm run dev`
   - `npm run build` → `npm run build` (now uses TypeScript compiler + Vite)
   - `npm run preview` → Preview production build

4. **Environment Variables**: 
   - CRA: `REACT_APP_*` → Vite: `VITE_*`
   - Access via `import.meta.env.VITE_*` instead of `process.env.REACT_APP_*`

5. **Public Assets**: 
   - CRA: `%PUBLIC_URL%/` → Vite: `/`
   - Assets in `public/` are served at root

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Preview production build**:
   ```bash
   npm run preview
   ```

## Benefits

- **Faster**: Vite uses native ES modules for instant server start
- **Type Safety**: TypeScript catches errors at compile time
- **Better DX**: Hot Module Replacement (HMR) is significantly faster
- **Modern**: Built for modern browsers with optimal bundling

## TypeScript

All components now have proper TypeScript types. The project uses strict mode for maximum type safety.
