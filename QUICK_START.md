# MCC Africa - Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Download Data & Assets
```bash
node download-api-data.js
node download-assets-and-rewrite-json.js
```

### 2. Switch to Offline Mode
```bash
node switch-to-offline.js offline
```

### 3. Start Local Server
```bash
node serve-offline.js
```

Then visit: http://localhost:8000

## 📋 What's Included

✅ **All API data** downloaded as JSON files  
✅ **All images & assets** downloaded locally  
✅ **Offline JavaScript** that loads from local files  
✅ **Easy switching** between online/offline modes  
✅ **Local web server** for testing  
✅ **Complete documentation** in OFFLINE_SETUP.md  

## 🔄 Switching Modes

**Check current mode:**
```bash
node switch-to-offline.js status
```

**Switch to offline:**
```bash
node switch-to-offline.js offline
```

**Switch back to online:**
```bash
node switch-to-offline.js online
```

## 📁 Key Files

- `data/` - All downloaded JSON data
- `data/assets/` - All downloaded images & files
- `js/mcc-offline.js` - Offline JavaScript loader
- `switch-to-offline.js` - Mode switcher
- `serve-offline.js` - Local web server

## 🎯 Result

Your MCC Africa site now works completely offline with:
- Same functionality as the online version
- Faster loading (no API calls)
- All images and assets served locally
- No internet connection required

For detailed instructions, see `OFFLINE_SETUP.md` 