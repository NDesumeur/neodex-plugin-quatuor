// Quatuor : 16 mots, 4 groupes cachés de 4 : trouve ce qui les relie.
// Jeu NeoDex en pixel art dessiné à la main (police bitmap, cadres et boutons en pixels). Il tourne dans le bac à sable de NeoDex.
const HTML = `<div class="appWrap wide">
  <div class="agHead"><span class="label">Quatuor</span><span class="hint">Clic ou Espace : choisir un mot · Entrée : valider · M : mélanger · Retour : effacer</span></div>
  <div class="gMain"><div class="gameBox"><canvas id="qtCanvas" width="244" height="172" role="img" aria-label="Quatuor"></canvas></div>
    <div class="gSide">
      <div class="sysCard"><b>RECORDS</b><div class="gStats" id="qtStats"></div></div>
      <div class="row"><button class="btn main" id="qtNew">NOUVELLE PARTIE</button></div>
      <div class="hint">Seize mots cachent quatre groupes de quatre : des fruits, des mots qui suivent « coup de », des pays cachés dans un mot… Choisis quatre mots qui vont ensemble et valide. Attention aux pièges : certains mots semblent aller dans deux groupes. Le jaune est le plus simple, le violet le plus retors. Quatre erreurs permises ; « À un près ! » quand trois mots sur quatre sont bons.</div>
    </div></div>
</div>`;
const CSS = `.gMain{display:flex;gap:22px;align-items:flex-start;flex-wrap:wrap}
.gameBox{display:grid;place-items:center;padding:10px;background:#05010b;flex:0 0 auto;position:relative}
.gameBox canvas{height:min(72vh,640px);width:auto;aspect-ratio:244/172;image-rendering:pixelated;cursor:var(--cp,pointer);touch-action:none}
.gSide{display:flex;flex-direction:column;gap:14px;flex:1;min-width:250px;max-width:420px}
.gSide .sysCard{display:flex;flex-direction:column}
.gStats{display:grid;grid-template-columns:1fr auto;gap:4px 14px}
.gStats b{text-align:right}`;
/* ---------- l'habillage pixel art, dessiné à la main : police bitmap (accents compris), cadres, boutons, icônes ----------
   Tout est en pixels pleins, agrandis par 2 sans lissage : aucun dégradé, aucune ombre floue. */
