// Чернетка нового першого екрана: node cms/build-draft.mjs → draft.html (закрито від Google; живий сайт не змінюється)
import fs from 'node:fs'; import { createRequire } from 'node:module'; import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url); const CMS = require('./render.js');
const dir = fileURLToPath(new URL('./', import.meta.url));
const out = CMS.build(fs.readFileSync(dir + 'template-draft.html', 'utf8'), JSON.parse(fs.readFileSync(dir + 'content.json', 'utf8')));
fs.writeFileSync(dir + '../draft.html', out); console.log('draft.html зібрано,', out.length, 'символів');
