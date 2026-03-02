# CMS Setup Checklist

Use this checklist to ensure your Strapi CMS is properly configured and integrated with the portal.

## ✅ Initial Setup

### 1. Strapi Installation
- [ ] Navigate to CMS directory: `cd CMS`
- [ ] Install dependencies: `yarn install`
- [ ] Copy `.env.example` to `.env`
- [ ] Configure database settings in `.env`
- [ ] Generate secrets: `openssl rand -base64 32`
- [ ] Start Strapi: `yarn develop`
- [ ] Verify Strapi runs at `http://localhost:1337`

### 2. Admin Account
- [ ] Navigate to `http://localhost:1337/admin`
- [ ] Create admin account (first time only)
- [ ] Log in successfully
- [ ] Verify admin panel loads

### 3. API Permissions
- [ ] Go to Settings → Users & Permissions Plugin → Roles
- [ ] Click on **Public** role
- [ ] Enable permissions for each content type:

#### Collection Types
- [ ] **Event**: find, findOne
- [ ] **News-article**: find, findOne
- [ ] **Leadership**: find, findOne
- [ ] **Benefit**: find, findOne
- [ ] **FAQ**: find, findOne
- [ ] **Partner**: find, findOne
- [ ] **Timeline-event**: find, findOne
- [ ] **News-category**: find, findOne

#### Single Types
- [ ] **Homepage**: find
- [ ] **About-page**: find
- [ ] **Membership-page**: find
- [ ] **Contact-info**: find
- [ ] **Site-setting**: find

- [ ] Click **Save**
- [ ] Verify permissions are saved

## ✅ Content Creation

### 4. Site Settings (Do First)
- [ ] Go to Content Manager → Site Setting
- [ ] Fill in:
  - [ ] Site Name: "APF Uganda"
  - [ ] Tagline
  - [ ] Upload Logo
  - [ ] Upload Favicon
  - [ ] Footer Text
  - [ ] Copyright Text
  - [ ] Social Media Links
- [ ] Click **Publish**

### 5. Contact Info
- [ ] Go to Content Manager → Contact Info
- [ ] Fill in:
  - [ ] Phone
  - [ ] Email
  - [ ] Address
  - [ ] Map Embed URL
  - [ ] Office Hours
  - [ ] Social Media Links
- [ ] Click **Publish**

### 6. News Categories
- [ ] Go to Content Manager → News Category
- [ ] Create categories:
  - [ ] Policy Update
  - [ ] Industry News
  - [ ] Member Spotlight
  - [ ] Events Recap
  - [ ] Research & Insights
- [ ] Set colors for each category
- [ ] Click **Publish** for each

### 7. Partners
- [ ] Go to Content Manager → Partner
- [ ] Add at least 3-5 partners:
  - [ ] Upload logo
  - [ ] Add name
  - [ ] Add website URL
  - [ ] Set order (1, 2, 3...)
  - [ ] Check "Is Active"
- [ ] Click **Publish** for each

### 8. Leadership
- [ ] Go to Content Manager → Leadership
- [ ] Add team members:
  - [ ] Upload photo
  - [ ] Add name and role
  - [ ] Add bio
  - [ ] Add email (optional)
  - [ ] Add LinkedIn (optional)
  - [ ] Set order
  - [ ] Check "Is Active"
- [ ] Click **Publish** for each

### 9. Benefits
- [ ] Go to Content Manager → Benefit
- [ ] Add membership benefits:
  - [ ] Upload image
  - [ ] Add title
  - [ ] Add description
  - [ ] Add icon name (lucide icon)
  - [ ] Set order
  - [ ] Check "Is Active"
- [ ] Click **Publish** for each

### 10. FAQs
- [ ] Go to Content Manager → FAQ
- [ ] Add frequently asked questions:
  - [ ] Add question
  - [ ] Add answer (rich text)
  - [ ] Select category
  - [ ] Set order
  - [ ] Check "Is Active"
- [ ] Click **Publish** for each

### 11. Timeline Events
- [ ] Go to Content Manager → Timeline Event
- [ ] Add historical milestones:
  - [ ] Add year
  - [ ] Add title
  - [ ] Add description
  - [ ] Upload image (optional)
  - [ ] Set order
- [ ] Click **Publish** for each

### 12. Events
- [ ] Go to Content Manager → Event
- [ ] Create sample events:
  - [ ] Add title
  - [ ] Add description
  - [ ] Add content (rich text)
  - [ ] Set date and time
  - [ ] Add location
  - [ ] Upload image
  - [ ] Add registration link (optional)
  - [ ] Add CPD points (optional)
  - [ ] Select category
  - [ ] Check "Is Featured" for important events
  - [ ] Set status (upcoming/ongoing/completed/cancelled)
- [ ] Click **Publish** for each

### 13. News Articles
- [ ] Go to Content Manager → News Article
- [ ] Create sample articles:
  - [ ] Add title
  - [ ] Add summary (max 200 chars)
  - [ ] Add content (rich text)
  - [ ] Upload featured image
  - [ ] Select category
  - [ ] Add author
  - [ ] Set publish date
  - [ ] Set read time (minutes)
  - [ ] Check "Is Top Pick" for featured articles
  - [ ] Check "Is Featured" for homepage
  - [ ] Add tags
- [ ] Click **Publish** for each

### 14. Homepage
- [ ] Go to Content Manager → Homepage
- [ ] Configure hero section:
  - [ ] Add title
  - [ ] Add subtitle
  - [ ] Upload background image
  - [ ] Add CTA text and link
  - [ ] Set overlay opacity
