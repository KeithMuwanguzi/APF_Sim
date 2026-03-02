# APF Service Portal

A modern web portal for the Accountancy Practitioners Forum (APF Uganda) built with React, TypeScript, and Vite.

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Next-generation frontend tooling
- **Material-UI** - Component library
- **React Router** - Client-side routing
- **Axios** - HTTP client

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the portal directory:
   ```bash
   cd portal
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:

```bash
npm run dev
```

The app will open at [http://localhost:3000](http://localhost:3000)

Features:
- ⚡ Lightning-fast Hot Module Replacement (HMR)
- 🔥 Instant server start
- 💪 Full TypeScript support

### Building for Production

Build the app for production:

```bash
npm run build
```

The optimized build will be output to the `dist/` folder.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

### Testing

Run tests:

```bash
npm test
```

## Project Structure

```
portal/
├── public/           # Static assets
├── src/
│   ├── assets/      # Images and media files
│   ├── components/  # React components
│   ├── pages/       # Page components
│   ├── App.tsx      # Main app component
│   ├── main.tsx     # Application entry point
│   └── index.css    # Global styles
├── index.html       # HTML template
├── vite.config.ts   # Vite configuration
└── tsconfig.json    # TypeScript configuration
```

## Environment Variables

Create a `.env` file in the portal root for environment-specific variables:

```env
# Django Backend API
VITE_API_URL=http://localhost:8000

# Strapi CMS API
VITE_CMS_URL=http://localhost:1337
```

Access them in your code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL
const cmsUrl = import.meta.env.VITE_CMS_URL
```

## Key Features

- Responsive design
- Modern UI with Material-UI components
- Type-safe codebase with TypeScript
- Fast development experience with Vite
- Optimized production builds
- **Strapi CMS Integration** - Full content management system

## CMS Integration

This portal integrates with Strapi CMS for managing public-facing content.

### Quick Start with CMS

1. **Start Strapi**:
   ```bash
   cd ../CMS
   yarn develop
   ```

2. **Configure Permissions**:
   - Visit `http://localhost:1337/admin`
   - Go to Settings → Roles → Public
   - Enable `find` and `findOne` for all content types

3. **Access CMS Management**:
   - Visit `http://localhost:5173/admin/cms`
   - View connection status and content statistics

### CMS Documentation

- 🚀 **Quick Start**: [CMS_QUICK_START.md](./CMS_QUICK_START.md) - Get started in 5 minutes
- 📖 **Integration Guide**: [CMS_INTEGRATION_GUIDE.md](./CMS_INTEGRATION_GUIDE.md) - Complete guide
- ✅ **Setup Checklist**: [CMS_SETUP_CHECKLIST.md](./CMS_SETUP_CHECKLIST.md) - Step-by-step setup
- 📊 **Improvements**: [CMS_IMPROVEMENTS_SUMMARY.md](./CMS_IMPROVEMENTS_SUMMARY.md) - What's new

### CMS Features

- ✅ Events management
- ✅ News articles
- ✅ Leadership profiles
- ✅ Membership benefits
- ✅ FAQs
- ✅ Partners
- ✅ Timeline events
- ✅ Page content (Homepage, About, Membership, Contact)
- ✅ Site settings

### Test CMS Integration

Visit the test page: `http://localhost:5173/test-cms`

## Learn More

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Material-UI Documentation](https://mui.com/)

## Migration Notes

This project was migrated from Create React App to Vite + TypeScript. See [MIGRATION.md](./MIGRATION.md) for details about the migration process.
