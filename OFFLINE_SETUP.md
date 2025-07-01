# MCC Africa - Offline Setup Guide

This guide explains how to convert the MCC Africa website from API-based to offline-first, allowing it to work without an internet connection.

## Overview

The MCC Africa website currently fetches data from a Directus API. This setup allows you to:
1. Download all API data as local JSON files
2. Download all assets (images, PDFs, etc.) to local storage
3. Switch between online (API) and offline (local files) modes
4. Serve the site completely offline

## Files Created

- `download-api-data.js` - Downloads all API responses as JSON files
- `download-assets-and-rewrite-json.js` - Downloads assets and updates JSON references
- `js/mcc-offline.js` - Offline version of the main JavaScript file
- `switch-to-offline.js` - Script to switch between online/offline modes
- `test-offline.html` - Test page to verify offline functionality
- `data/` - Directory containing all downloaded JSON files
- `data/assets/` - Directory containing all downloaded assets

## Setup Instructions

### Step 1: Download API Data

First, download all the API responses:

```bash
node download-api-data.js
```

This will:
- Create a `data/` directory
- Download JSON files for all endpoints (cities, challenges, people, etc.)
- Create a summary file with download statistics

### Step 2: Download Assets

Download all assets referenced in the JSON files:

```bash
node download-assets-and-rewrite-json.js
```

This will:
- Create a `data/assets/` directory
- Download all images, PDFs, and other assets
- Update JSON files to reference local asset paths
- Create an asset URL mapping file

### Step 3: Switch to Offline Mode

Switch the site to use local files instead of the API:

```bash
node switch-to-offline.js offline
```

This will:
- Backup the original `js/mcc.js` as `js/mcc-online.js`
- Replace `js/mcc.js` with the offline version

### Step 4: Test the Setup

Open the test page to verify everything works:

```bash
open test-offline.html
```

Or test the main site:

```bash
open index.html
```

## Switching Between Modes

### Check Current Mode
```bash
node switch-to-offline.js status
```

### Switch to Offline Mode
```bash
node switch-to-offline.js offline
```

### Switch Back to Online Mode
```bash
node switch-to-offline.js online
```

## File Structure

After setup, your directory structure will look like:

```
mcc-africa/
├── data/
│   ├── about.json
│   ├── cities.json
│   ├── challenge.json
│   ├── people.json
│   ├── timeline.json
│   ├── winners.json
│   ├── updates.json
│   ├── communications.json
│   ├── posters.json
│   ├── fadetext.json
│   ├── download-summary.json
│   ├── asset-url-map.json
│   └── assets/
│       ├── image1.png
│       ├── image2.jpg
│       ├── document1.pdf
│       └── ...
├── js/
│   ├── mcc.js (offline version)
│   ├── mcc-online.js (backup of original)
│   └── mcc-offline.js (offline version)
├── download-api-data.js
├── download-assets-and-rewrite-json.js
├── switch-to-offline.js
├── test-offline.html
└── index.html (and other HTML files)
```

## Data Endpoints Downloaded

The following API endpoints are downloaded and stored locally:

- **cities** - City information, challenges, and team members
- **challenge** - Challenge topics and descriptions
- **people** - Team member information
- **about** - About page content and configuration
- **timeline** - Project timeline information
- **winners** - Challenge winners and their information
- **updates** - Blog posts and updates
- **communications** - Communication materials
- **posters** - Poster assets
- **fadetext** - Fade text content

## Asset Types Downloaded

The following asset types are automatically detected and downloaded:

- **Images**: .jpg, .jpeg, .png, .gif, .svg, .webp
- **Documents**: .pdf
- **Audio**: .mp3, .wav, .m4a, .ogg
- **Video**: .mp4, .mov, .avi, .webm

## Troubleshooting

### Common Issues

1. **"Cannot read properties of undefined" errors**
   - Make sure you've run `download-api-data.js` first
   - Check that all JSON files exist in the `data/` directory

2. **Images not loading**
   - Run `download-assets-and-rewrite-json.js` to download assets
   - Check that assets are in `data/assets/` directory

3. **Site still trying to access API**
   - Make sure you've run `switch-to-offline.js offline`
   - Check that `js/mcc.js` contains the offline version

4. **CORS errors when testing locally**
   - Use a local web server instead of opening files directly
   - Example: `python -m http.server 8000` or `npx serve .`

### Verification Commands

Check if data files exist:
```bash
ls -la data/*.json
```

Check if assets were downloaded:
```bash
ls -la data/assets/ | wc -l
```

Check current mode:
```bash
node switch-to-offline.js status
```

## Performance Benefits

- **Faster loading** - No API calls required
- **Offline capability** - Works without internet connection
- **Reduced bandwidth** - Assets served locally
- **Better reliability** - No dependency on external API

## Maintenance

### Updating Data

To update the offline data:

1. Switch back to online mode: `node switch-to-offline.js online`
2. Re-download API data: `node download-api-data.js`
3. Re-download assets: `node download-assets-and-rewrite-json.js`
4. Switch back to offline mode: `node switch-to-offline.js offline`

### Adding New Endpoints

If new API endpoints are added:

1. Add the endpoint to `download-api-data.js`
2. Add corresponding load function to `js/mcc-offline.js`
3. Re-run the download scripts

## Notes

- YouTube video embeds remain as external links (cannot be downloaded)
- External website links remain as external links
- The site maintains the same functionality and appearance
- All Vue.js templating and interactivity works the same way

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify all files are in the correct locations
3. Ensure you're using a local web server (not file:// protocol)
4. Check that all download scripts completed successfully 