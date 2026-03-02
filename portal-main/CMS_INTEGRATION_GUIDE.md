# CMS Integration Guide

## Overview

The APF Uganda Portal now has full integration with Strapi CMS for managing public-facing content. This guide explains how to use the CMS management page and work with Strapi content.

## Quick Start

### 1. Start Strapi CMS

```bash
cd CMS
yarn develop
```

Strapi will start at `http://localhost:1337`

### 2. Access Strapi Admin

- Navigate to `http://localhost:1337/admin`
- Create your admin account (first time only)
- Log in to the admin panel

### 3. Configure API Permissions

For the portal to access CMS content, you need to enable public permissions:

1. Go to **Settings** → **Users & Permissions Plugin** → **Roles** → **Public**
2. Enable the following permissions for each content type:
   - ✅ `find` (list all items)
   - ✅ `findOne` (get single item)
3. Click **Save**

### 4. Access CMS Management Page

In the admin portal, navigate to:
- **Admin Dashboard** → **CMS Management**
- Or directly: `http://localhost:5173/admin/cms`

## Features

### CMS Management Dashboard

The CMS page provides:

1. **Connection Status**
   - Real-time connection monitoring
   - Error alerts with troubleshooting steps
   - Success confirmation when connected

2. **Content Overview**
   - News & Press articles count
   - Events listing count
   - Leadership members count
   - Benefits, FAQs, Partners, Timeline events

3. **Quick Actions**
   - Refresh data from Strapi
   - Create new content
   - Open Strapi admin panel
   - Navigate to page editors

4. **Recent Items**
   - Latest news articles
   - Upcoming events
   - Quick preview of content

### Content Types Available

#### Collection Types (Multiple Items)

1. **Events** (`/api/events`)
   - Conference, Workshop, Seminar, Forum, Networking
   - Featured events, CPD points, registration links
   - Status: upcoming, ongoing, completed, cancelled

2. **News Articles** (`/api/news-articles`)
   - Categories, tags, featured images
   - Top picks, featured articles
   - Author, publish date, read time

3. **Leadership** (`/api/leaderships`)
   - Team members with photos
   - Roles, bios, contact info
   - Order and active status

4. **Benefits** (`/api/benefits`)
   - Membership benefits with images
   - Icons and descriptions
   - Order for display

5. **FAQs** (`/api/faqs`)
   - Questions and answers
   - Categories: Membership, Events, General, Technical
   - Order for display

6. **Partners** (`/api/partners`)
   - Partner logos and information
   - Website links
   - Order for display

7. **Timeline Events** (`/api/timeline-events`)
   - Historical milestones
   - Year, title, description, images
   - Order for display

#### Single Types (One Instance)

1. **Homepage** (`/api/homepage`)
   - Hero section
   - Statistics
   - Chair message
   - Connecting professionals section

2. **About Page** (`/api/about-page`)
   - Hero section
   - History, vision, mission
   - Objectives

3. **Membership Page** (`/api/membership-page`)
   - Hero section
   - Process steps
   - Requirements
   - Call to action

4. **Contact Info** (`/api/contact-info`)
   - Phone, email, address
   - Office hours
   - Social media links

5. **Site Settings** (`/api/site-setting`)
   - Site name, tagline
   - Logo, favicon
   - Footer text
   - Maintenance mode

## Using the CMS Hooks

The portal provides React hooks for easy data fetching:

```typescript
import { useEvents, useNewsArticles, useLeadership } from '../hooks/useCMS';

function MyComponent() {
  const { events, loading, error } = useEvents();
  const { articles } = useNewsArticles({ isFeatured: true });
  const { leaders } = useLeadership();
  
  // Use the data in your component
}
```

### Available Hooks

- `useEvents(filters?)` - Fetch events
- `useNewsArticles(filters?)` - Fetch news articles
- `useLeadership()` - Fetch leadership members
- `useBenefits()` - Fetch membership benefits
- `useFAQs(category?)` - Fetch FAQs
- `usePartners()` - Fetch partners
- `useTimelineEvents()` - Fetch timeline events
- `useHomepage()` - Fetch homepage content
- `useAboutPage()` - Fetch about page content
- `useMembershipPage()` - Fetch membership page content
- `useContactInfo()` - Fetch contact information
- `useSiteSettings()` - Fetch site settings

## API Service Functions

You can also use the API service directly:

```typescript
import * as cmsApi from '../services/cmsApi';

// Fetch all events
const events = await cmsApi.getEvents();

// Fetch featured events only
const featuredEvents = await cmsApi.getEvents({ isFeatured: true });

// Fetch single event by slug
const event = await cmsApi.getEventBySlug('annual-conference-2026');

// Fetch news articles by category
const policyNews = await cmsApi.getNewsArticles({ category: 'policy-update' });
```

## Troubleshooting

### CMS Connection Error

If you see "Failed to connect to Strapi CMS":

1. **Check if Strapi is running**
   ```bash
   cd CMS
   yarn develop
   ```

2. **Verify the URL**
   - Strapi should be at `http://localhost:1337`
   - Check `portal/src/config/api.ts` for `CMS_BASE_URL`

3. **Check API permissions**
   - Go to Strapi admin → Settings → Roles → Public
   - Enable `find` and `findOne` for all content types

4. **Check CORS settings**
   - Strapi should allow requests from `http://localhost:5173`
   - Check `CMS/config/middlewares.ts`

### No Data Showing

If the CMS is connected but no data appears:

1. **Add content in Strapi**
   - Go to `http://localhost:1337/admin`
   - Create content in Content Manager
   - Click **Publish** (not just Save)

2. **Check filters**
   - Some queries filter by `isActive` or `isFeatured`
   - Make sure your content matches the filters

3. **Refresh the page**
   - Click the "Refresh" button on the CMS page
   - Or reload the browser

### Images Not Loading

If images don't appear:

1. **Check image upload**
   - Images must be uploaded in Strapi Media Library
   - Attach images to content items

2. **Check URL format**
   - Images should have full URLs
   - Check `strapiAdapter.ts` `extractMediaUrl` function

## Environment Variables

Configure CMS URL in `.env`:

```env
# Strapi CMS URL
VITE_CMS_URL=http://localhost:1337
```

For production:

```env
VITE_CMS_URL=https://cms.apfuganda.org
```

## Best Practices

1. **Always publish content**
   - Draft content won't appear in the portal
   - Click "Publish" after creating/editing

2. **Use featured flags**
   - Mark important content as featured
   - Featured items appear prominently

3. **Set proper order**
   - Use the `order` field to control display sequence
   - Lower numbers appear first

4. **Optimize images**
   - Upload reasonably sized images
   - Strapi will generate thumbnails automatically

5. **Use slugs consistently**
   - Slugs are auto-generated from titles
   - Used in URLs for SEO

6. **Test in Strapi first**
   - Preview content in Strapi admin
   - Then check the portal

## Next Steps

1. ✅ CMS integration complete
2. ✅ Management dashboard working
3. ⏳ Add sample content in Strapi
4. ⏳ Test all content types
5. ⏳ Configure production Strapi instance
6. ⏳ Set up automated deployments

## Support

For issues or questions:
- Check Strapi documentation: https://docs.strapi.io
- Review `CMS/STRAPI_CONTENT_STRUCTURE.md`
- Check the TestCMS page: `http://localhost:5173/test-cms`

---

**Last Updated:** February 2026