const PXK = (() => {
  // chaque lettre : ses lignes, de haut en bas, à partir de la ligne 2 de la case (0-1 : accents des majuscules, 9-10 : jambages)
  const S = {
    A: '.###. #...# #...# ##### #...# #...# #...#', B: '####. #...# #...# ####. #...# #...# ####.', C: '.###. #...# #.... #.... #.... #...# .###.',
    D: '####. #...# #...# #...# #...# #...# ####.', E: '##### #.... #.... ####. #.... #.... #####', F: '##### #.... #.... ####. #.... #.... #....',
    G: '.###. #...# #.... #.### #...# #...# .####', H: '#...# #...# #...# ##### #...# #...# #...#', I: '### .#. .#. .#. .#. .#. ###',
    J: '..### ...#. ...#. ...#. #..#. #..#. .##..', K: '#...# #..#. #.#.. ##... #.#.. #..#. #...#', L: '#.... #.... #.... #.... #.... #.... #####',
    M: '#...# ##.## #.#.# #.#.# #...# #...# #...#', N: '#...# ##..# #.#.# #..## #...# #...# #...#', O: '.###. #...# #...# #...# #...# #...# .###.',
    P: '####. #...# #...# ####. #.... #.... #....', Q: '.###. #...# #...# #...# #.#.# #..#. .##.#', R: '####. #...# #...# ####. #.#.. #..#. #...#',
    S: '.#### #.... #.... .###. ....# ....# ####.', T: '##### ..#.. ..#.. ..#.. ..#.. ..#.. ..#..', U: '#...# #...# #...# #...# #...# #...# .###.',
    V: '#...# #...# #...# #...# #...# .#.#. ..#..', W: '#...# #...# #...# #.#.# #.#.# ##.## #...#', X: '#...# #...# .#.#. ..#.. .#.#. #...# #...#',
    Y: '#...# #...# .#.#. ..#.. ..#.. ..#.. ..#..', Z: '##### ....# ...#. ..#.. .#... #.... #####',
    a: '..... ..... .###. ....# .#### #...# .####', b: '#.... #.... ####. #...# #...# #...# ####.', c: '..... ..... .###. #.... #.... #.... .###.',
    d: '....# ....# .#### #...# #...# #...# .####', e: '..... ..... .###. #...# ##### #.... .###.', f: '..## .#.. #### .#.. .#.. .#.. .#..',
    g: '..... ..... .#### #...# #...# #...# .#### ....# .###.', h: '#.... #.... ####. #...# #...# #...# #...#', i: '.#. ... ##. .#. .#. .#. ###',
    'ı': '... ... ##. .#. .#. .#. ###', j: '...# .... ..## ...# ...# ...# ...# #..# .##.', k: '#... #... #..# #.#. ##.. #.#. #..#',
    l: '##. .#. .#. .#. .#. .#. ###', m: '..... ..... ##.#. #.#.# #.#.# #.#.# #...#', n: '..... ..... ####. #...# #...# #...# #...#',
    o: '..... ..... .###. #...# #...# #...# .###.', p: '..... ..... ####. #...# #...# #...# ####. #.... #....', q: '..... ..... .#### #...# #...# #...# .#### ....# ....#',
    r: '.... .... #.## ##.. #... #... #...', s: '..... ..... .#### #.... .###. ....# ####.', t: '.#.. .#.. #### .#.. .#.. .#.. ..##',
    u: '..... ..... #...# #...# #...# #..## .##.#', v: '..... ..... #...# #...# #...# .#.#. ..#..', w: '..... ..... #...# #...# #.#.# #.#.# .#.#.',
    x: '..... ..... #...# .#.#. ..#.. .#.#. #...#', y: '..... ..... #...# #...# #...# #...# .#### ....# .###.', z: '..... ..... ##### ...#. ..#.. .#... #####',
    0: '.###. #...# #..## #.#.# ##..# #...# .###.', 1: '..#.. .##.. ..#.. ..#.. ..#.. ..#.. .###.', 2: '.###. #...# ....# ...#. ..#.. .#... #####',
    3: '####. ....# ....# .###. ....# ....# ####.', 4: '...#. ..##. .#.#. #..#. ##### ...#. ...#.', 5: '##### #.... ####. ....# ....# #...# .###.',
    6: '.###. #.... #.... ####. #...# #...# .###.', 7: '##### ....# ...#. ..#.. .#... .#... .#...', 8: '.###. #...# #...# .###. #...# #...# .###.',
    9: '.###. #...# #...# .#### ....# ....# .###.',
    '.': '. . . . . . #', ',': '.. .. .. .. .. .# .# #.', ':': '. . # . . . #', ';': '.. .. .# .. .. .# .# #.', '!': '# # # # # . #',
    '?': '.###. #...# ....# ...#. ..#.. ..... ..#..', "'": '# # . . . . .', '"': '#.# #.# ... ... ... ... ...', '-': '... ... ... ### ... ... ...',
    '+': '..... ..#.. ..#.. ##### ..#.. ..#.. .....', '/': '....# ...#. ...#. ..#.. .#... .#... #....', '(': '.# #. #. #. #. #. .#', ')': '#. .# .# .# .# .# #.',
    '%': '##..# ##.#. ...#. ..#.. .#... .#.## #..##', '·': '. . . # . . .', '×': '..... ..... #...# .#.#. ..#.. .#.#. #...#',
    '<': '...# ..#. .#.. #... .#.. ..#. ...#', '>': '#... .#.. ..#. ...# ..#. .#.. #...', '=': '.... .... #### .... #### .... ....',
    '_': '..... ..... ..... ..... ..... ..... #####', '#': '.#.#. .#.#. ##### .#.#. ##### .#.#. .#.#.', '&': '.##.. #..#. #.#.. .#... #.#.# #..#. .##.#',
    '…': '..... ..... ..... ..... ..... ..... #.#.#', '«': '..... ..#.# .#.#. #.#.. .#.#. ..#.# .....', '»': '..... #.#.. .#.#. ..#.# .#.#. #.#.. .....',
    '◀': '...# ..## .### #### .### ..## ...#', '▶': '#... ##.. ###. #### ###. ##.. #...', '→': '..... ..#.. ...#. ##### ...#. ..#.. .....',
    '←': '..... ..#.. .#... ##### .#... ..#.. .....', '↑': '..#.. .###. #.#.# ..#.. ..#.. ..#.. ..#..', '↓': '..#.. ..#.. ..#.. ..#.. #.#.# .###. ..#..',
    '*': '..... #.#.# .###. ##### .###. #.#.# .....', '[': '## #. #. #. #. #. ##', ']': '## .# .# .# .# .# ##', '|': '# # # # # # #',
    '@': '.###. #...# #.### #.#.# #.### #.... .###.', '€': '..### .#... ####. .#... ####. .#... ..###', '$': '..#.. .#### #.#.. .###. ..#.# ####. ..#..',
    '°': '.#. #.# .#. ... ... ... ...', '~': '..... ..... .#..# #.##. ..... ..... .....', '♪': '..##. ..#.# ..#.. ..#.. .##.. ###.. .#...',
  };
  const ACC = { a: ['..#', '.#.'], g: ['#..', '.#.'], c: ['.#.', '#.#'], d: ['...', '#.#'], t: ['.#.#', '#.#.'], z: ['.#.', '##.'] };  // aigu, grave, circonflexe, tréma, tilde, cédille
  const COMP = { é: 'ea', è: 'eg', ê: 'ec', ë: 'ed', á: 'aa', à: 'ag', â: 'ac', ä: 'ad', í: 'ıa', ì: 'ıg', î: 'ıc', ï: 'ıd', ó: 'oa', ò: 'og', ô: 'oc', ö: 'od',
    ú: 'ua', ù: 'ug', û: 'uc', ü: 'ud', ÿ: 'yd', ñ: 'nt', ç: 'cz', É: 'Ea', È: 'Eg', Ê: 'Ec', Ë: 'Ed', Á: 'Aa', À: 'Ag', Â: 'Ac', Ä: 'Ad', Í: 'Ia', Î: 'Ic', Ï: 'Id',
    Ó: 'Oa', Ô: 'Oc', Ö: 'Od', Ú: 'Ua', Ù: 'Ug', Û: 'Uc', Ü: 'Ud', Ñ: 'Nt', Ç: 'Cz' };
  const SUB = { 'œ': 'oe', 'Œ': 'OE', '’': "'", '‘': "'", '“': '"', '”': '"', '–': '-', '—': '-', ' ': ' ', ' ': ' ', '•': '·', '✓': 'v', 'ᐸ': '<', 'ᐳ': '>', '＜': '<', '＞': '>', '｜': '|', '／': '/', '！': '!', '？': '?', '（': '(', '）': ')', '：': ':', '　': ' ' };  // ᐸ ᐳ : les < > des titres YouTube
  const H = 11, glyphs = new Map(); let raster;
  function glyph(ch) {
    let g = glyphs.get(ch); if (g) return g;
    const px = [], add = (rows, ox, oy) => rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) if (r[x] === '#') px.push([ox + x, oy + y]); });
    const c = COMP[ch], src = S[c ? c[0] : ch]; let w = 3;
    if (src) {
      const rows = src.split(' '); w = Math.max(...rows.map(r => r.length)); add(rows, 0, 2);
      if (c) { const a = ACC[c[1]]; add(a, Math.floor((w - a[0].length) / 2), c[1] === 'z' ? 9 : /[A-Z]/.test(c[0]) ? 0 : 1); }
    } else if (ch !== ' ') {  // japonais, emoji… : la lettre du système, réduite à des pixels nets (sans lissage) sur la même hauteur que la police
      const q = (raster ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true })), RW = 16;
      q.canvas.width = RW; q.canvas.height = H; q.font = '11px "MS Gothic", "Yu Gothic UI", Meiryo, "Segoe UI Symbol", sans-serif'; q.fillStyle = '#000'; q.fillText(ch, 0, 10);
      const d = q.getImageData(0, 0, RW, H).data; let mx = 0;
      for (let y = 0; y < H; y++) for (let x = 0; x < RW; x++) if (d[(y * RW + x) * 4 + 3] > 110) { px.push([x, y]); mx = Math.max(mx, x + 1); }
      w = mx || 3;
      if (!px.length) { w = 5; add(['#####', '#...#', '#...#', '#...#', '#...#', '#...#', '#####'], 0, 2); }  // vraiment inconnue : une petite case
    }
    g = { w, px }; glyphs.set(ch, g); return g;
  }
  function layout(text) {
    let x = 0; const items = [];
    for (const ch of String(text)) for (const c of SUB[ch] ?? ch) { const g = glyph(c); items.push([g, x]); x += g.w + 1; }
    return { w: Math.max(0, x - 1), items };
  }
  function draw(g, text, x, y, color, s = 1) {  // (x, y) : coin haut gauche de la case
    const L = layout(text); g.fillStyle = color;
    for (const [gl, ox] of L.items) for (const [px, py] of gl.px) g.fillRect(x + (ox + px) * s, y + py * s, s, s);
    return L.w * s;
  }
  const bmp = new Map();
  function sprite(text, color, s = 1) {  // le texte tout prêt, gardé pour les images suivantes du jeu
    const k = text + '|' + color + '|' + s; let c = bmp.get(k); if (c) return c;
    c = document.createElement('canvas'); c.width = Math.max(1, layout(text).w * s); c.height = H * s; draw(c.getContext('2d'), text, 0, 0, color, s);
    if (bmp.size > 400) bmp.delete(bmp.keys().next().value);
    bmp.set(k, c); return c;
  }
  // comme fillText : (x, y) sur la ligne de base, aligné à gauche, au centre ou à droite
  function fill(g, text, x, y, color, s = 1, align = 'left') {
    const c = sprite(String(text), color, s), dx = align === 'center' ? -c.width / 2 : align === 'right' ? -c.width : 0;
    g.drawImage(c, Math.round(x + dx), Math.round(y - 9 * s));
  }
  const scale = size => Math.max(1, Math.round((size || 8) / 8));
  function art(rows, pal, s = 1) {  // un dessin en lignes de caractères, chaque caractère une couleur de la palette (« . » : transparent)
    const c = document.createElement('canvas'); c.width = Math.max(...rows.map(r => r.length)) * s; c.height = rows.length * s;
    const g = c.getContext('2d');
    rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) { const col = pal[r[x]]; if (col) { g.fillStyle = col; g.fillRect(x * s, y * s, s, s); } } });
    return c;
  }
  return { H, layout, draw, sprite, fill, scale, art };
})();

// les pièces de l'interface, pixel par pixel (K : contour, les autres lettres : la palette du jeu)
const PX_PANEL = ['..KKKKKKKKKKKK..', '.KAAAAAAAAAAAAK.', 'KALAAAAAAAAAALSK', 'KAAKKKKKKKKKKSSK', 'KAAKHHHHHHHHKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK',
  'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKKKKKKKKKKSSK', 'KALSSSSSSSSSSLSK', '.KSSSSSSSSSSSSK.', '..KKKKKKKKKKKK..'];
