const fs = require('fs');
const path = require('path');

// Function to extract asset filenames from JSON data
function extractAssetsFromJson(jsonData, assets = new Set()) {
  if (typeof jsonData === 'object' && jsonData !== null) {
    for (const [key, value] of Object.entries(jsonData)) {
      if (key === 'full_url' && typeof value === 'string' && value.startsWith('assets/')) {
        const filename = value.replace('assets/', '');
        assets.add(filename);
      } else if (Array.isArray(value)) {
        value.forEach(item => extractAssetsFromJson(item, assets));
      } else if (typeof value === 'object' && value !== null) {
        extractAssetsFromJson(value, assets);
      }
    }
  }
  return assets;
}

// Function to check if assets exist
function checkMissingAssets() {
  const dataDir = path.join(__dirname, 'data');
  const assetsDir = path.join(dataDir, 'assets');
  
  console.log('🔍 Checking for missing assets...\n');
  
  // Get list of existing assets
  const existingAssets = new Set();
  if (fs.existsSync(assetsDir)) {
    const files = fs.readdirSync(assetsDir);
    files.forEach(file => existingAssets.add(file));
  }
  
  console.log(`📁 Found ${existingAssets.size} existing assets in data/assets/\n`);
  
  // Check each JSON file
  const jsonFiles = [
    'cities.json',
    'challenge.json', 
    'people.json',
    'about.json',
    'updates.json',
    'winners.json'
  ];
  
  const allReferencedAssets = new Set();
  const missingAssets = new Set();
  
  jsonFiles.forEach(filename => {
    const filepath = path.join(dataDir, filename);
    if (fs.existsSync(filepath)) {
      console.log(`📄 Checking ${filename}...`);
      try {
        const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
        const assets = extractAssetsFromJson(data);
        assets.forEach(asset => {
          allReferencedAssets.add(asset);
          if (!existingAssets.has(asset)) {
            missingAssets.add(asset);
          }
        });
        console.log(`   Found ${assets.size} asset references`);
      } catch (error) {
        console.log(`   ❌ Error reading ${filename}: ${error.message}`);
      }
    } else {
      console.log(`   ⚠️  File not found: ${filename}`);
    }
  });
  
  console.log(`\n📊 Summary:`);
  console.log(`   Total referenced assets: ${allReferencedAssets.size}`);
  console.log(`   Existing assets: ${existingAssets.size}`);
  console.log(`   Missing assets: ${missingAssets.size}`);
  
  if (missingAssets.size > 0) {
    console.log(`\n❌ Missing assets:`);
    Array.from(missingAssets).sort().forEach(asset => {
      console.log(`   - ${asset}`);
    });
  } else {
    console.log(`\n✅ All referenced assets are present!`);
  }
  
  // Check for unused assets
  const unusedAssets = new Set();
  existingAssets.forEach(asset => {
    if (!allReferencedAssets.has(asset)) {
      unusedAssets.add(asset);
    }
  });
  
  if (unusedAssets.size > 0) {
    console.log(`\n⚠️  Unused assets (${unusedAssets.size}):`);
    Array.from(unusedAssets).slice(0, 10).forEach(asset => {
      console.log(`   - ${asset}`);
    });
    if (unusedAssets.size > 10) {
      console.log(`   ... and ${unusedAssets.size - 10} more`);
    }
  }
  
  console.log(`\nAll referenced asset filenames:`);
  Array.from(allReferencedAssets).sort().forEach(asset => console.log('   -', asset));
  console.log(`\nAll present asset filenames:`);
  Array.from(existingAssets).sort().forEach(asset => console.log('   -', asset));
  
  console.log('\nDone checking assets.');
}

// Run the check
checkMissingAssets(); 