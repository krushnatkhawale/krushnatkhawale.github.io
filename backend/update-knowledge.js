const fs = require('fs');
const path = require('path');

/**
 * This script synchronizes the backend knowledge.json with the latest 
 * education, experience, projects, and blogs data from the frontend application.
 * It is intended to run as a 'predeploy' task to ensure data consistency.
 */

const PROJECT_ROOT = path.resolve(__dirname, '..');
const BACKEND_JSON_PATH = path.join(PROJECT_ROOT, 'backend', 'knowledge.json');
const FRONTEND_DATA_DIR = path.join(PROJECT_ROOT, 'frontend', 'src', 'data');

const SECTIONS_TO_SYNC = ['education', 'experience', 'projects', 'blogs'];

function syncData() {
  console.log('Synchronizing backend knowledge base...');

  if (!fs.existsSync(BACKEND_JSON_PATH)) {
    console.error(`Error: Backend file not found at ${BACKEND_JSON_PATH}`);
    process.exit(1);
  }

  try {
    const knowledge = JSON.parse(fs.readFileSync(BACKEND_JSON_PATH, 'utf8'));

    SECTIONS_TO_SYNC.forEach((section) => {
      const sourceFile = path.join(FRONTEND_DATA_DIR, `${section}.json`);
      if (fs.existsSync(sourceFile)) {
        const sourceData = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));
        knowledge.portfolio[section] = sourceData;
        console.log(`[OK] Updated "${section}" in knowledge.json`);
      } else {
        console.warn(`[SKIP] Source file for "${section}" not found at ${sourceFile}`);
      }
    });

    fs.writeFileSync(BACKEND_JSON_PATH, JSON.stringify(knowledge, null, 2), 'utf8');
    console.log('Successfully updated knowledge.json');
  } catch (error) {
    console.error('Synchronization failed:', error.message);
    process.exit(1);
  }
}

syncData();