const PX_CARD = ['.KKKKKKKKKK.', 'KFFFFFFFFFFK', 'KFHHHHHHHHFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFSSSSSSSSFK', 'KFFFFFFFFFFK', '.KKKKKKKKKK.'];
const PX_BTN = ['.KKKKKKKKKK.', 'KWWWWWWWWWWK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KBBBBBBBBBBK', 'KKKKKKKKKKKK', 'KDDDDDDDDDDK', '.KKKKKKKKKK.'];
const PX_BTN_DOWN = ['............', '............', '.KKKKKKKKKK.', 'KBBBBBBBBBBK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KWWWWWWWWWWK', '.KKKKKKKKKK.'];
const PX_TRACK = ['.KKKKKKKKKK.', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KHHHHHHHHHHK', '.KKKKKKKKKK.'];
const PX_KNOB = ['.KKKKK.', 'KWWWWWK', 'KWAAABK', 'KWAAABK', 'KKKKKKK', 'KWAAABK', 'KWAAABK', 'KBBBBBK', 'KDDDDDK', '.KKKKK.'];
const PX_RAIL = ['KDDDDDDK', 'KDDDDDDK', 'KDDDDDDK', 'KDDHHDDK'];
const PX_ICONS = {
  play: ['kk......', 'kakk....', 'kaaakk..', 'kaaaaakk', 'kaaaaaak', 'kaaaaakk', 'kaaakk..', 'kakk....', 'kk......'],
  full: ['www...www', 'w.......w', 'w.......w', '.........', '....a....', '.........', 'w.......w', 'w.......w', 'www...www'],
  note: ['...aaaaaa', '...aaaaaa', '...a....a', '...a....a', '...a....a', '.aaa..aaa', 'aaaa.aaaa', 'aaaa.aaaa', '.aa...aa.'],
  star: ['....g....', '....g....', '...ggg...', 'ggggwgggg', '.ggwwwgg.', '..ggggg..', '..oo.oo..', '.oo...oo.', '.o.....o.'],
  crown: ['g...g...g', 'gg.ggg.gg', 'ggggggggg', 'grgggggrg', 'ggggggggg', 'ooooooooo'],
  folder: ['oooo.....', 'oggoooooo', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ooooooooo'],
  vol: ['....w....', '...ww..b.', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', '...ww..b.', '....w....'],
  clock: ['..wwwww..', '.w.....w.', 'w...a...w', 'w...a...w', 'w...aaa.w', 'w.......w', 'w.......w', '.w.....w.', '..wwwww..'],
  cursor: ['....a....', '..aaaaa..', '.a..a..a.', '.a.....a.', 'aaa.w.aaa', '.a.....a.', '.a..a..a.', '..aaaaa..', '....a....'],
  plus: ['...b...', '...b...', '...b...', 'bbbbbbb', '...b...', '...b...', '...b...'],
  down: ['wwwwwww', '.wwwww.', '..www..', '...w...'],
};

/* habille la page du jeu : root = son conteneur, T = sa palette, icons = [motif du texte, icône] pour les boutons et libellés */
function pxSkin(root, { T, icons = [], emblem, title }) {
  root.classList.add('pxk'); const s = 2, url = c => c.toDataURL();
  const btnPal = (M, W, B, D) => ({ K: T.k, W, M, B, D });
  const BN = btnPal(T.btn, T.btnHi, T.btnLo, T.k2), BH = btnPal(T.btnHov, T.btnHovHi, T.btnLo, T.k2);
  const BA = btnPal(T.acc, T.accL, T.accS, T.accD), BAH = btnPal(T.accL, '#ffffff', T.acc, T.accD);
  const img = { panel: PXK.art(PX_PANEL, { K: T.k, A: T.acc, S: T.accS, L: T.rivet, H: T.hl, D: T.fill }, s),
    card: PXK.art(PX_CARD, { K: T.k, F: T.line, H: T.hl, D: T.fill, S: T.k2 }, s), cardOn: PXK.art(PX_CARD, { K: T.k, F: T.acc, H: T.accS, D: T.fillOn, S: T.accD }, s),
    btn: PXK.art(PX_BTN, BN, s), btnH: PXK.art(PX_BTN, BH, s), btnD: PXK.art(PX_BTN_DOWN, BH, s),
    main: PXK.art(PX_BTN, BA, s), mainH: PXK.art(PX_BTN, BAH, s), mainD: PXK.art(PX_BTN_DOWN, BA, s),
    track: PXK.art(PX_TRACK, { K: T.k, D: T.k2, H: T.line }, s), knob: PXK.art(PX_KNOB, { K: T.k, W: T.accL, A: T.acc, B: T.accS, D: T.accD }, s),
    rail: PXK.art(PX_RAIL, { K: T.k, D: T.k2, H: T.line }, s), tile: PXK.art(T.tile, { x: T.bgDot, ':': T.bgDot2, '+': T.spark, '*': T.spark2 }, s) };
  const u = Object.fromEntries(Object.entries(img).map(([k, c]) => [k, url(c)]));
  const nine = (k, sl) => `border-style:solid;border-width:${sl * s}px;border-image:url(${u[k]}) ${sl * s} fill / ${sl * s}px stretch`;
  const IP = { k: T.k, w: T.text, a: T.acc, b: T.acc2, g: T.gold, o: T.orange, r: T.red, n: T.green, N: T.green2, m: T.muted, s: T.accS };
  const iconUrl = new Map(), icon = name => {
    let v = iconUrl.get(name); if (!v) { const c = PXK.art(PX_ICONS[name] || emblem, IP, s); v = { u: url(c), w: c.width, h: c.height }; iconUrl.set(name, v); }
    const b = document.createElement('b'); b.className = 'pxI'; b.setAttribute('aria-hidden', 'true'); b.style.cssText = `width:${v.w}px;height:${v.h}px;background-image:url(${v.u})`; return b;
  };
  const R = '.pxk.pxk';
  const css = document.createElement('style');
  css.textContent = `html,html body{background:${T.bg} url(${u.tile}) 0 0/${img.tile.width}px ${img.tile.height}px repeat!important}
::-webkit-scrollbar{width:16px;height:16px} ::-webkit-scrollbar-track{background:url(${u.rail}) 0 0/16px 8px repeat-y} ::-webkit-scrollbar-thumb{${nine('main', 4)}} ::-webkit-scrollbar-corner{background:none}
${R}{color:${T.text}}
${R} .px{box-shadow:none;background:none}
${R} .agHead{gap:18px;margin:0}
${R} .agHead .label{display:flex;align-items:center;gap:12px}
${R} .btn,${R} .tab{${nine('btn', 4)};height:auto;min-height:0;padding:0 6px 4px;margin:0;color:${T.text};font:12px/1 monospace;display:inline-flex;align-items:center;gap:6px;filter:none;text-shadow:none;letter-spacing:0;cursor:var(--cp,pointer)}
${R} .btn:hover,${R} .tab:hover{border-image-source:url(${u.btnH})}
${R} .btn:active,${R} .tab:active{border-image-source:url(${u.btnD});padding:4px 6px 0}
${R} .btn.main,${R} .tab.on{border-image-source:url(${u.main});color:${T.k}}
${R} .btn.main:hover,${R} .tab.on:hover{border-image-source:url(${u.mainH})}
${R} .btn.main:active,${R} .tab.on:active{border-image-source:url(${u.mainD})}
${R} .btn:focus-visible,${R} .tab:focus-visible{outline:2px dashed ${T.acc2};outline-offset:2px}
${R} .btn .pxV,${R} .tab .pxV{white-space:nowrap}
${R} .sysCard{${nine('card', 4)};padding:4px 6px;gap:8px;background:none}
${R} .sysCard.on{border-image-source:url(${u.cardOn})}
${R} .sysCard.on>b{color:${T.acc}}
${R} .sysCard>b{color:${T.text}}
${R} .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
${R} .gameBox,${R} .thBox{${nine('panel', 5)};box-shadow:none;background:none;padding:2px;gap:8px;grid-template-rows:auto auto}
${R} .gameBox canvas,${R} .thBox canvas{display:block;background:#05010b}
${R} .gameBox:fullscreen,${R} .thBox:fullscreen{border:0;padding:0;background:#000}
${R} .rhFs{position:static;opacity:1;justify-self:end;margin:0 6px 6px 0}
${R} .rhTabs{gap:8px;flex-wrap:wrap}
${R} .hint{color:${T.muted};line-height:24px}
${R} label{color:${T.muted};display:inline-flex;align-items:center;gap:8px}
${R} .rhDel{color:${T.red};top:6px;right:8px}
${R} input[type=range]{-webkit-appearance:none;appearance:none;background:none;height:20px;width:150px}
${R} input[type=range]::-webkit-slider-runnable-track{height:12px;${nine('track', 2)}}
${R} input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:20px;border:0;background:url(${u.knob}) 0 0/100% 100%;margin-top:-8px;cursor:var(--cp,pointer)}
${R} .pxSel{justify-content:space-between;gap:10px;max-width:100%;overflow:hidden}
${R} .rhImport .pxSel{flex:1;min-width:0}
.pxMenu{position:fixed;z-index:50;${nine('card', 4)};padding:2px;max-height:280px;overflow-y:auto;display:flex;flex-direction:column;gap:2px;color:${T.text}}
.pxMenu button{all:unset;padding:3px 8px;cursor:var(--cp,pointer);white-space:nowrap}
.pxMenu button:hover,.pxMenu button:focus-visible,.pxMenu button.on{background:${T.btnHov};color:${T.text}}
.pxMenu button.on{color:${T.acc}}
.pxT{position:relative;white-space:normal;font:12px/1 monospace;letter-spacing:0;text-transform:none}
.pxT i{display:inline-block;vertical-align:middle;background:currentColor;-webkit-mask:var(--m) 0 0/100% 100% no-repeat;mask:var(--m) 0 0/100% 100% no-repeat;image-rendering:pixelated}
.pxI{display:inline-block;vertical-align:middle;background:0 0/100% 100% no-repeat;image-rendering:pixelated;margin-right:6px}
.pxV>.pxI+.pxI{margin-left:-4px}
.pxSr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}`;
  document.head.append(css);
  // un mot = une image (en masque : sa couleur suit celle du texte), une règle par mot pour ne pas répéter l'image
  const words = new Map(), sheet = document.head.appendChild(document.createElement('style')).sheet;
  const word = w => {
    let k = words.get(w);
    if (!k) { const c = PXK.sprite(w, '#fff', s); k = 'pw' + words.size; words.set(w, k); sheet.insertRule(`.${k}{--m:url(${c.toDataURL()});width:${c.width}px;height:${c.height}px}`, sheet.cssRules.length); }
    const i = document.createElement('i'); i.className = k; return i;
  };
  function render(vis, text, lead) {
    const parts = [], ic = lead && icons.find(([re]) => re.test(text.trim()));
    if (ic) parts.push(icon(ic[1]));
    for (const m of text.matchAll(/(★+)|(\s+)|([^\s★]+)/g)) {
      if (m[1]) for (const _ of m[1]) parts.push(icon('star'));
      else if (m[2]) parts.push(document.createTextNode(' '));
      else parts.push(word(m[3]));
    }
    vis.replaceChildren(...parts);
  }
  const lead = node => node.parentElement?.matches('button,label,.tab,.btn') && !node.previousSibling;
  function pixText(node) {  // le texte reste dans la page (lecteur d'écran, copier) ; on voit ses lettres en pixels
    const wrap = document.createElement('span'), sr = document.createElement('span'), vis = document.createElement('span');
    wrap.className = 'pxT'; sr.className = 'pxSr'; vis.className = 'pxV'; vis.setAttribute('aria-hidden', 'true');
    const first = lead(node); node.replaceWith(wrap); sr.append(node); wrap.append(sr, vis); render(vis, node.data, first);
  }
  function pxSelect(sel) {  // une liste déroulante en pixels ; la vraie reste cachée et garde sa valeur et ses événements
    sel.dataset.px = '1'; sel.style.display = 'none';
    const b = document.createElement('button'), lab = document.createElement('span'); b.type = 'button'; b.className = 'btn pxSel'; b.append(lab, icon('down')); sel.after(b);
    const sync = () => { const t = sel.selectedOptions[0]?.textContent || '—'; if (lab.dataset.t !== t) { lab.dataset.t = t; lab.textContent = t; } };
    const d = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
    Object.defineProperty(sel, 'value', { configurable: true, get() { return d.get.call(this); }, set(v) { d.set.call(this, v); sync(); } });
    new MutationObserver(sync).observe(sel, { childList: true, subtree: true, characterData: true, attributes: true });
    sel.addEventListener('change', sync);
    b.onclick = () => {
      document.querySelector('.pxMenu')?.remove();
      const m = document.createElement('div'), r = b.getBoundingClientRect(); m.className = 'pxMenu'; m.setAttribute('role', 'listbox');
      for (const o of sel.options) {
        const it = document.createElement('button'); it.type = 'button'; it.textContent = o.textContent; it.className = o.selected ? 'on' : ''; it.setAttribute('role', 'option');
        it.onclick = () => { sel.value = o.value; sel.dispatchEvent(new Event('input', { bubbles: true })); sel.dispatchEvent(new Event('change', { bubbles: true })); close(); b.focus(); };
        m.append(it);
      }
      root.append(m);
      const below = innerHeight - r.bottom; m.style.minWidth = r.width + 'px'; m.style.left = Math.min(r.left, innerWidth - m.offsetWidth - 4) + 'px';
      m.style.top = (below > m.offsetHeight + 8 || below > r.top ? r.bottom + 2 : r.top - m.offsetHeight - 2) + 'px';
      const close = () => { m.remove(); removeEventListener('pointerdown', out, true); removeEventListener('keydown', key, true); removeEventListener('blur', close); };
      const out = e => { if (!m.contains(e.target) && e.target !== b && !b.contains(e.target)) close(); };
      const key = e => { if (e.key === 'Escape') { e.stopPropagation(); close(); b.focus(); } };
      addEventListener('pointerdown', out, true); addEventListener('keydown', key, true); addEventListener('blur', close);
      (m.querySelector('.on') || m.firstChild)?.focus();
    };
    sync();
  }
  const SKIP = 'select,option,textarea,script,style,canvas,.pxT,[data-pxskip]';
  let queued = false;
  function pass() {
    queued = false;
    root.querySelectorAll('select.gSel:not([data-px])').forEach(pxSelect);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), todo = [];
    for (let n; (n = w.nextNode());) if (n.data.trim() && n.parentElement && !n.parentElement.closest(SKIP)) todo.push(n);
    todo.forEach(pixText);
  }
  new MutationObserver(ms => {
    for (const m of ms) if (m.type === 'characterData') { const wrap = m.target.parentNode?.closest?.('.pxT'); if (wrap) render(wrap.lastChild, m.target.data, false); }
    if (!queued) { queued = true; queueMicrotask(pass); }
  }).observe(root, { childList: true, subtree: true, characterData: true });
  // le titre : grosses lettres à contour, trois tons, et l'emblème du jeu
  const lab = root.querySelector('.agHead .label');
  if (lab) {
    const L = PXK.layout(title), c = document.createElement('canvas'), g = c.getContext('2d'), on = [];
    c.width = L.w + 3; c.height = PXK.H + 3;
    for (const [gl, ox] of L.items) for (const [x, y] of gl.px) on.push([ox + x + 1, y + 1]);
    g.fillStyle = T.k; for (const [x, y] of on) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [2, 2], [1, 2], [2, 1]]) g.fillRect(x + dx, y + dy, 1, 1);
    for (const [x, y] of on) { g.fillStyle = y <= 5 ? T.accL : y <= 7 ? T.acc : T.accS; g.fillRect(x, y, 1, 1); }
    const big = document.createElement('canvas'), z = 4; big.width = c.width * z; big.height = c.height * z;
    const bg = big.getContext('2d'); bg.imageSmoothingEnabled = false; bg.drawImage(c, 0, 0, big.width, big.height);
    const t = document.createElement('b'); t.className = 'pxI'; t.style.cssText = `width:${big.width}px;height:${big.height}px;background-image:url(${big.toDataURL()})`;
    const e = PXK.art(emblem, IP, 3), em = document.createElement('b'); em.className = 'pxI'; em.style.cssText = `width:${e.width}px;height:${e.height}px;background-image:url(${e.toDataURL()})`;
    const sr = document.createElement('span'); sr.className = 'pxSr'; sr.textContent = lab.textContent;
    lab.dataset.pxskip = '1'; lab.replaceChildren(em, t, sr);
  }
  pass();
}


