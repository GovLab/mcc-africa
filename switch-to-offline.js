const fs = require('fs');
const path = require('path');

// Function to switch to offline mode
function switchToOffline() {
  const originalFile = path.join(__dirname, 'js', 'mcc.js');
  const backupFile = path.join(__dirname, 'js', 'mcc-online.js');
  const offlineFile = path.join(__dirname, 'js', 'mcc-offline.js');
  const targetFile = path.join(__dirname, 'js', 'mcc.js');
  
  try {
    // Check if offline file exists
    if (!fs.existsSync(offlineFile)) {
      console.error('❌ Offline file (mcc-offline.js) not found!');
      return;
    }
    
    // Check if data directory exists
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
      console.error('❌ Data directory not found! Please run download-api-data.js first.');
      return;
    }
    
    // Backup original file if it hasn't been backed up yet
    if (fs.existsSync(originalFile) && !fs.existsSync(backupFile)) {
      fs.copyFileSync(originalFile, backupFile);
      console.log('✓ Original file backed up as mcc-online.js');
    }
    
    // Copy offline file to replace the original
    fs.copyFileSync(offlineFile, targetFile);
    console.log('✓ Switched to offline mode');
    console.log('✓ Site will now load data from local JSON files');
    
  } catch (error) {
    console.error('❌ Error switching to offline mode:', error.message);
  }
}

// Function to switch back to online mode
function switchToOnline() {
  const originalFile = path.join(__dirname, 'js', 'mcc.js');
  const backupFile = path.join(__dirname, 'js', 'mcc-online.js');
  
  try {
    if (!fs.existsSync(backupFile)) {
      console.error('❌ Online backup file not found!');
      return;
    }
    
    // Restore the original file
    fs.copyFileSync(backupFile, originalFile);
    console.log('✓ Switched back to online mode');
    console.log('✓ Site will now load data from API');
    
  } catch (error) {
    console.error('❌ Error switching to online mode:', error.message);
  }
}

// Function to check current mode
function checkMode() {
  const currentFile = path.join(__dirname, 'js', 'mcc.js');
  const offlineFile = path.join(__dirname, 'js', 'mcc-offline.js');
  
  try {
    const currentContent = fs.readFileSync(currentFile, 'utf8');
    const offlineContent = fs.readFileSync(offlineFile, 'utf8');
    
    if (currentContent === offlineContent) {
      console.log('🟢 Current mode: OFFLINE');
      console.log('   Data is loaded from local JSON files');
    } else {
      console.log('🔴 Current mode: ONLINE');
      console.log('   Data is loaded from API');
    }
  } catch (error) {
    console.error('❌ Error checking mode:', error.message);
  }
}

// Main execution
const command = process.argv[2];

switch (command) {
  case 'offline':
    switchToOffline();
    break;
  case 'online':
    switchToOnline();
    break;
  case 'status':
    checkMode();
    break;
  default:
    console.log('Usage: node switch-to-offline.js [command]');
    console.log('');
    console.log('Commands:');
    console.log('  offline  - Switch to offline mode (use local JSON files)');
    console.log('  online   - Switch back to online mode (use API)');
    console.log('  status   - Check current mode');
    console.log('');
    console.log('Note: Make sure to run download-api-data.js first to get the data files.');
} 