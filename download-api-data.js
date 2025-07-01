const fs = require('fs');
const path = require('path');
const https = require('https');

// Base URL for the API
const API_BASE_URL = 'https://directus.thegovlab.com/mcc-africa/items';

// Define all the API endpoints that need to be downloaded
const endpoints = [
  {
    name: 'cities',
    url: `${API_BASE_URL}/cities?fields=*.*,city_challenge.*,city_challenge.city_challenge_id.*,city_challenge.city_challenge_id.image.data.*,city_team.people_id.*,city_team.people_id.image.data.*`
  },
  {
    name: 'challenge',
    url: `${API_BASE_URL}/challenge?fields=*.*`
  },
  {
    name: 'people',
    url: `${API_BASE_URL}/people?fields=*.*`
  },
  {
    name: 'about',
    url: `${API_BASE_URL}/about?fields=*.*`
  },
  {
    name: 'timeline',
    url: `${API_BASE_URL}/timeline?fields=*.*`
  },
  {
    name: 'fadetext',
    url: `${API_BASE_URL}/fadetext?fields=*.*`
  },
  {
    name: 'updates',
    url: `${API_BASE_URL}/updates?fields=*.*`
  },
  {
    name: 'winners',
    url: `${API_BASE_URL}/winners?fields=*.*,winner_names.people_id.*,city.cities_id.*,challenge.challenge_id.*`
  },
  {
    name: 'communications',
    url: `${API_BASE_URL}/communications?fields=*.*,social_media_image.banner_id.banner_upload.data.*`
  },
  {
    name: 'posters',
    url: `${API_BASE_URL}/posters?fields=*.*`
  }
];

// Function to make HTTPS request
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (error) {
          reject(new Error(`Failed to parse JSON: ${error.message}`));
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

// Function to download and save data
async function downloadEndpoint(endpoint) {
  try {
    console.log(`Downloading ${endpoint.name}...`);
    const data = await makeRequest(endpoint.url);
    
    // Create the data directory if it doesn't exist
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Save the data to a JSON file
    const filePath = path.join(dataDir, `${endpoint.name}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    
    console.log(`✓ Downloaded ${endpoint.name} (${Object.keys(data.data || {}).length} items)`);
    return data;
  } catch (error) {
    console.error(`✗ Failed to download ${endpoint.name}:`, error.message);
    throw error;
  }
}

// Main function to download all endpoints
async function downloadAllData() {
  console.log('Starting API data download...\n');
  
  const results = {};
  
  for (const endpoint of endpoints) {
    try {
      const data = await downloadEndpoint(endpoint);
      results[endpoint.name] = data;
    } catch (error) {
      console.error(`Failed to download ${endpoint.name}:`, error.message);
    }
  }
  
  console.log('\nDownload complete!');
  console.log(`Data saved to: ${path.join(__dirname, 'data')}`);
  
  // Create a summary file
  const summary = {
    timestamp: new Date().toISOString(),
    endpoints: Object.keys(results),
    totalEndpoints: endpoints.length,
    successfulDownloads: Object.keys(results).length
  };
  
  const summaryPath = path.join(__dirname, 'data', 'download-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  
  console.log(`Summary saved to: ${summaryPath}`);
}

// Run the download
downloadAllData().catch(console.error); 