export default async function (ctx) {
  const view = ctx.view;
  if (!ctx.host) { view.textContent = "Ce plugin doit être approuvé par NeoDex pour s'ouvrir."; return; }
  const host = ctx.host, { el, toast, sfx } = host;
  const folder = ctx.folder;
  host.addStyle(CSS);
  view.innerHTML = HTML;
  pxSkin(view.querySelector('.appWrap'), { title: "QUATUOR", T: {"k": "#0c0a12", "k2": "#16121e", "fill": "#221c2c", "fillOn": "#2e263a", "hl": "#3a3046", "line": "#62566e", "acc": "#b884e0", "accL": "#e8d0ff", "accS": "#7a4aa8", "accD": "#2a1440", "rivet": "#f0f0f8", "btn": "#3a3046", "btnHi": "#62566e", "btnLo": "#16121e", "btnHov": "#443852", "btnHovHi": "#82768e", "text": "#f4f0f8", "muted": "#c0b8cc", "acc2": "#7ee07a", "gold": "#ffd84a", "orange": "#ff8a3a", "red": "#ff4a3a", "green": "#7ee07a", "green2": "#2f8a3a", "bg": "#100c16", "bgDot": "#221c2c", "bgDot2": "#16121e", "spark": "#2a1440", "spark2": "#b884e0", "tile": ["................", "...:............", "................", "..........+.....", "................", "................", ".....:..........", "................", "................", ".............:..", "................", "..+.............", "................", ".........:......", "................", "................"]},
  emblem: ["............", "kkkkk..kkkkk", "kgggk..knnnk", "kgggk..knnnk", "kkkkk..kkkkk", "............", "kkkkk..kkkkk", "koook..kaaak", "koook..kaaak", "kkkkk..kkkkk", "............", "............"],
  icons: [[/^NOUVELLE/, 'play'], [/^RECORDS/, 'crown']] });
  const $ = id => view.querySelector('#' + id) || document.getElementById(id);
  const doc = async n => { try { return await folder.read(n); } catch { return null; } };
  const games = { best: {}, ...(await doc('games')) };
  let gamesTimer = null;
  const saveGames = () => { clearTimeout(gamesTimer); gamesTimer = setTimeout(() => { gamesTimer = null; folder.write('games', games).catch(() => {}); }, 500); };
  const best = (k, v) => { const b = games.best[k]; if (v > (b ?? 0)) {  // un score nul n'est jamais un record
    games.best[k] = v; saveGames(); return true; } return false; };
  const gstore = (k, init) => (games[k] ??= init);
function gameLoop(st, appKey, update, draw) {
  cancelAnimationFrame(st.raf);
  const STEP = 1000 / 60; let acc = 0, last = performance.now();
  const frame = t => {
    if (!view.classList.contains('on')) { st.raf = 0; if (st.mode === 'play') st.mode = 'pause'; return; }  // leaving the tab pauses the game
    st.raf = requestAnimationFrame(frame);
    acc += Math.min(200, t - last); last = t;
    while (acc >= STEP) { if (st.mode === 'play') update(); st.tick++; acc -= STEP; }
    draw();
  };
  st.raf = requestAnimationFrame(frame);
}
function gameText(g, w, lines, y0) {  // lignes centrées en police pixel, sur une bande sombre
  g.fillStyle = 'rgba(11,3,28,.72)'; g.fillRect(0, y0 - 14, w, lines.length * 14 + 14);
  lines.forEach(([text, color, size], i) => PXK.fill(g, text, w / 2, y0 + i * 14, color, PXK.scale(size), 'center'));
}
const px = (g, color, x, y, w = 1, h = 1) => { g.fillStyle = color; g.fillRect(Math.round(x), Math.round(y), w, h); };
function sprite(g, rows, x, y, pal) { rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c) px(g, c, x + i, y + j); } }); }
const seeded = s => () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const pxFont = (g, text, x, y, color, size = 8, align = 'left') => { const s = PXK.scale(size); PXK.fill(g, text, x + s, y + s, '#05010b', s, align); PXK.fill(g, text, x, y, color, s, align); };

