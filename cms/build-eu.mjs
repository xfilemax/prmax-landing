// Сторінка для українських підприємців у Європі: node cms/build-eu.mjs → eu.html (prmax.agency/eu)
// Береться той самий template.html + content.json, далі — заміни нижче. Кожна заміна мусить спрацювати, інакше збірка зупиняється.
import fs from 'node:fs'; import { createRequire } from 'node:module'; import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url); const CMS = require('./render.js');
const dir = fileURLToPath(new URL('./', import.meta.url));
const c = JSON.parse(fs.readFileSync(dir + 'content.json', 'utf8'));
c.texts.h1b = 'для бізнесу в ЄС';
c.seo.title = 'Сайт і реклама для українського бізнесу в Європі — від $300 | PRMAX';
c.seo.description = 'Для українських підприємців у Польщі, Німеччині, Чехії та всій Європі: сайт під ключ від $300, інтернет-магазин від $500, реклама Google, TikTok, Instagram і Telegram-бот. Запуск за 3 дні.';
c.seo.og_title = 'Сайт і реклама для українського бізнесу в Європі | PRMAX';
c.seo.og_desc = 'Сайт від $300, інтернет-магазин від $500, реклама і бот — запуск за 3 дні. Для українських підприємців у Європі.';
const fx = a => a.replace('Наші ціни — найнижчі в Україні серед студій такої якості', 'Наші ціни нижчі, ніж у європейських агенціях такої якості').replace('від 5 000 ₴ на місяць', 'від 150 € на місяць').replace('від 3 000 ₴ на місяць', 'від 100 € на місяць');
c.faq = c.faq.map(f => ({ q: f.q, a: fx(f.a) }));
c.faq = c.faq.filter(f => !/бонус від Google/i.test(f.q)).map(f => /моєму місті/.test(f.q)
  ? { q: 'Ви працюєте з бізнесом у Європі?', a: 'Так. Працюємо дистанційно з українськими підприємцями в Польщі, Німеччині, Чехії, Австрії, Італії, Іспанії та інших країнах. Реклама показується саме у вашому місті — українською, місцевою мовою або обома. Спілкуємось українською в Telegram, Viber чи WhatsApp.' }
  : f);