- [ ] Add statistics (3-4 stats):
  - [ ] Label and value
  - [ ] Icon name
- [ ] Configure chair message:
  - [ ] Add name and role
  - [ ] Upload photo
  - [ ] Add message
  - [ ] Add full message (optional)
- [ ] Configure connecting professionals section:
  - [ ] Add title
  - [ ] Add content
  - [ ] Upload image
  - [ ] Set image position
- [ ] Click **Publish**

### 15. About Page
- [ ] Go to Content Manager → About Page
- [ ] Configure hero section
- [ ] Add history (rich text)
- [ ] Add vision statement
- [ ] Add mission statement
- [ ] Add objectives (multiple):
  - [ ] Text
  - [ ] Icon name
- [ ] Click **Publish**

### 16. Membership Page
- [ ] Go to Content Manager → Membership Page
- [ ] Configure hero section
- [ ] Add intro text
- [ ] Add process steps (3-5 steps):
  - [ ] Step number
  - [ ] Title
  - [ ] Description
  - [ ] Icon name
- [ ] Add requirements (rich text)
- [ ] Configure call to action:
  - [ ] Title
  - [ ] Description
  - [ ] Button text and link
  - [ ] Background image
- [ ] Click **Publish**

## ✅ Portal Integration

### 17. Portal Configuration
- [ ] Verify portal `.env` has `VITE_CMS_URL=http://localhost:1337`
- [ ] Start portal: `cd portal && npm run dev`
- [ ] Portal runs at `http://localhost:5173`

### 18. Test CMS Connection
- [ ] Navigate to `http://localhost:5173/admin/cms`
- [ ] Verify "CMS Connected Successfully" message appears
- [ ] Check that content counts are displayed
- [ ] Verify recent items show up
- [ ] Click "Refresh" button to test data reload

### 19. Test Content Display
- [ ] Navigate to `http://localhost:5173/test-cms`
- [ ] Verify all content types load without errors
- [ ] Check that data appears in each section
- [ ] Expand details to see full JSON data

### 20. Test Public Pages
- [ ] Visit homepage: `http://localhost:5173/`
- [ ] Check hero section loads
- [ ] Verify stats display
- [ ] Check chair message appears
- [ ] Verify featured events show
- [ ] Check latest news displays
- [ ] Verify partners section loads

- [ ] Visit events page: `http://localhost:5173/events`
- [ ] Check events list loads
- [ ] Verify filters work
- [ ] Test event detail pages

- [ ] Visit news page: `http://localhost:5173/news`
- [ ] Check articles list loads
- [ ] Verify categories work
- [ ] Test article detail pages

- [ ] Visit about page: `http://localhost:5173/about`
- [ ] Check all sections load
- [ ] Verify leadership displays
- [ ] Check timeline appears

- [ ] Visit membership page: `http://localhost:5173/membership`
- [ ] Check benefits carousel works
- [ ] Verify process steps display
- [ ] Check FAQs load

- [ ] Visit contact page: `http://localhost:5173/contact`
- [ ] Check contact info displays
- [ ] Verify map loads
- [ ] Check social links work

## ✅ Testing & Validation

### 21. API Testing
- [ ] Test API endpoints directly:
  - [ ] `http://localhost:1337/api/events?populate=*`
  - [ ] `http://localhost:1337/api/news-articles?populate=*`
  - [ ] `http://localhost:1337/api/homepage?populate=deep`
- [ ] Verify JSON responses are correct
- [ ] Check that images have full URLs

### 22. Error Handling
- [ ] Stop Strapi server
- [ ] Verify portal shows connection error
- [ ] Check error message is helpful
- [ ] Restart Strapi
- [ ] Click "Retry" button
- [ ] Verify connection restores

### 23. Performance
- [ ] Check page load times
- [ ] Verify images load quickly
- [ ] Test with multiple content items
- [ ] Check browser console for errors

## ✅ Production Preparation

### 24. Environment Variables
- [ ] Create production `.env` for Strapi
- [ ] Set production database credentials
- [ ] Generate new secrets for production
- [ ] Set `NODE_ENV=production`
- [ ] Configure production URL

### 25. Security
- [ ] Review API permissions
- [ ] Ensure only necessary endpoints are public
- [ ] Configure CORS properly
- [ ] Set up SSL/HTTPS
- [ ] Enable rate limiting

### 26. Deployment
- [ ] Deploy Strapi to production server
- [ ] Update portal `VITE_CMS_URL` to production URL
- [ ] Test production connection
- [ ] Verify all content loads
- [ ] Monitor for errors

## ✅ Maintenance

### 27. Regular Tasks
- [ ] Backup Strapi database regularly
- [ ] Update content as needed
- [ ] Monitor API performance
- [ ] Review and update permissions
- [ ] Keep Strapi updated

### 28. Documentation
- [ ] Document custom configurations
- [ ] Keep content guidelines updated
- [ ] Train content editors
- [ ] Maintain troubleshooting guide

## 🎉 Completion

Once all items are checked:
- ✅ Strapi CMS is fully configured
- ✅ All content types have sample data
- ✅ Portal integration is working
- ✅ Public pages display content correctly
- ✅ System is ready for production

## Need Help?

- 📖 Review `CMS_INTEGRATION_GUIDE.md`
- 📖 Check `CMS/STRAPI_CONTENT_STRUCTURE.md`
- 🧪 Use test page: `http://localhost:5173/test-cms`
- 🔧 Check Strapi docs: https://docs.strapi.io

---

**Last Updated:** February 2026
