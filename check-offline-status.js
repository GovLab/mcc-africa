const fs = require('fs');
const path = require('path');

console.log('🔍 Checking MCC Africa Offline Setup Status...\n');

// Check data files
const dataFiles = [
  'about.json',
  'cities.json', 
  'challenge.json',
  'people.json',
  'timeline.json',
  'winners.json',
  'updates.json',
  'communications.json',
  'posters.json',
  'fadetext.json'
];

console.log('📊 Data Files:');
let dataFilesOk = 0;
dataFiles.forEach(file => {
  const filePath = path.join(__dirname, 'data', file);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    console.log(`  ✅ ${file} (${(stats.size / 1024).toFixed(1)} KB)`);
    dataFilesOk++;
  } else {
    console.log(`  ❌ ${file} - Missing`);
  }
});

// Check assets directory
console.log('\n🖼️  Assets:');
const assetsDir = path.join(__dirname, 'data', 'assets');
if (fs.existsSync(assetsDir)) {
  const assets = fs.readdirSync(assetsDir);
  console.log(`  ✅ ${assets.length} assets downloaded`);
  
  // Count by type
  const types = {};
  assets.forEach(asset => {
    const ext = path.extname(asset).toLowerCase();
    types[ext] = (types[ext] || 0) + 1;
  });
  
  Object.entries(types).forEach(([ext, count]) => {
    console.log(`    • ${ext}: ${count} files`);
  });
} else {
  console.log('  ❌ Assets directory missing');
}

// Check JavaScript files
console.log('\n📜 JavaScript Files:');
const jsFiles = [
  'js/mcc.js',
  'js/mcc-offline.js',
  'js/mcc-online.js'
];

jsFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    console.log(`  ✅ ${file} (${(stats.size / 1024).toFixed(1)} KB)`);
  } else {
    console.log(`  ❌ ${file} - Missing`);
  }
});

// Check utility scripts
console.log('\n🛠️  Utility Scripts:');
const scripts = [
  'download-api-data.js',
  'download-assets-and-rewrite-json.js',
  'switch-to-offline.js',
  'serve-offline.js'
];

scripts.forEach(script => {
  const filePath = path.join(__dirname, script);
  if (fs.existsSync(filePath)) {
    console.log(`  ✅ ${script}`);
  } else {
    console.log(`  ❌ ${script} - Missing`);
  }
});

// Check documentation
console.log('\n📚 Documentation:');
const docs = [
  'OFFLINE_SETUP.md',
  'QUICK_START.md'
];

docs.forEach(doc => {
  const filePath = path.join(__dirname, doc);
  if (fs.existsSync(filePath)) {
    console.log(`  ✅ ${doc}`);
  } else {
    console.log(`  ❌ ${doc} - Missing`);
  }
});

// Overall status
console.log('\n📈 Summary:');
console.log(`  • Data files: ${dataFilesOk}/${dataFiles.length} present`);
console.log(`  • Assets: ${fs.existsSync(assetsDir) ? 'Downloaded' : 'Missing'}`);
console.log(`  • Offline JS: ${fs.existsSync(path.join(__dirname, 'js/mcc-offline.js')) ? 'Ready' : 'Missing'}`);
console.log(`  • Switch script: ${fs.existsSync(path.join(__dirname, 'switch-to-offline.js')) ? 'Ready' : 'Missing'}`);

// Check current mode
try {
  const currentMcc = fs.readFileSync(path.join(__dirname, 'js/mcc.js'), 'utf8');
  const offlineMcc = fs.readFileSync(path.join(__dirname, 'js/mcc-offline.js'), 'utf8');
  
  if (currentMcc === offlineMcc) {
    console.log('  • Current mode: 🟢 OFFLINE');
  } else {
    console.log('  • Current mode: 🔴 ONLINE');
  }
} catch (error) {
  console.log('  • Current mode: ❓ Unknown');
}

console.log('\n🎯 Next Steps:');
if (dataFilesOk === dataFiles.length && fs.existsSync(assetsDir)) {
  console.log('  ✅ All data and assets are ready!');
  console.log('  🚀 Run: node serve-offline.js');
  console.log('  🌐 Visit: http://localhost:8000');
} else {
  console.log('  ⚠️  Some files are missing. Run the setup scripts:');
  console.log('     node download-api-data.js');
  console.log('     node download-assets-and-rewrite-json.js');
  console.log('     node switch-to-offline.js offline');
} 