// v2 (03.11.2026, «зроби вау»): прапор ЄС у плашці і синій бейдж «ЄС» з колом зірок у заголовку
const star = (cx, cy, r) => { let d = ''; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.4 : r; d += (i ? 'L' : 'M') + (cx + rr * Math.cos(a)).toFixed(2) + ' ' + (cy + rr * Math.sin(a)).toFixed(2); } return d + 'Z'; };
const ring = (cx, cy, R, r) => Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6; return star(cx + R * Math.sin(a), cy - R * Math.cos(a), r); }).join('');
const FLAG = `<svg class="eu-flag" viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" rx="3" fill="#003399"/><path fill="#FFCC00" d="${ring(15, 10, 6.2, 1.25)}"/></svg>`;
const BADGE = `<span class="eu-b"><svg class="eu-ring" viewBox="0 0 40 40" aria-hidden="true"><path fill="#FFCC00" d="${ring(20, 20, 15, 3)}"/></svg><b>ЄС</b></span>`;
const EU_CSS = `<style>
.pill .eu-flag{width:24px;height:16px;flex:0 0 auto;border-radius:3px;box-shadow:0 0 0 1px rgba(255,255,255,.18),0 0 14px rgba(0,51,153,.9);animation:euwave 3s ease-in-out infinite}
@keyframes euwave{50%{transform:rotate(-4deg) scale(1.08)}}
.pill{border-color:rgba(70,120,255,.55)!important;box-shadow:0 0 24px rgba(0,51,153,.35)}
#h1 .eu-b{display:inline-flex;align-items:center;gap:.14em;margin-left:.08em;padding:.02em .26em .06em .16em;border-radius:.2em;background:radial-gradient(120% 140% at 30% 20%,#2f5fe0 0%,#003399 55%,#00226b 100%);box-shadow:0 0 0 2px rgba(255,204,0,.55),0 .12em .6em rgba(0,51,153,.75),inset 0 1px 0 rgba(255,255,255,.25);font-style:normal;-webkit-text-fill-color:#FFCC00;color:#FFCC00;vertical-align:.04em;line-height:1.05}
#h1 .eu-b b{font-weight:800;font-style:normal;letter-spacing:.01em;text-shadow:0 0 .25em rgba(255,204,0,.45)}
#h1 .eu-ring{width:.78em;height:.78em;flex:0 0 auto;animation:euspin 24s linear infinite}
@keyframes euspin{to{transform:rotate(360deg)}}
@media (min-width:1300px){#h1 .ln:last-child .lni{font-size:50px!important}}
@media (max-width:400px){.pill .eu-tail{display:none}.pill .eu-flag{width:20px;height:14px}}
@media (prefers-reduced-motion:reduce){#h1 .eu-ring,.pill .eu-flag{animation:none}}
</style>`;
let out = CMS.build(fs.readFileSync(dir + 'template.html', 'utf8'), c);
const R = [
  ['<meta property="og:url" content="https://prmax.agency/">', '<meta property="og:url" content="https://prmax.agency/eu">'],
  ['<link rel="canonical" href="https://prmax.agency/">', '<link rel="canonical" href="https://prmax.agency/eu">'],
  [/<link rel="alternate" hreflang="[^"]*" href="https:\/\/prmax\.agency\/">\n?/, ''],
  ['Найнижчі ціни в Україні · <span class="more">запуск </span>за 3 дні', 'Українським підприємцям у Європі<span class="eu-tail"> · <span class="more">запуск </span>за 3 дні</span>'],
  ['· найнижчі ціни в Україні', '· ціни нижчі, ніж у європейських агенціях'],
  ['Найнижчі ціни <span class="og-text">в Україні</span>', 'Ціни нижчі, <span class="og-text">ніж у Європі</span>'],
  ['data-v="Київ">Київ</button><button type="button" data-i="1" data-v="Львів">Львів</button>', 'data-v="Польща">Польща</button><button type="button" data-i="1" data-v="Німеччина">Німеччина</button>'],
  ['data-v="Одеса">Одеса</button><button type="button" data-i="3" data-v="Дніпро">Дніпро</button>', 'data-v="Чехія">Чехія</button><button type="button" data-i="3" data-v="Австрія">Австрія</button>'],
  ['data-v="Харків">Харків</button><button type="button" data-i="5" data-v="Вся Україна">Вся Україна</button>', 'data-v="Італія / Іспанія">Італія / Іспанія</button><button type="button" data-i="5" data-v="Інша країна ЄС">Інша країна ЄС</button>'],
  ['<svg class="ic"><use href="#ic-pin"/></svg> Інше місто</button>', '<svg class="ic"><use href="#ic-pin"/></svg> Вкажу місто</button>'],
  ['У якому місті працюєте?</p>', 'У якій країні працюєте?</p>'],
  ['<div class="stat"><b>до 90 000 ₴</b><span>бонус від Google<sup>*</sup></span></div>', '<div class="stat"><b>від $300</b><span>сайт під ключ · магазин від $500</span></div>'],
  [/<div class="bonus-big rv">[\s\S]*?<div class="pay-notes">/, '<div class="pay-notes">'],
  ['90,67% пошуку в Україні — Google<sup>1</sup>', 'Google — пошук №1 у Європі'],
  ['евакуатор київ', 'евакуатор варшава', 0],
  ['Евакуатор Київ', 'Евакуатор Варшава', 0],
  ['Клієнт · Київ', 'Клієнт · Варшава'],
  ['Вся Україна. <span class="og-text">І Європа.</span>', 'Вся Європа. <span class="og-text">Українською.</span>'],
  ["'Бонус Google до 90 000 ₴ на рекламу'", "'Реклама на українців і місцевих у вашому місті'", 0],
  ['Безкоштовна доставка від 500 ₴.', 'Безкоштовна доставка від 30 €.'], ['Доставка від 500 ₴ безкоштовно.', 'Доставка від 30 € безкоштовно.'],
  ['Від 900 ₴/день', 'від 25 €/день'], ['від 900 ₴/день', 'від 25 €/день'],
  ["var CITIES=['Київ','Львів','Харків','Одеса','Дніпро','Запоріжжя'", "var CITIES=['Варшава','Берлін','Прага','Відень','Краків','Мюнхен'"],
  ["var seq=[['auto','Київ'],['beauty','Одеса'],['repair','Львів'],['food','Вінниця'],['home','Дніпро'],['rent','Харків'],['furniture','Полтава'],['biz','Київ'],['goods','Житомир']]",
   "var seq=[['auto','Варшава'],['beauty','Берлін'],['repair','Прага'],['food','Краків'],['home','Відень'],['rent','Вроцлав'],['furniture','Мюнхен'],['biz','Гданськ'],['goods','Лейпциг']]"],
  ["['Київ','Львів','Харків','Одеса','Дніпро','Вінниця','Полтава','Житомир','Рівне','Чернівці','+ будь-яке місто','Європа']", "['Польща','Німеччина','Чехія','Австрія','Італія','Іспанія','Нідерланди','Бельгія','Португалія','Литва','+ будь-яке місто','Вся Європа']"],
  ['placeholder="+380 __ ___ __ __"', 'placeholder="+48 / +49 / +420 …"', 0],
  ['placeholder="+380"', 'placeholder="+48 / +49 / +420 …"'],
  ['placeholder="Наприклад, Київ"', 'placeholder="Наприклад, Варшава"'], ['value="Київ" placeholder="Наприклад, Луцьк"', 'value="Варшава" placeholder="Наприклад, Берлін"'],
  ['наприклад, +380 63 207 20 00', 'з кодом країни, наприклад +48 512 345 678', 0],
  [/<div class="map rv" id="map">[\s\S]*?<\/svg><\/div>/, ''],
  ['<sup>*</sup> Розмір бонусу та умови визначає Google. <sup>1</sup> Statcounter, вересень 2026.', ''],
  ['сайт для бізнесу Київ Львів Одеса Харків Дніпро', 'сайт для бізнесу в Польщі, Німеччині, Чехії, Європі'],
  ['Працюємо онлайн по всій Україні.', 'Працюємо онлайн з українським бізнесом по всій Європі.', 0],
  ['"areaServed":{"@type":"Country","name":"Україна"}', '"areaServed":{"@type":"Place","name":"Європа"}'],
  [/function fmtUA\(v\)\{[^\n]*?return o\}/, "function fmtUA(v){v=String(v||'').replace(/[^\\d+\\s()-]/g,'');if(/^[1-9]/.test(v))v='+'+v;return v}"],
  [/function normPhone\(v\)\{[^\n]*?:'\+'\+d\}/, "function normPhone(v){var d=(v||'').replace(/\\D/g,'');if(d.indexOf('00')===0)d=d.slice(2);if(d.length===10&&d.charAt(0)==='0')d='38'+d;if(d.length<10||d.length>15)return '';return '+'+d}", 0],
  ["if(PROMO==='r10'){SRC=(SRC||'site')+'_r10'", "SRC=(SRC||'site')+'_eu';if(PROMO==='r10'){SRC=(SRC||'site')+'_r10'"],
  ["slugCity(c)+'.com.ua'", "slugCity(c)+'.com'"],
  [/evakuator-kyiv\.com\.ua/, 'evakuator-warszawa.com'],
  ['<button type="button" class="pill" data-goq><i class="dot"></i>', '<button type="button" class="pill" data-goq>' + FLAG],
  ['для бізнесу в\u00a0ЄС</span>', 'для бізнесу в\u00a0' + BADGE + '</span>'],
  ['</head>', EU_CSS + '</head>'],
  ["s.style.setProperty('--i',n++);s.textContent=w;", "s.style.setProperty('--i',n++);if(w==='ЄС')s.innerHTML=" + JSON.stringify(BADGE) + ";else s.textContent=w;"],
];
for (const [a, b, n] of R) {
  const cnt = typeof a === 'string' ? out.split(a).length - 1 : (out.match(new RegExp(a.source, 'g')) || []).length;
  if (!cnt || (n && cnt !== n)) { console.error('НЕ СПРАЦЮВАЛО:', String(a).slice(0, 80), cnt); process.exit(1); }
  out = typeof a === 'string' ? out.split(a).join(b) : out.replace(new RegExp(a.source, 'g'), b);
}
out = out.replace('<html lang="uk"', '<html lang="uk" data-region="eu"');
fs.writeFileSync(dir + '../eu.html', out); console.log('eu.html зібрано,', out.length, 'символів');
