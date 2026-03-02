# CMS Quick Start Guide

Get your CMS up and running in 5 minutes!

## 🚀 Quick Setup (5 Minutes)

### Step 1: Start Strapi (1 min)
```bash
cd CMS
yarn develop
```

Wait for: `Server started on http://localhost:1337`

### Step 2: Create Admin Account (1 min)
1. Open: `http://localhost:1337/admin`
2. Fill in admin details
3. Click "Let's start"

### Step 3: Enable API Permissions (2 min)
1. Go to: **Settings** → **Users & Permissions Plugin** → **Roles**
2. Click **Public**
3. Scroll down and enable for ALL content types:
   - ✅ `find`
   - ✅ `findOne`
4. Click **Save**

### Step 4: Test Connection (1 min)
1. Start portal: `cd portal && npm run dev`
2. Visit: `http://localhost:5173/admin/cms`
3. Look for green "CMS Connected Successfully" message

## ✅ You're Done!

Your CMS is now connected to the portal!

## 📝 Next: Add Content

### Quick Content Creation

1. **Open Strapi Admin**: `http://localhost:1337/admin`

2. **Create a News Article**:
   - Content Manager → News Article → Create new entry
   - Fill in title, summary, content
   - Upload featured image
   - Click **Publish**

3. **Create an Event**:
   - Content Manager → Event → Create new entry
   - Fill in title, description, date, location
   - Upload image
   - Set status to "upcoming"
   - Click **Publish**

4. **View in Portal**:
   - Refresh: `http://localhost:5173/admin/cms`
   - See your content appear!

## 🎯 Essential Content (Do These First)

### 1. Site Settings
- Content Manager → Site Setting
- Add site name, logo, footer text
- **Publish**

### 2. Contact Info
- Content Manager → Contact Info
- Add phone, email, address
- **Publish**

### 3. Homepage
- Content Manager → Homepage
- Configure hero section
- Add stats and chair message
- **Publish**

## 🧪 Test Everything

Visit the test page: `http://localhost:5173/test-cms`

This shows all content types and their data.

## 🆘 Troubleshooting

### "Failed to connect to Strapi CMS"
```bash
# Make sure Strapi is running
cd CMS
yarn develop
```

### "No data found"
1. Create content in Strapi admin
2. Click **Publish** (not just Save!)
3. Refresh the portal page

### Images not loading
- Upload images in Strapi Media Library
- Attach to content items
- Publish the content

## 📚 Full Documentation

- **Complete Guide**: `CMS_INTEGRATION_GUIDE.md`
- **Setup Checklist**: `CMS_SETUP_CHECKLIST.md`
- **Content Structure**: `../CMS/STRAPI_CONTENT_STRUCTURE.md`

## 💡 Quick Tips

1. Always click **Publish** after creating content
2. Use **Featured** flags for important items
3. Set **Order** field to control display sequence
4. Optimize images before uploading
5. Use the Quick Reference Card in the portal (bottom-right button)

## 🎉 Success!

You now have:
- ✅ Strapi CMS running
- ✅ Admin account created
- ✅ API permissions enabled
- ✅ Portal connected to CMS
- ✅ Ready to create content!

Start creating content and watch it appear in your portal!

---

**Need Help?** Click the "Quick Guide" button in the CMS management page!
