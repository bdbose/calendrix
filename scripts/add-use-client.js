import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const files = [
  path.join(__dirname, '../dist/index.js'),
  path.join(__dirname, '../dist/index.cjs')
];

const directive = '"use client";\n';

files.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    if (!content.startsWith('"use client";')) {
      fs.writeFileSync(file, directive + content);
      console.log(`Added "use client" to ${file}`);
    } else {
      console.log(`"use client" already present in ${file}`);
    }
  } else {
    console.warn(`File not found: ${file}`);
  }
});
