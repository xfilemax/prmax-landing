// PRMAX — збірка сторінки з шаблону (template.html) і вмісту (content.json).
// Один і той самий код працює локально (node cms/build.mjs) і в Google Apps Script (кнопка «Опублікувати» в таблиці-адмінці).
var PRMAX_CMS = (function () {
  function esc(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function get(o, k) { return k.split('.').reduce(function (a, p) { return a == null ? a : a[p]; }, o); }
  function render(tpl, data) {
    tpl = tpl.replace(/{{#([\w.]+)}}([\s\S]*?){{\/\1}}/g, function (m, k, inner) {
      var v = get(data, k);
      if (Array.isArray(v)) return v.map(function (it) { return render(inner, Object.assign({}, data, it)); }).join('');
      return v ? render(inner, data) : '';
    });
    tpl = tpl.replace(/{{{([\w.]+)}}}/g, function (m, k) { var v = get(data, k); return v == null ? '' : String(v); });
    return tpl.replace(/{{([\w.]+)}}/g, function (m, k) { var v = get(data, k); return v == null ? '' : esc(v); });
  }
  // {site}, {google}… у текстах із таблиці → актуальні ціни
  function fill(t, p) { return String(t == null ? '' : t).replace(/{(\w+)}/g, function (m, k) { return p[k] != null ? '$' + p[k] : m; }); }
  // типографіка: короткі слова й тире не відриваються, «10 000 ₴» не розривається (у таблиці пишемо звичайні пробіли)
  function typo(t) {
    return String(t).replace(/(^|[\s(«])([уівзаоякУІВЗАОЯК]|та|до|на|не|по|за|що|як|й)\s+/g, '$1$2\u00a0').replace(/(\d)\s(?=\d{3}\b)/g, '$1\u00a0').replace(/(\d)\s+(₴|грн|\$)/g, '$1\u00a0$2').replace(/\s+—/g, '\u00a0—');
  }
  function pct(a, b) { return b ? Math.round((1 - a / b) * 100) : 0; }
  function prepare(c) {
    var p = c.prices, d = { p: p, t: {}, faq: [], works: [] };
    Object.keys(c.texts).forEach(function (k) { d.t[k] = typo(fill(c.texts[k], p)); });
    d.faq = c.faq.map(function (f) { return { q: typo(fill(f.q, p)), a: typo(fill(f.a, p)) }; });
    d.works = c.works.map(function (w) { return { name: w.name, tag: w.tag, poster: w.poster, video: w.video || '', yt: w.yt || '' }; });
    d.seo = {}; Object.keys(c.seo || {}).forEach(function (k) { d.seo[k] = fill(c.seo[k], p); });
    d.disc = { site: 0, google: 0, bot: 0 };
    var mins = [p.site, p.google, p.bot, p.social, p.seo, p.maps, p.logo, p.lang].filter(function (x) { return x > 0; });
    function offer(name, price, desc) { return { '@type': 'Offer', itemOffered: { '@type': 'Service', name: name, description: desc } }; }
    var org = { '@context': 'https://schema.org', '@type': 'ProfessionalService', '@id': 'https://prmax.agency/#org', name: 'PRMAX', url: 'https://prmax.agency/', logo: 'https://prmax.agency/img/logo.webp', image: 'https://prmax.agency/img/og.jpg',
      description: 'Створення сайтів під ключ за 3 дні, налаштування реклами Google Ads, TikTok і Meta, Telegram-боти для бізнесу. Працюємо онлайн по всій Україні.',
      telephone: '+380632072000', priceRange: '$$', areaServed: { '@type': 'Country', name: 'Україна' }, address: { '@type': 'PostalAddress', addressCountry: 'UA' }, sameAs: ['https://t.me/prmaxagency_bot'],
      hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Послуги PRMAX', itemListElement: [
        offer('Сайт під ключ', p.site, 'Односторінковий сайт під вашу послугу за 3 дні'),
        offer('Налаштування реклами Google Ads', p.google, 'Реклама на тих, хто вже шукає вашу послугу у вашому місті'),
        offer('Telegram-бот для бізнесу', p.bot, 'Бот відповідає клієнтам 24/7 і збирає заявки'),
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Реклама TikTok, Facebook та Instagram' } },
        offer('SEO-налаштування сайту', p.seo, 'Щоб Google показував сайт без реклами'),
        offer('Налаштування Google Карт (профіль компанії)', p.maps, 'Адреса, фото, кнопка дзвінка в Google Картах'),
        offer('Ведення реклами й сайту', p.vedennya, 'Щомісячний супровід реклами та правки сайту')] } };
    var faqLd = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: d.faq.map(function (f) { return { '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }; }) };
    d.ld_org = JSON.stringify(org).replace(/</g, '\\u003c'); d.ld_faq = JSON.stringify(faqLd).replace(/</g, '\\u003c');
    return d;
  }
  function build(tpl, content) { return render(tpl, prepare(content)); }
  return { build: build, render: render, prepare: prepare };
})();
if (typeof module !== 'undefined') module.exports = PRMAX_CMS;