/* ---------- Quatuor : 16 mots, 4 groupes cachés de 4. Choisis 4 mots qui vont ensemble et valide ; 4 erreurs permises.
   Chaque grille a des pièges : des mots qui semblent aller dans deux groupes. Le jaune est le plus simple, le violet le plus retors ---------- */
const QT = {W: 244, H: 172, HUD: 12, TW: 58, TH: 26, GAP: 2, X0: 3, Y0: 15};
const QT_COL = [['#e8c84a', '#5a4000'], ['#7ec05a', '#1a4416'], ['#6aa0e8', '#103466'], ['#b884e0', '#36125a']];  // jaune, vert, bleu, violet
// chaque grille : 4 groupes [thème, [4 mots]], du plus simple au plus retors
const QT_P = [
  [['Planètes', ['VÉNUS', 'SATURNE', 'NEPTUNE', 'JUPITER']], ['Animaux de la savane', ['GIRAFE', 'ZÈBRE', 'GAZELLE', 'HYÈNE']], ['Barres chocolatées', ['MARS', 'TWIX', 'BOUNTY', 'LION']], ['Signes du zodiaque', ['BÉLIER', 'TAUREAU', 'CANCER', 'VIERGE']]],
  [['Sports de raquette', ['TENNIS', 'BADMINTON', 'SQUASH', 'PADEL']], ['Pâtes', ['LASAGNE', 'PENNE', 'FUSILLI', 'RAVIOLI']], ['Danses', ['VALSE', 'SALSA', 'POLKA', 'RUMBA']], ['Alphabet radio', ['TANGO', 'ROMEO', 'VICTOR', 'HOTEL']]],
  [['Oiseaux', ['MERLE', 'PIE', 'CORBEAU', 'MÉSANGE']], ['Peintres français', ['MONET', 'MANET', 'DEGAS', 'RENOIR']], ['Couleurs des cartes', ['PIQUE', 'CŒUR', 'CARREAU', 'TRÈFLE']], ['Rusé, fier, têtu, myope comme un…', ['RENARD', 'PAON', 'MULE', 'TAUPE']]],
  [['Légumes', ['CAROTTE', 'POIREAU', 'NAVET', 'CHOU']], ['Arbres', ['CHÊNE', 'HÊTRE', 'BOULEAU', 'ÉRABLE']], ['Monnaies', ['EURO', 'DOLLAR', 'YEN', 'ROUBLE']], ['Pomme de…', ['TERRE', 'PIN', 'ADAM', 'DISCORDE']]],
  [['Capitales européennes', ['ROME', 'BERLIN', 'MADRID', 'LISBONNE']], ['Héros de l’Iliade', ['ACHILLE', 'HECTOR', 'PARIS', 'AJAX']], ['Métaux', ['OR', 'FER', 'ZINC', 'CUIVRE']], ['Une rivière cachée', ['VANILLE', 'INDUSTRIE', 'CORNET', 'FRAMBOISE']]],
  [['Fromages', ['BRIE', 'COMTÉ', 'ROQUEFORT', 'CAMEMBERT']], ['Départements', ['CANTAL', 'GARD', 'AIN', 'NORD']], ['Vents', ['MISTRAL', 'SIROCCO', 'ZÉPHYR', 'BLIZZARD']], ['Se lisent dans les deux sens', ['RADAR', 'KAYAK', 'SAGAS', 'ELLE']]],
  [['Instruments à cordes', ['VIOLON', 'GUITARE', 'HARPE', 'BANJO']], ['Poissons', ['SOLE', 'BAR', 'THON', 'MERLAN']], ['Parties d’un vélo', ['SELLE', 'GUIDON', 'PÉDALE', 'CHAÎNE']], ['Se disent comme un nombre', ['SANS', 'SAINT', 'CETTE', 'DIS']]],
  [['Fruits rouges', ['FRAISE', 'FRAMBOISE', 'GROSEILLE', 'MÛRE']], ['Nuances de rouge', ['CARMIN', 'VERMILLON', 'POURPRE', 'CERISE']], ['Jeux de cartes', ['BELOTE', 'TAROT', 'POKER', 'BRIDGE']], ['Un nombre caché', ['BRONZE', 'FAMILLE', 'ACCENT', 'SEPTIQUE']]],
  [['Métiers', ['BOULANGER', 'BOUCHER', 'PLOMBIER', 'FACTEUR']], ['Pièces d’échecs', ['FOU', 'CAVALIER', 'TOUR', 'PION']], ['Cartes à jouer', ['VALET', 'AS', 'JOKER', 'ROI']], ['Fête des…', ['PÈRES', 'MÈRES', 'ROIS', 'VOISINS']]],
  [['Animaux de la ferme', ['VACHE', 'COCHON', 'CHÈVRE', 'DINDON']], ['Insectes', ['ABEILLE', 'FOURMI', 'GUÊPE', 'MOUCHE']], ['Fables : le premier animal du titre', ['CORBEAU', 'LIÈVRE', 'LOUP', 'CIGALE']], ['Saut de…', ['PUCE', 'ANGE', 'LIT', 'MOUTON']]],
  [['Météo', ['PLUIE', 'NEIGE', 'GRÊLE', 'ORAGE']], ['La mer', ['MARÉE', 'ÉCUME', 'HOULE', 'RESSAC']], ['Coiffures', ['FRANGE', 'CHIGNON', 'NATTE', 'COUETTE']], ['… de chaleur', ['VAGUE', 'COUP', 'BOUFFÉE', 'SOURCE']]],
  [['Pays d’Afrique', ['MAROC', 'KENYA', 'TCHAD', 'NIGER']], ['Pays d’Amérique du Sud', ['PÉROU', 'CHILI', 'BRÉSIL', 'COLOMBIE']], ['Épices', ['CURRY', 'CUMIN', 'PAPRIKA', 'CANNELLE']], ['Un pays caché', ['ROMAN', 'MALIN', 'DINDE', 'TIRANT']]],
  [['Vêtements', ['PULL', 'JUPE', 'MANTEAU', 'GILET']], ['Chaussures', ['BOTTE', 'SANDALE', 'MOCASSIN', 'TONG']], ['Sports collectifs', ['RUGBY', 'HANDBALL', 'VOLLEY', 'BASKET']], ['… de nuit', ['CHEMISE', 'BOÎTE', 'TABLE', 'OISEAU']]],
  [['Desserts', ['TARTE', 'MOUSSE', 'FLAN', 'CRUMBLE']], ['Temps de tempête', ['ÉCLAIR', 'RAFALE', 'GRÊLON', 'TEMPÊTE']], ['Le visage', ['NEZ', 'MENTON', 'JOUE', 'FRONT']], ['Coup de…', ['FOUDRE', 'POUCE', 'MAIN', 'FIL']]],
  [['Races de chiens', ['CANICHE', 'CARLIN', 'BEAGLE', 'TECKEL']], ['Races de chats', ['SIAMOIS', 'SPHYNX', 'CHARTREUX', 'ANGORA']], ['Langues', ['BRETON', 'BASQUE', 'PERSAN', 'LATIN']], ['Régions du Canada', ['LABRADOR', 'YUKON', 'QUÉBEC', 'ONTARIO']]],
  [['Outils', ['TOURNEVIS', 'PINCE', 'PERCEUSE', 'CLÉ']], ['Requin-…', ['MARTEAU', 'TIGRE', 'BALEINE', 'CITRON']], ['Agrumes', ['ORANGE', 'MANDARINE', 'LIME', 'YUZU']], ['Poisson-…', ['SCIE', 'CHAT', 'LUNE', 'CLOWN']]],
  [['Instruments à vent', ['TROMPETTE', 'SAXO', 'HAUTBOIS', 'TUBA']], ['Pains', ['FICELLE', 'BÂTARD', 'FOUGASSE', 'COURONNE']], ['Le magicien', ['BAGUETTE', 'CHAPEAU', 'CARTES', 'FOULARD']], ['Pour ne pas jurer', ['FLÛTE', 'MINCE', 'PURÉE', 'MERCREDI']]],
  [['Meubles', ['TABLE', 'CHAISE', 'ARMOIRE', 'BUFFET']], ['Repas', ['DÎNER', 'GOÛTER', 'BRUNCH', 'SOUPER']], ['Formes', ['CARRÉ', 'TRIANGLE', 'LOSANGE', 'OVALE']], ['… de famille', ['AIR', 'LIVRET', 'CHEF', 'CERCLE']]],
  [['Fleurs', ['TULIPE', 'MUGUET', 'PIVOINE', 'LILAS']], ['L’œil', ['IRIS', 'PUPILLE', 'CORNÉE', 'RÉTINE']], ['Vins', ['BLANC', 'ROSÉ', 'JAUNE', 'GRIS']], ['Feu…', ['VERT', 'FOLLET', 'ARRIÈRE', 'ROUGE']]],
  [['Jeux de société', ['ÉCHECS', 'DAMES', 'DOMINOS', 'GO']], ['Cuisine japonaise', ['SUSHI', 'RAMEN', 'TEMPURA', 'MISO']], ['Arts martiaux', ['JUDO', 'KARATÉ', 'AÏKIDO', 'KENDO']], ['Gâteaux', ['MIKADO', 'PALMIER', 'MADELEINE', 'FINANCIER']]],
  [['Fruits exotiques', ['MANGUE', 'PAPAYE', 'LITCHI', 'GOYAVE']], ['Oiseaux exotiques', ['TOUCAN', 'PERROQUET', 'COLIBRI', 'FLAMANT']], ['Îles de la Méditerranée', ['CORSE', 'CRÈTE', 'MALTE', 'CHYPRE']], ['… de mer', ['MAL', 'BRAS', 'LOUP', 'CHEVAL']]],
  [['Fruits', ['CITRON', 'PRUNE', 'POIRE', 'PÊCHE']], ['Couleurs', ['JAUNE', 'VIOLET', 'ORANGE', 'MARRON']], ['Pierres précieuses', ['SAPHIR', 'ÉMERAUDE', 'TOPAZE', 'OPALE']], ['Noces de…', ['PAPIER', 'COTON', 'CUIR', 'DIAMANT']]],
  [['Super-héros', ['BATMAN', 'HULK', 'THOR', 'FLASH']], ['Dieux grecs', ['ZEUS', 'HERMÈS', 'APOLLON', 'HADÈS']], ['Dieux nordiques', ['ODIN', 'LOKI', 'FREYA', 'TYR']], ['Marques de voitures', ['FIAT', 'SEAT', 'OPEL', 'SKODA']]],
  [['Sports d’hiver', ['SKI', 'LUGE', 'CURLING', 'BIATHLON']], ['Insectes', ['CRIQUET', 'LIBELLULE', 'PUNAISE', 'GRILLON']], ['Nages', ['CRAWL', 'BRASSE', 'PAPILLON', 'DOS']], ['Coups au tennis', ['LOB', 'REVERS', 'SMASH', 'SERVICE']]],
  [['Mammifères marins', ['DAUPHIN', 'PHOQUE', 'OTARIE', 'LAMANTIN']], ['Empereurs romains', ['NÉRON', 'AUGUSTE', 'TRAJAN', 'HADRIEN']], ['Codes secrets', ['MORSE', 'BRAILLE', 'BINAIRE', 'CÉSAR']], ['Finit par une note de musique', ['TOMBOLA', 'PARASOL', 'SALAMI', 'JUDO']]],
  [['Fleuves de France', ['SEINE', 'LOIRE', 'RHÔNE', 'GARONNE']], ['Genres musicaux', ['ROCK', 'JAZZ', 'REGGAE', 'RAP']], ['Monuments de Paris', ['LOUVRE', 'PANTHÉON', 'INVALIDES', 'OPÉRA']], ['Châteaux de la Loire', ['CHAMBORD', 'AMBOISE', 'BLOIS', 'CHEVERNY']]],
  [['Lettres grecques', ['ALPHA', 'BÊTA', 'DELTA', 'OMÉGA']], ['Constellations', ['ORION', 'LYRE', 'CYGNE', 'DRAGON']], ['Chez Alexandre Dumas', ['ATHOS', 'PORTHOS', 'ARAMIS', 'MILADY']], ['Personnages de Molière', ['TARTUFFE', 'HARPAGON', 'ALCESTE', 'SCAPIN']]],
  [['Plats italiens', ['PIZZA', 'RISOTTO', 'POLENTA', 'TIRAMISU']], ['Villes d’Italie', ['TURIN', 'NAPLES', 'MILAN', 'FLORENCE']], ['Villes de France', ['NANTES', 'LILLE', 'NICE', 'RENNES']], ['Gares de Paris', ['NORD', 'EST', 'LYON', 'BERCY']]],
  [['Animaux d’Australie', ['KANGOUROU', 'KOALA', 'WOMBAT', 'ÉMEU']], ['Percussions', ['TAMBOUR', 'CYMBALE', 'XYLOPHONE', 'TRIANGLE']], ['Solides', ['CUBE', 'SPHÈRE', 'CÔNE', 'PYRAMIDE']], ['… de Pâques', ['ŒUF', 'LUNDI', 'ÎLE', 'CLOCHE']]],
  [['Couvre-chefs', ['BÉRET', 'CASQUETTE', 'BONNET', 'TURBAN']], ['Desserts', ['FLAN', 'CLAFOUTIS', 'SORBET', 'CHARLOTTE']], ['Grades militaires', ['CAPORAL', 'SERGENT', 'GÉNÉRAL', 'COLONEL']], ['Sur un bateau', ['MARIN', 'PÊCHEUR', 'MOUSSE', 'CAPITAINE']]],
  [['Armes blanches', ['SABRE', 'FLEURET', 'ÉPÉE', 'DAGUE']], ['À l’école, on apprend à…', ['LIRE', 'ÉCRIRE', 'COMPTER', 'DESSINER']], ['Peuples anciens', ['GAULOIS', 'VIKING', 'CELTE', 'HUN']], ['Anciennes monnaies', ['FRANC', 'DRACHME', 'PESETA', 'MARK']]],
  [['Organes', ['FOIE', 'POUMON', 'REIN', 'ESTOMAC']], ['Os', ['FÉMUR', 'TIBIA', 'CRÂNE', 'RADIUS']], ['Variétés de pommes', ['GALA', 'REINETTE', 'GOLDEN', 'GRANNY']], ['Mots doux', ['CHÉRI', 'CŒUR', 'CHOU', 'LAPIN']]],
  [['Rongeurs', ['SOURIS', 'CASTOR', 'HAMSTER', 'ÉCUREUIL']], ['Petits des animaux', ['PORCELET', 'AGNEAU', 'ÂNON', 'POUSSIN']], ['Signes chinois', ['RAT', 'BUFFLE', 'DRAGON', 'SINGE']], ['Marques d’ordinateurs', ['APPLE', 'DELL', 'ASUS', 'ACER']]],
  [['Pièces de la maison', ['GRENIER', 'CAVE', 'SALON', 'CUISINE']], ['Ustensiles de cuisine', ['FOUET', 'LOUCHE', 'PASSOIRE', 'SPATULE']], ['Chevaux', ['PONEY', 'ÉTALON', 'JUMENT', 'POULAIN']], ['… de bataille', ['CHEVAL', 'CHAMP', 'PLAN', 'CRI']]],
];
const qts = gstore('quatuor', {next: 0, solved: [], perfect: 0, games: 0});
let qt = null, qtac = null, qtMute = false;
function qtBeep(f, d, type = 'square', slide = 0, vol = .04) { if (qtMute) return; try { qtac ??= new AudioContext(); const o = qtac.createOscillator(), g = qtac.createGain(), t = qtac.currentTime; o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g).connect(qtac.destination); o.start(t); o.stop(t + d); } catch {} }
function qtShuffle(a, r) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
// une nouvelle partie garde le même objet : la boucle du jeu (gameLoop) continue de tourner dessus
const renew = (old, o) => { if (!old) return o; for (const k of Object.keys(old)) if (k !== 'raf') delete old[k]; return Object.assign(old, o); };
function qtNew(idx = qts.next) {
  const g = qt?.g, rnd = seeded(Date.now() % 1e9 + idx);
  qt = renew(qt, {g, mode: 'play', tick: 0, seenT: 0, idx, rnd, tiles: qtShuffle(QT_P[idx].flatMap((grp, k) => grp[1].map(w => ({w, k}))), rnd), sel: new Set(), cur: 0, found: [], mist: 0, tried: new Set(), shake: 0, flash: 0, msg: '', msgT: 0, hover: null, over: 0, won: false, reveal: 0});
  qtInfo();
}
// les cases : les groupes trouvés en bandes en haut, puis les mots qui restent, 4 par ligne
const qtTileAt = i => ({x: QT.X0 + (i % 4) * (QT.TW + QT.GAP), y: QT.Y0 + (qt.found.length + Math.floor(i / 4)) * (QT.TH + QT.GAP)});
const QT_BTNS = [["MÉLANGER", "shuffle", 6], ["EFFACER", "clear", 84], ["VALIDER", "go", 162]];
function qtToggle(i) {
  if (qt.mode === 'pause') qt.mode = 'play';
  if (qt.mode !== 'play' || !qt.tiles[i]) return;
  const w = qt.tiles[i].w; qt.cur = i;
  if (qt.sel.has(w)) qt.sel.delete(w); else if (qt.sel.size < 4) qt.sel.add(w); else return;
  qtBeep(qt.sel.has(w) ? 520 : 380, .04, 'square', 0, .03);
}
function qtAct(a) {
  if (qt.mode === 'pause') qt.mode = 'play';
  if (qt.mode !== 'play') return;
  if (a === 'shuffle') { qtShuffle(qt.tiles, qt.rnd); qtBeep(300, .06, 'triangle', 500); }
  else if (a === 'clear') qt.sel.clear();
  else if (a === 'go') qtCheck();
}
function qtCheck() {
  if (qt.sel.size !== 4) { qt.msg = 'Choisis 4 mots'; qt.msgT = 70; return; }
  const key = [...qt.sel].sort().join('|');
  if (qt.tried.has(key)) { qt.msg = 'Déjà essayé !'; qt.msgT = 70; return; }
  qt.tried.add(key);
  const by = [0, 0, 0, 0]; for (const t of qt.tiles) if (qt.sel.has(t.w)) by[t.k]++;
  const k = by.indexOf(4);
  if (k >= 0) {
    qt.found.push(k); qt.tiles = qt.tiles.filter(t => t.k !== k); qt.sel.clear(); qt.flash = 24; qt.cur = 0;
    [523, 659, 784].forEach((f, i) => setTimeout(() => qtBeep(f, .1), i * 70));
    if (qt.found.length === 4) qtEnd(true);
  } else {
    qt.mist++; qt.shake = 20; qt.msg = Math.max(...by) === 3 ? 'À un près !' : 'Raté'; qt.msgT = 80;
    qtBeep(180, .25, 'sawtooth', 90, .05);
    if (qt.mist >= 4) qtEnd(false);
  }
}
function qtEnd(won) {
  qt.mode = 'over'; qt.won = won; qt.over = 0; qt.sel.clear(); qts.games++;
  if (won) { if (!qts.solved.includes(qt.idx)) qts.solved.push(qt.idx); if (!qt.mist) qts.perfect++; best('quatuor', qts.solved.length); }
  // la grille suivante : la première pas encore réussie après celle-ci, sinon la suivante tout court
  const n = QT_P.length, after = [...Array(n)].map((_, i) => (qt.idx + 1 + i) % n);
  qts.next = after.find(i => !qts.solved.includes(i)) ?? (qt.idx + 1) % n;
  saveGames(); qtInfo();
  if (won && !qtMute) setTimeout(() => [659, 784, 988, 1319].forEach((f, i) => setTimeout(() => qtBeep(f, .14), i * 90)), 200);
}
function qtUpdate() {
  if (qt.shake) qt.shake--; if (qt.flash) qt.flash--; if (qt.msgT) qt.msgT--;
  if (qt.mode === 'over') {
    qt.over++;
    // en cas de défaite, les groupes manquants se dévoilent un par un
    if (!qt.won && qt.over % 40 === 0 && qt.tiles.length) { const k = Math.min(...qt.tiles.map(t => t.k)); qt.found.push(k); qt.tiles = qt.tiles.filter(t => t.k !== k); qt.flash = 24; qtBeep(260, .08, 'triangle'); }
  }
}
function qtBand(g, k, row, flash) {
  const [c, d] = QT_COL[k], y = QT.Y0 + row * (QT.TH + QT.GAP), x = QT.X0, w = 4 * QT.TW + 3 * QT.GAP, grp = QT_P[qt.idx][k];
  px(g, '#05010b', x - 1, y - 1, w + 2, QT.TH + 2); px(g, c, x, y, w, QT.TH); px(g, '#ffffff', x, y, w, 1); px(g, d, x, y + QT.TH - 2, w, 2);
  PXK.fill(g, grp[0], x + w / 2, y + 11, '#120a18', 1, 'center');
  grp[1].forEach((wd, i) => PXK.fill(g, wd, x + QT.TW / 2 + i * (QT.TW + QT.GAP), y + 22, d, 1, 'center'));
  if (flash) { g.globalAlpha = flash / 24 * .8; px(g, '#ffffff', x, y, w, QT.TH); g.globalAlpha = 1; }
}
function qtDraw() {
  const g = qt.g, {W, H, HUD, TW, TH} = QT;
  for (; qt.seenT < qt.tick; qt.seenT++) if (qt.mode !== 'play') qtUpdate();
  g.imageSmoothingEnabled = false;
  px(g, '#120e1c', 0, 0, W, H); for (let y = HUD; y < H; y += 8) for (let x = (y >> 3) % 2 * 8; x < W; x += 16) px(g, '#18122a', x, y, 8, 8);
  qt.found.forEach((k, r) => qtBand(g, k, r, r === qt.found.length - 1 ? qt.flash : 0));
  qt.tiles.forEach((t, i) => {
    let {x, y} = qtTileAt(i); const on = qt.sel.has(t.w), hot = qt.hover === i, cur = qt.cur === i && qt.mode === 'play';
    if (on && qt.shake) x += Math.round(Math.sin(qt.shake * 1.6) * 2);
    px(g, '#05010b', x - 1, y - 1, TW + 2, TH + 2);
    px(g, on ? '#5a4478' : hot ? '#fff8e6' : '#efe4cc', x, y, TW, TH);
    px(g, on ? '#7a62a0' : '#ffffff', x, y, TW, 1); px(g, on ? '#3a2a52' : '#c8b898', x, y + TH - 2, TW, 2);
    if (cur) { px(g, '#ffd84a', x - 1, y - 1, TW + 2, 1); px(g, '#ffd84a', x - 1, y + TH, TW + 2, 1); px(g, '#ffd84a', x - 1, y - 1, 1, TH + 2); px(g, '#ffd84a', x + TW, y - 1, 1, TH + 2); }
    PXK.fill(g, t.w, x + TW / 2, y + 16, on ? '#ffffff' : '#2a1e36', 1, 'center');
  });
  // sous la grille : erreurs restantes (ou le résultat), puis les trois boutons
  const by = H - 22;
  if (qt.mode === 'over') {
    pxFont(g, qt.won ? (qt.mist ? 'BRAVO ! grille réussie' : 'SANS FAUTE ! grille réussie') : 'PERDU ! voici les groupes', W / 2, by - 4, qt.won ? '#7ee07a' : '#ff6a5a', 8, 'center');
    if (qt.over > 60 && !qt.tiles.length) pxFont(g, 'Entrée : grille suivante', W / 2, by + 12, '#c0b8cc', 8, 'center');
  } else {
    if (qt.msgT) pxFont(g, qt.msg, W / 2, by - 4, qt.msg === 'À un près !' ? '#ffd84a' : '#ff8a7a', 8, 'center');
    else { pxFont(g, 'Erreurs permises', 70, by - 4, '#a898b8', 8); for (let i = 0; i < 4; i++) px(g, i < 4 - qt.mist ? '#ff4a6a' : '#3a2a46', 168 + i * 9, by - 11, 6, 6); }
    for (const [label, a, x] of QT_BTNS) { const hot = qt.hover === a, dis = a === 'go' && qt.sel.size !== 4; px(g, '#05010b', x - 1, by + 1, 78, 15); px(g, hot && !dis ? '#ffd84a' : '#3a3046', x, by + 2, 76, 13); px(g, '#62566e', x, by + 2, 76, 1); pxFont(g, label, x + 38, by + 12, hot && !dis ? '#1a1018' : dis ? '#7a6e88' : '#ffffff', 8, 'center'); }
  }
  px(g, '#0c0a14', 0, 0, W, HUD);
  pxFont(g, 'Grille ' + (qt.idx + 1) + ' / ' + QT_P.length, 4, 9, '#ffffff', 8);
  pxFont(g, qts.solved.length + ' réussie' + (qts.solved.length > 1 ? 's' : ''), W - 4, 9, '#a898b8', 8, 'right');
  if (qt.tick % 20 === 0) g.canvas.setAttribute('aria-label', 'Quatuor : grille ' + (qt.idx + 1) + ', ' + qt.found.length + ' groupes trouvés, ' + (4 - qt.mist) + ' erreurs permises' + (qt.mode === 'over' ? (qt.won ? ', grille réussie' : ', perdu') : '') + '. Mots : ' + qt.tiles.map(t => t.w).join(', ') + '.');
}
function qtInfo() {
  $('qtStats').replaceChildren(...[['Grilles réussies', qts.solved.length + ' / ' + QT_P.length], ['Sans faute', qts.perfect], ['Parties', qts.games], ['Grille en cours', (qt ? qt.idx : qts.next) + 1]].flatMap(([a, b]) => [el('span', '', a), el('b', '', String(b))]));
}
document.addEventListener('keydown', e => {
  if (!view.classList.contains('on') || !qt || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
  const k = e.key, n = qt.tiles.length, mv = {ArrowLeft: -1, ArrowRight: 1, ArrowUp: -4, ArrowDown: 4}[k];
  if (qt.mode === 'over') { if ((k === 'Enter' || k === ' ') && qt.over > 60 && !qt.tiles.length) { e.preventDefault(); qtNew(); } return; }
  if (mv) { e.preventDefault(); if (qt.mode === 'pause') qt.mode = 'play'; const c = qt.cur + mv; if (c >= 0 && c < n) qt.cur = c; }
  else if (k === ' ') { e.preventDefault(); qtToggle(qt.cur); }
  else if (k === 'Enter') { e.preventDefault(); qtAct('go'); }
  else if (k === 'm' || k === 'M') qtAct('shuffle');
  else if (k === 'Backspace') { e.preventDefault(); qtAct('clear'); }
});
{ const cv = $('qtCanvas'), at = e => { const r = cv.getBoundingClientRect(); return {x: (e.clientX - r.left) / r.width * QT.W, y: (e.clientY - r.top) / r.height * QT.H}; };
  const hit = p => { for (let i = 0; i < qt.tiles.length; i++) { const t = qtTileAt(i); if (p.x >= t.x && p.x < t.x + QT.TW && p.y >= t.y && p.y < t.y + QT.TH) return i; }
    const by = QT.H - 22; if (qt.mode !== 'over' && p.y >= by + 2 && p.y < by + 15) for (const [, a, x] of QT_BTNS) if (p.x >= x && p.x < x + 76) return a; return null; };
  cv.onpointermove = e => { if (qt) qt.hover = hit(at(e)); };
  cv.onpointerleave = () => { if (qt) qt.hover = null; };
  cv.onpointerdown = e => { e.preventDefault(); if (!qt) return; if (qt.mode === 'over') { if (qt.over > 60 && !qt.tiles.length) qtNew(); return; } const h = hit(at(e)); if (typeof h === 'number') qtToggle(h); else if (h) qtAct(h); }; }
$('qtNew').onclick = () => { qtNew(qt && qt.mode !== 'over' ? qt.idx : qts.next); $('qtNew').blur(); };
{  // vérification : 20 grilles de 16 mots tous différents qui tiennent dans leur case, et une partie jouée (une erreur à un près, un groupe trouvé, une grille réussie)
  const bad = [];
  QT_P.forEach((p, i) => { const ws = p.flatMap(gr => gr[1]); if (p.length !== 4 || ws.length !== 16 || new Set(ws).size !== 16) bad.push(i + 1 + ' : mots');
    for (const w of ws) if (PXK.layout(w).w > QT.TW - 4) bad.push(i + 1 + ' : ' + w + ' trop long');
    for (const gr of p) if (PXK.layout(gr[0]).w > 4 * QT.TW) bad.push(i + 1 + ' : ' + gr[0] + ' trop long'); });
  const keep = qt, keepS = JSON.stringify(qts), keepB = games.best.quatuor; qt = null; qtMute = true;
  qtNew(0); const pick = (k, n) => qt.tiles.filter(t => t.k === k).slice(0, n).map(t => t.w);
  for (const w of [...pick(0, 3), ...pick(1, 1)]) qtToggle(qt.tiles.findIndex(t => t.w === w)); qtCheck();
  if (qt.mist !== 1 || qt.msg !== 'À un près !') bad.push('à un près');
  for (let k = 0; k < 4; k++) { qt.sel.clear(); for (const w of pick(k, 4)) qtToggle(qt.tiles.findIndex(t => t.w === w)); qtCheck(); }
  if (qt.mode !== 'over' || !qt.won || qt.found.length !== 4) bad.push('grille réussie');
  console.assert(!bad.length, 'quatuor', bad);
  Object.assign(qts, JSON.parse(keepS)); if (keepB === undefined) delete games.best.quatuor; else games.best.quatuor = keepB; qt = keep; qtMute = false;
}
ctx.onOpen(() => {
  if (!qt || !qt.g) { qtNew(); qt.g = $('qtCanvas').getContext('2d'); }
  if (qt.mode === 'pause') qt.mode = 'play';
  gameLoop(qt, 'quatuor', qtUpdate, qtDraw); qtInfo();
});
}
