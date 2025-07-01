const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');

const DATA_DIR = path.join(__dirname, 'data');
const ASSETS_DIR = path.join(DATA_DIR, 'assets');

// Supported asset extensions
const ASSET_EXTENSIONS = [
  '.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp',
  '.pdf', '.mp3', '.mp4', '.mov', '.avi', '.wav', '.m4a', '.ogg', '.webm'
];

// Helper: Recursively find all asset URLs in an object
function findAssetUrls(obj, urls = new Set()) {
  if (typeof obj === 'string') {
    try {
      const url = new URL(obj);
      if (ASSET_EXTENSIONS.some(ext => url.pathname.toLowerCase().endsWith(ext))) {
        urls.add(obj);
      }
    } catch (e) {}
  } else if (Array.isArray(obj)) {
    obj.forEach(item => findAssetUrls(item, urls));
  } else if (typeof obj === 'object' && obj !== null) {
    Object.values(obj).forEach(val => findAssetUrls(val, urls));
  }
  return urls;
}

// Helper: Download a file from a URL
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    proto.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${res.statusCode}`));
        return;
      }
      const fileStream = fs.createWriteStream(dest);
      res.pipe(fileStream);
      fileStream.on('finish', () => fileStream.close(() => resolve()));
    }).on('error', reject);
  });
}

// Helper: Generate a unique filename for each asset
function getLocalAssetFilename(url, usedNames) {
  const parsed = new URL(url);
  let base = path.basename(parsed.pathname);
  // Remove query string from filename
  base = base.split('?')[0];
  // If duplicate, add a hash
  let name = base;
  let i = 1;
  while (usedNames.has(name)) {
    name = base.replace(/(\.[^.]+)$/, `_${i}$1`);
    i++;
  }
  usedNames.add(name);
  return name;
}

// Helper: Recursively replace asset URLs in an object
function replaceAssetUrls(obj, urlMap) {
  if (typeof obj === 'string') {
    if (urlMap[obj]) return urlMap[obj];
    return obj;
  } else if (Array.isArray(obj)) {
    return obj.map(item => replaceAssetUrls(item, urlMap));
  } else if (typeof obj === 'object' && obj !== null) {
    const newObj = {};
    for (const [k, v] of Object.entries(obj)) {
      newObj[k] = replaceAssetUrls(v, urlMap);
    }
    return newObj;
  }
  return obj;
}

async function main() {
  if (!fs.existsSync(ASSETS_DIR)) {
    fs.mkdirSync(ASSETS_DIR, { recursive: true });
  }

  // 1. Find all JSON files in data/
  const jsonFiles = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));

  // 2. Collect all asset URLs
  const allUrls = new Set();
  const fileToUrls = {};
  for (const file of jsonFiles) {
    const json = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
    const urls = findAssetUrls(json);
    fileToUrls[file] = urls;
    urls.forEach(u => allUrls.add(u));
  }

  // 3. Download all unique assets
  const urlToLocal = {};
  const usedNames = new Set();
  for (const url of allUrls) {
    const localName = getLocalAssetFilename(url, usedNames);
    const localPath = path.join('assets', localName);
    urlToLocal[url] = localPath;
    const absPath = path.join(ASSETS_DIR, localName);
    if (!fs.existsSync(absPath)) {
      try {
        console.log(`Downloading: ${url} -> ${localPath}`);
        await downloadFile(url, absPath);
      } catch (e) {
        console.error(`Failed to download ${url}: ${e.message}`);
      }
    } else {
      console.log(`Already downloaded: ${localPath}`);
    }
  }

  // 4. Rewrite JSON files
  for (const file of jsonFiles) {
    const jsonPath = path.join(DATA_DIR, file);
    const json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const newJson = replaceAssetUrls(json, urlToLocal);
    fs.writeFileSync(jsonPath, JSON.stringify(newJson, null, 2));
    console.log(`Rewrote asset URLs in: ${file}`);
  }

  // 5. Write mapping file
  fs.writeFileSync(path.join(DATA_DIR, 'asset-url-map.json'), JSON.stringify(urlToLocal, null, 2));
  console.log('Done! All assets downloaded and JSON files updated.');
}

main().catch(e => { console.error(e); process.exit(1); }); 