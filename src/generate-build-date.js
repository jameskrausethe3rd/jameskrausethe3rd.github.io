const fs = require('fs');
const path = require('path');

// Get current date in ISO format
const buildDate = new Date().toISOString();

// File path for build-date.ts
const filePath = path.join(__dirname, '/assets/build-date.ts');

// Content to write into the file
const content = `export const BUILD_DATE = '${buildDate}';\n`;

// Write the file
fs.writeFileSync(filePath, content, 'utf8');

console.log('Build date generated:', buildDate);