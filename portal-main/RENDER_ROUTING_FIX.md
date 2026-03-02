# Fix 404 on Page Refresh - Render Static Site

## The Problem
When you refresh any page other than the home page (e.g., `/about`, `/contact`), you get a 404 error. This is because Render is looking for actual files at those paths instead of serving your React app.

## The Solution

### Option 1: Using _redirects file (Already Done)
The `public/_redirects` file has been created with:
```
/* /index.html 200
```

This file will be copied to the `dist` folder during build and should work automatically.

### Option 2: Configure in Render Dashboard (RECOMMENDED)

If the `_redirects` file doesn't work, manually configure in Render:

1. Go to https://dashboard.render.com
2. Select your `apf-portal` service
3. Go to **Settings** tab
4. Scroll to **Redirects/Rewrites** section
5. Add a new rewrite rule:
   - **Source**: `/*`
   - **Destination**: `/index.html`
   - **Type**: Rewrite (200)
6. Click **Save Changes**
7. Manually deploy again

### Option 3: Verify Build Output

Make sure the `_redirects` file is being copied to the dist folder:

1. Check your build locally:
   ```bash
   npm run build
   ls dist/_redirects
   ```

2. If the file is missing, Vite might not be copying it. The file should be in `public/_redirects` and Vite automatically copies everything from `public/` to `dist/`.

### Option 4: Use render.yaml (Alternative)

If you're using Infrastructure as Code, the `render.yaml` should have:

```yaml
services:
  - type: web
    name: apf-portal
    env: static
    buildCommand: npm install && npm run build
    staticPublishPath: ./dist

routes:
  - type: rewrite
    source: /*
    destination: /index.html
```

## Verify the Fix

After deploying, test with:
```bash
curl -I https://apf-uganda.onrender.com/about
```

You should see a `200 OK` response, not `404 Not Found`.

## Why This Happens

React Router handles routing on the client side. When you:
- Click a link → React Router handles it (works fine)
- Refresh the page → Browser asks server for `/about` → Server looks for `about.html` → 404

The redirect rule tells the server: "For any path, serve `index.html` and let React Router handle it."
