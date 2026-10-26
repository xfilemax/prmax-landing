// Локальна збірка: node cms/build.mjs  → index.html із cms/template.html + cms/content.json
import fs from 'node:fs'; import { createRequire } from 'node:module'; import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url); const CMS = require('./render.js');
const dir = fileURLToPath(new URL('./', import.meta.url));
const out = CMS.build(fs.readFileSync(dir + 'template.html', 'utf8'), JSON.parse(fs.readFileSync(dir + 'content.json', 'utf8')));
fs.writeFileSync(dir + '../index.html', out); console.log('index.html зібрано,', out.length, 'символів');
