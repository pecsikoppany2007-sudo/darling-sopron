/* Darling, I’ll call you later… – bemutató oldal, v4.
   GSAP + ScrollTrigger. Egérrel Lenis (lassabb, puhább görgetés), érintőn natív görgetés: ott semmi nem követi az ujjat, csak egyszeri, időzített mozgások vannak. */
(function () {
  'use strict';
  var html = document.documentElement;
  if (!window.gsap || !window.ScrollTrigger) { html.classList.remove('intro-on', 'lang-pending'); return; }
  html.classList.add('intro-run');
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ autoRound: false });

  var canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hwGpu = (function () {
    try {
      var c = document.createElement('canvas'), g = c.getContext('webgl');
      if (!g) return false;
      var ext = g.getExtension('WEBGL_debug_renderer_info');
      var r = ext ? String(g.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : '';
      var lose = g.getExtension('WEBGL_lose_context'); if (lose) lose.loseContext();
      return !/swiftshader|llvmpipe|softpipe|software|basic render/i.test(r);
    } catch (e) { return false; }
  })();
  if (!canHover) html.classList.add('touch');
  var desk = canHover && !reduced && innerWidth >= 1024;
  if (desk) html.classList.add('desk');
  if (reduced) html.classList.add('no-anim');

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }

  /* ------------------------------------------------------------------ nyelvek */
  var T = {
    de: {
      skip: 'Zur Speisekarte', n1: 'Speisekarte', n2: 'Cocktails', n3: 'Wein, Bier, Kaffee', n4: 'Tisch reservieren', n5: 'Lieferung', n6: 'Öffnungszeiten', menu: 'Menü',
      h1: 'Darling, I’ll call you later…', hsub: 'Fusion Street Food und Bar · Sopron, Várkerület 57.', hgo1: 'Speisekarte', hgo2: 'Tisch reservieren',
      aboutH: 'Über uns',
      lede: 'Zwei Räume und eine Terrasse am Várkerület, in jedem Raum dreißig Plätze. Die Küche brät von halb eins bis halb zehn Burger und stellt Poke Bowls zusammen, die Bar hat freitags bis eins und samstags bis zwei Uhr geöffnet.',
      capTerasz: 'Terrasse am Várkerület, mit Heizstrahlern', capBar: 'Die Bar', capAsztal: 'Cocktail und Getränkekarte',
      menuH: 'Speisekarte', menuNote: 'Die Küche kocht von 12:30 bis 21:30 Uhr. Jeden Burger gibt es auch mit glutenfreiem Brötchen, gegen 600 Ft Aufpreis.',
      menuFoot: 'Preise in Forint inklusive Mehrwertsteuer, wir verrechnen keine Servicegebühr. Fragen zu Allergenen beantwortet gern die Bedienung.',
      barH: 'Cocktails', shot: 'Darling Shot, 700 Ft pro Stück. Mindestens vier, die Sorte suchst du aus.', classH: 'Die Klassiker gibt es auch',
      drH: 'Wein, Bier, Kaffee', drLede: 'Auf der Weinkarte Ráspi, Prantner, Jandl und Lővér, bei den Bieren Münchner Helles, Guinness und Mort Subite. Die hausgemachte Limonade gibt es in zwei Größen.',
      bookH: 'Tisch reservieren', bookP: 'Für Freitag- und Samstagabend lieber vorher anrufen, die zwei Räume sind schnell voll. Ruf uns an oder schreib uns auf Instagram.',
      bookQ: '„Wenn wir nicht abheben, rufen wir später zurück…“', dialGo: 'Nummer wählen', dialCall: 'Anrufen', dialHint: 'Klick auf die Löcher und wähl selbst.',
      delH: 'Lieferung', d1t: 'Wohin', d1d: 'Sopron und Umgebung bis 10 km', d2t: 'Liefergebühr', d2d: 'bis 10 km gratis, darüber 700 Ft', d3t: 'Mindestbestellwert', d4t: 'Bezahlung', d4d: 'bar, mit Karte beim Fahrer oder online',
      ordOwn: 'Direkt bei uns bestellen', ordAlso: 'Du findest uns auch auf Wolt und foodora:', ordNote: 'Eine Rechnung mit MwSt. stellen wir auf Wunsch aus, bitte bei der Bestellung angeben.',
      visH: 'Öffnungszeiten', visNote: 'An Feiertagen und bei Veranstaltungen kann es Abweichungen geben, das sagen wir auf Instagram an.',
      aK: 'Adresse', tK: 'Telefon', sK: 'Soziale Medien', mapP: 'Die Karte ist ein Dienst von Google, beim Laden kann Google Cookies setzen.', mapGo: 'Karte laden',
      ftBig: 'Darling, I’ll call you later…', ftOp: 'Betreiber', ftSeat: 'Sitz', ftLegal: 'Impressum und Datenschutz', ftPhotos: 'Fotos: eigene Bilder des Darling.', ftHost: 'Hosting: Netlify, Inc.'
    },
    en: {
      skip: 'Skip to the menu', n1: 'Menu', n2: 'Cocktails', n3: 'Wine, beer, coffee', n4: 'Book a table', n5: 'Delivery', n6: 'Opening hours', menu: 'Menu',
      h1: 'Darling, I’ll call you later…', hsub: 'Fusion street food and bar · Sopron, Várkerület 57.', hgo1: 'Menu', hgo2: 'Book a table',
      aboutH: 'About us',
      lede: 'Two rooms and a terrace on Várkerület, thirty seats in each room. The kitchen grills burgers and builds poke bowls from half past twelve to half past nine, and the bar stays open until one on Fridays and two on Saturdays.',
      capTerasz: 'The terrace on Várkerület, with heaters', capBar: 'The bar', capAsztal: 'Cocktail and drinks list',
      menuH: 'Menu', menuNote: 'The kitchen cooks from 12:30 to 21:30. Any burger comes on a gluten-free bun for 600 Ft extra.',
      menuFoot: 'Prices are in forints and include VAT. We do not add a service charge. Ask your server about allergens.',
      barH: 'Cocktails', shot: 'Darling Shot, 700 Ft each. Order at least four, you pick the flavour.', classH: 'We serve the classics too',
      drH: 'Wine, beer, coffee', drLede: 'Ráspi, Prantner, Jandl and Lővér on the wine list, Münchner Helles, Guinness and Mort Subite among the beers. Our lemonade comes in two sizes.',
      bookH: 'Book a table', bookP: 'For Friday and Saturday nights it is worth calling ahead, both rooms fill up fast. Call us or send a message on Instagram.',
      bookQ: '“If we don’t pick up, we’ll call you later…”', dialGo: 'Dial the number', dialCall: 'Call', dialHint: 'Click the finger holes to dial yourself.',
      delH: 'Delivery', d1t: 'Where', d1d: 'Sopron and 10 km around', d2t: 'Delivery fee', d2d: 'free up to 10 km, 700 Ft beyond', d3t: 'Minimum order', d4t: 'Payment', d4d: 'cash, card to the courier or online',
      ordOwn: 'Order directly from us', ordAlso: 'You can also find us on Wolt and foodora:', ordNote: 'We issue a VAT invoice on request, mention it when you order.',
      visH: 'Opening hours', visNote: 'Hours may differ on public holidays and during events, we post changes on Instagram.',
      aK: 'Address', tK: 'Phone', sK: 'Social', mapP: 'The map is a Google service, Google may set cookies when it loads.', mapGo: 'Load the map',
      ftBig: 'Darling, I’ll call you later…', ftOp: 'Operator', ftSeat: 'Registered office', ftLegal: 'Legal notice and privacy', ftPhotos: 'Photos: Darling’s own pictures.', ftHost: 'Hosting: Netlify, Inc.'
    }
  };
  var huText = {};
  $$('[data-i18n]').forEach(function (el) { huText[el.getAttribute('data-i18n')] = el.textContent; });
  var lang = 'hu', LI = { hu: 0, de: 1, en: 2 };
  function nb(s) { return lang === 'hu' ? String(s).replace(/(^|[\s(„])(a|az|A|Az|és|is) /g, '$1$2 ') : s; }
  function t(k) { var d = T[lang] || {}; return nb(k in d ? d[k] : huText[k] || ''); }
  function L(a) { return nb(a == null ? '' : typeof a === 'string' ? a : (a[LI[lang]] != null ? a[LI[lang]] : a[0])); }
  function ft(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, lang === 'en' ? ',' : ' '); }

  /* ------------------------------------------------------------------ étlap (a hely nyomtatott étlapja alapján) */
  var MENU = [
    { k: 'Burger', img: 'm-burger', alt: ['Smashed burger hasábburgonyával és sörrel', 'Smashed Burger mit Pommes und Bier', 'Smashed burger with fries and beer'], items: [
      ['Darling Smashed', 3290, ['Darling szósz, marhahúspogácsa, cheddar, jégsaláta, paradicsom, uborka, hagyma, bacon', 'Darling-Sauce, Rindfleisch-Patty, Cheddar, Eisbergsalat, Tomate, Gurke, Zwiebel, Bacon', 'Darling sauce, beef patty, cheddar, iceberg, tomato, pickle, onion, bacon']],
      ['Double Smashed', 4190, ['Ugyanez két marhahúspogácsával', 'Dasselbe mit zwei Rindfleisch-Patties', 'The same with two beef patties']],
      ['Fresh Chicken', 3390, ['Majonéz, ropogós csirkemell, paradicsom, hagyma, jégsaláta, uborka, sajt, bacon', 'Mayonnaise, knusprige Hähnchenbrust, Tomate, Zwiebel, Eisbergsalat, Gurke, Käse, Bacon', 'Mayo, crispy chicken breast, tomato, onion, iceberg, pickle, cheese, bacon']],
      ['Camemberry', 3590, ['Vörösáfonyalekvár, camembert, madársaláta, hagyma, bacon, majonéz', 'Preiselbeermarmelade, Camembert, Feldsalat, Zwiebel, Bacon, Mayonnaise', 'Cranberry jam, camembert, lamb’s lettuce, onion, bacon, mayo']],
      ['Hot AF', 3890, ['Chipotle majonéz, marhahúspogácsa, cheddarszósz, jalapeño, jégsaláta, uborka, paradicsom, hagyma, bacon', 'Chipotle-Mayo, Rindfleisch-Patty, Cheddarsauce, Jalapeño, Eisbergsalat, Gurke, Tomate, Zwiebel, Bacon', 'Chipotle mayo, beef patty, cheddar sauce, jalapeño, iceberg, pickle, tomato, onion, bacon'], ['csípős', 'scharf', 'spicy']],
      ['Cute Cow', 3990, ['Vegán házi szósz, Beyond Meat, vegán cheddar, jégsaláta, paradicsom, uborka, hagyma, kókuszolaj', 'Vegane Haussauce, Beyond Meat, veganer Cheddar, Eisbergsalat, Tomate, Gurke, Zwiebel, Kokosöl', 'Vegan house sauce, Beyond Meat, vegan cheddar, iceberg, tomato, pickle, onion, coconut oil'], ['vegán', 'vegan', 'vegan']]
    ] },
    { k: 'Poke bowl', img: 'm-poke', alt: ['Poke bowl lazaccal, avokádóval és zöldségekkel', 'Poke Bowl mit Lachs, Avocado und Gemüse', 'Poke bowl with salmon, avocado and vegetables'], note: ['Alapnak választhatsz rizstésztát, sushi rizst, zöldsalátát vagy barna rizst, a feltétek kérésre cserélhetők.', 'Als Basis Reisnudeln, Sushireis, grüner Salat oder Naturreis, die Zutaten tauschen wir auf Wunsch.', 'Pick rice noodles, sushi rice, salad or brown rice as the base, toppings can be swapped on request.'], items: [
      ['Chicken Teriyaki Bowl', 3490, ['Csirkemell, sárgarépa, uborka, avokádó, paradicsom, kukorica, cékla; teriyaki, szója, majonéz', 'Hähnchenbrust, Karotte, Gurke, Avocado, Tomate, Mais, Rote Bete; Teriyaki, Soja, Mayonnaise', 'Chicken breast, carrot, cucumber, avocado, tomato, corn, beetroot; teriyaki, soy, mayo']],
      ['Tofu Bowl', 3490, ['Pirított tofu, wakame, avokádó, mangó, lilakáposzta, cukkini, sárgarépa; hoisin, szója', 'Gebratener Tofu, Wakame, Avocado, Mango, Rotkohl, Zucchini, Karotte; Hoisin, Soja', 'Seared tofu, wakame, avocado, mango, red cabbage, courgette, carrot; hoisin, soy']],
      ['Silly Salmon Bowl', 3790, ['Lazac, wakame, avokádó, retek, babcsíra, sárgarépa, cékla, kukorica; szója, wasabis majonéz', 'Lachs, Wakame, Avocado, Radieschen, Sprossen, Karotte, Rote Bete, Mais; Soja, Wasabi-Mayo', 'Salmon, wakame, avocado, radish, bean sprouts, carrot, beetroot, corn; soy, wasabi mayo']],
      ['Shrimp Bowl', 3990, ['Garnélarák, edamame, paradicsom, brokkoli, avokádó, mangó, babcsíra, retek, szezámmag; teriyaki, chilis majonéz', 'Garnelen, Edamame, Tomate, Brokkoli, Avocado, Mango, Sprossen, Radieschen, Sesam; Teriyaki, Chili-Mayo', 'Shrimp, edamame, tomato, broccoli, avocado, mango, bean sprouts, radish, sesame; teriyaki, chilli mayo']]
    ] },
    { k: 'Wrap', img: 'm-wrap', alt: ['Kettévágott wrap salátával', 'Halbierter Wrap mit Salat', 'Wrap cut in half with salad'], items: [
      ['Sophia', 3290, ['Grillezett csirke, jégsaláta, kukorica, tejföl, lime, jalapeño, cheddar', 'Gegrilltes Hähnchen, Eisbergsalat, Mais, Sauerrahm, Limette, Jalapeño, Cheddar', 'Grilled chicken, iceberg, corn, sour cream, lime, jalapeño, cheddar']],
      ['Maya', 3390, ['Ropogós csirke, borsos majonéz, szárított paradicsom, olívabogyó, parmezán, madársaláta', 'Knuspriges Hähnchen, Pfeffermayo, getrocknete Tomaten, Oliven, Parmesan, Feldsalat', 'Crispy chicken, pepper mayo, sun-dried tomato, olives, parmesan, lamb’s lettuce']],
      ['Liza', 3490, ['Camembert, vörösáfonya-szósz, madársaláta, körte, dió, olívaolaj', 'Camembert, Preiselbeersauce, Feldsalat, Birne, Walnuss, Olivenöl', 'Camembert, cranberry sauce, lamb’s lettuce, pear, walnut, olive oil']]
    ] },
    { k: ['Hot dog és toast', 'Hot Dog und Toast', 'Hot dogs and toasties'], img: 'm-hotdog', alt: ['Hot dog sült hagymával', 'Hot Dog mit Röstzwiebeln', 'Hot dog with crispy onions'], note: ['A hot doghoz frankfurti virslit vagy sajtos kolbászt kérhetsz.', 'Beim Hot Dog wählst du zwischen Frankfurter und Käsewurst.', 'Hot dogs come with a frankfurter or a cheese sausage.'], items: [
      ['Hot dog Extra', 2790, ['Ketchup, mustár, csemegeuborka, pirított hagyma, jalapeño, cheddar', 'Ketchup, Senf, Essiggurke, Röstzwiebeln, Jalapeño, Cheddar', 'Ketchup, mustard, gherkin, crispy onion, jalapeño, cheddar']],
      ['Hot dog Little Italy', 2890, ['Majonéz, szárított paradicsom, olívabogyó, mozzarella', 'Mayonnaise, getrocknete Tomaten, Oliven, Mozzarella', 'Mayo, sun-dried tomato, olives, mozzarella']],
      ['Toast', 2290, ['Vaj, sonka, sajt, saláta, ketchup', 'Butter, Schinken, Käse, Salat, Ketchup', 'Butter, ham, cheese, lettuce, ketchup']],
      ['Cheesy Toast', 2390, ['Vajkrém, brie, gouda, gorgonzola, saláta, ketchup', 'Buttercreme, Brie, Gouda, Gorgonzola, Salat, Ketchup', 'Butter spread, brie, gouda, gorgonzola, lettuce, ketchup']],
      ['Retro Klasszik', 2490, ['Vajkrém, sajt, sonka, kukorica', 'Buttercreme, Käse, Schinken, Mais', 'Butter spread, cheese, ham, corn']],
      ['Retro Gombás', 2590, ['Gombakrém, sajt', 'Pilzcreme, Käse', 'Mushroom spread, cheese']],
      ['Retro Magyaros', 2690, ['Paprikás vajkrém, sajt, füstölt tarja, paprikás szalámi, lilahagyma', 'Paprika-Buttercreme, Käse, geräucherter Schweinekamm, Paprikasalami, rote Zwiebel', 'Paprika butter, cheese, smoked pork neck, paprika salami, red onion']]
    ] },
    { k: ['Előétel és snack', 'Vorspeisen und Snacks', 'Starters and snacks'], img: 'm-strips', alt: ['Ropogós csirkecsíkok szósszal', 'Knusprige Hähnchenstreifen mit Dip', 'Crispy chicken strips with dip'], items: [
      ['Summer Roll Shrimp', 1990, ['Garnéla, üvegtészta, sárgarépa, uborka, koriander, lilakáposzta, mogyoró', 'Garnele, Glasnudeln, Karotte, Gurke, Koriander, Rotkohl, Erdnuss', 'Shrimp, glass noodles, carrot, cucumber, coriander, red cabbage, peanut']],
      ['Summer Roll Veggie', 1690, ['Avokádó, üvegtészta, sárgarépa, uborka, menta, lilakáposzta, mogyoró', 'Avocado, Glasnudeln, Karotte, Gurke, Minze, Rotkohl, Erdnuss', 'Avocado, glass noodles, carrot, cucumber, mint, red cabbage, peanut']],
      ['Crispy Chicken Strips', '2490 / 3490', ['5 vagy 8 darab, szósszal', '5 oder 8 Stück, mit Sauce', '5 or 8 pieces, with a sauce']],
      ['Chili Cheese Nuggets', '1490 / 2290', ['5 vagy 9 darab', '5 oder 9 Stück', '5 or 9 pieces']],
      ['Cheddar-bacon-jalapeño fries', 2990, ['Hasábburgonya cheddarszósszal, baconnel, jalapeñóval', 'Pommes mit Cheddarsauce, Bacon und Jalapeño', 'Fries with cheddar sauce, bacon and jalapeño']],
      ['Nachos', 1990, ['Cheddar- és salsaszósszal', 'Mit Cheddar- und Salsasauce', 'With cheddar and salsa sauce']],
      [['Hagymakarika kosár', 'Zwiebelringe', 'Onion rings'], 1790, ['12 darab, szósszal', '12 Stück, mit Sauce', '12 pieces, with a sauce']],
      [['Édesburgonya kosár', 'Süßkartoffel-Pommes', 'Sweet potato fries'], 2290, ['Szósszal', 'Mit Sauce', 'With a sauce']],
      [['Darling vegyes hidegtál', 'Darling Platte, gemischt', 'Darling mixed platter'], 4790, ['Kenyérrel és kenőkkel. Sajttálként 4990, húsos tálként 4490 Ft.', 'Mit Brot und Aufstrichen. Als Käseplatte 4990, als Fleischplatte 4490 Ft.', 'With bread and spreads. Cheese platter 4990, meat platter 4490 Ft.']]
    ] },
    { k: ['Desszert', 'Dessert', 'Desserts'], img: 'm-desszert', items: [
      ['Tiramisu', 1690, null],
      ['Churros', 1890, ['Nutellás vagy lekváros mártogatóval', 'Mit Nutella- oder Marmeladendip', 'With a Nutella or jam dip']],
      ['Bubble waffle', 2490, ['Berry: kékáfonyalekvár, vaníliapuding, erdei gyümölcs, tejszínhab. Banana: nutella, csokipuding, banán, Kinder csokoládé. Vanilla: vaníliafagyi, nutella, málna, fehér csoki.', 'Berry: Heidelbeermarmelade, Vanillepudding, Waldfrüchte, Sahne. Banana: Nutella, Schokopudding, Banane, Kinder-Schokolade. Vanilla: Vanilleeis, Nutella, Himbeere, weiße Schokolade.', 'Berry: blueberry jam, vanilla pudding, forest fruit, whipped cream. Banana: Nutella, chocolate pudding, banana, Kinder chocolate. Vanilla: vanilla ice cream, Nutella, raspberry, white chocolate.']],
      [['Sütemény', 'Kuchen', 'Cakes'], null, ['A napi kínálatot a pultnál kérdezd.', 'Das Tagesangebot erfährst du an der Theke.', 'Ask at the counter what we have today.']]
    ] }
  ];
  var COCK = [
    ['Aperol Lemonade', 2690, ['Aperol, friss citrom, friss narancs, Sprite, barnacukor', 'Aperol, frische Zitrone, frische Orange, Sprite, brauner Zucker', 'Aperol, fresh lemon, fresh orange, Sprite, brown sugar']],
    ['Gin Basil Smash', 2790, ['Gin, friss bazsalikom, friss citromlé, cukorszirup', 'Gin, frisches Basilikum, frischer Zitronensaft, Zuckersirup', 'Gin, fresh basil, fresh lemon juice, sugar syrup']],
    ['Whiskey Smash', 2790, ['Whiskey, friss menta, friss citromlé, cukorszirup', 'Whiskey, frische Minze, frischer Zitronensaft, Zuckersirup', 'Whiskey, fresh mint, fresh lemon juice, sugar syrup']],
    ['Amaretto Sour', 2590, ['Amaretto, friss citromlé', 'Amaretto, frischer Zitronensaft', 'Amaretto, fresh lemon juice']],
    ['Mark’s Cucumber', 2590, ['Hogy mi van benne, az titok', 'Was drin ist, bleibt geheim', 'What goes in is top secret']],
    ['Roses Mojito', 2690, ['Rum, friss menta, friss lime, rózsalimonádé, barnacukor', 'Rum, frische Minze, frische Limette, Rosenlimonade, brauner Zucker', 'Rum, fresh mint, fresh lime, rose lemonade, brown sugar']]
  ];
  var CLASS = [['Negroni', 2690], ['Margarita', 2590], ['Mezcal Margarita', 3290], ['Paloma', 2690], ['Old Fashioned', 2790], ['Espresso Martini', 2690], ['Pornstar Martini', 2790], ['Cuba Libre', 2590], ['Mojito', 2590], [['Gyümölcsös mojito', 'Frucht-Mojito', 'Fruit mojito'], 2790], ['Bloody Mary', 2590], ['Sopron Mule', 2790]];
  var CARDS = ['k-mule', 'k-sour', 'k-tiki', 'k-rozsa', 'k-zold', 'k-narancs', 'k-sour2', 'k-mojito', 'k-gin', 'k-hab'];
  var DRINKS = [
    [['Sör', 'Bier', 'Beer'], [
      ['Münchner Helles', '0,3 · 0,5', '990 / 1490'], ['Pilsner', '0,3 · 0,5', '990 / 1490'], ['Guinness', '0,25 · 0,5', '1290 / 2490'],
      ['Hoegaarden', '0,3 · 0,5', '1390 / 1990'], ['Mort Subite', '0,4', '1490'], ['Belle-Vue Kriek', '0,4', '1890'], [['Peroni alkoholmentes', 'Peroni alkoholfrei', 'Peroni alcohol-free'], '0,33', '990']]],
    [['Bor', 'Wein', 'Wine'], [
      [['Iváncsics zöld veltelíni', 'Iváncsics Grüner Veltliner', 'Iváncsics Grüner Veltliner'], '1 dl · 0,75', '650 / 4500'], [['Prantner rizling', 'Prantner Riesling', 'Prantner Riesling'], '1 dl · 0,75', '700 / 5000'],
      [['Prantner rozé', 'Prantner Rosé', 'Prantner rosé'], '1 dl · 0,75', '700 / 5000'], ['Gangl Sauvignon Blanc', '0,75', '5000'], ['Lővér Chardonnay', '0,75', '5000'],
      [['Ráspi kékfrankos', 'Ráspi Blaufränkisch', 'Ráspi Kékfrankos'], '1 dl · 0,75', '700 / 5000'], [['Jandl Missio kékfrankos', 'Jandl Missio Blaufränkisch', 'Jandl Missio Kékfrankos'], '1 dl', '700'], ['Ráspi Syrah', '1 dl · 0,75', '1100 / 8000']]],
    [['Pezsgő', 'Schaumwein', 'Sparkling'], [
      ['Soligo Prosecco DOC', '1 dl · 0,75', '1200 / 8500'], ['Kreinbacher Prestige Brut', '0,75', '14000'], ['Billecart-Salmon Brut Réserve', '0,75', '37500'], ['Louis Roederer Collection 242', '0,75', '45000']]],
    [['Kávé és limonádé', 'Kaffee und Limonade', 'Coffee and lemonade'], [
      ['Espresso', '', '690'], ['Cappuccino', '', '990'], ['Flat white', '', '1350'], ['Espresso tonic', '', '1350'], ['Matcha latte', '', '1590'],
      [['Darling limonádé', 'Darling Limonade', 'Darling lemonade'], '0,3 · 0,5', '990 / 1490', ['classic, áfonya-levendula, mangó-maracuja, eper-bazsalikom, málna-rózsa, menta-bodza', 'Classic, Heidelbeere-Lavendel, Mango-Maracuja, Erdbeere-Basilikum, Himbeere-Rose, Minze-Holunder', 'classic, blueberry-lavender, mango-passion fruit, strawberry-basil, raspberry-rose, mint-elderflower']]]]
  ];
  /* nyitvatartás: Google Térkép, 2026-11-09 (vasárnap = 0). 25:00 = másnap 1:00 */
  var HOURS = [['14:00', '22:00'], ['12:00', '23:00'], ['12:00', '23:00'], ['12:00', '23:00'], ['12:00', '23:00'], ['13:00', '25:00'], ['13:00', '26:00']];
  var DAYS = [['Vasárnap', 'Sonntag', 'Sunday'], ['Hétfő', 'Montag', 'Monday'], ['Kedd', 'Dienstag', 'Tuesday'], ['Szerda', 'Mittwoch', 'Wednesday'], ['Csütörtök', 'Donnerstag', 'Thursday'], ['Péntek', 'Freitag', 'Friday'], ['Szombat', 'Samstag', 'Saturday']];

  /* ------------------------------------------------------------------ budapesti idő (EU nyári időszámítás szabálya, Intl nélkül) */
  function lastSun(y, m) { var d = new Date(Date.UTC(y, m + 1, 0)); return d.getUTCDate() - d.getUTCDay(); }
  function bud() {
    var n = new Date(), y = n.getUTCFullYear();
    var s = Date.UTC(y, 2, lastSun(y, 2), 1), e = Date.UTC(y, 9, lastSun(y, 9), 1);
    var b = new Date(n.getTime() + ((n.getTime() >= s && n.getTime() < e) ? 2 : 1) * 3600000);
    return { d: b.getUTCDay(), m: b.getUTCHours() * 60 + b.getUTCMinutes() };
  }
  function mins(s) { var p = s.split(':'); return +p[0] * 60 + +p[1]; }
  function hm(s) { var m = mins(s) % 1440; return Math.floor(m / 60) + ':' + ('0' + m % 60).slice(-2); }
  function status() {
    var b = bud(), y = (b.d + 6) % 7, h = HOURS[b.d], hy = HOURS[y];
    if (mins(hy[1]) > 1440 && b.m < mins(hy[1]) - 1440) return { open: true, till: hy[1] };
    if (b.m >= mins(h[0]) && b.m < mins(h[1])) return { open: true, till: h[1] };
    if (b.m < mins(h[0])) return { open: false, when: 0, at: h[0] };
    return { open: false, when: 1, at: HOURS[(b.d + 1) % 7][0] };
  }
  function renderLive() {
    var s = status(), el = $('#live');
    el.classList.toggle('is-open', s.open);
    $('#liveTxt').textContent = s.open
      ? L(['Most nyitva, ' + hm(s.till) + '-ig', 'Jetzt geöffnet, bis ' + hm(s.till), 'Open now, until ' + hm(s.till)])
      : L([(s.when ? 'Holnap ' : 'Ma ') + hm(s.at) + '-kor nyitunk', (s.when ? 'Morgen' : 'Heute') + ' ab ' + hm(s.at), 'Opens ' + (s.when ? 'tomorrow' : 'today') + ' at ' + hm(s.at)]);
    var b = bud(), h = HOURS[b.d];
    $('#heroToday').innerHTML = esc(L(['Ma', 'Heute', 'Today'])) + '<b>' + hm(h[0]) + '–' + hm(h[1]) + '</b>';
    $$('#hours tr').forEach(function (tr) { tr.classList.toggle('is-today', +tr.getAttribute('data-d') === b.d); });
  }
  function renderHours() {
    var order = [1, 2, 3, 4, 5, 6, 0];
    $('#hours tbody').innerHTML = order.map(function (d) {
      return '<tr data-d="' + d + '"><th scope="row" data-t="' + esc(L(['ma', 'heute', 'today'])) + '">' + esc(L(DAYS[d])) + '</th><td>' + hm(HOURS[d][0]) + '–' + hm(HOURS[d][1]) + '</td></tr>';
    }).join('');
  }

  /* ------------------------------------------------------------------ kirajzolás */
  var tabI = 0;
  var ROM = ['01', '02', '03', '04', '05', '06'];
  function renderTabs() {
    $('#tabs').innerHTML = MENU.map(function (g, i) { return '<button type="button" role="tab" id="tab' + i + '" aria-controls="menuList" aria-selected="' + (i === tabI) + '" tabindex="' + (i === tabI ? 0 : -1) + '"><i>' + ROM[i] + '</i>' + esc(L(g.k)) + '</button>'; }).join('');
  }
  function price(p) { return p == null ? '' : ft(p).replace(/ \/ /, ' / ') + ' Ft'; }
  function renderMenu(anim) {
    var g = MENU[tabI], list = $('#menuList');
    var h = g.items.map(function (it, k) {
      return '<div class="dish" style="--k:' + k + '"><p class="dish__n">' + esc(L(it[0])) + (it[3] ? ' <span class="dish__t">' + esc(L(it[3])) + '</span>' : '') + '</p><p class="dish__p">' + esc(price(it[1])) + '</p>' + (it[2] ? '<p class="dish__d">' + esc(L(it[2])) + '</p>' : '') + '</div>';
    }).join('');
    if (g.note) h += '<p class="dish__d" style="margin-top:18px">' + esc(L(g.note)) + '</p>';
    list.innerHTML = h;
    list.setAttribute('aria-labelledby', 'tab' + tabI);
    list.classList.remove('is-swap'); if (anim && !reduced) { void list.offsetWidth; list.classList.add('is-swap'); }
    showPic(g);
  }
  var picCache = {};
  function showPic(g) {
    var fr = $('#menuPic'); if (!fr) return;
    var key = g.img, im = picCache[key];
    if (!im) {
      im = new Image(); im.decoding = 'async'; im.alt = '';
      if (key === 'logo') { im.src = 'img/logo.svg?v=4'; im.className = 'is-logo'; }
      else { im.src = 'img/' + key + '-800.webp?v=4'; im.srcset = 'img/' + key + '-800.webp?v=4 800w, img/' + key + '-1400.webp?v=4 1400w'; im.sizes = '(min-width: 900px) 30vw, 100vw'; }
      picCache[key] = im; fr.appendChild(im);
    }
    $$('img', fr).forEach(function (x) { x.classList.remove('was'); if (x.classList.contains('is-on') && x !== im) { x.classList.remove('is-on'); x.classList.add('was'); } });
    fr.appendChild(im); void im.offsetWidth;
    requestAnimationFrame(function () { im.classList.add('is-on'); });
  }
  function renderBar() {
    $('#cList').innerHTML = COCK.map(function (c) { return '<li><b>' + esc(c[0]) + '</b><em class="pr">' + ft(c[1]) + '</em><span>' + esc(L(c[2])) + '</span></li>'; }).join('');
    $('#classics').innerHTML = CLASS.map(function (c) { return '<li>' + esc(L(c[0])) + '<em>' + ft(c[1]) + '</em></li>'; }).join('');
  }
  function renderDrinks() {
    $('#drGrid').innerHTML = DRINKS.map(function (g) {
      return '<div class="dl"><h3>' + esc(L(g[0])) + '</h3><ul>' + g[1].map(function (it) {
        return '<li><span>' + esc(L(it[0])) + (it[3] ? '<small>' + esc(L(it[3])) + '</small>' : '') + '</span><em>' + (it[1] ? esc(it[1]) + ' · ' : '') + esc(ft(it[2])) + ' Ft</em></li>';
      }).join('') + '</ul></div>';
    }).join('');
  }

  /* ------------------------------------------------------------------ címek sorokra bontva, bekezdés szavakra */
  function splitBl() {
    $$('.bl').forEach(function (h) {
      var tx = (h.querySelector('.ln') ? h.getAttribute('aria-label') : h.textContent).trim();
      h.setAttribute('aria-label', tx);
      h.innerHTML = tx.split(/[ \n\t]+/).map(function (w) { return '<span class="w" aria-hidden="true">' + esc(w) + '</span>'; }).join(' ');
      var ws = $$('.w', h), lines = [], top = null;
      ws.forEach(function (w) { var o = w.offsetTop; if (top === null || Math.abs(o - top) > 4) { lines.push([]); top = o; } lines[lines.length - 1].push(w.textContent); });
      h.innerHTML = lines.map(function (l, i) { return '<span class="ln" aria-hidden="true" style="--l:' + i + '"><span class="ln__i">' + esc(l.join(' ')) + '</span></span>'; }).join('');
      if (h.classList.contains('h2')) h.insertAdjacentHTML('beforeend', PEND.replace('pend"', 'pend' + (h.hasAttribute('data-lit') ? ' is-lit' : '') + '"'));
    });
    if (lampObs) $$('.pend:not(.is-lit)').forEach(function (p) { lampObs.observe(p.parentNode); });
    requestAnimationFrame(alignCones);
  }
  /* a fénykúpban a tapéta mintája pontosan a szakasz mintájára illeszkedik */
  function alignCones() {
    $$('.pend__c').forEach(function (c) {
      var sec = c.closest('.sec'); if (!sec) return;
      var a = c.getBoundingClientRect(), b = sec.getBoundingClientRect();
      var x = ((b.left - a.left) % 120 + 120) % 120, y = ((b.top - a.top) % 60 + 60) % 60;
      c.style.backgroundPosition = x.toFixed(1) + 'px ' + y.toFixed(1) + 'px, 0 0';
    });
  }
  /* lefutott fény-animációk lezárása, hogy ne maradjanak külön rétegen */
  document.addEventListener('animationend', function (e) {
    var n = e.animationName, t = e.target;
    if (n === 'lampOn' && t.classList.contains('pend__c')) t.parentNode.classList.add('is-on');
    else if (n === 'lightUp') { var ph = t.closest('.ph'); if (ph) ph.classList.add('is-on'); }
  });
  /* függőlámpa a címek fölött: odaérve vibrálva felkapcsol */
  var PEND = '<span class="pend" aria-hidden="true"><svg viewBox="0 0 40 20"><path class="pend__s" d="M20 1.5c-3 0-5 2-5.6 4.6C8.2 7 3 11.4 1.5 18.5h37C37 11.4 31.8 7 25.6 6.1 25 3.5 23 1.5 20 1.5z"/></svg><i class="pend__b"></i><i class="pend__c"></i></span>';
  var lampObs = ('IntersectionObserver' in window) && !reduced ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (!e.isIntersecting) return; var h = e.target; lampObs.unobserve(h); h.setAttribute('data-lit', ''); var p = h.querySelector('.pend'); if (p) p.classList.add('is-lit'); });
  }, { rootMargin: '0px 0px -22% 0px' }) : null;
  var ledeWords = [];
  function splitLede() {
    var q = $('#lede'); if (!q) return;
    var tx = (q.querySelector('.wd') ? q.getAttribute('aria-label') : q.textContent).trim(); q.setAttribute('aria-label', tx);
    q.innerHTML = tx.split(/[ \n\t]+/).map(function (w) { return '<span class="wd" aria-hidden="true">' + esc(w) + '</span>'; }).join(' ');
    ledeWords = $$('.wd', q);
    if (reduced) ledeWords.forEach(function (w) { w.classList.add('on'); });
  }

  /* ------------------------------------------------------------------ nyelvváltás */
  var ready = false;
  function applyLang(l, save) {
    lang = T[l] || l === 'hu' ? l : 'hu';
    html.lang = lang;
    $$('[data-i18n]').forEach(function (el) { var v = t(el.getAttribute('data-i18n')); if (el.textContent !== v) el.textContent = v; });
    $$('.lang button').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-lang') === lang); });
    document.title = lang === 'hu' ? 'Drágám, később hívlak… · Darling, I’ll call you later · Sopron, Várkerület 57.' : 'Darling, I’ll call you later… · Sopron, Várkerület 57.';
    baseTitle = document.title;
    renderTabs(); renderMenu(false); renderBar(); renderDrinks(); renderHours(); renderLive();
    splitBl(); splitLede();
    $$('.bl').forEach(function (h) { if (ready && h.getBoundingClientRect().top < innerHeight) h.classList.add('is-in'); });
    if (ready) { observeBl(); lightLede(); ScrollTrigger.refresh(); }
    if (save) try { localStorage.setItem('dl-lang', lang); } catch (e) {}
    html.classList.remove('lang-pending');
  }
  var baseTitle = document.title;
  var startLang = 'hu';
  try { startLang = localStorage.getItem('dl-lang') || ''; } catch (e) {}
  if (!startLang) { var nl = (navigator.languages || [navigator.language || 'hu']).map(function (x) { return String(x).slice(0, 2); }); startLang = nl.filter(function (x) { return x === 'hu' || x === 'de' || x === 'en'; })[0] || 'en'; }
  $$('.lang button').forEach(function (b) { b.addEventListener('click', function () { applyLang(b.getAttribute('data-lang'), true); }); });

  /* étlap fülek: kattintás + nyilak */
  $('#tabs').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var i = $$('#tabs button').indexOf(b); if (i === tabI) return;
    tabI = i; renderTabs(); renderMenu(true); $('#tab' + i).focus();
    if (ready) ScrollTrigger.refresh();
  });
  $('#tabs').addEventListener('keydown', function (e) {
    var d = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return; e.preventDefault();
    tabI = (tabI + d + MENU.length) % MENU.length; renderTabs(); renderMenu(true); $('#tab' + tabI).focus();
  });

  /* ------------------------------------------------------------------ megjelenések */
  var io = 'IntersectionObserver' in window;
  var blObs = io ? new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); blObs.unobserve(e.target); } }); }, { rootMargin: '0px 0px -12% 0px' }) : null;
  function observeBl() { $$('.bl:not(.is-in)').forEach(function (h) { if (h.id === 'heroTitle') return; if (blObs) blObs.observe(h); else h.classList.add('is-in'); }); }
  var phObs = io ? new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); phObs.unobserve(e.target); } }); }, { rootMargin: '0px 0px -10% 0px' }) : null;
  function initPh() { if (reduced || !phObs) return; $$('.ph').forEach(function (p) { p.classList.add('rv'); phObs.observe(p); }); }

  function lightLede() {
    if (!ledeWords.length || reduced) return;
    var q = $('#lede'), r = q.getBoundingClientRect(), vh = innerHeight;
    var p = Math.min(1, Math.max(0, (vh * .86 - r.top) / (r.height + vh * .42)));
    var n = Math.round(p * ledeWords.length);
    ledeWords.forEach(function (w, i) { w.classList.toggle('on', i < n); });
  }

  /* ------------------------------------------------------------------ hero */
  var heroDone = false;
  function heroIn() {
    if (heroDone) return; heroDone = true;
    var ht = $('#heroTitle'); ht.style.setProperty('--d', '.05s'); ht.classList.add('is-in');
    if (reduced) return;
    gsap.from('.hero__sub, .hero__go .go, .hero__today', { y: 22, opacity: 0, duration: 1.4, stagger: .09, ease: 'expo.out', delay: .4, clearProps: 'transform,opacity' });
    if (!html.classList.contains('intro-on')) gsap.fromTo('.hero__img', { scale: 1.12 }, { scale: 1.04, duration: 2.8, ease: 'expo.out' });
  }

  var G = { ok: false, m: [0, 0], mT: [0, 0], run: false, vis: true };
  var heroEl = $('#top');
  if (canHover && !reduced && hwGpu && !window.__noGl && heroEl) (function () {
    var VS = 'attribute vec2 a;varying vec2 v;void main(){v=vec2(a.x*.5+.5,.5-a.y*.5);gl_Position=vec4(a,0.,1.);}';
    var FS = [
      'precision highp float;varying vec2 v;',
      'uniform sampler2D uI,uD;uniform vec2 uRes,uM;uniform float uAR,uOver;',
      'const vec2 POS=vec2(.5,.58);',
      'vec2 img(vec2 p){float sa=uRes.x/uRes.y;vec2 s=sa>uAR?vec2(1.,uAR/sa):vec2(sa/uAR,1.);',
      ' vec2 o=(1.-s)*POS;vec2 c=o+.5*s;return c+(o+p*s-c)/uOver;}',
      'void main(){vec2 p=v;',
      ' for(int i=0;i<3;i++){float d=texture2D(uD,img(p)).r;p=v+uM*(d-.45)*vec2(.024,.016);}',
      ' gl_FragColor=vec4(texture2D(uI,img(p)).rgb,1.);}'
    ].join('\n');
    var cv = document.createElement('canvas'); cv.className = 'hero__gl'; cv.setAttribute('aria-hidden', 'true');
    $('.hero__stack').insertBefore(cv, $('.hero__shade'));
    var gl = cv.getContext('webgl', { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: 'high-performance' });
    if (!gl) return;
    function sh(tp, src) { var x = gl.createShader(tp); gl.shaderSource(x, src); gl.compileShader(x); return gl.getShaderParameter(x, gl.COMPILE_STATUS) ? x : null; }
    var vs = sh(gl.VERTEX_SHADER, VS), fs = sh(gl.FRAGMENT_SHADER, FS); if (!vs || !fs) return;
    var pr = gl.createProgram(); gl.attachShader(pr, vs); gl.attachShader(pr, fs); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
    gl.useProgram(pr);
    var b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var al = gl.getAttribLocation(pr, 'a'); gl.enableVertexAttribArray(al); gl.vertexAttribPointer(al, 2, gl.FLOAT, false, 0, 0);
    var U = {}; ['uI', 'uD', 'uRes', 'uM', 'uAR', 'uOver'].forEach(function (nm) { U[nm] = gl.getUniformLocation(pr, nm); });
    function tex(unit, src) {
      var tx = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, tx);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, src);
    }
    var im = new Image(), dep = new Image(); im.decoding = dep.decoding = 'async';
    var lastW = 0, lastH = 0;
    function size() {
      var w = cv.clientWidth, h = cv.clientHeight, dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      lastW = innerWidth; lastH = innerHeight;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      gl.viewport(0, 0, cv.width, cv.height); gl.uniform2f(U.uRes, w, h);
    }
    function draw() { gl.uniform2f(U.uM, G.m[0], G.m[1]); gl.drawArrays(gl.TRIANGLES, 0, 3); }
    function frame() {
      var moving = false;
      for (var i = 0; i < 2; i++) { var dm = G.mT[i] - G.m[i]; if (Math.abs(dm) > .0008) { G.m[i] += dm * .055; moving = true; } else G.m[i] = G.mT[i]; }
      draw();
      if (!moving || !G.vis) { G.run = false; gsap.ticker.remove(frame); }
    }
    G.kick = function () { if (G.ok && G.vis && !G.run) { G.run = true; gsap.ticker.add(frame); } };
    function load() {
      im.src = 'img/hero-' + (innerWidth > 1500 ? 2400 : 1400) + '.webp?v=4'; dep.src = 'img/hero-depth.webp?v=4';
      var bm = function (x) { return window.createImageBitmap ? createImageBitmap(x).catch(function () { return x; }) : Promise.resolve(x); };
      Promise.all([im.decode(), dep.decode()]).then(function () { return Promise.all([bm(im), bm(dep)]); }).then(function (bms) {
        tex(0, bms[0]); tex(1, bms[1]);
        gl.uniform1i(U.uI, 0); gl.uniform1i(U.uD, 1);
        gl.uniform1f(U.uAR, im.naturalWidth / im.naturalHeight); gl.uniform1f(U.uOver, 1.04);
        G.ok = true; size(); draw();
        html.classList.add('hero-3d');
      }).catch(function () {});
    }
    var idle = window.requestIdleCallback || function (f) { return setTimeout(f, 1); };
    var wait = function () { if (heroDone) setTimeout(function () { idle(load, { timeout: 1500 }); }, 1500); else setTimeout(wait, 200); };
    wait();
    cv.addEventListener('webglcontextlost', function (e) { e.preventDefault(); G.ok = false; html.classList.remove('hero-3d'); });
    heroEl.addEventListener('pointermove', function (e) { G.mT[0] = (e.clientX / innerWidth - .5) * 2; G.mT[1] = (e.clientY / innerHeight - .5) * 2; G.kick(); });
    heroEl.addEventListener('pointerleave', function () { G.mT[0] = G.mT[1] = 0; G.kick(); });
    if (io) new IntersectionObserver(function (es) { G.vis = es[0].isIntersecting; if (G.vis) G.kick(); }).observe(heroEl);
    window.addEventListener('resize', function () { if (G.ok && (innerWidth !== lastW || Math.abs(innerHeight - lastH) > 160)) { size(); draw(); } });
  })();

  /* ------------------------------------------------------------------ intro: mozivászon. Sötétben gépelt felirat a hely címével és a mostani idővel,
     alul filmfelirat, aztán fény szivárog be az ajtó résén, az ajtó kinyílik, és vibrálva felkapcsolnak a lámpák */
  function runIntro(done) {
    var intro = $('#intro');
    if (!html.classList.contains('intro-on') || html.classList.contains('no-intro') || !intro.animate) { html.classList.remove('intro-on'); done(); return; }
    try { sessionStorage.setItem('dl-intro', '1'); } catch (e) {}
    var b = bud(), hh = Math.floor(b.m / 60), mm = ('0' + b.m % 60).slice(-2);
    var l1 = L(['Sopron, Várkerület 57.', 'Sopron, Várkerület 57.', 'Sopron, Várkerület 57.']);
    $('#introL1').innerHTML = l1.split('').map(function (c) { return '<b>' + (c === ' ' ? '&nbsp;' : esc(c)) + '</b>'; }).join('');
    $('#introL2').textContent = (lang === 'hu' ? L(DAYS[b.d]).toLowerCase() : L(DAYS[b.d])) + ', ' + hh + ':' + mm;
    $('#introSub').textContent = '– ' + L(['Drágám, később hívlak…', 'Darling, ich ruf dich später an…', 'Darling, I’ll call you later…']);
    $('#introSkip').textContent = canHover ? L(['Kattints a kihagyáshoz', 'Klicken zum Überspringen', 'Click to skip']) : L(['Koppints a kihagyáshoz', 'Tippen zum Überspringen', 'Tap to skip']);
    var anims = [], timers = [], finished = false;
    function A(el, kf, o) { var a = el.animate(kf, Object.assign({ fill: 'both' }, o)); anims.push(a); return a; }
    function T(f, ms) { timers.push(setTimeout(f, ms)); }
    var E = 'cubic-bezier(.16,1,.3,1)', IO = 'cubic-bezier(.77,0,.18,1)';
    /* 1. gépelt felirat */
    $$('#introL1 b').forEach(function (c, k) { A(c, [{ opacity: 0 }, { opacity: 1 }], { duration: 70, delay: 350 + k * 48, easing: 'linear' }); });
    var t1 = 350 + l1.length * 48;
    A($('#introL2'), [{ opacity: 0, filter: 'blur(6px)', transform: 'translateY(6px)' }, { opacity: 1, filter: 'blur(0)', transform: 'none' }], { duration: 900, delay: t1 + 150, easing: E });
    A($('.intro__cap'), [{ opacity: 1 }, { opacity: 0, filter: 'blur(4px)' }], { duration: 700, delay: t1 + 1500, easing: 'ease-in' });
    /* 2. filmfelirat */
    var t2 = t1 + 1250;
    A($('#introSub'), [{ opacity: 0 }, { opacity: 1, offset: .12 }, { opacity: 1, offset: .8 }, { opacity: 0 }], { duration: 2300, delay: t2, easing: 'linear' });
    /* 3. fény az ajtórésben: vibrál, mint egy bemelegedő izzó */
    var t3 = t2 + 900;
    A($('.intro__seam'), [{ opacity: 0, transform: 'scaleY(.15)' }, { opacity: .9, transform: 'scaleY(.6)', offset: .1 }, { opacity: .2, offset: .16 }, { opacity: 1, transform: 'scaleY(1)', offset: .32 }, { opacity: .55, offset: .4 }, { opacity: 1, transform: 'scaleY(1)' }], { duration: 1100, delay: t3, easing: 'linear' });
    A($('.intro__glow'), [{ opacity: 0, transform: 'scaleX(.25)' }, { opacity: .7, offset: .1 }, { opacity: .1, offset: .16 }, { opacity: .8, offset: .32 }, { opacity: .4, offset: .4 }, { opacity: 1, transform: 'scaleX(.55)' }], { duration: 1100, delay: t3, easing: 'linear' });
    /* 4. az ajtó kinyílik, a lámpák felkapcsolnak */
    var t4 = t3 + 1150, hi = $('.hero__img'), dk = $('#heroDark');
    hi.style.transform = 'scale(1.22)'; dk.style.opacity = '.9';
    A($('.intro__half--l'), [{ transform: 'none' }, { transform: 'translateX(-101%)' }], { duration: 1900, delay: t4, easing: IO });
    A($('.intro__half--r'), [{ transform: 'none' }, { transform: 'translateX(101%)' }], { duration: 1900, delay: t4, easing: IO });
    A($('.intro__glow'), [{ transform: 'scaleX(.55)', opacity: 1 }, { transform: 'scaleX(2.6)', opacity: 0 }], { duration: 1500, delay: t4, easing: 'cubic-bezier(.5,0,.3,1)', fill: 'forwards' });
    A($('.intro__seam'), [{ opacity: 1 }, { opacity: 0 }], { duration: 500, delay: t4, easing: 'ease-out', fill: 'forwards' });
    T(function () {
      gsap.to(hi, { scale: 1.04, duration: 3.4, ease: 'expo.out' });
      dk.animate([{ opacity: .9 }, { opacity: .55, offset: .14 }, { opacity: .85, offset: .2 }, { opacity: .35, offset: .34 }, { opacity: .6, offset: .4 }, { opacity: 0 }], { duration: 2200, delay: 350, easing: 'linear', fill: 'forwards' }).onfinish = function () { dk.style.opacity = 0; };
    }, t4);
    /* 5. a mozivászon csíkjai elhúzódnak */
    A($('.intro__bar--t'), [{ transform: 'none' }, { transform: 'translateY(-101%)' }], { duration: 1300, delay: t4 + 1300, easing: IO });
    var last = A($('.intro__bar--b'), [{ transform: 'none' }, { transform: 'translateY(101%)' }], { duration: 1300, delay: t4 + 1300, easing: IO });
    T(finish, t4 + 1100);
    function finish() { if (finished) return; finished = true; done(); }
    function cleanup() { anims.forEach(function (a) { a.cancel(); }); html.classList.remove('intro-on'); intro.remove(); removeEventListener('keydown', skip); }
    last.onfinish = cleanup;
    /* kihagyás: kattintás, billentyű vagy görgetés */
    T(function () { intro.classList.add('is-skip'); }, 1600);
    function skip() {
      if (intro.__sk) return; intro.__sk = true;
      timers.forEach(clearTimeout);
      anims.forEach(function (a) { a.pause(); });
      intro.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 650, easing: 'ease-out', fill: 'forwards' }).onfinish = cleanup;
      gsap.to(hi, { scale: 1.04, duration: 2, ease: 'expo.out' });
      dk.animate([{ opacity: getComputedStyle(dk).opacity }, { opacity: 0 }], { duration: 900, fill: 'forwards' }).onfinish = function () { dk.style.opacity = 0; };
      finish();
    }
    intro.addEventListener('click', skip); intro.addEventListener('wheel', skip, { passive: true }); intro.addEventListener('touchstart', skip, { passive: true });
    addEventListener('keydown', skip);
  }

  /* ------------------------------------------------------------------ tárcsás telefon */
  var NUM = '06707426894';
  var dial = { busy: false, typed: '' };
  (function buildDial() {
    var NS = 'http://www.w3.org/2000/svg', svg = $('#dialSvg'); if (!svg) return;
    function el(n, at) { var e = document.createElementNS(NS, n); for (var k in at) e.setAttribute(k, at[k]); return e; }
    var R = 140, HR = 25;
    var defs = el('defs', {}), mask = el('mask', { id: 'dialMask' });
    mask.appendChild(el('circle', { r: 182, fill: '#fff' }));
    var nums = $('#dialNums'), holes = $('#dialHoles');
    for (var n = 1; n <= 10; n++) {
      var a = (-5 - 30 * (n - 1)) * Math.PI / 180, x = Math.cos(a) * R, y = Math.sin(a) * R;
      var dg = n % 10;
      mask.appendChild(el('circle', { cx: x.toFixed(1), cy: y.toFixed(1), r: HR, fill: '#000' }));
      var tx = el('text', { x: x.toFixed(1), y: y.toFixed(1), class: 'dial__num' }); tx.textContent = dg; nums.appendChild(tx);
      var h = el('circle', { cx: x.toFixed(1), cy: y.toFixed(1), r: HR, class: 'dial__hole', 'data-d': dg });
      holes.appendChild(h);
      holes.appendChild(el('circle', { cx: x.toFixed(1), cy: y.toFixed(1), r: HR + .5, class: 'dial__ring' }));
    }
    var gr = el('linearGradient', { id: 'dialBrass', x1: 0, y1: 0, x2: 1, y2: 1 });
    [['0', '#f0d48a'], ['.32', '#c9a043'], ['.55', '#8f6d22'], ['.78', '#d6b25c'], ['1', '#7a5a1a']].forEach(function (st) { gr.appendChild(el('stop', { offset: st[0], 'stop-color': st[1] })); });
    defs.appendChild(gr); defs.appendChild(mask); svg.insertBefore(defs, svg.firstChild);
    var pl = $('.dial__plate'); pl.setAttribute('mask', 'url(#dialMask)'); pl.setAttribute('fill', 'url(#dialBrass)');
  })();
  function fmt(s) {
    var p = [s.slice(0, 2), s.slice(2, 4), s.slice(4, 7), s.slice(7, 11)].filter(Boolean);
    return p.join(' ');
  }
  function showTyped() { $('#dialNum').textContent = fmt(dial.typed); }
  function spin(d) {
    var n = d === 0 ? 10 : d, rot = 40 + 30 * (n - 1), w = $('#dialWheel');
    return new Promise(function (res) {
      if (reduced) { res(); return; }
      var tl = gsap.timeline({ onComplete: res });
      tl.to(w, { rotation: rot, svgOrigin: '0 0', duration: .14 + rot / 360 * .26, ease: 'power2.out' })
        .to(w, { rotation: 0, svgOrigin: '0 0', duration: .12 + rot / 360 * .4, ease: 'sine.inOut' }, '+=.03');
    });
  }
  function press(d) {
    if (dial.busy) return Promise.resolve();
    dial.busy = true;
    return spin(d).then(function () {
      if (dial.typed.length >= 11) dial.typed = '';
      dial.typed += d; showTyped(); dial.busy = false;
      if (dial.typed === NUM) ringing();
    });
  }
  function ringing() {
    var s = $('#dialNum');
    setTimeout(function () { s.textContent = L(['Kicseng…', 'Es klingelt…', 'Ringing…']); }, 500);
    setTimeout(function () { s.textContent = L(['Drágám, később hívlak…', 'Darling, ich ruf dich später an…', 'Darling, I’ll call you later…']); }, 2300);
    setTimeout(function () { dial.typed = ''; s.textContent = fmt(NUM); }, 5200);
  }
  function dialAll() {
    if (dial.busy) return;
    dial.typed = ''; showTyped();
    var i = 0;
    (function next() { if (i >= NUM.length) return; press(+NUM[i++]).then(function () { setTimeout(next, 60); }); })();
  }
  $('#dialGo').addEventListener('click', dialAll);
  $('#dialSvg').addEventListener('click', function (e) { var h = e.target.closest('.dial__hole'); if (h) press(+h.getAttribute('data-d')); });
  if (!canHover && io && !reduced) {
    var dObs = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { dObs.disconnect(); setTimeout(dialAll, 500); } }, { threshold: .6 });
    dObs.observe($('#dialSvg'));
  }
  $('#dialNum').textContent = fmt(NUM);

  /* ------------------------------------------------------------------ térkép csak kattintásra */
  $('#mapGo').addEventListener('click', function () {
    var m = $('#map'), f = document.createElement('iframe');
    f.src = 'https://www.google.com/maps?q=Darling,+I%27ll+call+you+later...,+V%C3%A1rker%C3%BClet+57,+Sopron&output=embed';
    f.title = L(['Térkép', 'Karte', 'Map']); f.loading = 'lazy'; f.referrerPolicy = 'no-referrer-when-downgrade';
    m.appendChild(f); m.classList.add('is-on');
  });

  /* ------------------------------------------------------------------ mobil menü */
  var burger = $('#burger'), mnav = $('#mnav');
  function setMenu(o) {
    mnav.hidden = !o; burger.setAttribute('aria-expanded', o); document.body.style.overflow = o ? 'hidden' : '';
    if (o && !reduced) gsap.from($$('a', mnav), { y: 30, opacity: 0, duration: .9, stagger: .05, ease: 'expo.out', clearProps: 'all' });
  }
  burger.addEventListener('click', function () { setMenu(mnav.hidden); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !mnav.hidden) { setMenu(false); burger.focus(); } });

  /* ------------------------------------------------------------------ lap címe, ha elnavigálsz: a hely saját mondata */
  document.addEventListener('visibilitychange', function () {
    document.title = document.hidden ? L(['Drágám, később hívlak…', 'Darling, ich ruf dich später an…', 'Darling, I’ll call you later…']) : baseTitle;
  });

  /* ------------------------------------------------------------------ indulás */
  applyLang(startLang, false);
  initPh();

  var lenis = null;
  if (canHover && !reduced && window.Lenis) {
    lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
    window.__lenis = lenis;
  }
  function goTo(id) {
    var el = id === 'top' ? 0 : document.getElementById(id); if (el == null) return;
    var pinned = id === 'bar' && desk;
    if (lenis) lenis.scrollTo(el === 0 ? 0 : el, { offset: el === 0 || pinned ? 0 : -70, duration: 1.6 });
    else if (el === 0) scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]'); if (!a) return;
    var id = a.getAttribute('href').slice(1); if (!id) return;
    if (!document.getElementById(id) && id !== 'top') return;
    e.preventDefault(); if (!mnav.hidden) setMenu(false);
    goTo(id); history.replaceState(null, '', '#' + id);
  });

  /* fejléc: lefelé elbújik, felfelé előjön */
  var hd = $('#hd'), lastY = 0;
  function onScroll(y) {
    var hh = heroEl.offsetHeight;
    hd.classList.toggle('is-solid', y > hh - 80);
    if (y > hh * .6 && y > lastY + 4 && mnav.hidden) hd.classList.add('is-hid');
    else if (y < lastY - 4 || y < hh * .6) hd.classList.remove('is-hid');
    lastY = y;
    lightLede();
  }
  if (lenis) lenis.on('scroll', function (l) { onScroll(l.scroll); });
  else addEventListener('scroll', function () { onScroll(scrollY); }, { passive: true });

  /* aktív menüpont */
  var secs = ['etlap', 'bar', 'italok', 'foglalas', 'rendeles', 'nyitvatartas'];
  secs.forEach(function (id) {
    ScrollTrigger.create({ trigger: '#' + id, start: 'top 45%', end: 'bottom 45%', onToggle: function (s) { $$('.hd__nav a').forEach(function (a) { if (a.getAttribute('href') === '#' + id) a.classList.toggle('is-on', s.isActive); }); } });
  });

  /* gördülő szalag a klasszikusokkal: görgetésre gyorsul, visszafelé megfordul */
  (function marquee() {
    var t = $('#mqT'); if (!t) return;
    var s = CLASS.map(function (c) { return L(c[0]); }).join('<i>✦</i>') + '<i>✦</i>';
    t.innerHTML = '<span>' + s + '</span><span aria-hidden="true">' + s + '</span>';
    if (reduced || !t.animate) return;
    var a = t.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-50%)' }], { duration: 52000, iterations: Infinity });
    var rate = 1, target = 1;
    if (io) new IntersectionObserver(function (es) { if (es[0].isIntersecting) a.play(); else a.pause(); }).observe($('#mq'));
    if (lenis) {
      lenis.on('scroll', function (l) { target = 1 + Math.max(-5, Math.min(5, l.velocity * .22)); if (Math.abs(target) < .4) target = target < 0 ? -.4 : 1; });
      gsap.ticker.add(function () { rate += (target - rate) * .06; target += (1 - target) * .04; a.updatePlaybackRate ? a.updatePlaybackRate(rate) : (a.playbackRate = rate); });
    }
  })();

  /* koktélkártyák */
  var deck = $('#deck');
  deck.innerHTML = CARDS.map(function (k, i) {
    var r = [-4, 3, -2, 5, -5, 2, -3, 4, -1, 3][i];
    return '<figure class="card" style="--r:' + r + 'deg" data-n="' + ('0' + (i + 1)).slice(-2) + ' / ' + CARDS.length + '"><img src="img/' + k + '-600.webp?v=4" srcset="img/' + k + '-600.webp?v=4 600w, img/' + k + '-1100.webp?v=4 1100w" sizes="(min-width: 900px) 420px, 68vw" alt=""' + (i < 2 ? '' : ' loading="lazy"') + ' width="600" height="880"><i class="card__dim"></i></figure>';
  }).join('');

  var mm = gsap.matchMedia();
  mm.add('(hover: hover) and (pointer: fine) and (min-width: 1181px) and (prefers-reduced-motion: no-preference)', function () {
    /* kártyák: görgetésre egymás után leosztva a pultra */
    var run = $('#barRun'), cards = $$('.card', deck), n = cards.length;
    run.style.height = 'calc(100lvh + ' + (n - 1) * 46 + 'vh)';
    var tl = gsap.timeline({ scrollTrigger: { trigger: run, start: 'top top', end: 'bottom bottom', scrub: .9 } });
    cards.forEach(function (c, i) {
      if (!i) return;
      var r = parseFloat(c.style.getPropertyValue('--r'));
      tl.fromTo(c, { y: innerHeight * 1.1, rotation: r * 3 + (i % 2 ? 14 : -14) }, { y: 0, rotation: r, ease: 'power3.out', duration: 1 }, i - 1);
      tl.to(cards[i - 1], { scale: .965, duration: 1, ease: 'none' }, i - 1);
      tl.to(cards[i - 1].querySelector('.card__dim'), { opacity: .5, duration: 1, ease: 'none' }, i - 1);
    });
    $$('.card', deck).forEach(function (c) { c.style.transform = ''; });
    /* képek belső parallaxa */
    $$('.ph:not(.deliv__pic) .ph__in img, .deliv__pic .ph__in img').forEach(function (img) {
      gsap.fromTo(img, { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: img.closest('.ph'), start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    /* hero: görgetésre lassan közelít és elsötétül, a cím lemarad */
    gsap.to('.hero__stack', { scale: 1.08, yPercent: 8, ease: 'none', scrollTrigger: { trigger: heroEl, start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero__txt', { yPercent: -18, opacity: 0, ease: 'none', scrollTrigger: { trigger: heroEl, start: '30% top', end: 'bottom top', scrub: true } });
    return function () { run.style.height = ''; };
  });
  mm.add('(max-width: 1180px), (hover: none), (pointer: coarse)', function () {
    $$('.card', deck).forEach(function (c) { c.style.transform = ''; });
  });

  /* egérkövető pont + mágneses gombok */
  if (desk) (function () {
    var cur = $('#cur'), glow = $('#glow'), x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y, gx = x, gy = y, on = false;
    html.classList.add('cur-on');
    $('#curH').innerHTML = Array.apply(null, Array(10)).map(function (_, i) { var a = (i * 30 - 60) * Math.PI / 180; return '<circle class="h" r="1.3" cx="' + (Math.cos(a) * 11).toFixed(2) + '" cy="' + (Math.sin(a) * 11).toFixed(2) + '"/>'; }).join('');
    addEventListener('pointermove', function (e) {
      x = e.clientX; y = e.clientY;
      if (!on) { on = true; cx = x; cy = y; gsap.ticker.add(tick); }
      var tg = e.target;
      cur.classList.toggle('is-hole', !!tg.closest('.dial__hole'));
      cur.classList.toggle('is-link', !tg.closest('.dial__hole') && !!tg.closest('a,button'));
      cur.classList.toggle('is-pic', !tg.closest('a,button') && !!tg.closest('.ph,.card,.menu__frame'));
    }, { passive: true });
    function tick() {
      cx += (x - cx) * .24; cy += (y - cy) * .24; gx += (x - gx) * .06; gy += (y - gy) * .06;
      cur.style.transform = 'translate3d(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px,0)';
      glow.style.transform = 'translate3d(' + gx.toFixed(1) + 'px,' + gy.toFixed(1) + 'px,0)';
      updWalls();
      if (Math.abs(x - cx) < .1 && Math.abs(y - cy) < .1 && Math.abs(x - gx) < .3 && Math.abs(y - gy) < .3) { gsap.ticker.remove(tick); on = false; }
    }
    /* fal: a tapéta mintája csak a meleg fény körül látszik */
    var walls = $$('.sec,.ft__in').map(function (sc) {
      sc.insertAdjacentHTML('afterbegin', '<div class="wall" aria-hidden="true"><div class="wall__spot"><div class="wall__pat"></div></div></div>');
      var sp = sc.firstChild.firstChild; return { s: sc, sp: sp, pt: sp.firstChild, on: false };
    });
    var seen = false, sq = false;
    function updWalls() {
      if (!seen) return;
      var rs = walls.map(function (w) { return w.s.getBoundingClientRect(); });
      walls.forEach(function (w, i) {
        var r = rs[i], vis = glow.style.opacity !== '0' && gy > r.top - 320 && gy < r.bottom + 320;
        if (vis) {
          var ox = gx - r.left - 320, oy = gy - r.top - 320;
          w.sp.style.transform = 'translate3d(' + ox.toFixed(1) + 'px,' + oy.toFixed(1) + 'px,0)';
          w.pt.style.backgroundPosition = (((-ox) % 120 + 120) % 120).toFixed(1) + 'px ' + (((-oy) % 60 + 60) % 60).toFixed(1) + 'px';
        }
        if (vis !== w.on) { w.on = vis; w.sp.classList.toggle('is-on', vis); }
      });
    }
    addEventListener('pointermove', function () { seen = true; }, { passive: true });
    addEventListener('scroll', function () { if (!sq && seen) { sq = true; requestAnimationFrame(function () { sq = false; updWalls(); }); } }, { passive: true });
    document.addEventListener('pointerleave', function () { cur.style.opacity = 0; glow.style.opacity = 0; updWalls(); });
    document.addEventListener('pointerenter', function () { cur.style.opacity = 1; glow.style.opacity = 1; });
    $$('.go').forEach(function (b) {
      var qx = gsap.quickTo(b, 'x', { duration: .5, ease: 'power3.out' }), qy = gsap.quickTo(b, 'y', { duration: .5, ease: 'power3.out' });
      b.addEventListener('pointermove', function (e) { var r = b.getBoundingClientRect(); qx((e.clientX - r.left - r.width / 2) * .25); qy((e.clientY - r.top - r.height / 2) * .3); });
      b.addEventListener('pointerleave', function () { qx(0); qy(0); });
    });
  })();

  /* lámpafüst: gépen, valódi GPU-val, csak amíg égő lámpa van a képen; az egér kicsit megkavarja */
  if (desk && hwGpu && !window.__noGl) (function () {
    var cv = $('#smoke'), gl = cv && cv.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false });
    if (!gl) return;
    var VS = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
    var FS = 'precision mediump float;uniform vec2 R;uniform float S,T;uniform vec4 C[4];uniform float A[4];uniform vec4 M;' +
      'float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}' +
      'float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+1.),f.x),f.y);}' +
      'float fb(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n(p);p=p*2.03+17.;a*=.5;}return v;}' +
      'void main(){vec2 p=vec2(gl_FragCoord.x,R.y-gl_FragCoord.y)/S;float L=0.;' +
      'for(int i=0;i<4;i++){vec4 c=C[i];vec2 d=p-c.xy;float an=atan(abs(d.x),max(d.y,.001));' +
      'float e=length(vec2(d.x/(c.z*.36),d.y/c.w));L+=A[i]*step(0.,d.y)*smoothstep(.62,.1,an)*(1.-smoothstep(.12,1.,e));}' +
      'if(L<.003){gl_FragColor=vec4(0.);return;}' +
      'vec2 q=p/230.+vec2(0.,T*.045);vec2 dm=p-M.xy;q-=M.zw*exp(-dot(dm,dm)/30000.);' +
      'q+=.85*vec2(fb(q+vec2(T*.02,3.1)),fb(q+vec2(5.2,-T*.025)));' +
      'float s=smoothstep(.36,.9,fb(q*1.15));float a=min(L,1.)*s*.3;gl_FragColor=vec4(vec3(1.,.8,.5)*a,a);}';
    function sh(t, src) { var o = gl.createShader(t); gl.shaderSource(o, src); gl.compileShader(o); return gl.getShaderParameter(o, gl.COMPILE_STATUS) ? o : null; }
    var vs = sh(gl.VERTEX_SHADER, VS), fs = sh(gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) return;
    var pr = gl.createProgram(); gl.attachShader(pr, vs); gl.attachShader(pr, fs); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
    gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    var U = {}; ['R', 'S', 'T', 'C', 'A', 'M'].forEach(function (k) { U[k] = gl.getUniformLocation(pr, k); });
    var SC = .5, cw = 0, ch = 0;
    function size() { cw = Math.round(cv.clientWidth * SC); ch = Math.round(cv.clientHeight * SC); cv.width = cw; cv.height = ch; gl.viewport(0, 0, cw, ch); }
    html.classList.add('gl-smoke'); size();
    addEventListener('resize', size);
    var mx = -9999, my = -9999, vx = 0, vy = 0, lx = null, ly = 0, run = false, drawn = false, t0 = performance.now();
    addEventListener('pointermove', function (e) {
      if (lx !== null) { vx += (e.clientX - lx) * .004; vy += (e.clientY - ly) * .004; }
      lx = mx = e.clientX; ly = my = e.clientY;
    }, { passive: true });
    var Cv = new Float32Array(16), Av = new Float32Array(4);
    function frame(now) {
      var vh = innerHeight, k = 0;
      Cv.fill(0); Av.fill(0);
      $$('.pend.is-lit .pend__c,.pend.is-on .pend__c').forEach(function (c) {
        if (k > 3) return;
        var r = c.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh || r.right < 0 || r.left > innerWidth) return;
        if (!c._st) c._st = now;
        Cv[k * 4] = r.left + r.width / 2; Cv[k * 4 + 1] = r.top; Cv[k * 4 + 2] = r.width; Cv[k * 4 + 3] = r.height;
        Av[k] = Math.min(1, Math.max(0, (now - c._st - 400) / 1600)); k++;
      });
      if (!k) { if (drawn) { gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); drawn = false; } run = false; return; }
      vx *= .93; vy *= .93;
      var vm = Math.sqrt(vx * vx + vy * vy); if (vm > .6) { vx *= .6 / vm; vy *= .6 / vm; }
      gl.uniform2f(U.R, cw, ch); gl.uniform1f(U.S, SC); gl.uniform1f(U.T, (now - t0) / 1000);
      gl.uniform4fv(U.C, Cv); gl.uniform1fv(U.A, Av); gl.uniform4f(U.M, mx, my, vx, vy);
      gl.drawArrays(gl.TRIANGLES, 0, 3); drawn = true;
      requestAnimationFrame(frame);
    }
    function wake() { if (!run) { run = true; requestAnimationFrame(frame); } }
    addEventListener('scroll', wake, { passive: true });
    document.addEventListener('animationstart', function (e) { if (e.animationName === 'lampOn') wake(); });
    wake();
  })();

  /* élő nyitvatartás percenként */
  setInterval(renderLive, 60000);

  /* újraméretezés: csak szélességváltozásra vagy nagy magasságváltozásra */
  var rw = innerWidth, rh = innerHeight;
  addEventListener('resize', function () {
    if (innerWidth === rw && Math.abs(innerHeight - rh) < 160) return;
    var wc = innerWidth !== rw; rw = innerWidth; rh = innerHeight;
    if (wc) { splitBl(); $$('.bl').forEach(function (h) { h.classList.add('is-in'); }); }
    ScrollTrigger.refresh();
  });

  /* intro, aztán minden más */
  var fontsReady = document.fonts && document.fonts.load ? Promise.all([document.fonts.load('300 40px Imbue'), document.fonts.load('italic 400 30px Instrument'), document.fonts.load('300 12px "DM Mono"'), document.fonts.load('400 16px Schibsted')]).catch(function () {}) : Promise.resolve();
  var heroImg = $('.hero__img');
  var imgReady = heroImg.decode ? heroImg.decode().catch(function () {}) : Promise.resolve();
  var guard = new Promise(function (r) { setTimeout(r, 2500); });
  Promise.race([Promise.all([fontsReady, imgReady]), guard]).then(function () {
    splitBl(); splitLede();
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      ready = true;
      runIntro(function () { heroIn(); observeBl(); lightLede(); ScrollTrigger.refresh(); });
      if (location.hash.length > 1 && document.getElementById(location.hash.slice(1))) setTimeout(function () { goTo(location.hash.slice(1)); }, 400);
    }); });
  });
})();
